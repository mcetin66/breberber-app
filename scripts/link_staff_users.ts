
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
});

async function linkStaffUsers() {
    console.log('🔗 Linking Business Staff to Auth Users...');

    // 1. Fetch all profiles with role 'staff'
    const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('role', 'staff');

    if (profileError) {
        console.error('❌ Profile Fetch Error:', profileError.message);
        return;
    }

    console.log(`📋 Found ${profiles.length} staff profiles.`);

    let linkedCount = 0;
    let notFoundCount = 0;

    for (const profile of profiles) {
        // Find matching business_staff by email
        // And update user_id
        const { data: staff, error: findError } = await supabase
            .from('business_staff')
            .update({ user_id: profile.id }) // LINKING HERE
            .eq('email', profile.email)
            .select()
            .maybeSingle();

        if (findError) {
            console.error(`   ❌ Update Error (${profile.email}):`, findError.message);
        } else if (staff) {
            // console.log(`   ✅ Linked: ${profile.email}`);
            linkedCount++;
        } else {
            console.log(`   ⚠️  No Business Staff found for email: ${profile.email}`);
            notFoundCount++;
        }
    }

    console.log('\n✅ Process Complete.');
    console.log(`   Linked: ${linkedCount}`);
    console.log(`   Not Linked (Email mismatch?): ${notFoundCount}`);
}

linkStaffUsers();
