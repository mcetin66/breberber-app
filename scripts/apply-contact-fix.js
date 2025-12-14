const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
    host: 'aws-1-ap-southeast-2.pooler.supabase.com',
    port: 6543,
    user: 'postgres.lgalixbqtzcxnloibsuu',
    password: 'zohuvC/~RjL7!$_1',
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
});

async function runFix() {
    try {
        console.log('Connecting to database...');
        await client.connect();

        // Use the absolute path to the artifact file we just created
        const sqlPath = String.raw`C:\Users\Mustafa\.gemini\antigravity\brain\f88a36ac-ab12-4100-a521-f7e23a2e59aa\add_contact_name.sql`;

        console.log('Reading migration file:', sqlPath);
        if (!fs.existsSync(sqlPath)) {
            throw new Error('Migration file not found at ' + sqlPath);
        }

        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Executing migration...');
        await client.query(sql);
        console.log('Success! contact_name column added.');

    } catch (err) {
        console.error('Migration Error:', err);
    } finally {
        await client.end();
    }
}

runFix();
