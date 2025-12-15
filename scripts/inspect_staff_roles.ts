
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
});

async function inspectStaffRoles() {
    const email = 'buza.0@altemurberber306.com';
    console.log(`Inspecting roles for: ${email}`);

    // Check Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .maybeSingle();

    console.log('--- Profile ---');
    console.log(profile);

    // Check Business Staff Record
    const { data: staff } = await supabase
        .from('business_staff')
        .select('*')
        .eq('email', email)
        .maybeSingle();

    console.log('--- Business Staff ---');
    console.log(staff);

    // Check Auth Meta
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const user = users.find(u => u.email === email);
    console.log('--- Auth User Meta ---');
    console.log(user?.user_metadata);
}

inspectStaffRoles();
