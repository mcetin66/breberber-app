const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Manually Load .env
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
}

// 2. Init Supabase
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
// Check if there is a service role key for admin tasks
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

console.log('--- Storage Check ---');
console.log('URL:', supabaseUrl ? 'Found' : 'Missing');
console.log('Anon Key:', supabaseKey ? 'Found' : 'Missing');
console.log('Service Role Key:', serviceRoleKey ? 'Found (Will attempt creation)' : 'Missing (Read-only check)');

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing credentials.');
    process.exit(1);
}

// Use Service Role if available for creation, otherwise Anon
const client = createClient(supabaseUrl, serviceRoleKey || supabaseKey);

async function checkBuckets() {
    const bucketsToCheck = ['images', 'avatars'];

    try {
        const { data: buckets, error } = await client.storage.listBuckets();
        if (error) {
            console.error('Error listing buckets:', error.message);
            return;
        }

        const existingNames = buckets.map(b => b.name);
        console.log('Current Buckets:', existingNames);

        for (const name of bucketsToCheck) {
            if (!existingNames.includes(name)) {
                console.log(`Bucket '${name}' missing. Attempting creation...`);
                const { data, error: createError } = await client.storage.createBucket(name, {
                    public: true,
                    fileSizeLimit: 10485760, // 10MB
                });

                if (createError) {
                    console.error(`Failed to create '${name}':`, createError.message);
                } else {
                    console.log(`Successfully created bucket '${name}'`);
                }
            } else {
                console.log(`Bucket '${name}' exists.`);
            }
        }

    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

checkBuckets();
