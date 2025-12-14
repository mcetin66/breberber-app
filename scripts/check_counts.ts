
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function check() {
    const { count: bookingCount } = await supabase.from('bookings').select('*', { count: 'exact', head: true });
    const { count: businessCount } = await supabase.from('businesses').select('*', { count: 'exact', head: true });
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

    console.log('--- 📊 GÜNCEL VERİ TABLOSU DURUMU ---');
    console.log(`🏠 İşletmeler: ${businessCount}`);
    console.log(`👥 Kullanıcılar: ${userCount}`);
    console.log(`📅 Randevular: ${bookingCount}`);
    console.log('-------------------------------------');
}

check();
