
import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Load env from root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function migrate() {
    try {
        console.log("Connecting to database...");
        await client.connect();

        console.log("Enabling RLS on audit_logs...");
        await client.query(`ALTER TABLE IF EXISTS audit_logs ENABLE ROW LEVEL SECURITY;`);

        console.log("Creating insert policy...");
        // Drop if exists to ensure clean state or use IO block
        await client.query(`
            DO $$ 
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM pg_policies 
                    WHERE tablename = 'audit_logs' 
                    AND policyname = 'Enable insert for authenticated users'
                ) THEN
                    DROP POLICY "Enable insert for authenticated users" ON audit_logs;
                END IF;

                CREATE POLICY "Enable insert for authenticated users" 
                ON audit_logs 
                FOR INSERT 
                TO authenticated 
                WITH CHECK (auth.uid() = user_id);
            END $$;
        `);

        console.log("✅ Audit logs RLS policy applied successfully.");
    } catch (err) {
        console.error("❌ Migration failed:", err);
    } finally {
        await client.end();
    }
}

migrate();
