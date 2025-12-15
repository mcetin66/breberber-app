-- ============================================
-- BREBERBER DATABASE SCHEMA
-- Version: 2.0 (December 2025)
-- Generated from live Supabase database
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES (Users)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'business_owner', 'staff', 'admin')),
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. SERVICE CATEGORIES
-- ============================================
CREATE TABLE IF NOT EXISTS service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    icon TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. BUSINESSES
-- ============================================
CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    address TEXT,
    city TEXT,
    phone TEXT,
    email TEXT,
    logo_url TEXT,
    cover_url TEXT,
    rating NUMERIC DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    latitude NUMERIC,
    longitude NUMERIC,
    is_active BOOLEAN DEFAULT TRUE,
    business_type TEXT DEFAULT 'berber' CHECK (business_type IN ('berber', 'kuafor', 'guzellik_merkezi')),
    working_hours JSONB DEFAULT '{}',
    contact_name TEXT,
    instagram TEXT,
    subscription_tier TEXT DEFAULT 'basic' CHECK (subscription_tier IN ('basic', 'premium', 'enterprise')),
    subscription_start_date TIMESTAMPTZ,
    subscription_end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. BUSINESS STAFF
-- ============================================
CREATE TABLE IF NOT EXISTS business_staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    title TEXT, -- 'manager', 'staff', etc.
    avatar_url TEXT,
    photo_url TEXT,
    bio TEXT,
    rating NUMERIC DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. SERVICES
-- ============================================
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    category_id UUID REFERENCES service_categories(id) ON DELETE SET NULL,
    category TEXT, -- Fallback text category
    name TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL,
    duration INTEGER DEFAULT 30, -- Legacy field
    price NUMERIC NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. STAFF SERVICES (Many-to-Many)
-- ============================================
CREATE TABLE IF NOT EXISTS staff_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID REFERENCES business_staff(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(staff_id, service_id)
);

-- ============================================
-- 7. STAFF WORKING HOURS
-- ============================================
CREATE TABLE IF NOT EXISTS staff_working_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID REFERENCES business_staff(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    lunch_start TIME,
    lunch_end TIME,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. BOOKINGS (Appointments)
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES business_staff(id) ON DELETE SET NULL,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'blocked')),
    total_price NUMERIC NOT NULL,
    notes TEXT,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 9. FAVORITES
-- ============================================
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, business_id)
);

-- ============================================
-- 10. REVIEWS
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES business_staff(id) ON DELETE SET NULL,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 11. AUDIT LOGS
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    details JSONB DEFAULT '{}',
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_business ON bookings(business_id);
CREATE INDEX IF NOT EXISTS idx_bookings_staff ON bookings(staff_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_business_staff_business ON business_staff(business_id);
CREATE INDEX IF NOT EXISTS idx_services_business ON services(business_id);
CREATE INDEX IF NOT EXISTS idx_staff_working_hours_staff ON staff_working_hours(staff_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_working_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- PROFILES
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- BUSINESSES
CREATE POLICY "Public can view active businesses" ON businesses FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Business owners can insert businesses" ON businesses FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Business owners can update own businesses" ON businesses FOR UPDATE TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Business owners can delete own businesses" ON businesses FOR DELETE TO authenticated USING (auth.uid() = owner_id);

-- BUSINESS STAFF
CREATE POLICY "Anyone can view active staff" ON business_staff FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Business owners can manage staff" ON business_staff FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM businesses WHERE id = business_id AND owner_id = auth.uid())
);
CREATE POLICY "Business owners can update staff" ON business_staff FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM businesses WHERE id = business_id AND owner_id = auth.uid())
);
CREATE POLICY "Business owners can delete staff" ON business_staff FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM businesses WHERE id = business_id AND owner_id = auth.uid())
);

-- SERVICES
CREATE POLICY "Anyone can view active services" ON services FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Business owners can manage services" ON services FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM businesses WHERE id = business_id AND owner_id = auth.uid())
);
CREATE POLICY "Business owners can update services" ON services FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM businesses WHERE id = business_id AND owner_id = auth.uid())
);
CREATE POLICY "Business owners can delete services" ON services FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM businesses WHERE id = business_id AND owner_id = auth.uid())
);

-- BOOKINGS
CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT TO authenticated USING (
    customer_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM businesses WHERE id = business_id AND owner_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM business_staff WHERE id = staff_id AND user_id = auth.uid())
);
CREATE POLICY "Customers can create bookings" ON bookings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update own bookings" ON bookings FOR UPDATE TO authenticated USING (
    customer_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM businesses WHERE id = business_id AND owner_id = auth.uid())
);
CREATE POLICY "Users can delete own bookings" ON bookings FOR DELETE TO authenticated USING (
    customer_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM businesses WHERE id = business_id AND owner_id = auth.uid())
);

-- FAVORITES
CREATE POLICY "Users can view own favorites" ON favorites FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can manage own favorites" ON favorites FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own favorites" ON favorites FOR DELETE TO authenticated USING (user_id = auth.uid());

-- REVIEWS
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT TO public USING (true);
CREATE POLICY "Customers can create reviews" ON reviews FOR INSERT TO authenticated WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE TO authenticated USING (customer_id = auth.uid());
CREATE POLICY "Users can delete own reviews" ON reviews FOR DELETE TO authenticated USING (customer_id = auth.uid());

-- SERVICE CATEGORIES
CREATE POLICY "Anyone can view categories" ON service_categories FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage categories" ON service_categories FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- STAFF SERVICES
CREATE POLICY "Anyone can view staff services" ON staff_services FOR SELECT TO public USING (true);
CREATE POLICY "Business owners can manage staff services" ON staff_services FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1 FROM business_staff bs 
        JOIN businesses b ON bs.business_id = b.id 
        WHERE bs.id = staff_id AND b.owner_id = auth.uid()
    )
);

-- STAFF WORKING HOURS
CREATE POLICY "Anyone can view working hours" ON staff_working_hours FOR SELECT TO public USING (true);
CREATE POLICY "Business owners can manage working hours" ON staff_working_hours FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1 FROM business_staff bs 
        JOIN businesses b ON bs.business_id = b.id 
        WHERE bs.id = staff_id AND b.owner_id = auth.uid()
    )
);

-- AUDIT LOGS
CREATE POLICY "Admins can view audit logs" ON audit_logs FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Allow authenticated insert on audit_logs" ON audit_logs FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_staff_updated_at BEFORE UPDATE ON business_staff FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- END OF SCHEMA
-- ============================================
