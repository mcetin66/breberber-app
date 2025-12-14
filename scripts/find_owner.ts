
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
const supabase = createClient(envConfig.EXPO_PUBLIC_SUPABASE_URL, envConfig.EXPO_PUBLIC_SUPABASE_ANON_KEY);

async function findOwner() {
    console.log('Searching for a valid owner ID...');
    const { data } = await supabase
        .from('businesses')
        .select('owner_id, name')
        .not('owner_id', 'is', null)
        .limit(1)
        .single();

    if (data) {
        console.log(`FOUND_OWNER_ID: ${data.owner_id}`);
        console.log(`(Borrowed from business: ${data.name})`);
    } else {
        console.log('NO_OWNER_FOUND');
    }
}
findOwner();
