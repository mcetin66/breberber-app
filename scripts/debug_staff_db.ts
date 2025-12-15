
import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const dbUrl = process.env.DATABASE_URL;

async function debugStaff() {
    if (!dbUrl) {
        console.error('DATABASE_URL is missing');
        return;
    }

    const client = new Client({
        connectionString: dbUrl,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to DB');

        // 1. Get the last 5 added staff members
        console.log('--- Latest 5 Staff Members ---');
        const res = await client.query(`
        SELECT id, name, business_id, is_active, created_at 
        FROM business_staff 
        ORDER BY created_at DESC 
        LIMIT 5
    `);
        console.table(res.rows);

        // 2. Check if there are any staff members with is_active = NULL or FALSE
        console.log('--- Inactive Staff Members ---');
        const inactiveRes = await client.query(`
        SELECT id, name, business_id, is_active 
        FROM business_staff 
        WHERE is_active IS NOT TRUE
        LIMIT 5
    `);
        console.table(inactiveRes.rows);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

debugStaff();
