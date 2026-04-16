import fs from 'fs';
import https from 'https';
import path from 'path';

const filePath = 'src/data/newsArticles.js';
let content = fs.readFileSync(filePath, 'utf8');

const targetDir = 'public/investor-relations/newsroom';
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// Find all external attachment URLs
const urlRegex = /https:\/\/investor\.sdaletech\.com\/newsroom\/([a-zA-Z0-9_.]+pdf)/g;
let match;
const downloads = [];

while ((match = urlRegex.exec(content)) !== null) {
    const fullUrl = match[0];
    const fileName = match[1];
    downloads.push({ fullUrl, fileName });
}

console.log(`Found ${downloads.length} attachments to localize.`);

const downloadFile = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
};

async function processAll() {
    for (const item of downloads) {
        const localPath = path.join(targetDir, item.fileName);
        console.log(`Downloading ${item.fileName}...`);
        try {
            await downloadFile(item.fullUrl, localPath);
            console.log(`Downloaded ${item.fileName}`);
            
            // Replace the URL in the content
            const localLink = `/investor-relations/newsroom/${item.fileName}`;
            content = content.replace(item.fullUrl, localLink);
        } catch (e) {
            console.error(`Failed to download ${item.fileName}:`, e);
        }
    }
    
    // Write the updated content back
    fs.writeFileSync(filePath, content);
    console.log('Finished updating newsArticles.js with local links.');
}

processAll();
