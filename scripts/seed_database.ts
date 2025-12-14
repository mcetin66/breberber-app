import { createClient } from '@supabase/supabase-js';
import { fakerTR as faker } from '@faker-js/faker';
import dotenv from 'dotenv';

dotenv.config();

// --- CONFIGURATION ---
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('❌ Hata: EXPO_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY .env dosyasında bulunamadı.');
    process.exit(1);
}

// Admin yetkisiyle client oluştur (RLS bypass)
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
});

// --- CONSTANTS ---
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
        { name: 'Saç Yıkama & Masaj', price: 50, duration: 15 }, // Duration slightly adj for easier blocking
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

const WORKING_HOURS = { start: 9, end: 19 }; // Basitleştirilmiş saatler (09:00 - 19:00)

// --- HELPERS ---
const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const sanitize = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, '');
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Zaman formatını (HH:MM) düzgün ayarlayan ve süre ekleyen fonksiyon
const addMinutesToTime = (timeStr: string, minutesToAdd: number) => {
    const [h, m] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m, 0, 0);
    date.setMinutes(date.getMinutes() + minutesToAdd);

    const newH = date.getHours().toString().padStart(2, '0');
    const newM = date.getMinutes().toString().padStart(2, '0');
    return `${newH}:${newM}`; // Örn: "09:30" döner
};

