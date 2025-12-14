import { createClient } from '@supabase/supabase-js';
import { fakerTR as faker } from '@faker-js/faker';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
});
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const sanitize = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, '');

const CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Konya', 'Kayseri', 'Eskişehir', 'Kocaeli', 'Samsun'];
const BUSINESS_TYPES = {
    berber: { count: 10, staffMin: 2, staffMax: 3, label: 'Berber' },
    kuafor: { count: 20, staffMin: 3, staffMax: 5, label: 'Kuaför' },
    guzellik_merkezi: { count: 10, staffMin: 4, staffMax: 6, label: 'Güzellik Merkezi' },
};
const SERVICES_DATA = {
    berber: [
        { name: 'Saç Kesimi', price: 200, duration: 30 },
        { name: 'Sakal Kesimi', price: 100, duration: 15 },
        { name: 'Saç Yıkama & Masaj', price: 50, duration: 15 },
        { name: 'Çocuk Tıraşı', price: 150, duration: 30 },
        { name: 'Damat Tıraşı', price: 1000, duration: 60 },
        { name: 'Cilt Bakımı', price: 300, duration: 30 },
    ],
    kuafor: [
        { name: 'Fön', price: 100, duration: 30 },
        { name: 'Saç Kesimi', price: 300, duration: 45 },
        { name: 'Dip Boya', price: 600, duration: 60 },
        { name: 'Komple Boya', price: 1200, duration: 90 },
        { name: 'Manikür', price: 200, duration: 30 },
        { name: 'Gelin Başı', price: 3000, duration: 120 },
    ],
    guzellik_merkezi: [
        { name: 'Lazer Epilasyon', price: 1500, duration: 60 },
        { name: 'Hydrafacial', price: 1200, duration: 60 },
        { name: 'Protez Tırnak', price: 800, duration: 90 },
        { name: 'Microblading', price: 2500, duration: 120 },
    ],
};

async function seedBusinesses() {
    console.log('🏢 [02] İşletmeler Oluşturuluyor...');

    let totalCount = 0;
    for (const [type, config] of Object.entries(BUSINESS_TYPES)) {
        console.log(`   📂 ${config.label} (${config.count} adet)...`);

        for (let i = 0; i < config.count; i++) {
            await delay(200);

            const city = Math.random() < 0.4 ? 'İstanbul' : getRandomItem(CITIES);
            const ownerName = faker.person.fullName();
            const businessName = `${ownerName.split(' ')[0]} ${type === 'berber' ? 'Berber' : config.label}`;
            const slug = sanitize(businessName) + getRandomInt(100, 999);
            const email = `${slug}@isletme.com`;

            // Owner Auth
            const { data: ownerAuth } = await supabase.auth.admin.createUser({
                email,
                password: 'password123',
                email_confirm: true,
                user_metadata: { full_name: ownerName, role: 'business', sub_role: 'owner' }
            });

            if (!ownerAuth?.user) {
                console.error(`   ❌ Sahip oluşturulamadı (${email}):`, ownerAuth?.error?.message || 'Bilinmeyen Hata');
                if (ownerAuth?.error) console.error(ownerAuth.error);
                continue;
            }

            // 1.5 PROFİL OLUŞTUR (Business Insert öncesi Zorunlu!)
            const { error: profileError } = await supabase.from('profiles').upsert({
                id: ownerAuth.user.id,
                email: email,
                full_name: ownerName,
                role: 'business_owner', // Database Constraint: 'customer', 'business_owner', 'staff', 'admin'
                avatar_url: faker.image.avatar(),
                phone: faker.phone.number(),
                created_at: new Date().toISOString(),
            });

            if (profileError) {
                console.error(`   ❌ Profil Oluşturulamadı (${email}):`, profileError.message);
                continue;
            }

            // Business Insert
            const { data: business, error: busError } = await supabase.from('businesses').insert({
                owner_id: ownerAuth.user.id,
                name: businessName,
                contact_name: ownerName,
                email: email,
                phone: faker.phone.number(),
                city: city,
                address: faker.location.streetAddress(),
                business_type: type,
                is_active: true,
                cover_url: `https://loremflickr.com/800/400/${type === 'berber' ? 'barber' : 'salon'}?random=${i}`,
            }).select().single();

            if (busError || !business) {
                console.error(`   ❌ İşletme Kayıt Hatası (${businessName}):`, busError?.message);
                continue;
            }

            // Services
            const servicesList = SERVICES_DATA[type as keyof typeof SERVICES_DATA].map(s => ({
                business_id: business.id, ...s, is_active: true
            }));
            await supabase.from('services').insert(servicesList);

            // Staff
            const staffCount = getRandomInt(config.staffMin, config.staffMax);
            const staffList = Array.from({ length: staffCount }).map((_, idx) => ({
                business_id: business.id,
                name: faker.person.fullName(),
                role: idx === 0 ? 'manager' : 'staff',
                email: `${sanitize(faker.person.firstName())}.${idx}@${slug}.com`,
                phone: faker.phone.number(),
                photo_url: faker.image.avatar(),
                is_active: true
            }));
            await supabase.from('business_staff').insert(staffList);

            totalCount++;
            process.stdout.write(`   ✅ ${businessName} oluşturuldu (${totalCount})\r`);
        }
    }
    console.log('\n✅ [02] İşletmeler TAMAMLANDI.');
}

seedBusinesses().catch(console.error);
