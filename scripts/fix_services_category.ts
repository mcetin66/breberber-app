
import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function addCategoryColumn() {
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

        console.log('🛠️ Adding category column to services table...');
        await client.query(`
            ALTER TABLE public.services 
            ADD COLUMN IF NOT EXISTS category text;
        `);

        console.log('✅ Column added successfully.');

    } catch (err: any) {
        console.error('❌ Failed:', err.message);
    } finally {
        await client.end();
    }
}

addCategoryColumn();
