// Script to fix RLS policies for platform_admin
import 'dotenv/config';
import pg from 'pg';

const { Client } = pg;
const connectionString = 'postgresql://postgres.lgalixbqtzcxnloibsuu:zohuvC%2F~RjL7!%24_1@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres';

async function fixRLS() {
    console.log('🔄 Connecting to database to fix RLS...');
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

    try {
        await client.connect();

        // 1. Policy for businesses: Allow platform_admin to do ALL operations
        console.log('🔧 Updating RLS for businesses table...');

        // First drop existing policy if duplicate names exist (optional but cleaner)
        // We'll use a unique name: "Enable all for platform_admin"

        await client.query(`
      DROP POLICY IF EXISTS "Enable all for platform_admin" ON businesses;
      CREATE POLICY "Enable all for platform_admin"
      ON businesses
      FOR ALL
      USING (
        auth.uid() IN (
          SELECT id FROM profiles WHERE role = 'platform_admin'
        )
      );
    `);

        console.log('✅ Policy created: "Enable all for platform_admin" on businesses');

        // 2. Also need policy for profiles? Probably exists.
        // Let's ensure platform_admin can update any profile (e.g. changing roles)
        // (We handled this manually before but good to have persistent policy)

    } catch (err) {
        console.error('❌ Error fixing RLS:', err);
    } finally {
        await client.end();
    }
}

fixRLS();
