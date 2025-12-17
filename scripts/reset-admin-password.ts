// Script to reset admin password using Service Role Key
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function resetAdminPassword() {
    console.log('🔐 Resetting password for admin@gmail.com...');

    const { data, error } = await supabase.auth.admin.updateUserById(
        '7bc789a1-87eb-48d2-9c2c-9ecceb970f28', // ID from previous script output
        { password: 'password123' }
    );

    if (error) {
        console.error('❌ Error resetting password:', error.message);

        // If user not found by ID (maybe ID changed?), try by email?
        // Note: updateUserById is safer. Let's verify user exists via listUsers if ID fails.
        return;
    }

    console.log('✅ Password reset successfully to: password123');
    console.log('User:', data.user.email);
}

resetAdminPassword();
