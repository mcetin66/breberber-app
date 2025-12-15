
import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function relaxBookingsConstraints() {
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

        console.log('🛠️ Relaxing constraints for bookings table...');

        // Relax constraints to allow for 'blocked' entries (mola)
        // Nullable customer_id, service_id
        await client.query(`
            ALTER TABLE public.bookings 
            ALTER COLUMN customer_id DROP NOT NULL,
            ALTER COLUMN service_id DROP NOT NULL,
            ALTER COLUMN total_price DROP NOT NULL DEFAULT 0,
            ALTER COLUMN total_price SET DEFAULT 0;
        `);

        console.log('✅ Constraints relaxed successfully.');

    } catch (err: any) {
        console.error('❌ Failed:', err.message);
    } finally {
        await client.end();
    }
}

relaxBookingsConstraints();
