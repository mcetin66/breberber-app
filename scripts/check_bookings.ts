
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!; // use service role if possible for admin check, but existing file usage suggests anon with relaxed policies or user token.
// Actually for scripts I should try to use a service role key if available or just anon key.
// Since we don't have service role in env usually, I'll rely on anon. 
// But generic fetch without auth might fail RLS. 
// However, I can try.

const client = createClient(supabaseUrl, supabaseKey);

async function checkBookings() {
    console.log('Checking bookings...');

    // 1. Check all bookings count
    const { data: allBookings, error } = await client.from('bookings').select('*');

    if (error) {
        console.error('Error fetching bookings:', error.message);
        return;
    }

    console.log(`Total Bookings in DB: ${allBookings?.length}`);

    if (allBookings && allBookings.length > 0) {
        console.log('Sample Booking:', allBookings[0]);

        // Count by status
        const completed = allBookings.filter(b => b.status === 'completed').length;
        const pending = allBookings.filter(b => b.status === 'pending').length;
        const confirmed = allBookings.filter(b => b.status === 'confirmed').length;

        console.log('Stats:', { completed, pending, confirmed });
    } else {
        console.log('No bookings found.');
    }

    // Check businesses
    const { data: businesses } = await client.from('businesses').select('*');
    console.log(`Total Businesses: ${businesses?.length}`);
}

checkBookings();
