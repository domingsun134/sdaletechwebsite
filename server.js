import express from 'express';
import nodemailer from 'nodemailer';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import tls from 'tls';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Bypass SSL verification for Supabase connection (Self-signed certificate issue)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

dotenv.config();

// Enforce modern TLS
tls.DEFAULT_MIN_VERSION = 'TLSv1.2';



// Simple file logger
function logToFile(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    try {
        fs.appendFileSync(path.join(__dirname, 'server.log'), logMessage);
    } catch (err) {
        console.error('Failed to write to log file:', err);
    }
}

// Override console.log and console.error to also write to file
const originalLog = console.log;
const originalError = console.error;

console.log = (...args) => {
    const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
    logToFile(`[INFO] ${msg}`);
    originalLog.apply(console, args);
};

console.error = (...args) => {
    const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
    logToFile(`[ERROR] ${msg}`);
    originalError.apply(console, args);
};

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// AWS Configuration
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// Supabase Configuration
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY);

// Audit Logging Helper
async function logAuditAction(category, action, details, performedBy = 'SYSTEM', targetUser = 'N/A') {
    try {
        const { error } = await supabase
            .from('audit_logs')
            .insert({
                category,
                action,
                details,
                performed_by: performedBy,
                target_user: targetUser
            });

        if (error) console.error('Failed to write audit log:', error);
    } catch (err) {
        console.error('Audit log exception:', err);
    }
}


// API to fetch audit logs
app.get('/api/audit-logs', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('audit_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error fetching audit logs:', error);
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
});

// Email Configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.office365.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        minVersion: 'TLSv1.2'
    }
});

// Routes
app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const mailOptions = {
        from: process.env.SMTP_USER, // Sender address
        to: process.env.SMTP_USER || 'stl-workflow@sdaletech.com', // Receiver address
        subject: `[Website Enquiry] ${subject}: ${name}`,
        text: `
            Name: ${name}
            Email: ${email}
            Subject: ${subject}
            
            Message:
            ${message}
        `,
        html: `
            <h3>New Website Enquiry</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <br/>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

// Multer Configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get('/api/applications', async (req, res) => {
    try {
        if (!process.env.S3_BUCKET_NAME) {
            return res.status(500).json({ error: 'S3 bucket not configured' });
        }

        const command = new ListObjectsV2Command({
            Bucket: process.env.S3_BUCKET_NAME,
            Prefix: 'applications/'
        });

        const { Contents } = await s3Client.send(command);

        if (!Contents || Contents.length === 0) {
            return res.json([]);
        }

        // Filter out the folder itself or non-json files if necessary
        const validFiles = Contents.filter(file => !file.Key.endsWith('/') && file.Size > 0);

        const applications = await Promise.all(validFiles.map(async (file) => {
            try {
                const getCommand = new GetObjectCommand({
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: file.Key
                });
                const response = await s3Client.send(getCommand);
                const str = await response.Body.transformToString();
                const appData = JSON.parse(str);

                // Enforce ID from filename to ensure consistency for deletion
                // This fixes the 404 error if the internal JSON ID doesn't match the filename
                const filenameId = path.basename(file.Key, '.json');
                appData.id = filenameId;

                // Generate Presigned URL for the resume if resumeKey exists
                if (appData.resumeKey) {
                    const resumeCommand = new GetObjectCommand({
                        Bucket: process.env.S3_BUCKET_NAME,
                        Key: appData.resumeKey
                    });
                    // URL expires in 1 hour (3600 seconds)
                    appData.resumeUrl = await getSignedUrl(s3Client, resumeCommand, { expiresIn: 3600 });
                }

                return appData;
            } catch (err) {
                console.error(`Failed to parse application file ${file.Key}:`, err);
                return null;
            }
        }));

        // Filter out nulls (failed parses) and sort
        const validApplications = applications.filter(app => app !== null);
        validApplications.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

        console.log(`Retrieved ${validApplications.length} applications from S3`);
        res.json(validApplications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
});

app.post('/api/apply', upload.single('resume'), async (req, res) => {
    const { name, email, phone, coverLetter, jobTitle, recipient } = req.body;
    const resume = req.file;

    if (!name || !email || !phone || !resume) {
        return res.status(400).json({ error: 'Required fields missing' });
    }

    const applicationId = uuidv4();
    const resumeKey = `resumes/${applicationId}_${resume.originalname}`;
    const dataKey = `applications/${applicationId}.json`;
    let s3Url = '';

    try {
        if (process.env.S3_BUCKET_NAME) {
            // 1. Upload Resume to S3
            await s3Client.send(new PutObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: resumeKey,
                Body: resume.buffer,
                ContentType: resume.mimetype
            }));
            s3Url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${resumeKey}`;
            console.log('Resume uploaded to S3:', s3Url);

            // 2. Save Application Data as JSON to S3 (Cheaper alternative to DynamoDB)
            const applicationData = {
                id: applicationId,
                jobTitle,
                name,
                email,
                phone,
                coverLetter,
                resumeKey: resumeKey, // Store Key instead of URL
                // resumeUrl: s3Url, // Legacy: keep for now or remove? Let's keep but rely on key.
                appliedAt: new Date().toISOString(),
                status: 'new'
            };

            await s3Client.send(new PutObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: dataKey,
                Body: JSON.stringify(applicationData, null, 2),
                ContentType: 'application/json'
            }));
            console.log('Application data saved to S3');
        }

        // 3. Send Email Notification
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: recipient || process.env.SMTP_USER || 'stl-workflow@sdaletech.com',
            subject: `[Job Application] ${jobTitle}: ${name}`,
            text: `
                New Job Application for ${jobTitle}
                
                Name: ${name}
                Email: ${email}
                Phone: ${phone}
                
                Cover Letter:
                ${coverLetter || 'N/A'}
                
                Resume URL: ${s3Url || 'Attached'}
            `,
            html: `
                <h3>New Job Application</h3>
                <p><strong>Position:</strong> ${jobTitle}</p>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <br/>
                <p><strong>Cover Letter:</strong></p>
                <p>${(coverLetter || 'N/A').replace(/\n/g, '<br>')}</p>
                <br/>
                ${s3Url ? `<p><strong>Resume:</strong> <a href="${s3Url}">Download Resume</a></p>` : ''}
            `,
            attachments: [
                {
                    filename: resume.originalname,
                    content: resume.buffer
                }
            ]
        };

        await transporter.sendMail(mailOptions);
        console.log('Application email sent successfully');

        // Trigger Auto-Analysis (Fire and Forget)
        console.log(`[Auto-Analyze] Triggering analysis for ${applicationId}`);
        performAnalysis(applicationId, jobTitle)
            .then(() => console.log(`[Auto-Analyze] Completed for ${applicationId}`))
            .catch(err => console.error(`[Auto-Analyze] Failed for ${applicationId}:`, err));

        res.status(200).json({ message: 'Application submitted successfully' });

    } catch (error) {
        console.error('Error processing application:', error);
        res.status(500).json({ error: 'Failed to process application' });
    }
});



// Job Management Routes
const JOBS_S3_KEY = 'jobs/jobs.json';

// Helper to get jobs from S3 or fallback to local file
async function getJobsFromS3() {
    try {
        if (!process.env.S3_BUCKET_NAME) {
            console.warn('S3_BUCKET_NAME not set, falling back to local file');
            throw new Error('S3 not configured');
        }

        const command = new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: JOBS_S3_KEY
        });
        const response = await s3Client.send(command);
        const str = await response.Body.transformToString();
        return JSON.parse(str);
    } catch (error) {
        // If file doesn't exist in S3 or S3 error, fallback to local initial data
        console.log('Fetching jobs from S3 failed or file missing, using default data:', error.message);
        try {
            const localPath = path.join(__dirname, 'src', 'data', 'jobs.json');
            const data = fs.readFileSync(localPath, 'utf8');
            return JSON.parse(data);
        } catch (localError) {
            console.error('Failed to read local jobs.json:', localError);
            return [];
        }
    }
}

// Helper to save jobs to S3
async function saveJobsToS3(jobs) {
    if (!process.env.S3_BUCKET_NAME) {
        throw new Error('S3_BUCKET_NAME not configured');
    }

    await s3Client.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: JOBS_S3_KEY,
        Body: JSON.stringify(jobs, null, 2),
        ContentType: 'application/json'
    }));
}

app.get('/api/jobs', async (req, res) => {
    try {
        const jobs = await getJobsFromS3();
        res.json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
});

app.post('/api/jobs', async (req, res) => {
    try {
        const newJob = req.body;
        if (!newJob.title || !newJob.company) {
            return res.status(400).json({ error: 'Title and Company are required' });
        }

        // Ensure ID
        if (!newJob.id) {
            newJob.id = Date.now();
        }

        const jobs = await getJobsFromS3();
        jobs.push(newJob);

        await saveJobsToS3(jobs);
        res.status(201).json(newJob);
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ error: 'Failed to create job' });
    }
});

app.put('/api/jobs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedJob = req.body;
        const jobs = await getJobsFromS3();

        const index = jobs.findIndex(j => j.id == id);
        if (index === -1) {
            return res.status(404).json({ error: 'Job not found' });
        }

        // Preserve ID and update fields
        jobs[index] = { ...jobs[index], ...updatedJob, id: jobs[index].id };

        await saveJobsToS3(jobs);
        res.json(jobs[index]);
    } catch (error) {
        console.error('Error updating job:', error);
        res.status(500).json({ error: 'Failed to update job' });
    }
});

