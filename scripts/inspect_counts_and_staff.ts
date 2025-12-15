
import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function inspectCountsAndStaff() {
    if (!process.env.DATABASE_URL) {
        console.error('❌ Error: DATABASE_URL is not defined');
        process.exit(1);
    }

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();

        // 1. Count Businesses
        const resBiz = await client.query(`SELECT COUNT(*) FROM public.businesses`);
        console.log(`🏢 Toplam İşletme: ${resBiz.rows[0].count}`);

        // 2. Count Customers (Profiles)
        const resCust = await client.query(`SELECT COUNT(*) FROM public.profiles WHERE role = 'customer'`);
        console.log(`👥 Toplam Müşteri: ${resCust.rows[0].count}`);

        // 3. Count Staff
        const resStaffCount = await client.query(`SELECT COUNT(*) FROM public.business_staff`);
        console.log(`✂️  Toplam Personel (Profil): ${resStaffCount.rows[0].count}`);

        // 4. Find Sample Staff Logins
        // We need to join business_staff with profiles to ensure they have a user account
        // Or check usually seed sets them up.
        // Assuming email in business_staff matches auth.users email.

        console.log('\n--- Örnek Personel Giriş Bilgileri ---');
        const resStaff = await client.query(`
            SELECT 
                bs.name as staff_name,
                bs.email as staff_email,
                b.name as business_name
            FROM public.business_staff bs
            JOIN public.businesses b ON bs.business_id = b.id
            WHERE bs.email IS NOT NULL
            LIMIT 5;
        `);

        if (resStaff.rows.length === 0) {
            console.log('❌ Hiç personel e-postası bulunamadı.');
        } else {
            console.table(resStaff.rows);
            console.log('🔑 Not: Seed verilerinde şifre genellikle "password123" veya "123456" olabilir.');
        }

    } catch (err: any) {
        console.error('❌ Failed:', err.message);
    } finally {
        await client.end();
    }
}

inspectCountsAndStaff();
