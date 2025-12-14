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

    for (let i = 0; i < 200; i++) {
        await delay(100); // Rate limit

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
            console.error(`   ❌ Hata (${email}):`, error.message);
            continue;
        }

        if (authUser?.user) {
            await supabase.from('profiles').upsert({
                id: authUser.user.id,
                full_name: `${firstName} ${lastName}`,
                email,
                role: 'customer',
                phone: faker.phone.number(),
                avatar_url: faker.image.avatar(),
            }, { onConflict: 'id' });
        }

        if ((i + 1) % 20 === 0) process.stdout.write(`   ${i + 1} müşteri hazır...\r`);
    }
    console.log('\n✅ [01] Müşteriler TAMAMLANDI.');
}

seedCustomers().catch(console.error);
