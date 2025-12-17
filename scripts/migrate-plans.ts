// Script to update 'basic' plans to 'silver'
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function migratePlans() {
    console.log('🔄 Migrating basic plans to silver...');

    const { data, error } = await supabase
        .from('businesses')
        .update({ subscription_tier: 'silver' })
        .eq('subscription_tier', 'basic');

    if (error) {
        console.error('❌ Error migrating plans:', error);
    } else {
        console.log('✅ Migration complete. Updated records functionality depends on return value config, but command sent.');
    }
}

migratePlans();
