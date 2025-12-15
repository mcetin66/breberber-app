
import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function inspectBookingsTable() {
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

        const res = await client.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'bookings';
        `);

        console.log('Bookings Table Schema:');
        console.table(res.rows);

        // Check enum types for status if any
        // ...

    } catch (err: any) {
        console.error('❌ Failed:', err.message);
    } finally {
        await client.end();
    }
}

inspectBookingsTable();
