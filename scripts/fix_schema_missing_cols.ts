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

        // Fix Services Table
        console.log('🛠️ Adding duration column to services...');
        await client.query(`
            ALTER TABLE services 
            ADD COLUMN IF NOT EXISTS duration integer DEFAULT 30;
        `);

        // Fix Staff Table
        console.log('🛠️ Adding email column to business_staff...');
        await client.query(`
            ALTER TABLE business_staff 
            ADD COLUMN IF NOT EXISTS email text;
        `);

        console.log('🛠️ Adding photo_url column to business_staff if missing...');
        await client.query(`
            ALTER TABLE business_staff 
            ADD COLUMN IF NOT EXISTS photo_url text;
        `);

        console.log('✅ Migration successful: Columns added.');
    } catch (err: any) {
        console.error('❌ Migration failed:', err.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

migrate();
