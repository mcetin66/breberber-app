import { Client } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

async function fixAuditLogs() {
    if (!process.env.DATABASE_URL) {
        console.error('❌ Error: DATABASE_URL is not defined in .env');
        process.exit(1);
    }

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('🔌 Connecting to database...');
        await client.connect();

        console.log('🛠️ Applying Audit Logs Fix (Columns & RLS)...');

        // We can run the commands sequentially or in a single block.
        // running in single block for atomicity.
        await client.query(`
            -- Add user_id if missing
            alter table public.audit_logs add column if not exists user_id uuid references auth.users(id) on delete set null;

            -- Enable RLS just in case
            alter table public.audit_logs enable row level security;

            -- Drop old restrict policies
            drop policy if exists "Enable insert for authenticated users on audit_logs" on public.audit_logs;
            drop policy if exists "Admins can insert audit logs" on public.audit_logs;
            drop policy if exists "Allow authenticated insert on audit_logs" on public.audit_logs;
            drop policy if exists "Allow authenticated select on audit_logs" on public.audit_logs;

            -- Create new permissive policies
            create policy "Allow authenticated insert on audit_logs"
              on public.audit_logs
              for insert
              with check (auth.role() = 'authenticated');

            create policy "Allow authenticated select on audit_logs"
              on public.audit_logs
              for select
              using (auth.role() = 'authenticated');
              
            -- Also allow update for admins just in case? No, logs are immutable usually.
            
            -- Grant access to authenticated role just to be sure (usually implied by public but RLS filters it)
            grant all on public.audit_logs to authenticated;
            grant all on public.audit_logs to service_role;
        `);

        console.log('✅ Audit Logs fix applied successfully.');
    } catch (err: any) {
        console.error('❌ Fix failed:', err.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

fixAuditLogs();
