// Quick script to check resume_url values in Supabase
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkResumeUrls() {
    const { data, error } = await supabase
        .from('applications')
        .select('id, name, resume_url')
        .limit(10);

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('\n=== Applications Resume URLs ===\n');
    data.forEach(app => {
        console.log(`ID: ${app.id}`);
        console.log(`Name: ${app.name}`);
        console.log(`Resume URL: ${app.resume_url}`);
        console.log(`URL Type: ${app.resume_url?.startsWith('http') ? 'HTTP URL' : 'Storage Path'}`);
        console.log('---');
    });

    // Check if resumes bucket exists
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    console.log('\n=== Storage Buckets ===\n');
    if (bucketError) {
        console.error('Bucket Error:', bucketError);
    } else {
        buckets.forEach(bucket => {
            console.log(`- ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
        });
    }

    // Try to list files in resumes bucket
    console.log('\n=== Files in resumes bucket ===\n');
    const { data: files, error: filesError } = await supabase.storage
        .from('resumes')
        .list('', { limit: 10 });

    if (filesError) {
        console.error('Files Error:', filesError);
    } else {
        files.forEach(file => {
            console.log(`- ${file.name}`);
        });
    }
}

checkResumeUrls();
