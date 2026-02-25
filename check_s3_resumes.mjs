// Check if resume files are in S3 instead of Supabase
import { S3Client, ListObjectsV2Command, HeadObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

async function checkS3Resumes() {
    console.log('\n=== Checking S3 for resume files ===\n');

    const testFile = 'applications/1770266468151_9l6ezgk1zz.docx';

    try {
        const headCommand = new HeadObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: testFile
        });

        const response = await s3Client.send(headCommand);
        console.log(`✅ File EXISTS in S3: ${testFile}`);
        console.log('File size:', response.ContentLength, 'bytes');
        console.log('Content type:', response.ContentType);
    } catch (error) {
        if (error.name === 'NotFound') {
            console.log(`❌ File NOT FOUND in S3: ${testFile}`);
        } else {
            console.error('Error checking S3:', error.message);
        }
    }

    // List all files in applications folder
    console.log('\n=== Listing S3 applications folder ===\n');
    try {
        const listCommand = new ListObjectsV2Command({
            Bucket: process.env.S3_BUCKET_NAME,
            Prefix: 'applications/',
            MaxKeys: 20
        });

        const listResponse = await s3Client.send(listCommand);

        if (listResponse.Contents && listResponse.Contents.length > 0) {
            console.log(`Found ${listResponse.Contents.length} files:`);
            listResponse.Contents.forEach(file => {
                console.log(`  - ${file.Key} (${file.Size} bytes)`);
            });
        } else {
            console.log('No files found in S3 applications folder');
        }
    } catch (error) {
        console.error('Error listing S3:', error.message);
    }
}

checkS3Resumes();
