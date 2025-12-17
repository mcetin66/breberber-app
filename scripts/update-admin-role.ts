// Script to update admin@gmail.com role to platform_admin
// First updates the constraint, then updates the role
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Use service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateAdminRole() {
    console.log('🔧 Step 1: Updating profiles_role_check constraint...');

    // First, drop the old constraint and add new one with platform_admin
    const { error: constraintError } = await supabase.rpc('exec_sql', {
        sql: `
      ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
      ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
        CHECK (role IN ('customer', 'business_owner', 'staff', 'platform_admin', 'admin'));
    `
    });

    if (constraintError) {
        console.log('⚠️ RPC not available, trying direct update...');

        // Try direct SQL via REST API
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': supabaseServiceKey,
                'Authorization': `Bearer ${supabaseServiceKey}`,
            },
            body: JSON.stringify({
                sql: `
          ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
          ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
            CHECK (role IN ('customer', 'business_owner', 'staff', 'platform_admin'));
        `
            }),
        });

        if (!response.ok) {
            console.log('⚠️ Cannot update constraint via API. Please run the following SQL in Supabase Dashboard:');
            console.log('');
            console.log('--- COPY THIS SQL TO SUPABASE SQL EDITOR ---');
            console.log(`
-- Step 1: Drop old constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Step 2: Add new constraint with platform_admin
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('customer', 'business_owner', 'staff', 'platform_admin'));

-- Step 3: Update admin user role
UPDATE profiles 
SET role = 'platform_admin' 
WHERE email = 'admin@gmail.com';
      `);
            console.log('--- END OF SQL ---');
            return;
        }
    }

    console.log('🔧 Step 2: Updating admin@gmail.com role to platform_admin...');

    // Update the role
    const { data, error } = await supabase
        .from('profiles')
        .update({ role: 'platform_admin' })
        .eq('email', 'admin@gmail.com')
        .select();

    if (error) {
        console.error('❌ Error updating role:', error.message);
        return;
    }

    console.log('✅ Role updated successfully:', data);
}

updateAdminRole();
