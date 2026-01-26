import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envConfig = {
    AZURE_TENANT_ID: process.env.AZURE_TENANT_ID,
    AZURE_CLIENT_ID: process.env.AZURE_CLIENT_ID,
    AZURE_CLIENT_SECRET: process.env.AZURE_CLIENT_SECRET
};

// Helper to fetch
function fetchUrl(url, options, body) {
    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        resolve(data);
                    }
                } else {
                    reject(new Error(`Status ${res.statusCode}: ${data}`));
                }
            });
        });
        req.on('error', reject);
        if (body) req.write(body);
        req.end();
    });
}

async function run() {
    try {
        console.log('Fetching Azure Token...');
        const params = new URLSearchParams();
        params.append('client_id', envConfig.AZURE_CLIENT_ID);
        params.append('scope', 'https://graph.microsoft.com/.default');
        params.append('client_secret', envConfig.AZURE_CLIENT_SECRET);
        params.append('grant_type', 'client_credentials');

        const tokenData = await fetchUrl(`https://login.microsoftonline.com/${envConfig.AZURE_TENANT_ID}/oauth2/v2.0/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }, params.toString());

        const accessToken = tokenData.access_token;
        console.log('Token acquired.');

        console.log('Fetching Rooms...');
        const roomsData = await fetchUrl('https://graph.microsoft.com/v1.0/places/microsoft.graph.room', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        if (roomsData.value && roomsData.value.length > 0) {
            console.log('\n--- RAW DATA FOR FIRST ROOM ---');
            console.log(JSON.stringify(roomsData.value[0], null, 2));
            console.log('-------------------------------\n');
            console.log(`Total Rooms Found: ${roomsData.value.length}`);

            // List all names for context
            console.log('\nList of all room names:');
            roomsData.value.forEach(r => console.log(`- ${r.displayName}`));
        } else {
            console.log('No rooms found.');
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

run();
