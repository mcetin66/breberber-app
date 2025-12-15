
import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const dbUrl = process.env.DATABASE_URL;

async function fixPolicies() {
    const client = new Client({
        connectionString: dbUrl,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected');

        // Remove existing policies that might be too restrictive
        await client.query(`
      DROP POLICY IF EXISTS "Public read access" ON business_staff;
      DROP POLICY IF EXISTS "Authenticated insert" ON business_staff;
      DROP POLICY IF EXISTS "Authenticated update" ON business_staff;
      DROP POLICY IF EXISTS "Authenticated delete" ON business_staff;
    `);

        // Add PERMISSIVE policies for debugging (allows authenticated users to do anything)
        // Warning: insecure for production, but necessary to unblock development now.
        await client.query(`
      CREATE POLICY "Allow All Authenticated" ON business_staff
        FOR ALL
        USING (auth.role() = 'authenticated')
        WITH CHECK (auth.role() = 'authenticated');
        
      CREATE POLICY "Allow Public Read" ON business_staff
        FOR SELECT
        USING (true);
    `);

        console.log('Policies updated to be permissive for business_staff');

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

fixPolicies();
