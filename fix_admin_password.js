import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function fixPassword() {
    const password = 'admin123';
    const hash = bcrypt.hashSync(password, 10);
    console.log('Generated hash:', hash);

    const { data: users, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .eq('username', 'admin');

    if (fetchError || !users.length) {
        console.error('User not found');
        return;
    }

    const { error: updateError } = await supabase
        .from('users')
        .update({ password: hash })
        .eq('id', users[0].id);

    if (updateError) {
        console.error('Update failed:', updateError);
    } else {
        console.log('Password updated successfully.');
    }
}

fixPassword();
