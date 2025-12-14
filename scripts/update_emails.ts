
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load env
const envPath = path.resolve(process.cwd(), '.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabaseUrl = envConfig.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = envConfig.EXPO_PUBLIC_SUPABASE_ANON_KEY;
// Using Service Role Key if available would be better for updates, but Anon key with RLS policy allowing update (if logged in user is admin) or if policies are open during dev.
// Assuming Anon key works for now as the user likely set RLS to allow public/anon for dev or we are reusing the same key from previous context.
// Actually, for a script, we might need SERVICE_ROLE if RLS blocks updates. 
// BUT, let's try with the KEY we have. If it fails, I'll ask for SERVICE_ROLE or check if RLS is off.
// Re-reading previous logs: 'EXPO_PUBLIC_SUPABASE_ANON_KEY' was used.

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
        .replace(/[^a-z0-9]/g, '');
}

async function main() {
    console.log('Fetching businesses...');
    const { data: businesses, error } = await supabase
        .from('businesses')
        .select('id, name, email');

    if (error) {
        console.error('Error fetching businesses:', error);
        return;
    }

    console.log(`Found ${businesses.length} businesses.`);
    let updatedCount = 0;

    for (const b of businesses) {
        // Skip valid emails
        if (b.email && b.email.includes('@')) {
            console.log(`Skipping ${b.name} (Already has email: ${b.email})`);
            continue;
        }

        // Generate ID
        const firstName = b.name.split(' ')[0];
        const slug = slugify(firstName);
        const newEmail = `${slug}@gmail.com`;

        console.log(`Updating ${b.name} -> ${newEmail}...`);

        const { error: updateError } = await supabase
            .from('businesses')
            .update({ email: newEmail })
            .eq('id', b.id);

        if (updateError) {
            console.error(`FAILED to update ${b.name}:`, updateError.message);
        } else {
            console.log(`SUCCESS: ${b.name}`);
            updatedCount++;
        }
    }

    console.log('--- DONE ---');
    console.log(`Updated ${updatedCount} businesses.`);
}

main();
