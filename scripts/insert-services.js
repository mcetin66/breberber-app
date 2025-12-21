const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const sb = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    console.log('Searching for user...');
    const { data: users, error } = await sb.from('profiles').select('*').eq('email', 'slagzellikmerkezi@isletme.com').single();

    if (error || !users) {
        console.log('User not found:', error);
        return;
    }

    console.log('User found:', users.id);

    const { data: business, error: bErr } = await sb.from('businesses').select('*').eq('owner_id', users.id).single();

    if (bErr || !business) {
        console.log('Business not found for user:', bErr);
        return;
    }

    console.log('Business Found:', business.id, business.name);

    const services = [
        { name: 'Saç Kesimi', duration_minutes: 30, price: 150, category: 'Saç' },
        { name: 'Sakal Tıraşı', duration_minutes: 15, price: 80, category: 'Sakal' },
        { name: 'Saç Yıkama', duration_minutes: 10, price: 50, category: 'Bakım' },
        { name: 'Fön Çekimi', duration_minutes: 20, price: 100, category: 'Saç' }
    ];

    const payload = services.map(s => ({ ...s, business_id: business.id }));

    const { data: ins, error: iErr } = await sb.from('services').insert(payload).select();

    if (iErr) console.log('Insert Error:', iErr);
    else console.log('Services Inserted:', ins.length);
}

run();
