// Script to check business data
import 'dotenv/config';
import pg from 'pg';

const { Client } = pg;
const connectionString = 'postgresql://postgres.lgalixbqtzcxnloibsuu:zohuvC%2F~RjL7!%24_1@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres';

async function checkData() {
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    await client.connect();

    const res = await client.query('SELECT id, name, subscription_tier, subscription_end_date FROM businesses LIMIT 5');
    console.log('Business Data:', res.rows);

    await client.end();
}

checkData();