app.delete('/api/jobs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let jobs = await getJobsFromS3();

        const initialLength = jobs.length;
        jobs = jobs.filter(j => j.id != id);

        if (jobs.length === initialLength) {
            return res.status(404).json({ error: 'Job not found' });
        }

        await saveJobsToS3(jobs);
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ error: 'Failed to delete job' });
    }
});

// User Management Routes
// Using Supabase directly instead of S3

// Helper to get users from Supabase
async function getUsersFromSupabase() {
    const { data, error } = await supabase
        .from('users')
        .select('*');

    if (error) {
        console.error('Supabase fetch users error:', error);
        throw error;
    }
    return data || [];
}

app.get('/api/users', async (req, res) => {
    try {
        const users = await getUsersFromSupabase();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

app.post('/api/users', async (req, res) => {
    try {
        const newUser = req.body;

        // Validation:
        // If it's a local user, need username/password.
        // If it's an Entra user (has azure_oid), password might be empty.

        if (!newUser.username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        if (!newUser.azure_oid && !newUser.password) {
            return res.status(400).json({ error: 'Password is required for local users' });
        }

        // Check if username already exists in Supabase
        const { data: existingUsers } = await supabase
            .from('users')
            .select('id')
            .eq('username', newUser.username);

        if (existingUsers && existingUsers.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // If Entra user, check if OID exists
        if (newUser.azure_oid) {
            const { data: existingOid } = await supabase
                .from('users')
                .select('id')
                .eq('azure_oid', newUser.azure_oid);
            if (existingOid && existingOid.length > 0) {
                return res.status(400).json({ error: 'User already exists (Entra ID linked)' });
            }
        }

        // Insert into Supabase
        const { data, error } = await supabase
            .from('users')
            .insert([{
                username: newUser.username,
                password: newUser.password || null,
                name: newUser.name,
                role: newUser.role || 'hr',
                email: newUser.email,
                azure_oid: newUser.azure_oid || null,
                company_name: newUser.company_name || null
            }])
            .select();

        if (error) {
            throw error;
        }

        res.status(201).json(data[0]);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

app.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = req.body;

        const { data, error } = await supabase
            .from('users')
            .update(updatedUser)
            .eq('id', id)
            .select();

        if (error) throw error;
        if (!data || data.length === 0) return res.status(404).json({ error: 'User not found' });

        res.json(data[0]);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// --- Azure / Teams Integration Helpers ---

let azureTokenCache = {
    token: null,
    expiresAt: 0
};

async function getAzureAccessToken() {
    const now = Date.now();
    if (azureTokenCache.token && azureTokenCache.expiresAt > now) {
        return azureTokenCache.token;
    }

    const tenantId = process.env.AZURE_TENANT_ID;
    const clientId = process.env.AZURE_CLIENT_ID;
    const clientSecret = process.env.AZURE_CLIENT_SECRET;

    if (!tenantId || !clientId || !clientSecret) {
        throw new Error('Azure configuration missing (AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET)');
    }

    console.log('[Azure] Fetching new access token...');
    const tokenResponse = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: clientId,
            scope: 'https://graph.microsoft.com/.default',
            client_secret: clientSecret,
            grant_type: 'client_credentials',
        }),
    });

    if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('Failed to get Azure token:', errorText);
        throw new Error(`Failed to authenticate with Azure: ${errorText}`);
    }

    const tokenData = await tokenResponse.json();
    // Cache token (subtract 5 mins for safety buffer)
    azureTokenCache = {
        token: tokenData.access_token,
        expiresAt: now + (tokenData.expires_in * 1000) - (5 * 60 * 1000)
    };

    return tokenData.access_token;
}

async function createTeamsMeeting(subject, startTime, endTime) {
    try {
        console.log('[Teams] Attempting to create online meeting...');
        const accessToken = await getAzureAccessToken();

        // 1. Identify the Organizer
        // Use SMTP_USER exclusively as requested
        const organizerEmail = process.env.SMTP_USER || 'stl-workflow@sdaletech.com';

        console.log(`[Teams] Looking up organizer ID for: ${organizerEmail}`);
        const userResponse = await fetch(`https://graph.microsoft.com/v1.0/users/${organizerEmail}`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        if (!userResponse.ok) {
            console.warn(`[Teams] Organizer lookup failed for ${organizerEmail}: ${userResponse.status}`);
            // Fallback: Try looking up by UPN if email failed, or just fail gracefully
            throw new Error(`Organizer user not found: ${organizerEmail}`);
        }

        const organizer = await userResponse.json();
        const organizerId = organizer.id;

        // 2. Create Online Meeting
        // POST /users/{id}/onlineMeetings
        const meetingPayload = {
            startDateTime: startTime, // ISO 8601
            endDateTime: endTime,
            subject: subject,
            // lobbyBypassSettings: { scope: 'everyone' } // Optional: allow everyone to join directly
        };

        const meetingResponse = await fetch(`https://graph.microsoft.com/v1.0/users/${organizerId}/onlineMeetings`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(meetingPayload)
        });

        if (!meetingResponse.ok) {
            const err = await meetingResponse.text();
            throw new Error(`Meeting creation failed: ${meetingResponse.status} ${err}`);
        }

        const meetingData = await meetingResponse.json();
        console.log(`[Teams] Meeting created successfully! Join URL: ${meetingData.joinWebUrl}`);

        return {
            joinUrl: meetingData.joinWebUrl,
            id: meetingData.id
        };

    } catch (error) {
        console.error('[Teams] Failed to create Teams meeting:', error.message);
        // Return null to allow fallback to static text
        return null;
    }
}

// --- Room Integration Endpoints ---

app.get('/api/integrations/rooms', async (req, res) => {
    try {
        const accessToken = await getAzureAccessToken();

        // Fetch rooms from Graph API
        // Note: Requires Place.Read.All permission
        // List all rooms in the tenant
        console.log('[Rooms] Fetching rooms from Azure...');
        const response = await fetch('https://graph.microsoft.com/v1.0/places/microsoft.graph.room', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        if (!response.ok) {
            const err = await response.text();
            console.error('[Rooms] Failed to fetch rooms:', err);
            throw new Error(`Failed to fetch rooms: ${response.status}`);
        }

        const data = await response.json();
        // data.value contains the list of rooms

        const rooms = data.value.map(room => ({
            id: room.id,
            name: room.displayName,
            email: room.emailAddress,
            capacity: room.capacity,
            building: room.address?.buildingStr
        }));

        res.json(rooms);

    } catch (error) {
        console.error('[Rooms] Error:', error);
        res.status(500).json({ error: 'Failed to list rooms' });
    }
});

app.post('/api/integrations/rooms/availability', async (req, res) => {
    try {
        const { roomEmail, startTime, endTime } = req.body;
        if (!roomEmail || !startTime || !endTime) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const accessToken = await getAzureAccessToken();

        // Check availability using getSchedule
        // POST /users/{roomEmail}/calendar/getSchedule
        // Requires Calendars.Read.Shared
        const payload = {
            schedules: [roomEmail],
            startTime: {
                dateTime: startTime,
                timeZone: "Asia/Singapore"
            },
            endTime: {
                dateTime: endTime,
                timeZone: "Asia/Singapore"
            },
            availabilityViewInterval: 15 // Check in 15 min blocks
        };

        const response = await fetch(`https://graph.microsoft.com/v1.0/users/${roomEmail}/calendar/getSchedule`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Prefer': 'outlook.timezone="Asia/Singapore"'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            // Fallback: Try /calendars/{roomEmail}/getSchedule if /users/... fails 
            // (sometimes rooms aren't fully treated as users for this endpoint depending on permissions)
            console.warn(`[Rooms] getSchedule failed for ${roomEmail} via /users endpoint. Status: ${response.status}`);

            // Just fail for now, implementing robust fallback needs more logic
            const err = await response.text();
            throw new Error(`Failed to check availability: ${err}`);
        }

        const data = await response.json();
        const schedule = data.value[0];

        // Check if there are any items in scheduleItems that overlap or status is not 'free'
        // 'availabilityView' string is also useful (0=free, 1=tentative, 2=busy, 3=ood, 4=workingElsewhere)

        const isBusy = schedule.scheduleItems && schedule.scheduleItems.some(item => {
            // Simple overlap check is done by Graph API returning items in the window
            // If status is busy or tentative, it's occupied
            return item.status === 'busy' || item.status === 'tentative';
        });

        // Also check availabilityView string just in case
        const availabilityView = schedule.availabilityView;
        const isFreeInView = !availabilityView.includes('2') && !availabilityView.includes('1'); // 2 is busy

        res.json({
            available: !isBusy && isFreeInView,
            details: schedule
        });

    } catch (error) {
        console.error('[Rooms] Availability Error:', error);
        res.status(500).json({ error: 'Failed to check room availability' });
    }
});

app.post('/api/integrations/rooms/find-available', async (req, res) => {
    try {
        const { startTime, endTime } = req.body;
        if (!startTime || !endTime) {
            return res.status(400).json({ error: 'Missing start/end time' });
        }

        const accessToken = await getAzureAccessToken();

        // 1. Get All Rooms
        console.log('[Rooms] Finding available rooms (Entra Places)...');
        const roomsResponse = await fetch('https://graph.microsoft.com/v1.0/places/microsoft.graph.room', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        if (!roomsResponse.ok) {
            throw new Error('Failed to fetch room list: ' + roomsResponse.statusText);
        }

        const roomsData = await roomsResponse.json();

        // --- LOGGING ALL DETAILS AS REQUESTED ---
        // --- LOGGING ALL DETAILS AS REQUESTED ---
        console.log('[Rooms] Raw Data (First 3 items):');
        if (roomsData.value && roomsData.value.length > 0) {
            // 1. Log first 3 for general context
            roomsData.value.slice(0, 3).forEach((room, i) => {
                console.log(`--- Room ${i + 1} ---`);
                console.log(JSON.stringify(room, null, 2));
            });

            // 2. HUNT for the specific "bad" room to see its properties
            const badRoom = roomsData.value.find(r => r.displayName.includes('Driver') || r.name?.includes('Driver'));
            if (badRoom) {
                console.log('\n!!! FOUND SUSPICIOUS ROOM (Driver) !!!');
                console.log(JSON.stringify(badRoom, null, 2));
                console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n');
            } else {
                console.log('[Rooms] Could not find any room with "Driver" in name in the raw list.');
            }
        } else {
            console.log('[Rooms] No rooms found in raw response.');
        }
        // ----------------------------------------

        const allRooms = roomsData.value.map(r => ({
            id: r.id,
            name: r.displayName,
            email: r.emailAddress,
            capacity: r.capacity,
            building: r.address?.buildingStr,
            address: r.address,
            bookingType: r.bookingType // Capture booking type
        }));

        if (allRooms.length === 0) {
            return res.json([]);
        }

        // 2. Filter by Country (Singapore) AND "Meeting Room" criteria
        const sgRooms = allRooms.filter(r => {
            const country = r.address?.countryOrRegion || '';
            const city = r.address?.city || '';

            const isSingapore = (country.toLowerCase().includes('singapore') || country.toLowerCase() === 'sg') ||
                (city.toLowerCase().includes('singapore'));

            // Filter 1: Booking Type should be 'standard' (Resource Mailbox usually)
            const isStandard = r.bookingType === 'standard';

            // Filter 2: Name blacklist (User requested to remove "Driver Booking")
            const isNotDriver = !r.name.toLowerCase().includes('driver');

            // Log details for the rooms user asked about to debug differences
            if (r.name.includes('India Meeting Room') || r.name.includes('Driver')) {
                console.log(`[DEBUG-FILTER] Checking: ${r.name}`);
                console.log(`   - Is Singapore: ${isSingapore}`);
                console.log(`   - BookingType: ${r.bookingType} (Pass? ${isStandard})`);
                console.log(`   - Is Not Driver: ${isNotDriver}`);
                // FULL DUMP FOR COMPARISON
                console.log(JSON.stringify(r, null, 2));
            }

            return isSingapore && isStandard && isNotDriver;
        });

        console.log(`[Rooms] Filtered: ${sgRooms.length} rooms found (Singapore + Standard + No Driver).`);

        if (sgRooms.length === 0) {
            console.log('[Rooms] No matching rooms found. Returning empty.');
            return res.json([]);
        }

        // 3. Batch Check Availability
        console.log('[Rooms] Checking availability for SG rooms...');
        const roomEmails = sgRooms.map(r => r.email);

        const payload = {
            schedules: roomEmails,
            startTime: {
                dateTime: startTime,
                timeZone: "Asia/Singapore"
            },
            endTime: {
                dateTime: endTime,
                timeZone: "Asia/Singapore"
            },
            availabilityViewInterval: 15
        };

        const scheduleResponse = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(process.env.CONTACT_EMAIL || roomEmails[0])}/calendar/getSchedule`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Prefer': 'outlook.timezone="Asia/Singapore"'
            },
            body: JSON.stringify(payload)
        });

        if (!scheduleResponse.ok) {
            const txt = await scheduleResponse.text();
            console.warn('[Rooms] Bulk availability check failed:', txt);
            // Fallback: return sgRooms without availability check
            return res.json(sgRooms);
        }

        const scheduleData = await scheduleResponse.json();
        const schedules = scheduleData.value;

        // 4. Filter Available Rooms
        const availableRooms = sgRooms.filter(room => {
            const roomSchedule = schedules.find(s => s.scheduleId === room.email);
            if (!roomSchedule) return true;

            const hasConflict = roomSchedule.scheduleItems && roomSchedule.scheduleItems.some(item =>
                item.status === 'busy' || item.status === 'tentative'
            );

            return !hasConflict;
        });

        console.log(`[Rooms] Returning ${availableRooms.length} available rooms.`);
        res.json(availableRooms);

    } catch (error) {
        console.error('[Rooms] Find Available Error:', error);
        res.status(500).json({ error: 'Failed to find available rooms' });
    }
});

// NEW: Endpoint to check Exchange Room Lists
app.get('/api/integrations/rooms/exchange/lists', async (req, res) => {
    try {
        const accessToken = await getAzureAccessToken();
        const userEmail = process.env.CONTACT_EMAIL;

        console.log('[Exchange] Fetching Room Lists for:', userEmail);
        if (!userEmail) return res.status(400).json({ error: 'CONTACT_EMAIL not set' });

        const response = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(userEmail)}/findRoomLists`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        if (!response.ok) {
            const txt = await response.text();
            console.error('[Exchange] Failed to fetch room lists:', txt);
            return res.status(response.status).json({ error: txt });
        }

        const data = await response.json();
        console.log('[Exchange] Room Lists:', JSON.stringify(data, null, 2));
        res.json(data);
    } catch (error) {
        console.error('[Exchange] Error:', error);
        res.status(500).json({ error: error.message });
    }
});



app.post('/api/entra-users', async (req, res) => {
    try {
        const { search } = req.body;
        if (!search || search.length < 2) {
            return res.json([]);
        }

        // Refactored to use helper
        let accessToken;
        try {
            accessToken = await getAzureAccessToken();
        } catch (e) {
            console.error('Azure setup issue:', e);
            return res.status(500).json({ error: 'Azure configuration missing or invalid' });
        }




        // 2. Search Users
        // Using $filter for startsWith
        const graphUrl = `https://graph.microsoft.com/v1.0/users?$filter=startswith(displayName,'${search}')&$select=id,displayName,mail,jobTitle,companyName&$top=10`;

        const userResponse = await fetch(graphUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!userResponse.ok) {
            const errorText = await userResponse.text();
            console.error('Failed to fetch users from Graph:', errorText);
            throw new Error('Failed to fetch users');
        }

        const userData = await userResponse.json();
        res.json(userData.value);

    } catch (error) {
        console.error('Error in /api/entra-users:', error);
        res.status(500).json({ error: 'Failed to search users' });
    }
});

app.post('/api/entra-user-by-id', async (req, res) => {
    try {
        const { employeeId } = req.body;
        if (!employeeId) {
            return res.status(400).json({ error: 'Employee ID is required' });
        }

        let accessToken;
        try {
            accessToken = await getAzureAccessToken();
        } catch (e) {
            return res.status(500).json({ error: 'Azure auth failed' });
        }

        // 2. Search User by Employee ID
        // Note: employeeId property might vary in Graph. Usually it's `employeeId`.
        const graphUrl = `https://graph.microsoft.com/v1.0/users?$filter=employeeId eq '${employeeId}'`;

        const userResponse = await fetch(graphUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!userResponse.ok) {
            const errorText = await userResponse.text();
            console.error('Failed to fetch user from Graph:', errorText);
            throw new Error('Failed to fetch user');
        }

        const userData = await userResponse.json();

        if (!userData.value || userData.value.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = userData.value[0];

        // 3. Get Manager (Best effort)
        try {
            const managerResponse = await fetch(`https://graph.microsoft.com/v1.0/users/${user.id}/manager`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (managerResponse.ok) {
                const managerData = await managerResponse.json();
                user.managerName = managerData.displayName;
                user.managerEmail = managerData.mail;
            } else {
                console.log(`No manager found for user ${user.id} or error: ${managerResponse.status}`);
                user.managerName = "Not found";
                user.managerEmail = "N/A";
            }
        } catch (err) {
            console.error('Failed to fetch manager:', err);
            user.managerName = "Error fetching manager";
        }

        // Return the first match with manager info
        res.json(user);

    } catch (error) {
        console.error('Error in /api/entra-user-by-id:', error);
        res.status(500).json({ error: 'Failed to search user' });
    }
});

app.post('/api/trigger-offboarding-workflow', async (req, res) => {
    try {
        const workflowUrl = process.env.POWER_AUTOMATE_WORKFLOW_URL || 'https://defaultc1cf29bbbbd14beeb9773da25824f9.e5.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/00aae021be9145f1b672749815b78de5/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=bhAgj09N93WITZDU7f5TkKeiBk9GjaQNeYwI2jnSucs';

        if (!workflowUrl) {
            console.warn('POWER_AUTOMATE_WORKFLOW_URL not configured');
            return res.status(200).json({ message: 'Workflow skipped (URL not configured)' });
        }

        const response = await fetch(workflowUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        if (!response.ok) {
            console.error('Workflow trigger failed:', await response.text());
            return res.status(500).json({ error: 'Failed to trigger workflow' });
        }

        console.log('Power Automate workflow triggered successfully');

        await logAuditAction(
            'OFFBOARDING',
            'TRIGGER_WORKFLOW',
            { employeeId: req.body.employee_id, ...req.body },
            'ADMIN', // Assuming admin triggers this manually
            req.body.employee_name || 'Unknown'
        );

        res.json({ message: 'Workflow triggered' });
    } catch (error) {
        console.error('Error triggering workflow:', error);
        res.status(500).json({ error: 'Failed to trigger workflow' });
    }
});

// Endpoint for Power Automate to call back for status update
app.post('/api/update-offboarding-status', async (req, res) => {
    const { employee_id, status } = req.body;

    if (!employee_id || !status) {
        return res.status(400).json({ error: 'Missing employee_id or status' });
    }

    try {
        const { error } = await supabase
            .from('offboarding_requests')
            .update({ status: status })
            .eq('employee_id', employee_id);

        if (error) throw error;

        console.log(`Updated offboarding status for ${employee_id} to ${status}`);

        await logAuditAction(
            'OFFBOARDING',
            'UPDATE_STATUS',
            { employeeId: employee_id, status },
            'SYSTEM',
            employee_id
        );

        res.json({ success: true, message: 'Status updated successfully' });
    } catch (error) {
        console.error('Error updating offboarding status:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

// Endpoint for Power Automate to get list of resignees for today (Prosoft Updated)
app.get('/api/offboarding/resignees/today', async (req, res) => {
    try {
        // Get today's date in YYYY-MM-DD format (Singapore Time +8)
        // Adjust logic if server is already in local time or use UTC accordingly based on date storage
        // Assuming database stores resignation_date as YYYY-MM-DD string
        const today = new Date();
        const offset = 8 * 60; // Singapore is UTC+8
        const localTime = new Date(today.getTime() + (offset * 60 * 1000));
        const dateString = localTime.toISOString().split('T')[0];

        // Or if running on local machine in SG, just:
        // const dateString = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

        // Safer approach for consistency across environments:
        const sgDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" });
        const d = new Date(sgDate);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        console.log(`Fetching resignees for date: ${formattedDate} with status 'Prosoft Updated'`);

        const { data, error } = await supabase
            .from('offboarding_requests')
            .select('employee_id, employee_name, employee_email')
            .eq('resignation_date', formattedDate)
            .eq('status', 'Prosoft Updated');

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('Error fetching today resignees:', error);
        res.status(500).json({ error: 'Failed to fetch resignees' });
    }
});

app.delete('/api/offboarding-requests/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // 1. Delete from Supabase
        const { error } = await supabase
            .from('offboarding_requests')
            .delete()
            .eq('id', id);

        if (error) throw error;

        // 2. Log Audit
        await logAuditAction(
            'OFFBOARDING',
            'DELETE_REQUEST',
            { requestId: id },
            'ADMIN',
            'N/A'
        );

        res.json({ message: 'Offboarding request deleted' });
    } catch (error) {
        console.error('Error deleting offboarding request:', error);
        res.status(500).json({ error: 'Failed to delete request' });
    }
});

import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
import mammoth from 'mammoth';

// AWS Bedrock Configuration
const bedrockClient = new BedrockRuntimeClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// Helper to extract text from resume buffer
async function extractTextFromResume(buffer, mimetype) {
    if (mimetype === 'application/pdf') {
        const data = await pdf(buffer);
        return data.text;
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth.extractRawText({ buffer: buffer });
        return result.value;
    } else if (mimetype === 'text/plain') {
        return buffer.toString('utf-8');
    } else {
        // Fallback for other types
        console.warn(`Unsupported mimetype for text extraction: ${mimetype}`);
        return buffer.toString('utf-8'); // Try best effort
    }
}

// Shared Analysis Logic
async function performAnalysis(applicationId, jobTitleOverride = null) {
    console.log(`[Analyze] Starting analysis for application ID: ${applicationId}`);
    try {
        if (!process.env.S3_BUCKET_NAME) {
            throw new Error('S3_BUCKET_NAME not set');
        }

        // 1. Fetch Application Data
        const appKey = `applications/${applicationId}.json`;
        const appCommand = new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: appKey
        });
        const appResponse = await s3Client.send(appCommand);
        const appStr = await appResponse.Body.transformToString();
        const appData = JSON.parse(appStr);

        // 2. Fetch Resume File
        if (!appData.resumeKey) {
            throw new Error('No resumeKey found in application data');
        }
        console.log(`[Analyze] Fetching resume from S3: ${appData.resumeKey}`);
        const resumeCommand = new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: appData.resumeKey
        });
        const resumeResponse = await s3Client.send(resumeCommand);
        const resumeBuffer = await resumeResponse.Body.transformToByteArray();
        const resumeText = await extractTextFromResume(Buffer.from(resumeBuffer), resumeResponse.ContentType);

        // 3. Fetch Job Description
        const jobs = await getJobsFromS3();
        const targetTitle = jobTitleOverride || appData.jobTitle;
        const job = jobs.find(j => j.title === targetTitle);

        if (!job) {
            throw new Error(`Job description not found for title: ${targetTitle}`);
        }

        const jdText = `
            Title: ${job.title}
            Company: ${job.company}
            Location: ${job.location}
            Type: ${job.type}
            Highlights: ${job.highlights}
            Responsibilities: ${job.responsibilities}
            Requirements: ${job.requirements}
            Career Level: ${job.career_level}
        `;

        // 4. Call Bedrock
        console.log('[Analyze] Preparing Bedrock prompt...');
        const prompt = `
            You are an expert HR recruiter and technical interviewer. Analyze the following Candidate Resume against the Job Description.
            
            Job Description:
            ${jdText}

            Candidate Resume:
            ${resumeText.substring(0, 20000)}

            Provide a comprehensive analysis in JSON format with the following structure:
            {
                "scores": {
                    "overall": <0-100>,
                    "skills_match": <0-100>,
                    "experience_match": <0-100>,
                    "cultural_fit": <0-100>
                },
                "summary": "<Executive summary of the candidate's suitability, max 3 sentences>",
                "technical_analysis": {
                    "matched_skills": ["<skill 1>", "<skill 2>"],
                    "missing_skills": ["<skill 1>", "<skill 2>"]
                },
                "soft_skills": ["<skill 1>", "<skill 2>"],
                "red_flags": ["<concern 1>", "<concern 2>"]
            }
            Do not include any markdown formatting or explanations outside the JSON.
        `;

        const input = {
            modelId: "anthropic.claude-3-haiku-20240307-v1:0",
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify({
                anthropic_version: "bedrock-2023-05-31",
                max_tokens: 1000,
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: prompt
                            }
                        ]
                    }
                ]
            })
        };

        console.log('[Analyze] Invoking Bedrock model...');
        const command = new InvokeModelCommand(input);
        const response = await bedrockClient.send(command);
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        const resultText = responseBody.content[0].text;

        // Parse the JSON from the LLM response
        let analysisResult;
        try {
            const jsonStr = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
            analysisResult = JSON.parse(jsonStr);
        } catch (e) {
            console.error('[Analyze] Failed to parse LLM response:', e);
            console.error('[Analyze] Raw response:', resultText);
            throw new Error('Failed to parse analysis result from AI model');
        }

        // 5. Save Analysis to Application Data in S3
        console.log('[Analyze] Saving analysis to S3...');
        appData.analysis = analysisResult;
        await s3Client.send(new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: appKey,
            Body: JSON.stringify(appData, null, 2),
            ContentType: 'application/json'
        }));

        console.log('[Analyze] Analysis complete and saved');
        return analysisResult;

    } catch (error) {
        console.error('[Analyze] Error in performAnalysis:', error);
        throw error;
    }
}

