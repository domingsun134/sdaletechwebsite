import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

console.log('Testing Supabase Connection...');
console.log('URL:', supabaseUrl);
console.log('Key (last 4):', supabaseKey ? supabaseKey.slice(-4) : 'None');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testStorage() {
    try {
        // 1. List buckets to check connection
        console.log('\nListing buckets...');
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();
        if (listError) {
            console.error('Error listing buckets:', listError);
        } else {
            console.log('Buckets:', buckets.map(b => b.name));
            const resumeBucket = buckets.find(b => b.name === 'resumes');
            if (resumeBucket) {
                console.log('Resumes bucket public:', resumeBucket.public);
            }
        }

        // 2. Try to list files in 'resumes' bucket
        console.log("\nListing files in 'resumes' bucket (folder 'applications')...");
        const { data: files, error: filesError } = await supabase.storage
            .from('resumes')
            .list('applications');

        if (filesError) {
            console.error("Error listing files in 'resumes':", filesError);
        } else {
            console.log(`Found ${files.length} files.`);
            if (files.length > 0) {
                console.log('Sample file:', files[0].name);

                // 3. Try to download the sample file
                console.log(`\nAttempting to download ${files[0].name}...`);
                const { data, error: downloadError } = await supabase.storage
                    .from('resumes')
                    .download(`applications/${files[0].name}`);

                if (downloadError) {
                    console.error('Download failed:', downloadError);
                } else {
                    console.log('Download successful! Size:', data.size);
                }
            } else {
                console.log("No files found to test download.");
            }
        }

    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

testStorage();
