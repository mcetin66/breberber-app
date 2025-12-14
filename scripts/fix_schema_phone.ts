import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function migrate() {
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

        console.log('🛠️ Adding phone column to business_staff...');
        await client.query(`
            ALTER TABLE business_staff 
            ADD COLUMN IF NOT EXISTS phone text;
        `);

        console.log('✅ Migration successful: Phone column added.');
    } catch (err: any) {
        console.error('❌ Migration failed:', err.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

migrate();
