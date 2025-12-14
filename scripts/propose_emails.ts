
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load env
const envPath = path.resolve(process.cwd(), '.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabaseUrl = envConfig.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = envConfig.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Turkish character mapping
const trMap: { [key: string]: string } = {
    'ç': 'c', 'Ç': 'c',
    'ğ': 'g', 'Ğ': 'g',
    'ı': 'i', 'I': 'i', 'İ': 'i',
    'ö': 'o', 'Ö': 'o',
    'ş': 's', 'Ş': 's',
    'ü': 'u', 'Ü': 'u',
    ' ': '' // Remove spaces
};

function slugify(text: string) {
    return text
        .split('')
        .map(char => trMap[char] || char)
        .join('')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, ''); // Keep only alphanumeric
}

async function main() {
    const { data: businesses, error } = await supabase
        .from('businesses')
        .select('id, name, email');

    if (error) {
        console.error('Error fetching businesses:', error);
        return;
    }

    console.log(`Debug: Fetched ${businesses.length} rows.`); // Debug fetch count

    console.log('| ID | İşletme Adı | Mevcut Email | Önerilen Email |');
    console.log('|---|---|---|---|');

    businesses.forEach(b => {
        // Generate email only if missing or requested (user said "her bir işletmeye", implying all)
        // But let's check if it exists to avoid overwriting valid ones unless told.
        // User instruction: "her bir işletmeye ismiyle alakalı demo bir mail adresi gir"
        // I will propose for ALL, marking existing ones as [KEEP] or [UPDATE] if they look like demos.

        let proposed = '';
        if (b.email && b.email.includes('@')) {
            proposed = b.email + ' (Mevcut)';
        } else {
            // Use only the first word as requested
            const firstName = b.name.split(' ')[0];
            const slug = slugify(firstName);
            proposed = `${slug}@gmail.com`;
        }

        console.log(`| ${b.id.substring(0, 8)}... | ${b.name} | ${b.email || 'YOK'} | **${proposed}** |`);
    });
}

main();
