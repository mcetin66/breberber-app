
import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function listStaffForBusiness() {
    if (!process.env.DATABASE_URL) {
        console.error('❌ Error: DATABASE_URL is not defined');
        process.exit(1);
    }

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    const targetEmail = 'altemurberber306@isletme.com';

    try {
        await client.connect();

        // 1. Find Business ID
        const resBiz = await client.query(`SELECT id, name FROM public.businesses WHERE email = $1`, [targetEmail]);

        if (resBiz.rows.length === 0) {
            console.log(`❌ İşletme bulunamadı: ${targetEmail}`);
            process.exit(0);
        }

        const business = resBiz.rows[0];
        console.log(`🏢 İşletme: ${business.name} (${business.id})`);

        // 2. Find Staff
        const resStaff = await client.query(`
            SELECT 
                name,
                email,
                title,
                phone
            FROM public.business_staff 
            WHERE business_id = $1
        `, [business.id]);

        if (resStaff.rows.length === 0) {
            console.log('❌ Bu işletmeye ait personel bulunamadı.');
        } else {
            console.table(resStaff.rows);
            console.log('🔑 Giriş Şifresi (Genel): password123');
        }

    } catch (err: any) {
        console.error('❌ Failed:', err.message);
    } finally {
        await client.end();
    }
}

listStaffForBusiness();
