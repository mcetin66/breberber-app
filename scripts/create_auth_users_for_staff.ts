
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
});

// Helper delay to avoid rate limits
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function createAuthUsersForStaff() {
    console.log('🚀 Creating Auth Users for Staff...');

    // 1. Fetch all staff with emails
    const { data: staffList, error: staffError } = await supabase
        .from('business_staff')
        .select('*')
        .not('email', 'is', null);

    if (staffError) {
        console.error('❌ Failed to fetch staff:', staffError.message);
        return;
    }

    console.log(`📋 Found ${staffList.length} staff records with emails.`);

    let createdCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const staff of staffList) {
        const email = staff.email;
        if (!email) continue; // Should not happen due to query

        // 2. Check if user already exists
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
        // Note: listUsers is paginated, default 50. For 150 staff we should fetch all or use createUser error to detect conflict.
        // Actually, let's just try to Create. If fails with "User already registered", we assume they exist.
        // BUT listUsers might be slow.
        // Let's rely on createUser error.

        // 3. Create User
        // console.log(`   Processing: ${staff.name} (${email})...`);

        const { data: authUser, error: createError } = await supabase.auth.admin.createUser({
            email: email,
            password: 'password123',
            email_confirm: true,
            user_metadata: {
                full_name: staff.name,
                role: 'staff'
            }
        });

        let userId = authUser.user?.id;

        if (createError) {
            if (createError.message.includes('already registered')) {
                // User exists, find their ID to ensure profile exists
                skippedCount++;
                // We need the ID to upsert profile.
                // Fetch user by email
                // Note: There isn't a direct "getUserByEmail" in admin API easily without listing?
                // Actually `supabase.rpc` or just listUsers filters? No.
                // Let's try signIn? No.
                // We'll iterate listUsers if needed, or skip profile update if we assume existing users are fine?
                // Better safe: ensure profile is correct.

                // Let's do a quick list for this email? No API for that.
                // I will skip this step for existing users, assuming they are set up or were Owners.
                // If they were valid Staff created before, they are fine.
                // If they are orphaned (Auth exists but no profile?), that's a edge case.

                process.stdout.write(`   ⚠️  Exists: ${email}\r`);
                continue;
            } else {
                console.error(`   ❌ Auth Error (${email}):`, createError.message);
                errorCount++;
                continue;
            }
        }

        if (userId) {
            createdCount++;

            // 4. Create Profile
            const { error: profileError } = await supabase.from('profiles').upsert({
                id: userId,
                email: email,
                full_name: staff.name,
                role: 'staff',
                avatar_url: staff.avatar_url,
                phone: staff.phone,
                created_at: new Date().toISOString()
            });

            if (profileError) {
                console.error(`   ❌ Profile Error (${email}):`, profileError.message);
            } else {
                // process.stdout.write(`   ✅ Created: ${email}\r`);
            }
        }

        // Small delay to be kind to API
        if (createdCount % 10 === 0) await delay(100);
    }

    console.log('\n✅ Process Complete.');
    console.log(`   Created: ${createdCount}`);
    console.log(`   Skipped (Exists): ${skippedCount}`);
    console.log(`   Errors: ${errorCount}`);
}

createAuthUsersForStaff().catch(console.error);
