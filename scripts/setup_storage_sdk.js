require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function setupStorage() {
    console.log('🚀 Setting up Supabase Storage via SDK...\n');

    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Missing Supabase credentials in .env');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // 1. Bucket oluştur
        console.log('📦 Creating bucket: app-media');
        const { data: bucket, error: bucketError } = await supabase.storage.createBucket('app-media', {
            public: true,
            fileSizeLimit: 10485760, // 10MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
        });

        if (bucketError) {
            if (bucketError.message.includes('already exists')) {
                console.log('✅ Bucket already exists!');
            } else {
                throw bucketError;
            }
        } else {
            console.log('✅ Bucket created successfully!');
        }

        console.log('\n🎉 Storage setup complete!');
        console.log('\n📋 Bucket Details:');
        console.log('   Name: app-media');
        console.log('   Public: Yes');
        console.log('   Max File Size: 10MB');
        console.log('   Allowed Types: PNG, JPEG, JPG, WebP');
        console.log('\n📁 Folder Structure (will be created on first upload):');
        console.log('   app-media/');
        console.log('   ├── businesses/');
        console.log('   │   └── {business_id}/');
        console.log('   │       ├── profile/ (logo.jpg, cover.jpg)');
        console.log('   │       ├── gallery/');
        console.log('   │       ├── services/{service_id}/');
        console.log('   │       ├── staff/');
        console.log('   │       └── showcase/');
        console.log('   └── users/');
        console.log('       └── avatars/{user_id}.jpg');
        console.log('\n💡 Next: Add Logo/Cover URL inputs to Edit Business modal');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

setupStorage();