async function seed() {
    console.log('🌱 Veritabanı tohumlama başlıyor...');

    // 1. CREATE CUSTOMERS
    console.log('\n--- 1. Müşteriler Oluşturuluyor (200 Adet) ---');
    const customerIds: string[] = [];

    // Auth kullanıcıları tek tek oluşturulmalı ama log kirliliğini azaltalım
    for (let i = 0; i < 200; i++) {
        // Rate Limit Koruması: Her istek arası 100ms bekle
        await delay(100);

        const sex = Math.random() > 0.5 ? 'female' : 'male';
        const firstName = faker.person.firstName(sex);
        const lastName = faker.person.lastName();
        const email = `customer${i + 1}@test.com`;

        const { data: authUser, error } = await supabase.auth.admin.createUser({
            email,
            password: 'password123',
            email_confirm: true,
            user_metadata: { full_name: `${firstName} ${lastName}`, role: 'customer' }
        });

        if (error) {
            console.error(`\n❌ Müşteri Hatası (${email}):`, error.message);
            // Kullanıcı zaten varsa ID'sini alıp devam edelim
            continue;
        }

        if (authUser?.user) {
            customerIds.push(authUser.user.id);

            // Profil oluştur (Upsert: Varsa güncelle, yoksa ekle)
            await supabase.from('profiles').upsert({
                id: authUser.user.id,
                full_name: `${firstName} ${lastName}`,
                email,
                role: 'customer',
                phone: faker.phone.number(),
                avatar_url: faker.image.avatar(),
            }, { onConflict: 'id' }); // Trigger çakışmasını önler
        }

        if ((i + 1) % 10 === 0) process.stdout.write(`   ${i + 1} müşteri hazır...\r`);
    }
    console.log('\n✅ Müşteriler tamamlandı.');

    // 2. BUSINESSES & STAFF & BOOKINGS LOOP
    console.log('\n--- 2. İşletmeler, Personel ve Randevular Oluşturuluyor ---');

    for (const [type, config] of Object.entries(BUSINESS_TYPES)) {
        console.log(`\n📂 Kategori: ${config.label} (${config.count} adet)`);

        for (let i = 0; i < config.count; i++) {
            await delay(200); // İşletmeler arası biraz daha uzun bekle

            // --- A. İŞLETME ---
            const city = Math.random() < 0.4 ? 'İstanbul' : getRandomItem(CITIES);
            const ownerName = faker.person.fullName();
            const businessName = `${ownerName.split(' ')[0]} ${type === 'berber' ? 'Berber' : config.label}`;
            const slug = sanitize(businessName) + getRandomInt(100, 999);
            const email = `${slug}@isletme.com`;

            // Owner Auth
            const { data: ownerAuth, error: authError } = await supabase.auth.admin.createUser({
                email,
                password: 'password123',
                email_confirm: true,
                user_metadata: { full_name: ownerName, role: 'business', sub_role: 'owner' }
            });

            if (authError || !ownerAuth?.user) {
                console.error(`\n❌ İşletme Sahibi Hatası (${email}):`, authError?.message);
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
                console.error(`\n❌ İşletme Kayıt Hatası (${businessName}):`, busError?.message);
                continue;
            }

            // --- B. HİZMETLER ---
            const servicesList = SERVICES_DATA[type as keyof typeof SERVICES_DATA].map(s => ({
                business_id: business.id,
                ...s,
                is_active: true
            }));
            const { error: servError, data: createdServices } = await supabase.from('services').insert(servicesList).select();
            if (servError || !createdServices) {
                console.error(`\n❌ Hizmet Hatası (${businessName}):`, servError?.message);
                continue;
            }

            // --- C. PERSONEL ---
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
            const { data: createdStaff, error: staffError } = await supabase.from('business_staff').insert(staffList).select();

            if (staffError) console.error(`\n❌ Personel Hatası (${businessName}):`, staffError.message);

            // --- D. RANDEVULAR (Batch Insert) ---
            if (createdStaff && createdStaff.length > 0 && customerIds.length > 0) {
                const bookingsBatch: any[] = [];
                let currentDate = new Date();
                currentDate.setMonth(currentDate.getMonth() - 3); // 3 ay önce
                const endDate = new Date();
                endDate.setDate(endDate.getDate() + 14); // 2 hafta sonra

                while (currentDate <= endDate) {
                    if (currentDate.getDay() !== 0) { // Pazar hariç
                        const dateStr = currentDate.toISOString().split('T')[0];

                        for (const staff of createdStaff) {
                            // Şans faktörü: Her gün full dolu olmasın
                            if (Math.random() > 0.7) continue;

                            const dailyAppts = getRandomInt(2, 4);
                            for (let a = 0; a < dailyAppts; a++) {
                                // Rastgele saat (09:00 - 18:30 arası)
                                const hour = getRandomInt(9, 18);
                                const minute = Math.random() > 0.5 ? '00' : '30';
                                const startTime = `${hour.toString().padStart(2, '0')}:${minute}`;

                                const service = getRandomItem(createdServices);
                                const endTime = addMinutesToTime(startTime, service.duration); // Helper kullanıldı

                                // Statü Belirleme
                                let status = 'completed';
                                if (currentDate > new Date()) status = 'pending';
                                else {
                                    const r = Math.random();
                                    if (r < 0.1) status = 'cancelled';
                                    else if (r < 0.2) status = 'no_show';
                                }

                                bookingsBatch.push({
                                    business_id: business.id,
                                    staff_id: staff.id,
                                    customer_id: getRandomItem(customerIds),
                                    service_id: service.id,
                                    booking_date: dateStr,
                                    start_time: startTime,
                                    end_time: endTime,
                                    total_price: service.price,
                                    status: status,
                                    created_at: currentDate.toISOString() // Oluşturulma tarihi de geçmiş olsun
                                });
                            }
                        }
                    }
                    currentDate.setDate(currentDate.getDate() + 1);
                }

                // Batch Insert (Tek seferde veritabanına yazma)
                if (bookingsBatch.length > 0) {
                    const { error: bookingError } = await supabase.from('bookings').insert(bookingsBatch);
                    if (bookingError) console.error(`   ⚠️ Randevu Hatası (${businessName}):`, bookingError.message);
                }
            }
            process.stdout.write(`   ✅ ${businessName} oluşturuldu (${i + 1}/${config.count})\r`);
        }
    }

    console.log('\n\n🎉 SEED İŞLEMİ BAŞARIYLA TAMAMLANDI!');
}

// --- CLEANUP FUNCTION ---
async function cleanTestData() {
    console.log('🧹 Test verileri temizleniyor...');

    // Auth userları silerken ilişkili tüm tablolar (cascade varsa) zaten silinir.
    // Ancak Supabase Auth API toplu silme desteklemez, listeyip sileceğiz.

    // 1. Müşterileri Bul
    const { data: users, error } = await supabase.auth.admin.listUsers();
    if (error) {
        console.error('Kullanıcılar listelenemedi:', error);
        return;
    }

    const testUsers = users.users.filter(u =>
        u.email?.endsWith('@test.com') ||
        u.email?.endsWith('@isletme.com')
    );

    console.log(`🗑️  ${testUsers.length} adet test kullanıcısı (ve bağlı verileri) siliniyor...`);

    for (const u of testUsers) {
        await supabase.auth.admin.deleteUser(u.id);
        process.stdout.write(`   Silindi: ${u.email}\r`);
    }

    console.log('\n✨ Temizlik tamamlandı! Veritabanı test yükünden arındırıldı.');
}

// --- MAIN EXECUTION ---
async function main() {
    const args = process.argv.slice(2);
    if (args.includes('--clean')) {
        await cleanTestData();
    } else {
        await seed();
    }
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
