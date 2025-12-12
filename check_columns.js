
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
    console.log('Checking for verified_at column...');
    const { data, error } = await supabase
        .from('onboarding_submissions')
        .select('verified_at')
        .limit(1);

    if (error) {
        console.error('Error:', error.message);
        if (error.code === 'PGRST204' || error.message.includes('Could not find the')) {
            console.log('Column verified_at DOES NOT exist.');
        }
    } else {
        console.log('Column verified_at EXISTS.');
    }
}

checkColumns();