app.post('/api/analyze-supabase-application/:id', async (req, res) => {
    console.log(`[Analyze] Request received for Supabase application ID: ${req.params.id}`);
    try {
        const { id } = req.params;

        // 1. Fetch Application Data from Supabase
        const { data: appData, error: appError } = await supabase
            .from('applications')
            .select('*')
            .eq('id', id)
            .single();

        if (appError || !appData) {
            throw new Error(`Application not found: ${appError?.message}`);
        }

        console.log(`[Analyze] Found application: ${appData.name}, Job: ${appData.job_title}`);

        // 2. Fetch Resume File from Supabase Storage
        if (!appData.resume_url) {
            throw new Error('No resume URL found in application');
        }

        // Parse path from resume_url (expecting "resumes/applications/filename" or similar)
        // If it's a full URL, we might need to be careful, but current code stores path "applications/filename"
        // Bucket is 'resumes'
        const filePath = appData.resume_url;
        console.log(`[Analyze] Downloading resume from 'resumes' bucket, path: ${filePath}`);

        const { data: fileData, error: fileError } = await supabase.storage
            .from('resumes')
            .download(filePath);

        if (fileError || !fileData) {
            throw new Error(`Failed to download resume: ${fileError?.message}`);
        }

        const buffer = Buffer.from(await fileData.arrayBuffer());
        const mimetype = fileData.type;

        // 3. Extract Text
        console.log('[Analyze] Extracting text...');
        const resumeText = await extractTextFromResume(buffer, mimetype || 'application/pdf'); // Default to pdf if unknown

        // 4. Fetch Job Description (Mock or from DB? For now use specific known jobs or generic)
        // Since jobs are in local JSON or S3 in this code, but maybe also in Supabase 'jobs' table?
        // Let's try to fetch from Supabase 'jobs' table first since we migrated
        let jdText = '';
        if (appData.job_title) {
            const { data: jobData } = await supabase
                .from('jobs')
                .select('*')
                .eq('title', appData.job_title)
                .single();

            if (jobData) {
                jdText = `
                    Title: ${jobData.title}
                    Company: ${jobData.company}
                    Location: ${jobData.location}
                    Type: ${jobData.type}
                    Highlights: ${jobData.highlights}
                    Responsibilities: ${jobData.responsibilities}
                    Requirements: ${jobData.requirements}
                    Career Level: ${jobData.career_level}
                `;
            }
        }

        if (!jdText) {
            // Fallback to S3/Local jobs if not found in DB
            const jobs = await getJobsFromS3();
            const job = jobs.find(j => j.title === appData.job_title);
            if (job) {
                jdText = `
                    Title: ${job.title}
                    Company: ${job.company}
                    Location: ${job.location}
                    Highlights: ${job.highlights}
                    Responsibilities: ${job.responsibilities}
                    Requirements: ${job.requirements}
                 `;
            } else {
                // Component-based fallback if really nothing found
                jdText = `Job Title: ${appData.job_title}`;
            }
        }

        // 5. Call Bedrock
        console.log('[Analyze] invoking Bedrock...');
        const prompt = `
            You are an expert HR recruiter. Analyze the following Candidate Resume against the Job Description.

            Job Description:
            ${jdText}

            Candidate Resume:
            ${resumeText.substring(0, 20000)}

            Provide a comprehensive analysis in JSON format with the following structure:
            {
                "scores": {
                    "overall": <0-100>,
                    "skills_match": <0-100>,
                    "experience_match": <0-100>,
                    "cultural_fit": <0-100>
                },
                "match": "<High|Medium|Low>",
                "summary": "<Expert summary max 3 sentences focused on fit>",
                "technical_analysis": {
                    "matched_skills": ["<skill1>", "<skill2>"],
                    "missing_skills": ["<skill1>", "<skill2>"]
                },
                "soft_skills": ["<skill1>", "<skill2>"],
                "red_flags": ["<potential concern 1>", "<potential concern 2>"]
            }
            Do not include Markdown. Return ONLY JSON.
        `;

        const input = {
            modelId: "anthropic.claude-3-haiku-20240307-v1:0",
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify({
                anthropic_version: "bedrock-2023-05-31",
                max_tokens: 1000,
                messages: [{ role: "user", content: [{ type: "text", text: prompt }] }]
            })
        };

        const command = new InvokeModelCommand(input);
        const response = await bedrockClient.send(command);
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        const resultText = responseBody.content[0].text;

        const jsonStr = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
        const analysisResult = JSON.parse(jsonStr);

        // 6. Update Application in Supabase
        console.log('[Analyze] Saving result to Supabase...');
        const { error: updateError } = await supabase
            .from('applications')
            .update({ analysis: analysisResult })
            .eq('id', id);

        if (updateError) throw updateError;

        console.log('[Analyze] Success!');
        res.json(analysisResult);

    } catch (error) {
        console.error('[Analyze] Error:', error);
        res.status(500).json({ error: 'Analysis failed', details: error.message });
    }
});

