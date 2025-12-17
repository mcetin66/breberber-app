// Script to update database constraints and admin role via direct Postgres connection
import 'dotenv/config';
import pg from 'pg';

const { Client } = pg;

// Use the provided DATABASE_URL
// Note: We need to properly decode the URL provided by the user
const connectionString = 'postgresql://postgres.lgalixbqtzcxnloibsuu:zohuvC%2F~RjL7!%24_1@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres';

async function runMigration() {
    console.log('🔄 Connecting to database...');

    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false } // Required for Supabase connection
    });

    try {
        await client.connect();
        console.log('✅ Connected successfully.');

        console.log('🔧 Step 1: Dropping old constraint...');
        // Drop the old constraint
        await client.query('ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;');
        console.log('✅ Constraint dropped.');

        console.log('🔧 Step 2: Updating admin roles to platform_admin...');
        // Update ALL users with role 'admin' to 'platform_admin' BEFORE adding the new constraint
        const updateResult = await client.query(`
      UPDATE profiles 
      SET role = 'platform_admin' 
      WHERE role = 'admin' OR email = 'admin@gmail.com'
      RETURNING *;
    `);
        console.log(`✅ Updated ${updateResult.rowCount} users to platform_admin.`);
        if (updateResult.rowCount && updateResult.rowCount > 0) console.log('Updated users:', updateResult.rows.map(r => r.email));

        console.log('🔧 Step 3: Adding new constraint...');
        // Add the new constraint NOW that data is compliant
        await client.query(`
      ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
      CHECK (role IN ('customer', 'business_owner', 'staff', 'platform_admin'));
    `);
        console.log('✅ New constraint added successfully.');

    } catch (err) {
        console.error('❌ Error executing migration:', err);
    } finally {
        await client.end();
        console.log('🔌 Connection closed.');
    }
}

runMigration();
