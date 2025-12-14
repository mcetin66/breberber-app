require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function deploy() {
    try {
        await client.connect();
        console.log('Connected to database');

        const sqlPath = path.join(__dirname, '../supabase/migrations/20251214_audit_logs.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Running migration...');
        await client.query(sql);

        console.log('Migration successfully executed!');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

deploy();