app.delete('/api/applications/:id', async (req, res) => {
    console.log(`[Delete] Request received for application ID: ${req.params.id}`);
    try {
        const { id } = req.params;

        // 1. Fetch Application to get Resume URL
        const { data: appData, error: fetchError } = await supabase
            .from('applications')
            .select('resume_url')
            .eq('id', id)
            .single();

        if (fetchError) {
            console.warn(`[Delete] Could not fetch application details (might already be deleted): ${fetchError.message}`);
        }

        // 2. Delete Resume from Storage (if exists)
        if (appData && appData.resume_url) {
            console.log(`[Delete] Removing resume: ${appData.resume_url}`);
            const { error: storageError } = await supabase.storage
                .from('resumes')
                .remove([appData.resume_url]);

            if (storageError) {
                console.error(`[Delete] Failed to remove resume file: ${storageError.message}`);
                // Continue deleting the record anyway
            }
        }

        // 3. Delete Application Record
        const { error: deleteError } = await supabase
            .from('applications')
            .delete()
            .eq('id', id);

        if (deleteError) {
            throw new Error(`Failed to delete application record: ${deleteError.message}`);
        }

        console.log(`[Delete] Application ${id} deleted successfully`);

        await logAuditAction(
            'DELETE_APPLICATION',
            'DELETED_APPLICATION',
            { applicationId: id, resumeUrl: appData?.resume_url },
            'ADMIN',
            'N/A'
        );

        res.json({ message: 'Application deleted successfully' });

    } catch (error) {
        console.error('[Delete] Error:', error);
        res.status(500).json({ error: 'Delete failed', details: error.message });
    }
});

