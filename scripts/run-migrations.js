const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
    host: 'aws-1-ap-southeast-2.pooler.supabase.com',
    port: 6543,
    user: 'postgres.lgalixbqtzcxnloibsuu',
    password: 'zohuvC/~RjL7!$_1',
    database: 'postgres',
    ssl: { rejectUnauthorized: false } // Required for Supabase connection
});

async function runMigrations() {
    try {
        console.log('Connecting to database...');
        await client.connect();
        console.log('Connected.');

        const schemaPath = path.join(__dirname, '..', 'supabase', 'migrations', '20251212103951_create_initial_schema.sql');
        const dataPath = path.join(__dirname, '..', 'supabase', 'migrations', '20251212104605_add_sample_data_fixed.sql');

        // Note: Use '..' because script is in 'scripts/' folder, but supabase is in root.
        // Wait, __dirname is c:\Users\Mustafa\source\repos\breberber-app\scripts
        // So '..' takes us to root.

        // Let's verify paths existence just in case
        if (!fs.existsSync(schemaPath)) {
            throw new Error(`Schema file not found at ${schemaPath}`);
        }

        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        const dataSql = fs.readFileSync(dataPath, 'utf8');

        console.log('Running schema migration...');
        await client.query(schemaSql);
        console.log('Schema migration completed.');

        console.log('Running sample data migration...');
        // The sample data script might contain multiple statements.
        // pg client.query might execute multiple statements if they are in one string, depending on config?
        // Actually, pg allows multiple statements in one query string by default.
        await client.query(dataSql);
        console.log('Sample data migration completed.');

    } catch (err) {
        console.error('Migration failed:', err);
        // Print more details if available
        if (err.position) console.error('Position:', err.position);
        if (err.code) console.error('Code:', err.code);
    } finally {
        await client.end();
        console.log('Disconnected.');
    }
}

runMigrations();
