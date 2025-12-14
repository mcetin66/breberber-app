
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Manual env loading since we are running via ts-node in scripts/
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listUsers() {
    console.log('Fetching users from "profiles" table...');
    const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role, phone, created_at');

    if (error) {
        console.error('Error fetching users:', error);
        return;
    }

    console.log('\n--- 👥 Veritabanındaki Kullanıcılar ---');
    if (!data || data.length === 0) {
        console.log('Hiç kullanıcı bulunamadı.');
    } else {
        data.forEach((user, index) => {
            console.log(`${index + 1}. [${user.role?.toUpperCase() || 'USER'}] ${user.full_name || 'İsimsiz'} (${user.phone})`);
            console.log(`   ID: ${user.id}`);
            console.log(`   Kayıt: ${new Date(user.created_at).toLocaleString('tr-TR')}`);
            console.log('-----------------------------------');
        });
    }
}

listUsers();
