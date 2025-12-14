import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Service role key gerekli

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorage() {
    console.log('🚀 Setting up Supabase Storage...\n');

    try {
        // 1. Bucket oluştur
        console.log('📦 Creating bucket: app-media');
        const { data: bucket, error: bucketError } = await supabase.storage.createBucket('app-media', {
            public: true,
            fileSizeLimit: 5242880, // 5MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
        });

        if (bucketError) {
            if (bucketError.message.includes('already exists')) {
                console.log('✅ Bucket already exists');
            } else {
                throw bucketError;
            }
        } else {
            console.log('✅ Bucket created successfully');
        }

        // 2. Test klasör yapısı oluştur (opsiyonel)
        console.log('\n📁 Creating folder structure...');

        // Dummy dosya ile klasör oluştur
        const dummyFile = new Blob([''], { type: 'text/plain' });

        await supabase.storage.from('app-media').upload('businesses/.keep', dummyFile);
        await supabase.storage.from('app-media').upload('users/avatars/.keep', dummyFile);

        console.log('✅ Folder structure created');

        console.log('\n🎉 Storage setup complete!');
        console.log('\n📋 Bucket Details:');
        console.log('   Name: app-media');
        console.log('   Public: Yes');
        console.log('   Max File Size: 5MB');
        console.log('   Allowed Types: PNG, JPEG, JPG, WebP');
        console.log('\n📁 Folder Structure:');
        console.log('   ├── businesses/');
        console.log('   │   └── {business_id}/');
        console.log('   │       ├── profile/');
        console.log('   │       ├── gallery/');
        console.log('   │       ├── services/');
        console.log('   │       ├── staff/');
        console.log('   │       └── showcase/');
        console.log('   └── users/');
        console.log('       └── avatars/');

    } catch (error: any) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

setupStorage();
