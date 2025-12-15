
import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function addBusinessHoursColumn() {
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
        console.log('🔌 Connected to DB');

        console.log('🛠️ Adding working_hours column to businesses table...');

        await client.query(`
            ALTER TABLE public.businesses 
            ADD COLUMN IF NOT EXISTS working_hours JSONB DEFAULT '{}'::jsonb;
        `);

        console.log('✅ Column working_hours added successfully.');

    } catch (err: any) {
        console.error('❌ Failed:', err.message);
    } finally {
        await client.end();
    }
}

addBusinessHoursColumn();