app.post('/api/hire-application/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { jobId } = req.body;
        const APP_URL = process.env.APP_URL || 'http://localhost:5173';

        // 1. Fetch Application & Candidate Details
        const { data: application, error: fetchError } = await supabase
            .from('applications')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !application) throw new Error('Application not found');

        // 2. Update Application Status
        const { error: updateAppError } = await supabase
            .from('applications')
            .update({ status: 'hired' })
            .eq('id', id);

        if (updateAppError) throw updateAppError;

        // 3. Update Job Status (if provided)
        if (jobId) {
            const { error: updateJobError } = await supabase
                .from('jobs')
                .update({ status: 'Inactive' })
                .eq('id', jobId);

            if (updateJobError) console.error("Error updating job status:", updateJobError);
        }

        // 4. Generate Onboarding Link
        const onboardingLink = `${APP_URL}/onboarding/${id}`;

        // 5. Send Email
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: application.email,
            subject: `Congratulations! Offer from Sunningdale Tech`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #ef4444;">Congratulations, ${application.name}!</h2>
                    <p>We are thrilled to offer you the position of <strong>${application.job_title}</strong> at Sunningdale Tech.</p>
                    <p>To proceed with the hiring process, please complete our onboarding form by clicking the button below:</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${onboardingLink}" style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                            Complete Onboarding Form
                        </a>
                    </div>
                    
                    <p>Or copy and paste this link into your browser:</p>
                    <p><a href="${onboardingLink}">${onboardingLink}</a></p>
                    
                    <p>If you have any questions, please reply to this email.</p>
                    <br>
                    <p>Best regards,</p>
                    <p><strong>HR Team</strong><br>Sunningdale Tech Ltd</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Hiring email sent to ${application.email}`);

        res.json({ success: true, message: 'Candidate hired and email sent' });

        await logAuditAction(
            'HIRE_CANDIDATE',
            'HIRED_APPLICATION',
            { applicationId: id, jobId, status: 'hired' },
            'ADMIN',
            application.name
        );

    } catch (error) {
        console.error('Error processing hire:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/resend-onboarding-email', async (req, res) => {
    try {
        const { applicationId } = req.body;
        const APP_URL = process.env.APP_URL || 'http://localhost:5173';

        if (!applicationId) {
            return res.status(400).json({ error: 'Application ID is required' });
        }

        // 1. Fetch Application Details
        const { data: application, error: fetchError } = await supabase
            .from('applications')
            .select('*')
            .eq('id', applicationId)
            .single();

        if (fetchError || !application) throw new Error('Application not found');

        // 2. Generate Onboarding Link
        const onboardingLink = `${APP_URL}/onboarding/${applicationId}`;

        // 3. Send Email
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: application.email,
            subject: `[Reminder] Complete Your Onboarding - Sunningdale Tech`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #ef4444;">Hello ${application.name},</h2>
                    <p>This is a reminder to complete your onboarding form for the position of <strong>${application.job_title}</strong> at Sunningdale Tech.</p>
                    <p>Please click the button below to access the form:</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${onboardingLink}" style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                            Complete Onboarding Form
                        </a>
                    </div>
                    
                    <p>Or copy and paste this link into your browser:</p>
                    <p><a href="${onboardingLink}">${onboardingLink}</a></p>
                    
                    <p>If you have already completed this, please ignore this email.</p>
                    <br>
                    <p>Best regards,</p>
                    <p><strong>HR Team</strong><br>Sunningdale Tech Ltd</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Onboarding reminder email sent to ${application.email}`);

        res.json({ success: true, message: 'Onboarding email resent successfully' });

    } catch (error) {
        console.error('Error resending onboarding email:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/notify-onboarding-submission', async (req, res) => {
    try {
        const { applicationId } = req.body;
        const APP_URL = process.env.APP_URL || 'http://localhost:5173';

        if (!applicationId) {
            return res.status(400).json({ error: 'Application ID is required' });
        }

        // 1. Fetch Application Details
        const { data: application, error: fetchError } = await supabase
            .from('applications')
            .select('*')
            .eq('id', applicationId)
            .single();

        if (fetchError || !application) throw new Error('Application not found');

        // 2. Fetch Job Details to get Notification Email
        const { data: jobData, error: jobError } = await supabase
            .from('jobs')
            .select('*')
            .ilike('title', application.job_title)
            .maybeSingle();

        if (jobError) console.error('Error fetching job details:', jobError);

        const notificationEmail = jobData?.email || process.env.SMTP_USER || 'stl-workflow@sdaletech.com';
        const hiringManagerEmail = jobData?.hiring_manager_email;

        // 3. Prepare Recipients
        const recipients = [notificationEmail];
        // Optional: Include Hiring Manager if needed/desired, user said "notification email will do" but good to be robust?
        // User strictly said "send to notification email will do", so let's stick to that to avoid spamming managers if not asked.
        // Actually, let's just send to notification email as requested.

        // 4. Send Email
        const onboardingDashboardLink = `${APP_URL}/admin/jobs?tab=onboarding`; // Direct to onboarding tab

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: notificationEmail,
            subject: `Onboarding Submitted: ${application.name} (${application.job_title})`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb;">Onboarding Submitted</h2>
                    <p><strong>Candidate:</strong> ${application.name}</p>
                    <p><strong>Position:</strong> ${application.job_title}</p>
                    <p>The candidate has successfully submitted their onboarding information.</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${onboardingDashboardLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                            View Onboarding Details
                        </a>
                    </div>
                    
                    <p>Please log in to the HR Portal to review the submission.</p>
                    <br>
                    <p>Best regards,</p>
                    <p><strong>Sunningdale Tech System</strong></p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Onboarding notification sent to ${notificationEmail}`);

        res.json({ success: true, message: 'Notification sent' });

    } catch (error) {
        console.error('Error sending onboarding notification:', error);
        res.status(500).json({ error: error.message });
    }
});

// --- AD Integration Endpoints ---

// Get pending users for AD provisioning
app.get('/api/integrations/ad/pending', async (req, res) => {
    try {
        // Fetch HR details where ad_provisioned is false (or null)
        const { data: pendingUsers, error } = await supabase
            .from('hr_onboarding_details')
            .select(`
                *,
                applications:application_id (
                    name,
                    email,
                    personal_details:onboarding_submissions(personal_details)
                )
            `)
            .is('ad_provisioned', false); // Assuming default is false, or check for null too if needed

        if (error) throw error;

        // Transform data for the PowerShell script / Power Automate
        const usersForAD = pendingUsers.map(user => {
            const personal = user.applications?.personal_details?.[0]?.personal_details || {};
            const firstName = personal.firstName || user.applications?.name.split(' ')[0] || 'Unknown';
            const lastName = personal.lastName || user.applications?.name.split(' ').slice(1).join(' ') || 'User';

            return {
                host: {
                    connectionReferenceName: "shared_uiflow",
                    operationId: "RunUIFlow_V2"
                },
                parameters: {
                    uiFlowId: "8525a8df-d496-48ea-ad44-53cdeb04c1b0",
                    runMode: "unattended",
                    "item/DistinguishedName": "OU=Users,OU=Accounts,OU=LL,OU=RR,OU=AP,OU=AAll Sunningdale Tech Sites and Users,DC=ad,DC=techgrp,DC=com",
                    "item/EmployeeCode": user.employee_code,
                    "item/FirstName": firstName,
                    "item/InitialPassword": "Qweasdzxc12~#@",
                    "item/LastName": lastName,
                    "item/LDAP": "LDAP://DC=ad,DC=techgrp,DC=com",
                    "item/EmailSuffix": "@sdaletech.com",
                    "item/Location": user.location,
                    "item/Department": user.department,
                    "item/JobTitle": user.job_title,
                    "item/Manger": user.manager_email || user.manager,
                    "item/Company": user.company,
                    "item/Region": user.region,
                    "x-ms-flow-trusted-access": true
                },
                // Internal ID for confirmation
                internalId: user.id
            };
        });

        res.json(usersForAD);
    } catch (error) {
        console.error('Error fetching pending AD users:', error);
        res.status(500).json({ error: 'Failed to fetch pending users' });
    }
});

// Confirm AD provisioning
app.post('/api/integrations/ad/confirm', async (req, res) => {
    try {
        const { id, success, error: adError } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'ID is required' });
        }

        if (success) {
            const { error } = await supabase
                .from('hr_onboarding_details')
                .update({
                    ad_provisioned: true,
                    ad_provisioned_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;
            console.log(`[AD Integration] User ${id} provisioned successfully.`);
        } else {
            console.error(`[AD Integration] Failed to provision user ${id}:`, adError);
            // Optionally log the error to a separate table or field
        }

        res.json({ message: 'Status updated' });
    } catch (error) {
        console.error('Error confirming AD provisioning:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

app.post('/api/integrations/ad/provision', async (req, res) => {
    const POWER_AUTOMATE_URL = 'https://defaultc1cf29bbbbd14beeb9773da25824f9.e5.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/461a31f1690e42ce87aad4b3ece8e5bb/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=rM-z-sebpScOmTg4OkvIlqD4tAW_1Y6qf3O1C7GmxyM';

    try {
        const { applicationId } = req.body;
        if (!applicationId) return res.status(400).json({ error: 'Application ID is required' });

        // Fetch HR details
        const { data: hrDetails, error: hrError } = await supabase
            .from('hr_onboarding_details')
            .select('*')
            .eq('application_id', applicationId)
            .single();

        if (hrError) throw hrError;

        // Fetch Personal Details
        const { data: submission, error: subError } = await supabase
            .from('onboarding_submissions')
            .select('personal_details')
            .eq('application_id', applicationId)
            .single();

        if (subError) throw subError;

        // Fetch Company AD Name
        let companyADName = hrDetails.company;
        if (hrDetails.company) {
            const { data: compData } = await supabase
                .from('companies')
                .select('ad_full_name')
                .eq('item', hrDetails.company)
                .maybeSingle();

            if (compData && compData.ad_full_name) {
                companyADName = compData.ad_full_name;
            }
        }

        // Fetch Location AD Name
        let locationADName = hrDetails.location;
        if (hrDetails.location) {
            const { data: locData } = await supabase
                .from('locations')
                .select('ad_full_name')
                .eq('item', hrDetails.location)
                .maybeSingle();

            if (locData && locData.ad_full_name) {
                locationADName = locData.ad_full_name;
            }
        }

        const personal = submission.personal_details || {};
        const firstName = personal.firstName || 'Unknown';
        const lastName = personal.lastName || 'User';

        // Construct Payload
        const payload = {
            employeeCode: hrDetails.employee_code,
            firstName: firstName,
            lastName: lastName,
            displayName: `${firstName} ${lastName}`,
            jobTitle: hrDetails.job_title,
            department: hrDetails.department,
            company: companyADName,
            manager: hrDetails.manager_email || hrDetails.manager,
            location: locationADName,
            region: hrDetails.region,
            emailSuffix: "@sdaletech.com",
            distinguishedName: "OU=Users,OU=Accounts,OU=LL,OU=RR,OU=AP,OU=AAll Sunningdale Tech Sites and Users,DC=ad,DC=techgrp,DC=com",
            ldapPath: "LDAP://DC=ad,DC=techgrp,DC=com",
            initialPassword: "Qweasdzxc12~#@"

        };

        // Call Power Automate
        const paResponse = await fetch(POWER_AUTOMATE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!paResponse.ok) {
            const errorText = await paResponse.text();
            throw new Error(`Power Automate failed: ${paResponse.status} ${errorText}`);
        }

        // Update Provisioning Status locally
        await supabase
            .from('hr_onboarding_details')
            .update({
                ad_provisioned: true,
                ad_provisioned_at: new Date().toISOString()
            })
            .eq('id', hrDetails.id);

        res.json({ success: true, message: 'Provisioning request sent to Power Automate' });

    } catch (error) {
        console.error('Error provisioning AD user:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/analyze-application/:id', async (req, res) => {
    console.log(`[Analyze] Request received for application ID: ${req.params.id}`);
    try {
        const { id } = req.params;
        const { jobTitle } = req.body;

        const result = await performAnalysis(id, jobTitle);
        res.json(result);

    } catch (error) {
        console.error('[Analyze] Error analyzing application:', error);
        if (error.message === 'No resumeKey found in application data') {
            return res.status(400).json({ error: 'No resume found for this application' });
        }
        res.status(500).json({ error: 'Failed to analyze application', details: error.message });
    }
});

app.post('/api/generate-questions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`[Questions] Generating interview questions for application ID: ${id}`);

        if (!process.env.S3_BUCKET_NAME) {
            return res.status(500).json({ error: 'S3 bucket not configured' });
        }

        // 1. Fetch Application Data
        const appKey = `applications/${id}.json`;
        const appCommand = new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: appKey
        });
        const appResponse = await s3Client.send(appCommand);
        const appStr = await appResponse.Body.transformToString();
        const appData = JSON.parse(appStr);

        // 2. Fetch Resume Text (Re-extract or store? We need to re-fetch/extract)
        // Optimization: We could store extracted text in appData to save processing, 
        // but for now let's re-fetch to keep it simple and stateless.
        if (!appData.resumeKey) {
            return res.status(400).json({ error: 'No resume found' });
        }

        const resumeCommand = new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: appData.resumeKey
        });
        const resumeResponse = await s3Client.send(resumeCommand);
        const resumeBuffer = await resumeResponse.Body.transformToByteArray();
        const resumeText = await extractTextFromResume(Buffer.from(resumeBuffer), resumeResponse.ContentType);

        // 3. Fetch Job Description
        const jobs = await getJobsFromS3();
        const job = jobs.find(j => j.title === appData.jobTitle);

        const jdText = job ? `
            Title: ${job.title}
            Responsibilities: ${job.responsibilities}
            Requirements: ${job.requirements}
        ` : `Job Title: ${appData.jobTitle}`;

        // 4. Call Bedrock for Questions
        const prompt = `
            Based on the following Job Description and Candidate Resume, generate 5 targeted interview questions.
            
            Job Description:
            ${jdText}

            Candidate Resume:
            ${resumeText.substring(0, 15000)}

            Output strictly valid JSON:
            {
                "interview_questions": [
                    { "question": "...", "context": "..." },
                    ...
                ]
            }
        `;

        const input = {
            modelId: "anthropic.claude-3-haiku-20240307-v1:0",
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify({
                anthropic_version: "bedrock-2023-05-31",
                max_tokens: 1000,
                messages: [{ role: "user", content: [{ type: "text", text: prompt }] }]
            })
        };

        const command = new InvokeModelCommand(input);
        const response = await bedrockClient.send(command);
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        const resultText = responseBody.content[0].text;

        const jsonStr = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
        const questionsResult = JSON.parse(jsonStr);

        // 5. Update Application Data with Questions
        if (!appData.analysis) appData.analysis = {};
        appData.analysis.interview_questions = questionsResult.interview_questions;

        await s3Client.send(new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: appKey,
            Body: JSON.stringify(appData, null, 2),
            ContentType: 'application/json'
        }));

        res.json(questionsResult);

    } catch (error) {
        console.error('[Questions] Error generating questions:', error);
        res.status(500).json({ error: 'Failed to generate questions' });
    }
});

app.post('/api/schedule-interview', async (req, res) => {
    try {
        console.log('[Schedule] Request received:', req.body);
        const { applicationId, message, slots: proposedSlots } = req.body;

        if (!applicationId) {
            return res.status(400).json({ error: 'Application ID is required' });
        }

        // 1. Fetch Application Data from Supabase
        const { data: appData, error: appError } = await supabase
            .from('applications')
            .select('name, email, job_title')
            .eq('id', applicationId)
            .single();

        if (appError || !appData) {
            throw new Error('Application not found');
        }

        // Map snake_case to camelCase for consistency with existing code
        appData.jobTitle = appData.job_title;

        // 2. Save Proposed Slots to Supabase
        if (proposedSlots && Array.isArray(proposedSlots) && proposedSlots.length > 0) {
            const newSlots = proposedSlots.map(slot => ({
                start_time: slot.startTime,
                end_time: slot.endTime,
                status: 'open',
                application_id: applicationId,
                meeting_type: slot.type || 'online', // 'online' or 'onsite'
                room_details: slot.room || null // { id, name, email }
            }));

            const { error: slotsError } = await supabase
                .from('interview_slots')
                .insert(newSlots);

            if (slotsError) {
                console.error('Error saving slots to Supabase:', slotsError);
                throw new Error('Failed to save interview slots');
            }
        }

        // 3. Generate Internal Booking Link
        const baseUrl = process.env.BASE_URL || 'http://localhost:5173';
        const interviewLink = `${baseUrl}/schedule/${applicationId}`;

        // 4. Send Email
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: appData.email,
            subject: `Interview Invitation: ${appData.jobTitle} at Sunningdale Tech`,
            text: `
                Dear ${appData.name},

                ${message || 'We have reviewed your application and would like to invite you for an interview.'}

                Please use the following link to select a time slot:
                ${interviewLink}

                Best regards,
                Sunningdale Tech HR Team
            `,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h3 style="color: #333;">Interview Invitation</h3>
                    <p style="color: #555;">Dear ${appData.name},</p>
                    <p style="color: #555; line-height: 1.6;">${(message || 'We have reviewed your application and would like to invite you for an interview.').replace(/\n/g, '<br>')}</p>
                    
                    <p style="color: #555; margin-top: 20px;"><strong>Please use the following link to select a time slot:</strong></p>
                    
                    <div style="margin: 25px 0;">
                        <a href="${interviewLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Select Time Slot</a>
                    </div>
                    
                    <p style="color: #777; font-size: 14px;">Or copy this link: <br>
                    <a href="${interviewLink}" style="color: #2563eb;">${interviewLink}</a></p>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    
                    <p style="color: #555;">Best regards,</p>
                    <p style="color: #333; font-weight: bold;">Sunningdale Tech HR Team</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`[Interview] Invitation sent to ${appData.email}`);

        // 5. Update Application Status
        // 5. Update Application Status (Handled by Frontend or separate call, but good to log)
        console.log(`[Interview] Status updated for ${appData.email}`);

        res.json({ message: 'Interview invitation sent successfully' });

    } catch (error) {
        console.error('[Interview] Error sending invitation:', error);
        res.status(500).json({ error: 'Failed to send interview invitation' });
    }
});

// Event Management Routes
const EVENTS_S3_KEY = 'events/events.json';

// Helper to get events from S3 or fallback to local file
async function getEventsFromS3() {
    try {
        if (!process.env.S3_BUCKET_NAME) {
            console.warn('S3_BUCKET_NAME not set, falling back to local file');
            throw new Error('S3 not configured');
        }

        const command = new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: EVENTS_S3_KEY
        });
        const response = await s3Client.send(command);
        const str = await response.Body.transformToString();
        return JSON.parse(str);
    } catch (error) {
        // If file doesn't exist in S3 or S3 error, fallback to local initial data
        console.log('Fetching events from S3 failed or file missing, using default data:', error.message);
        try {
            const localPath = path.join(__dirname, 'src', 'data', 'events.json');
            const data = fs.readFileSync(localPath, 'utf8');
            return JSON.parse(data);
        } catch (localError) {
            console.error('Failed to read local events.json:', localError);
            return [];
        }
    }
}

// Helper to save events to S3
async function saveEventsToS3(events) {
    if (!process.env.S3_BUCKET_NAME) {
        throw new Error('S3_BUCKET_NAME not configured');
    }

    await s3Client.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: EVENTS_S3_KEY,
        Body: JSON.stringify(events, null, 2),
        ContentType: 'application/json'
    }));
}

app.get('/api/events', async (req, res) => {
    try {
        const events = await getEventsFromS3();
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

app.post('/api/events', async (req, res) => {
    try {
        const newEvent = req.body;
        if (!newEvent.title || !newEvent.date) {
            return res.status(400).json({ error: 'Title and Date are required' });
        }

        // Ensure ID
        if (!newEvent.id) {
            newEvent.id = Date.now();
        }

        const events = await getEventsFromS3();
        events.push(newEvent);

        await saveEventsToS3(events);
        res.status(201).json(newEvent);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Failed to create event' });
    }
});

app.put('/api/events/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedEvent = req.body;
        const events = await getEventsFromS3();

        const index = events.findIndex(e => e.id == id);
        if (index === -1) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Preserve ID and update fields
        events[index] = { ...events[index], ...updatedEvent, id: events[index].id };

        await saveEventsToS3(events);
        res.json(events[index]);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Failed to update event' });
    }
});

app.delete('/api/events/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let events = await getEventsFromS3();

        const initialLength = events.length;
        events = events.filter(e => e.id != id);

        if (events.length === initialLength) {
            return res.status(404).json({ error: 'Event not found' });
        }

        await saveEventsToS3(events);
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Failed to delete event' });
    }
});

// --- Availability & Scheduling Endpoints ---

const AVAILABILITY_KEY = 'availability.json';

async function getAvailability() {
    try {
        const command = new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: AVAILABILITY_KEY
        });
        const response = await s3Client.send(command);
        const str = await response.Body.transformToString();
        return JSON.parse(str);
    } catch (error) {
        if (error.name === 'NoSuchKey') return [];
        throw error;
    }
}

async function saveAvailability(slots) {
    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: AVAILABILITY_KEY,
        Body: JSON.stringify(slots),
        ContentType: 'application/json'
    });
    await s3Client.send(command);
}

// Get all availability slots
app.get('/api/availability', async (req, res) => {
    try {
        const slots = await getAvailability();
        // Optional: Filter by status or applicationId
        const { status, applicationId } = req.query;

        let filtered = slots;

        if (status) {
            filtered = filtered.filter(s => s.status === status);
        }

        if (applicationId) {
            // If applicationId is provided, we want slots proposed for this application
            // OR slots that are already booked by this application
            filtered = filtered.filter(s =>
                (s.status === 'proposed' && s.applicationId === applicationId) ||
                (s.bookedBy?.applicationId === applicationId)
            );
        }

        res.json(filtered);
    } catch (error) {
        console.error('Error fetching availability:', error);
        res.status(500).json({ error: 'Failed to fetch availability' });
    }
});

// Add new availability slot
app.post('/api/availability', async (req, res) => {
    try {
        const { startTime, endTime } = req.body;
        if (!startTime || !endTime) {
            return res.status(400).json({ error: 'Start and end time required' });
        }

        const slots = await getAvailability();
        const newSlot = {
            id: uuidv4(),
            startTime,
            endTime,
            status: 'open',
            bookedBy: null
        };

        slots.push(newSlot);
        await saveAvailability(slots);

        res.json(newSlot);
    } catch (error) {
        console.error('Error adding availability:', error);
        res.status(500).json({ error: 'Failed to add availability' });
    }
});

// Delete availability slot
app.delete('/api/availability/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let slots = await getAvailability();
        slots = slots.filter(s => s.id !== id);
        await saveAvailability(slots);
        res.json({ message: 'Slot deleted' });
    } catch (error) {
        console.error('Error deleting availability:', error);
        res.status(500).json({ error: 'Failed to delete availability' });
    }
});

// Book an interview slot
app.post('/api/book-interview', async (req, res) => {
    try {
        const { slotId, applicationId } = req.body;

        if (!slotId || !applicationId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // 1. Get Slot from Supabase
        const { data: slot, error: slotError } = await supabase
            .from('interview_slots')
            .select('*')
            .eq('id', slotId)
            .single();

        if (slotError || !slot) {
            return res.status(404).json({ error: 'Interview slot not found' });
        }

        if (slot.status !== 'open' && slot.application_id !== applicationId) {
            return res.status(409).json({ error: 'Slot is no longer available' });
        }

        // 2. Get Application from Supabase
        const { data: appData, error: appError } = await supabase
            .from('applications')
            .select('*')
            .eq('id', applicationId)
            .single();

        if (appError || !appData) {
            return res.status(404).json({ error: 'Application not found' });
        }

        // 3. Update Slot in Supabase
        const { error: updateError } = await supabase
            .from('interview_slots')
            .update({
                status: 'booked',
                booked_by: {
                    name: appData.name,
                    email: appData.email,
                    applicationId: applicationId
                },
                application_id: applicationId
            })
            .eq('id', slotId);

        if (updateError) throw updateError;

        // 4. Update Application Status
        await supabase
            .from('applications')
            .update({ status: 'interview_scheduled' })
            .eq('id', applicationId);
        console.log('[DEBUG-FLOW] Application status updated.');

        // 5. Fetch Job Details for Hiring Manager Email (Source: Supabase)
        console.log('[DEBUG-FLOW] Fetching job details from Supabase for:', appData.job_title);

        const { data: jobData, error: jobError } = await supabase
            .from('jobs')
            .select('*')
            .ilike('title', appData.job_title) // Case-insensitive match
            .maybeSingle(); // Use maybeSingle to avoid 406 if multiple (though should be unique) or 0 found

        if (jobError) {
            console.error('[DEBUG-FLOW] Error fetching job from Supabase:', jobError);
        }

        const job = jobData;
        console.log('[DEBUG-FLOW] Job found in Supabase:', job ? 'Yes' : 'No');

        if (job) {
            console.log('[DEBUG-FLOW] Job Emails - HiringManager:', job.hiring_manager_email, 'Notification:', job.email);
        }

        // Map Supabase snake_case to local variables
        const hiringManagerEmail = job?.hiring_manager_email;
        const notificationEmail = job?.email || process.env.SMTP_USER || 'stl-workflow@sdaletech.com';

        // 6. Send Confirmation Emails
        console.log('[DEBUG-FLOW] Preparing email...');
        const interviewDate = new Date(slot.start_time);
        const interviewEnd = new Date(slot.end_time);
        const dateString = interviewDate.toLocaleString('en-SG', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // --- TEAMS MEETING GENERATION ---
        let meetingLink = null;
        let locationText = "Microsoft Teams Meeting"; // Default/Fallback

        // Fix: Define isOnsite from slot data
        const isOnsite = slot.meeting_type === 'onsite';
        if (isOnsite && slot.room_details) {
            locationText = `${slot.room_details.name} (${slot.room_details.address?.buildingStr || 'Onsite'})`;
        }

        // Try to generate a dynamic link only if ONLINE default
        // Actually, if isOnsite, we don't need Teams link usually?
        // But user code structure implies we create it anyway or use logic.
        // Let's keep existing logic but SKIP createTeamsMeeting if isOnsite to save time/error?
        // The original code tried to create it regardless. 
        // Let's strictly follow the "isOnsite" flag to optimize.

        let teamsMeeting = null;
        if (!isOnsite) {
            teamsMeeting = await createTeamsMeeting(
                `Interview: ${appData.name} - ${appData.job_title}`,
                interviewDate.toISOString(),
                interviewEnd.toISOString()
            );
        }

        if (teamsMeeting && teamsMeeting.joinUrl) {
            meetingLink = teamsMeeting.joinUrl;
            locationText = meetingLink; // For ICS location, sometimes URL is better or just "Microsoft Teams Meeting"
        }

        const teamsLinkHtml = meetingLink
            ? `<p><strong>Join Teams Meeting:</strong> <a href="${meetingLink}">Click here to join</a></p>`
            : `<p><strong>Location:</strong> Microsoft Teams Meeting (Link will be provided separately if not attached)</p>`;

        const teamsLinkTxt = meetingLink
            ? `Join Teams Meeting: ${meetingLink}`
            : `Location: Microsoft Teams Meeting`;


        // Create ICS Content
        // If we have a link, put it in DESCRIPTION and possibly LOCATION
        const icsDescription = `Interview with ${appData.name} for the position of ${appData.job_title}.\\n\\n${teamsLinkTxt}`;
        // Fix: Use locationText for onsite meetings instead of defaulting to Teams
        const icsLocation = isOnsite ? locationText : (meetingLink || "Microsoft Teams Meeting");

        // Create ICS Content
        // Ensure strictly CRLF line endings for Outlook compatibility
        const icsLines = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Sunningdale Tech//Interview System//EN',
            'CALSCALE:GREGORIAN',
            'METHOD:REQUEST', // Critical for "Invite" behavior
            'BEGIN:VEVENT',
            `UID:${slotId}@sdaletech.com`,
            `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
            `DTSTART:${interviewDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
            `DTEND:${interviewEnd.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
            `SUMMARY:Interview: ${appData.name} - ${appData.job_title}`,
            `DESCRIPTION:${icsDescription}`,
            `LOCATION:${icsLocation}`,
            `ORGANIZER;CN=Sunningdale HR:mailto:${process.env.SMTP_USER || notificationEmail}`,
            `ATTENDEE;RSVP=TRUE;CN=${appData.name}:mailto:${appData.email}`
        ];

        if (hiringManagerEmail) {
            icsLines.push(`ATTENDEE;RSVP=TRUE;CN=Hiring Manager:mailto:${hiringManagerEmail}`);
        }

        // Add Notification Email (e.g. Saharudin) to attendees if not same as Hiring Manager
        if (notificationEmail && notificationEmail !== hiringManagerEmail && notificationEmail !== process.env.SMTP_USER) {
            icsLines.push(`ATTENDEE;RSVP=TRUE;CN=Notification Contact:mailto:${notificationEmail}`);
        }

        // Add Room Email if Onsite (to book the room)
        const roomEmail = slot.room_details?.email;
        if (isOnsite && roomEmail) {
            icsLines.push(`ATTENDEE;RSVP=TRUE;CN=Meeting Room:mailto:${roomEmail}`);
            // Also add CUTYPE=RESOURCE if needed, but standard attendee usually books it
        }

        icsLines.push('STATUS:CONFIRMED');
        icsLines.push('SEQUENCE:0');
        icsLines.push('END:VEVENT');
        icsLines.push('END:VCALENDAR');

        const icsContent = icsLines.join('\r\n');

        const recipients = [appData.email, notificationEmail];
        if (hiringManagerEmail) {
            recipients.push(hiringManagerEmail);
        }
        // Add Room Email to recipients to ensure it gets the invite
        if (isOnsite && roomEmail) {
            recipients.push(roomEmail);
        }

        // Filter and Deduplicate
        // Use a Map to deduplicate by lowercase email to handle case-sensitivity issues
        const uniqueRecipientsMap = new Map();
        recipients.forEach(r => {
            if (r && r.trim().length > 0) {
                uniqueRecipientsMap.set(r.toLowerCase(), r);
            }
        });
        const validRecipients = Array.from(uniqueRecipientsMap.values());

        if (validRecipients.length === 0) {
            console.warn('[Interview] No valid email recipients found.');
        } else {
            console.log('[DEBUG-FLOW] Sending single email to multiple recipients via transporter...');

            // Helper to sanitize email
            const cleanEmail = (email) => {
                return email ? email.trim().replace(/[\u200B-\u200D\uFEFF]/g, '') : '';
            };

            const sanitizedRecipients = validRecipients.map(cleanEmail).filter(e => e.length > 0);
            const toField = sanitizedRecipients.join(', ');

            console.log('[DEBUG-FLOW] Final To Header:', toField);

            // HARDCODED TEST - SINGLE RECIPIENT ONLY
            // const testRecipients = 'linkang.sun@sdaletech.com';
            // console.log('[DEBUG-FLOW] !!! USING SINGLE RECIPIENT !!! :', testRecipients);

            const mailOptions = {
                from: process.env.SMTP_USER,
                to: toField, // Use dynamic recipients
                subject: `Interview Confirmed: ${appData.name} - ${appData.job_title}`,
                text: `
Interview Confirmed

Candidate: ${appData.name}
Position: ${appData.job_title}
Time: ${dateString}
${teamsLinkTxt}

A calendar invitation is attached to this email.
                `,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center;">
                            <h2 style="margin: 0;">Interview Confirmed</h2>
                        </div>
                        <div style="padding: 30px; color: #333;">
                            <p>The interview has been successfully scheduled.</p>
                            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 30%;">Candidate</td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${appData.name}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Position</td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${appData.job_title}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Time</td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${dateString}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Location</td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                                        ${isOnsite ? locationText : (meetingLink ? `<a href="${meetingLink}">Join Teams Meeting</a>` : 'Microsoft Teams Meeting')}
                                    </td>
                                </tr>
                            </table>
                            ${meetingLink ? `
                            <div style="margin: 30px 0; text-align: center;">
                                <a href="${meetingLink}" style="background-color: #5b5fc7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                                    Join Teams Meeting
                                </a>
                            </div>
                            ` : ''}
                            <p style="color: #666; font-size: 14px; margin-top: 30px;">
                                A calendar invitation has been attached to this email. Please accept it to add this to your calendar.
                            </p>
                        </div>
                        <div style="background-color: #f9fafb; padding: 20px; text-align: center; color: #999; font-size: 12px;">
                            © Sunningdale Tech Ltd
                        </div>
                    </div>
                `,
                icalEvent: {
                    filename: 'interview.ics',
                    method: 'request',
                    content: icsContent
                }
            };

            console.log('[DEBUG-EMAIL] icalEvent ENABLED');
            console.log('[DEBUG-EMAIL] mailOptions.to:', mailOptions.to);

            try {
                // Using exact same method as schedule-interview endpoint
                await transporter.sendMail(mailOptions);
                console.log(`[Interview] Confirmation email sent to ${toField}`);
            } catch (emailError) {
                console.error('[Interview] Failed to send email:', emailError.message);
                // We do NOT throw here, so the client still gets a success response for the booking
            }
        }

        res.json({ message: 'Interview booked successfully' });

    } catch (error) {
        console.error('Error booking interview:', error);
        res.status(500).json({ error: 'Failed to book interview' });
    }
});

// Serve static files from the 'dist' directory
// Serve static files from the 'dist' directory ONLY in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));

    // Handle React routing, return all requests to React app
    app.get(/.*/, (req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
