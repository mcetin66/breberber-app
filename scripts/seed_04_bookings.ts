import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
});

const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const addMinutesToTime = (timeStr: string, minutesToAdd: number) => {
    const [h, m] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m, 0, 0);
    date.setMinutes(date.getMinutes() + minutesToAdd);
    const newH = date.getHours().toString().padStart(2, '0');
    const newM = date.getMinutes().toString().padStart(2, '0');
    return `${newH}:${newM}`;
};

async function seedBookings() {
    console.log('📅 [03] Randevular Oluşturuluyor...');

    // 1. Verileri Çek
    console.log('   Veriler alınıyor...');
    const { data: businesses } = await supabase.from('businesses').select('id, business_type');
    const { data: customers } = await supabase.from('profiles').select('id, gender').eq('role', 'customer');

    if (!businesses || !customers) {
        console.error('❌ İşletme veya müşteri bulunamadı. Önce 01 ve 02 scriptlerini çalıştırın.');
        return;
    }

    const maleCustomers = customers.filter(c => c.gender === 'male').map(c => c.id);
    const femaleCustomers = customers.filter(c => c.gender === 'female').map(c => c.id);

    console.log(`   ${businesses.length} işletme ve ${customers.length} müşteri bulundu (E:${maleCustomers.length}, K:${femaleCustomers.length}).`);

    // 2. Her işletme için döngü
    for (const bus of businesses) {
        // Hedef Kitlesini Belirle
        let targetCustomerIds: string[] = [];

        if (bus.business_type === 'berber') {
            targetCustomerIds = maleCustomers; // Berber: Sadece Erkek
        } else if (bus.business_type === 'guzellik_merkezi') {
            targetCustomerIds = femaleCustomers; // Güzellik: Sadece Kadın
        } else {
            targetCustomerIds = [...maleCustomers, ...femaleCustomers]; // Kuaför: Karışık (Unisex)
        }

        if (targetCustomerIds.length === 0) {
            console.log(`   ⚠️ Uyarı: ${bus.business_type} için uygun müşteri bulunamadı.`);
            continue;
        }

        // Personel ve Hizmetleri al
        const { data: staff } = await supabase.from('business_staff').select('id').eq('business_id', bus.id);
        const { data: services } = await supabase.from('services').select('*').eq('business_id', bus.id);

        if (!staff || !services || staff.length === 0 || services.length === 0) continue;

        // Müdavim Listesi Oluştur (Sadık Müşteriler)
        // Hedef kitle içinden rastgele 15-20 kişiyi "Müdavim" seç
        const regularCount = getRandomInt(15, 20);
        const regularCustomers: string[] = [];
        for (let i = 0; i < regularCount; i++) {
            if (targetCustomerIds.length > 0) {
                regularCustomers.push(getRandomItem(targetCustomerIds));
            }
        }

        const bookingsBatch: any[] = [];
        let currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() - 3); // 3 ay önce
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 14); // 2 hafta sonra

        while (currentDate <= endDate) {
            if (currentDate.getDay() !== 0) { // Pazar hariç
                const dateStr = currentDate.toISOString().split('T')[0];

                // Her gün için müşteri çakışmalarını takip etmek için bir Set
                const customerSchedule = new Set<string>();

                for (const s of staff) {
                    if (Math.random() > 0.6) continue; // %40 doluluk

                    const dailyAppts = getRandomInt(2, 5);
                    for (let a = 0; a < dailyAppts; a++) {
                        const hour = getRandomInt(9, 18);
                        const minute = Math.random() > 0.5 ? '00' : '30';
                        const startTime = `${hour.toString().padStart(2, '0')}:${minute}`;

                        const service = getRandomItem(services);
                        const endTime = addMinutesToTime(startTime, service.duration_minutes);

                        // Müşteri Seçimi (Sadık Müşteri + Çakışma Kontrolü)
                        let selectedCustomerId = null;
                        let attempts = 0;
                        while (!selectedCustomerId && attempts < 10) {
                            // %70 Müdavim, %30 Rastgele
                            let candidateId;
                            if (Math.random() < 0.7 && regularCustomers.length > 0) {
                                candidateId = getRandomItem(regularCustomers);
                            } else {
                                candidateId = getRandomItem(targetCustomerIds);
                            }

                            const slotKey = `${candidateId}_${dateStr}_${hour}`;

                            if (!customerSchedule.has(slotKey)) {
                                selectedCustomerId = candidateId;
                                customerSchedule.add(slotKey);
                            }
                            attempts++;
                        }

                        if (!selectedCustomerId) continue; // Uygun müşteri bulunamadıysa bu slotu geç

                        // Statü
                        let status = 'completed';
                        if (currentDate > new Date()) status = 'pending';
                        else {
                            const r = Math.random();
                            if (r < 0.2) status = 'cancelled'; // 20% iptal (no_show supported değil)
                        }

                        bookingsBatch.push({
                            business_id: bus.id,
                            staff_id: s.id,
                            customer_id: selectedCustomerId,
                            service_id: service.id,
                            booking_date: dateStr,
                            start_time: startTime,
                            end_time: endTime,
                            total_price: service.price,
                            status: status,
                            created_at: currentDate.toISOString()
                        });
                    }
                }
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Batch Insert
        if (bookingsBatch.length > 0) {
            // Chunking - Supabase bazen çok büyük batchleri reddeder, 100'er 100'er atalım
            const chunkSize = 100;
            for (let i = 0; i < bookingsBatch.length; i += chunkSize) {
                const chunk = bookingsBatch.slice(i, i + chunkSize);
                const { error } = await supabase.from('bookings').insert(chunk);
                if (error) console.error(`   ⚠️ Hata (İşletme ${bus.id}):`, error.message);
            }
        }
        process.stdout.write(`   ✅ Randevular eklendi: İşletme ${bus.id.slice(0, 4)}... \r`);
    }

    console.log('\n✅ [03] Randevular TAMAMLANDI.');
}

seedBookings().catch(console.error);
