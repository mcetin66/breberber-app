
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Fix for ESM/CJS path issue
const envPath = path.resolve(process.cwd(), '.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabase = createClient(envConfig.EXPO_PUBLIC_SUPABASE_URL, envConfig.EXPO_PUBLIC_SUPABASE_ANON_KEY);

async function count() {
    // Select count only
    const { count, error } = await supabase
        .from('businesses')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('Count Error:', error);
    } else {
        console.log('--- RESULT ---');
        console.log(`Total Businesses in DB: ${count}`);
        console.log('--------------');
    }
}

count();
