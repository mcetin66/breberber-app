
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
const supabase = createClient(envConfig.EXPO_PUBLIC_SUPABASE_URL, envConfig.EXPO_PUBLIC_SUPABASE_ANON_KEY);

async function testPagination() {
    console.log('--- STARTING PAGINATION TEST ---');

    // Page 1
    const LIMIT = 10;
    const from1 = 0;
    const to1 = 9;
    console.log(`Fetching Page 1 (Range: ${from1}-${to1})...`);

    const page1 = await supabase
        .from('businesses')
        .select('name', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from1, to1);

    console.log(`Page 1 Items: ${page1.data?.length}`);
    console.log(`Total Count: ${page1.count}`);
    if (page1.data) {
        page1.data.forEach((b: any, i) => console.log(`  ${i + 1}. ${b.name}`));
    }

    // Page 2
    const from2 = 10;
    const to2 = 19;
    console.log(`\nFetching Page 2 (Range: ${from2}-${to2})...`);

    const page2 = await supabase
        .from('businesses')
        .select('name', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from2, to2);

    console.log(`Page 2 Items: ${page2.data?.length}`);
    if (page2.data && page2.data.length > 0) {
        page2.data.forEach((b: any, i) => console.log(`  ${i + 11}. ${b.name}`));
    } else {
        console.log('  [EMPTY - NO DATA RETURNED]');
    }

    const totalCount = page1.count || 0;
    if ((page2.data?.length || 0) === 0 && totalCount > 10) {
        console.error('ERROR: Count says there are more items, but Page 2 is empty!');
    } else {
        console.log('PAGINATION TEST PASSED (DB Layer)');
    }
}

testPagination();
