
import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function addLunchBreakColumns() {
    if (!process.env.DATABASE_URL) {
        console.error('❌ Error: DATABASE_URL is not defined in .env');
        process.exit(1);
    }

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('🔌 Connected to DB');

        console.log('🛠️ Adding lunch_start and lunch_end columns to staff_working_hours table...');

        await client.query(`
            ALTER TABLE public.staff_working_hours 
            ADD COLUMN IF NOT EXISTS lunch_start time,
            ADD COLUMN IF NOT EXISTS lunch_end time;
        `);

        console.log('✅ Columns added successfully.');

    } catch (err: any) {
        console.error('❌ Failed:', err.message);
    } finally {
        await client.end();
    }
}

addLunchBreakColumns();
