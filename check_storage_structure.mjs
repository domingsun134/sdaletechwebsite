// Check the actual file structure in Supabase storage
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkStorageStructure() {
    console.log('\n=== Checking resumes bucket structure ===\n');

    // List root level
    const { data: rootFiles, error: rootError } = await supabase.storage
        .from('resumes')
        .list('', { limit: 100 });

    if (rootError) {
        console.error('Root Error:', rootError);
    } else {
        console.log('Root level:');
        rootFiles.forEach(file => {
            console.log(`  ${file.name} (${file.id ? 'folder' : 'file'})`);
        });
    }

    // List applications folder
    const { data: appFiles, error: appError } = await supabase.storage
        .from('resumes')
        .list('applications', { limit: 100 });

    if (appError) {
        console.error('\nApplications folder Error:', appError);
    } else {
        console.log('\nApplications folder:');
        appFiles.forEach(file => {
            console.log(`  applications/${file.name}`);
        });
    }

    // Try to create a signed URL for one of the files
    console.log('\n=== Testing Signed URL Generation ===\n');
    const testPath = 'applications/1770101507725_6zjjj8p6cxh.pdf';
    console.log(`Testing path: ${testPath}`);

    const { data: signedData, error: signedError } = await supabase.storage
        .from('resumes')
        .createSignedUrl(testPath, 60);

    if (signedError) {
        console.error('Signed URL Error:', signedError);
    } else {
        console.log('✅ Signed URL created successfully!');
        console.log('URL:', signedData.signedUrl);
    }
}

checkStorageStructure();
