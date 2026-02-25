// Test if the resume files actually exist in Supabase storage
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testSupabaseResume() {
    const testPath = 'applications/1770266468151_9l6ezgk1zz.docx';

    console.log(`\n=== Testing Supabase Storage Access ===\n`);
    console.log(`Path: ${testPath}`);

    // Try to get file metadata
    const { data: listData, error: listError } = await supabase.storage
        .from('resumes')
        .list('applications', { limit: 100 });

    if (listError) {
        console.error('List error:', listError);
    } else {
        console.log('\nFiles in resumes/applications:');
        listData.forEach(file => {
            console.log(`  - ${file.name} (${file.metadata?.size || 0} bytes)`);
        });

        // Check if our specific file exists
        const fileExists = listData.some(f => f.name === '1770266468151_9l6ezgk1zz.docx');
        console.log(`\nFile exists: ${fileExists}`);
    }

    // Try to download the file
    console.log('\n=== Attempting Download ===\n');
    const { data: downloadData, error: downloadError } = await supabase.storage
        .from('resumes')
        .download(testPath);

    if (downloadError) {
        console.error('Download error:', downloadError);
    } else {
        console.log('✅ Download successful!');
        console.log('File size:', downloadData.size, 'bytes');
        console.log('File type:', downloadData.type);
    }
}

testSupabaseResume();
