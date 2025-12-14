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

        // 1. Profiles: Gender
        console.log('🛠️ Checking profiles table...');
        await client.query(`
            ALTER TABLE profiles 
            ADD COLUMN IF NOT EXISTS gender text;
        `);
        // Check constraint check
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

        // 2. Businesses: Business Type
        console.log('🛠️ Checking businesses table...');
        await client.query(`
            ALTER TABLE businesses 
            ADD COLUMN IF NOT EXISTS business_type text DEFAULT 'berber';
        `);

        // 3. Business Staff: Email, Phone
        console.log('🛠️ Checking business_staff table...');
        await client.query(`
            ALTER TABLE business_staff 
            ADD COLUMN IF NOT EXISTS email text,
            ADD COLUMN IF NOT EXISTS phone text;
        `);

        // 4. Services: Duration (Ensure consistency if needed, but schema says duration_minutes)
        // We will adapt the script to duration_minutes, but let's just ensure no 'duration' col exists to avoid confusion
        // or add it as alias if we really wanted to (nah, stick to schema)

        console.log('✅ Comprehensive Schema Migration successful.');
    } catch (err: any) {
        console.error('❌ Migration failed:', err.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

migrate();
