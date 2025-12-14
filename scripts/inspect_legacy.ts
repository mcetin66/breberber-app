
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
const supabase = createClient(envConfig.EXPO_PUBLIC_SUPABASE_URL, envConfig.EXPO_PUBLIC_SUPABASE_ANON_KEY);

async function inspectBusinesses() {
    console.log('--- INSPECTING STARTUP BUSINESSES ---');
    const { data: businesses } = await supabase
        .from('businesses')
        .select('*')
        .or('name.ilike.%modern%,name.ilike.%klasik%');

    if (!businesses || businesses.length === 0) {
        console.log('No businesses found matching "Modern" or "Klasik".');
        return;
    }

    businesses.forEach(b => {
        console.log(`\nName: ${b.name}`);
        console.log(`ID: ${b.id}`);
        console.log(`Owner ID: ${b.owner_id}`);
        console.log(`Created At: ${b.created_at}`);
        console.log(`Plan: ${b.subscription_tier}`);
    });

    // Also check the current user to see if it matches (simulated check)
    // In a real scenario, we'd check the session, but here we just show the owner_id consistency.
}

inspectBusinesses();
