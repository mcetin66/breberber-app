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
    const { data: businesses } = await supabase.from('businesses').select('id');
    const { data: customers } = await supabase.from('profiles').select('id').eq('role', 'customer');

    if (!businesses || !customers) {
        console.error('❌ İşletme veya müşteri bulunamadı. Önce 01 ve 02 scriptlerini çalıştırın.');
        return;
    }
    const customerIds = customers.map(c => c.id);

    console.log(`   ${businesses.length} işletme ve ${customerIds.length} müşteri bulundu.`);

    // 2. Her işletme için döngü
    for (const bus of businesses) {
        // Personel ve Hizmetleri al
        const { data: staff } = await supabase.from('business_staff').select('id').eq('business_id', bus.id);
        const { data: services } = await supabase.from('services').select('*').eq('business_id', bus.id);

        if (!staff || !services || staff.length === 0 || services.length === 0) continue;

        const bookingsBatch: any[] = [];
        let currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() - 3); // 3 ay önce
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 14); // 2 hafta sonra

        while (currentDate <= endDate) {
            if (currentDate.getDay() !== 0) { // Pazar hariç
                const dateStr = currentDate.toISOString().split('T')[0];

                for (const s of staff) {
                    if (Math.random() > 0.6) continue; // %40 doluluk

                    const dailyAppts = getRandomInt(2, 5);
                    for (let a = 0; a < dailyAppts; a++) {
                        const hour = getRandomInt(9, 18);
                        const minute = Math.random() > 0.5 ? '00' : '30';
                        const startTime = `${hour.toString().padStart(2, '0')}:${minute}`;

                        const service = getRandomItem(services);
                        const endTime = addMinutesToTime(startTime, service.duration);

                        // Statü
                        let status = 'completed';
                        if (currentDate > new Date()) status = 'pending';
                        else {
                            const r = Math.random();
                            if (r < 0.1) status = 'cancelled';
                            else if (r < 0.2) status = 'no_show';
                        }

                        bookingsBatch.push({
                            business_id: bus.id,
                            staff_id: s.id,
                            customer_id: getRandomItem(customerIds),
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
