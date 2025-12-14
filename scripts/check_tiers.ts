
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
const supabase = createClient(envConfig.EXPO_PUBLIC_SUPABASE_URL, envConfig.EXPO_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
    const { data } = await supabase.from('businesses').select('name, subscription_tier');
    console.log('| İşletme Adı | Paket (Veritabanındaki) |');
    console.log('|---|---|');
    data?.forEach((b: any) => {
        console.log(`| ${b.name} | ${b.subscription_tier || 'YOK (NULL)'} |`);
    });
}
check();
