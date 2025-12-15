
import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function inspectColumns() {
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
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'business_staff';
        `);

        console.log('--- Columns for business_staff ---');
        console.table(res.rows);

    } catch (err: any) {
        console.error('❌ Failed:', err.message);
    } finally {
        await client.end();
    }
}

inspectColumns();
