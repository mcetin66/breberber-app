import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
);

// Safe, professional images for each business type
const SAFE_IMAGES = {
    berber: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&h=400&fit=crop',
    kuafor: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=400&fit=crop',
    guzellik_merkezi: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=400&fit=crop',
};

async function updateBusinessImages() {
    console.log('🖼️ Updating business cover images to safe URLs...');

    for (const [type, imageUrl] of Object.entries(SAFE_IMAGES)) {
        const { data, error } = await supabase
            .from('businesses')
            .update({ cover_url: imageUrl })
            .eq('business_type', type);

        if (error) {
            console.error(`❌ Error updating ${type}:`, error.message);
        } else {
            console.log(`✅ Updated ${type} businesses with safe image`);
        }
    }

    console.log('✅ Done! All business images updated.');
}

updateBusinessImages().catch(console.error);
