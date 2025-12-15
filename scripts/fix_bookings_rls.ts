
import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function fixBookingsRLS() {
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
        console.log('🔒 Configuring RLS for Bookings...');

        // Enable RLS
        await client.query(`ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;`);

        // Ensure businesses is readable for RLS checks/subqueries
        await client.query(`ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;`);
        await client.query(`DROP POLICY IF EXISTS "Public can view active businesses" ON public.businesses;`);

        // Allow anyone to read business info (needed for RLS subqueries to work properly)
        await client.query(`
            CREATE POLICY "Public can view active businesses" 
            ON public.businesses
            FOR SELECT
            USING (true);
        `);

        // 1. Owners Policy: Full Access to their business's bookings
        // Drop first to update
        await client.query(`DROP POLICY IF EXISTS "Owners can manage their business bookings" ON public.bookings;`);
        await client.query(`
            CREATE POLICY "Owners can manage their business bookings"
            ON public.bookings
            FOR ALL
            TO authenticated
            USING (
                business_id IN (
                    SELECT id FROM public.businesses 
                    WHERE owner_id = auth.uid()
                )
            )
            WITH CHECK (
                business_id IN (
                    SELECT id FROM public.businesses 
                    WHERE owner_id = auth.uid()
                )
            );
        `);

        // 2. Customers Policy: View/Create their own bookings (Standard)
        await client.query(`DROP POLICY IF EXISTS "Customers can manage their own bookings" ON public.bookings;`);
        await client.query(`
            CREATE POLICY "Customers can manage their own bookings"
            ON public.bookings
            FOR ALL
            TO authenticated
            USING (
                auth.uid() = customer_id
            )
            WITH CHECK (
                auth.uid() = customer_id
            );
        `);

        // 3. Staff Policy: View bookings assigned to them
        // Assuming we map auth.uid() to staff table? 
        // Or simpler: If user is staff of the business. 
        // For now, let's stick to Owner + Customer which covers the main flows.
        // Also Public Read might be needed for availability checking?
        // Actually availability is usually checked via RPC or filtered query.

        // Update Status Constraint to allow 'blocked'
        await client.query(`ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_status_check;`);
        await client.query(`
            ALTER TABLE public.bookings ADD CONSTRAINT bookings_status_check 
            CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'blocked'));
        `);

        console.log('✅ RLS Policies updated successfully.');

    } catch (err: any) {
        console.error('❌ Failed:', err.message);
    } finally {
        await client.end();
    }
}

fixBookingsRLS();
