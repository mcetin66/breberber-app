
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function debugUser() {
    console.log('🔍 Checking user: berkaykuafr374@isletme.com');

    // 1. Get User ID from Auth
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) {
        console.error('Auth Error:', authError);
        return;
    }

    const user = users.find(u => u.email === 'berkaykuafr374@isletme.com');
    if (!user) {
        console.error('❌ User not found in Auth system!');
        return;
    }

    console.log('✅ Auth User Found:', {
        id: user.id,
        email: user.email,
        metadata: user.user_metadata
    });

    // 2. Check Profile
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (profileError) {
        console.error('❌ Profile Error:', profileError);
    } else {
        console.log('✅ Profile Data:', profile);
    }

    // 3. Check Business Ownership
    const { data: business, error: businessError } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .single();

    if (businessError) {
        console.log('ℹ️ No Business found for this user (or error):', businessError.message);
    } else {
        console.log('✅ Business Data:', {
            id: business.id,
            name: business.name,
            owner_id: business.owner_id
        });
    }
}

debugUser();
