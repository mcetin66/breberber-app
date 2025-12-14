require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function migrate() {
    try {
        await client.connect();
        console.log('Connected to database');

        console.log('Renaming admin_id to user_id...');
        await client.query('ALTER TABLE audit_logs RENAME COLUMN admin_id TO user_id;');

        console.log('Migration successfully executed!');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

migrate();
