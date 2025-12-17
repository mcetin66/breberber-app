// Script to add missing subscription columns to businesses table
import 'dotenv/config';
import pg from 'pg';

const { Client } = pg;

// Use the provided DATABASE_URL
const connectionString = 'postgresql://postgres.lgalixbqtzcxnloibsuu:zohuvC%2F~RjL7!%24_1@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres';

async function runMigration() {
    console.log('🔄 Connecting to database...');

    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('✅ Connected successfully.');

        console.log('🔧 Checking if columns exist...');

        // Check if subscription_tier exists
        const resTier = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='businesses' AND column_name='subscription_tier';
    `);

        if (resTier.rowCount === 0) {
            console.log('➕ Adding subscription_tier column...');
            await client.query(`
        ALTER TABLE businesses 
        ADD COLUMN subscription_tier text DEFAULT 'basic';
      `);
            console.log('✅ subscription_tier added.');
        } else {
            console.log('ℹ️ subscription_tier already exists.');
        }

        // Check if subscription_end_date exists
        const resEndDate = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='businesses' AND column_name='subscription_end_date';
    `);

        if (resEndDate.rowCount === 0) {
            console.log('➕ Adding subscription_end_date column...');
            await client.query(`
        ALTER TABLE businesses 
        ADD COLUMN subscription_end_date timestamp with time zone;
      `);
            console.log('✅ subscription_end_date added.');
        } else {
            console.log('ℹ️ subscription_end_date already exists.');
        }

        // Also update types/database.ts manually if needed, but for now let's fix the DB first.

    } catch (err) {
        console.error('❌ Error executing migration:', err);
    } finally {
        await client.end();
        console.log('🔌 Connection closed.');
    }
}

runMigration();
