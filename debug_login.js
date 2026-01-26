import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function debugLogin() {
    console.log('--- Debugging Login ---');

    // 1. Fetch user
    const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', 'admin');

    if (error) {
        console.error('Error fetching user:', error);
        return;
    }

    if (!users || users.length === 0) {
        console.error('User "admin" NOT FOUND in Supabase.');
        return;
    }

    const user = users[0];
    console.log('User found:', { ...user, password: user.password ? 'HIDDEN_HASH' : 'NULL' });

    // 2. Check Password
    const inputPassword = 'admin123';
    console.log(`Testing password: "${inputPassword}"`);
    console.log(`Stored Hash: ${user.password}`);

    const isMatch = bcrypt.compareSync(inputPassword, user.password);
    console.log('bcrypt.compareSync result:', isMatch);

    if (isMatch) {
        console.log('SUCCESS: Password matches.');
    } else {
        console.log('FAILURE: Password does NOT match.');

        // Generate a new hash to see what it looks like
        const newHash = bcrypt.hashSync(inputPassword, 10);
        console.log('Generated new hash for "admin123":', newHash);
    }
}

debugLogin();
