import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

console.log('SUPABASE_URL present:', !!process.env.SUPABASE_URL);
console.log('SUPABASE_SERVICE_ROLE_KEY present:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log('SUPABASE_KEY present:', !!process.env.SUPABASE_KEY);

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY);

async function testFetch() {
    console.log('Fetching users...');
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
        console.error('Error:', JSON.stringify(error, null, 2));
    } else {
        console.log('Success. Users found:', data.length);
        if (data.length > 0) {
            console.log('First user:', data[0]);
            // filter for linkang
            const linkang = data.find(u => u.username.toLowerCase().includes('linkang'));
            console.log('Linkang User:', linkang);
        }
    }
}

testFetch();
