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

        console.log('🛠️ Adding gender column...');
        await client.query(`
            ALTER TABLE profiles 
            ADD COLUMN IF NOT EXISTS gender text;
        `);

        console.log('🔒 Adding check constraint...');
        await client.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_gender_check') THEN
                    ALTER TABLE profiles 
                    ADD CONSTRAINT profiles_gender_check 
                    CHECK (gender IN ('male', 'female', 'unisex'));
                END IF;
            END $$;
        `);

        console.log('✅ Migration successful: gender column added to profiles table.');
    } catch (err: any) {
        console.error('❌ Migration failed:', err.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

migrate();
