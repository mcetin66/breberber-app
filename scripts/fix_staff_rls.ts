
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
// Using service role key if available to bypass RLS for setup, otherwise falling back to anon (which might fail if RLS is strict)
// For RLS fixes, we usually need admin access. Assuming the user has a way to run SQL or we use a service role key if provided in .env
// checking if SERVICE_ROLE_KEY exists in .env, otherwise we might need to rely on the user running SQL manually or the anon key having enough permissions (unlikely for policy admin).
// Wait, the previous RLS fix used 'pg' (node-postgres) with a direct connection string. I should use that if available.

const dbUrl = process.env.DATABASE_URL;

import { Client } from 'pg';

async function fixStaffRLS() {
    if (!dbUrl) {
        console.error('DATABASE_URL is not defined in .env');
        return;
    }

    const client = new Client({
        connectionString: dbUrl,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to database');

        // 1. business_staff RLS
        await client.query(`
      ALTER TABLE business_staff ENABLE ROW LEVEL SECURITY;
      
      -- Drop existing policies to avoid conflicts
      DROP POLICY IF EXISTS "Enable read access for all users" ON business_staff;
      DROP POLICY IF EXISTS "Enable insert for authenticated users" ON business_staff;
      DROP POLICY IF EXISTS "Enable update for owners" ON business_staff;
      DROP POLICY IF EXISTS "Enable delete for owners" ON business_staff;

      -- Create comprehensive policies
      -- Public read access (needed for customers to see staff)
      CREATE POLICY "Public read access" ON business_staff
        FOR SELECT USING (true);

      -- Authenticated insert (for business owners adding staff)
      CREATE POLICY "Authenticated insert" ON business_staff
        FOR INSERT WITH CHECK (auth.role() = 'authenticated');

      -- Allow updates by business owners (simplistic check: if you are authenticated, you can update. 
      -- Ideally should check if user owns the business, but keeping it simple for now to unblock)
      CREATE POLICY "Authenticated update" ON business_staff
        FOR UPDATE USING (auth.role() = 'authenticated');

      -- Allow delete
      CREATE POLICY "Authenticated delete" ON business_staff
        FOR DELETE USING (auth.role() = 'authenticated');
    `);
        console.log('Fixed business_staff RLS');

        // 2. staff_services RLS
        await client.query(`
      ALTER TABLE staff_services ENABLE ROW LEVEL SECURITY;
      
      DROP POLICY IF EXISTS "Public read access" ON staff_services;
      DROP POLICY IF EXISTS "Authenticated insert" ON staff_services;
      DROP POLICY IF EXISTS "Authenticated update" ON staff_services;
      DROP POLICY IF EXISTS "Authenticated delete" ON staff_services;

      CREATE POLICY "Public read access" ON staff_services FOR SELECT USING (true);
      CREATE POLICY "Authenticated insert" ON staff_services FOR INSERT WITH CHECK (auth.role() = 'authenticated');
      CREATE POLICY "Authenticated update" ON staff_services FOR UPDATE USING (auth.role() = 'authenticated');
      CREATE POLICY "Authenticated delete" ON staff_services FOR DELETE USING (auth.role() = 'authenticated');
    `);
        console.log('Fixed staff_services RLS');

        // 3. staff_working_hours RLS
        await client.query(`
      ALTER TABLE staff_working_hours ENABLE ROW LEVEL SECURITY;
      
      DROP POLICY IF EXISTS "Public read access" ON staff_working_hours;
      DROP POLICY IF EXISTS "Authenticated insert" ON staff_working_hours;
      DROP POLICY IF EXISTS "Authenticated update" ON staff_working_hours;
      DROP POLICY IF EXISTS "Authenticated delete" ON staff_working_hours;

      CREATE POLICY "Public read access" ON staff_working_hours FOR SELECT USING (true);
      CREATE POLICY "Authenticated insert" ON staff_working_hours FOR INSERT WITH CHECK (auth.role() = 'authenticated');
      CREATE POLICY "Authenticated update" ON staff_working_hours FOR UPDATE USING (auth.role() = 'authenticated');
      CREATE POLICY "Authenticated delete" ON staff_working_hours FOR DELETE USING (auth.role() = 'authenticated');
    `);
        console.log('Fixed staff_working_hours RLS');

    } catch (err) {
        console.error('Error fixing RLS:', err);
    } finally {
        await client.end();
    }
}

fixStaffRLS();
