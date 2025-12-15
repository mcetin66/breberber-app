
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
});

async function checkStaffAuth() {
    const email = 'buza.0@altemurberber306.com'; // Previously found staff email
    console.log(`Checking auth for: ${email}`);

    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
        console.error('Error listing users:', error);
        return;
    }

    const found = data.users.find(u => u.email === email);

    if (found) {
        console.log('✅ User exists in Auth:', found.id);
    } else {
        console.log('❌ User does NOT exist in Auth. This is the problem.');
    }
}

checkStaffAuth();
