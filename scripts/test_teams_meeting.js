import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from parent directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const AZURE_TENANT_ID = process.env.AZURE_TENANT_ID;
// Use hardcoded fallback if env var is missing/mismatched, but prefer env
const AZURE_CLIENT_ID = process.env.AZURE_CLIENT_ID || "d8ff2464-4dab-40b5-9c5f-1eae92070ebc";
const AZURE_CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET;
const ORGANIZER_EMAIL = "stl-workflow@sdaletech.com"; // Hardcoded as per user request

console.log("-----------------------------------------");
console.log("Testing Teams Meeting Creation");
console.log("Tenant ID: " + AZURE_TENANT_ID);
console.log("Client ID: " + AZURE_CLIENT_ID);
console.log("Organizer: " + ORGANIZER_EMAIL);
console.log("-----------------------------------------");

async function getAccessToken() {
    console.log("1. Authenticating with separate Azure App...");
    const tokenResponse = await fetch(`https://login.microsoftonline.com/${AZURE_TENANT_ID}/oauth2/v2.0/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: AZURE_CLIENT_ID,
            scope: 'https://graph.microsoft.com/.default',
            client_secret: AZURE_CLIENT_SECRET,
            grant_type: 'client_credentials',
        }),
    });

    if (!tokenResponse.ok) {
        throw new Error(await tokenResponse.text());
    }
    const data = await tokenResponse.json();
    console.log("   Authentication successful.");
    return data.access_token;
}

async function createMeeting() {
    try {
        const token = await getAccessToken();

        console.log(`2. Resolving User ID for ${ORGANIZER_EMAIL}...`);
        const userResp = await fetch(`https://graph.microsoft.com/v1.0/users/${ORGANIZER_EMAIL}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!userResp.ok) throw new Error(await userResp.text());
        const user = await userResp.json();
        console.log(`   Found User ID: ${user.id}`);

        console.log("3. Creating Online Meeting...");
        const startTime = new Date();
        startTime.setMinutes(startTime.getMinutes() + 5); // Start in 5 mins
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + 30); // 30 min duration

        const meetingPayload = {
            startDateTime: startTime.toISOString(),
            endDateTime: endTime.toISOString(),
            subject: "Test Meeting from Script"
        };

        const meetingResp = await fetch(`https://graph.microsoft.com/v1.0/users/${user.id}/onlineMeetings`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(meetingPayload)
        });

        if (!meetingResp.ok) {
            const errText = await meetingResp.text();
            console.error("\nFAILED to create meeting.");
            console.error("Status:", meetingResp.status);
            console.error("Error:", errText);
        } else {
            const meeting = await meetingResp.json();
            console.log("\nSUCCESS! Meeting Created.");
            console.log("Join URL:", meeting.joinWebUrl);
        }

    } catch (err) {
        console.error("Error:", err.message);
    }
}

createMeeting();
