import { createClient } from '@supabase/supabase-js';
import { fakerTR as faker } from '@faker-js/faker';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
});
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function seedCustomers() {
    console.log('👥 [01] Müşteriler Oluşturuluyor...');

    const TOTAL_MALE = 150;
    const TOTAL_FEMALE = 100;
    const TOTAL = TOTAL_MALE + TOTAL_FEMALE;

    // 1. Mevcut Kullanıcıları Çek (Performans için tek seferde)
    console.log('   Mevcut kullanıcılar listeleniyor...');
    const { data: { users: existingUsers }, error: listError } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    if (listError) {
        console.error('❌ Kullanıcı listesi alınamadı:', listError.message);
        return;
    }
    const userMap = new Map(existingUsers.map(u => [u.email, u.id]));
    console.log(`   ${userMap.size} mevcut kullanıcı bulundu.`);

    for (let i = 0; i < TOTAL; i++) {
        await delay(100); // 100ms yeterli, çünkü gereksiz istekleri kestik

        // İlk 150 Erkek, Sonra 100 Kadın
        const sexType = i < TOTAL_MALE ? 'male' : 'female';

        const firstName = faker.person.firstName(sexType);
        const lastName = faker.person.lastName();
        const email = `customer${i + 1}@test.com`;
        let userId = userMap.get(email);

        // Kullanıcı yoksa oluştur
        if (!userId) {
            const { data: authUser, error } = await supabase.auth.admin.createUser({
                email,
                password: 'password123',
                email_confirm: true,
                user_metadata: { full_name: `${firstName} ${lastName}`, role: 'customer' }
            });

            if (error) {
                console.error(`   ❌ Hata (${email}):`, error.message);
                continue;
            }
            userId = authUser.user?.id;
        }

        // Profili Oluştur/Güncelle
        if (userId) {
            const { error: upsertError } = await supabase.from('profiles').upsert({
                id: userId,
                full_name: `${firstName} ${lastName}`,
                email,
                role: 'customer',
                gender: sexType,
                phone: faker.phone.number(),
                avatar_url: faker.image.avatar(),
            }, { onConflict: 'id' });

            if (upsertError) {
                console.error(`   ❌ Profil Hatası (${email}):`, upsertError.message);
            }
        }

        if ((i + 1) % 50 === 0) process.stdout.write(`   ${i + 1}/${TOTAL} işlendi...\r`);
    }
    console.log('\n✅ [01] Müşteriler TAMAMLANDI.');
}

seedCustomers().catch(console.error);
