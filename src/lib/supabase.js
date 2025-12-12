
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://edpkbrlfkzlfofiuvqrg.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Zb18cw3LIQviKbuH-xG3IQ_VfuByoRJ';

export const supabase = createClient(supabaseUrl, supabaseKey);
