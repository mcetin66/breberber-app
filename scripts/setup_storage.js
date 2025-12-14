require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function setupStorage() {
    console.log('🚀 Setting up Supabase Storage...\n');

    // Debug: DATABASE_URL'i kontrol et
    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL not found in .env file!');
        console.log('\n💡 Make sure you have this in your .env file:');
        console.log('DATABASE_URL=postgresql://postgres.lgalixbqtzcxnloibsuu:PASSWORD@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres');
        process.exit(1);
    }

    console.log('🔍 DATABASE_URL:', process.env.DATABASE_URL);
    console.log('🔍 Length:', process.env.DATABASE_URL.length);
    console.log('🔍 First 50 chars:', process.env.DATABASE_URL.substring(0, 50));

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();
        console.log('✅ Connected to database\n');

        // SQL dosyasını oku
        const sqlPath = path.join(__dirname, 'setup_storage.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // SQL'i çalıştır
        console.log('📦 Creating bucket and policies...');
        await client.query(sql);

        console.log('✅ Storage setup complete!\n');
        console.log('📋 Created:');
        console.log('   • Bucket: app-media (Public)');
        console.log('   • Policy: Public Access (SELECT)');
        console.log('   • Policy: Authenticated Upload (INSERT)');
        console.log('   • Policy: Authenticated Update (UPDATE)');
        console.log('   • Policy: Authenticated Delete (DELETE)');
        console.log('\n📁 Folder Structure:');
        console.log('   app-media/');
        console.log('   ├── businesses/{business_id}/');
        console.log('   │   ├── profile/ (logo.jpg, cover.jpg)');
        console.log('   │   ├── gallery/');
        console.log('   │   ├── services/{service_id}/');
        console.log('   │   ├── staff/');
        console.log('   │   └── showcase/');
        console.log('   └── users/avatars/{user_id}.jpg');

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.message.includes('already exists')) {
            console.log('\n💡 Bucket already exists! You can continue.');
        } else {
            process.exit(1);
        }
    } finally {
        await client.end();
    }
}

setupStorage();
