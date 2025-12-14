import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
});

async function clean() {
    console.log('🧹 [00] Temizlik Başlıyor...');

    // 1. Randevuları Sil (Cascade ile silinemeyenler için garanti olsun)
    const { error: bookingError } = await supabase.from('bookings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (!bookingError) console.log('   ✅ Randevular tablosu temizlendi.');

    // 2. İşletmeleri Sil
    const { error: busError } = await supabase.from('businesses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (!busError) console.log('   ✅ İşletmeler tablosu temizlendi.');

    // 3. Test Kullanıcılarını Sil (Auth)
    const { data: users, error } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    if (error) {
        console.error('Kullanıcı listesi alınamadı:', error);
        return;
    }

    const testUsers = users.users.filter(u =>
        u.email?.endsWith('@test.com') ||
        u.email?.endsWith('@isletme.com')
    );

    console.log(`   🗑️  ${testUsers.length} adet test kullanıcısı siliniyor...`);
    let deletedCount = 0;

    for (const u of testUsers) {
        await supabase.auth.admin.deleteUser(u.id);
        deletedCount++;
        if (deletedCount % 10 === 0) process.stdout.write(`   Silinen: ${deletedCount}\r`);
    }

    console.log('\n✨ [00] Temizlik TAMAMLANDI.');
}

clean().catch(console.error);
