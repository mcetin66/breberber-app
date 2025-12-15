
import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function inspectPolicies() {
    if (!process.env.DATABASE_URL) {
        console.error('❌ Error: DATABASE_URL is not defined');
        process.exit(1);
    }

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();

        const res = await client.query(`
            SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
            FROM pg_policies 
            WHERE tablename = 'bookings';
        `);

        console.log('--- RLS Policies for Bookings ---');
        console.table(res.rows.map(r => ({
            name: r.policyname,
            cmd: r.cmd,
            roles: r.roles,
            using: r.qual,
            with_check: r.with_check
        })));

    } catch (err: any) {
        console.error('❌ Failed:', err.message);
    } finally {
        await client.end();
    }
}

inspectPolicies();
