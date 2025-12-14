/*
  # BreBerber Initial Database Schema

  ## Overview
  Complete database schema for the BreBerber barbershop booking application.
  
  ## New Tables
  
  ### 1. profiles
    - `id` (uuid, primary key) - References auth.users
    - `email` (text) - User email
    - `full_name` (text) - User's full name
    - `phone` (text) - Phone number
    - `avatar_url` (text) - Profile picture URL
    - `role` (text) - User role: 'customer', 'business_owner', 'staff', 'admin'
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### 2. businesses
    - `id` (uuid, primary key)
    - `owner_id` (uuid) - References profiles
    - `name` (text) - Business name
    - `description` (text) - Business description
    - `address` (text) - Full address
    - `city` (text) - City
    - `phone` (text) - Business phone
    - `email` (text) - Business email
    - `logo_url` (text) - Logo image URL
    - `cover_url` (text) - Cover image URL
    - `rating` (numeric) - Average rating
    - `review_count` (integer) - Total reviews
    - `latitude` (numeric) - Location latitude
    - `longitude` (numeric) - Location longitude
    - `is_active` (boolean) - Business status
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### 3. business_staff
    - `id` (uuid, primary key)
    - `business_id` (uuid) - References businesses
    - `user_id` (uuid) - References profiles
    - `name` (text) - Staff name
    - `title` (text) - Job title
    - `avatar_url` (text) - Staff photo
    - `bio` (text) - Staff bio
    - `rating` (numeric) - Staff rating
    - `review_count` (integer) - Staff reviews
    - `is_active` (boolean) - Staff status
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### 4. service_categories
    - `id` (uuid, primary key)
    - `name` (text) - Category name
    - `icon` (text) - Icon name
    - `display_order` (integer) - Sort order
    - `created_at` (timestamptz)

  ### 5. services
    - `id` (uuid, primary key)
    - `business_id` (uuid) - References businesses
    - `category_id` (uuid) - References service_categories
    - `name` (text) - Service name
    - `description` (text) - Service description
    - `duration_minutes` (integer) - Service duration
    - `price` (numeric) - Service price
    - `is_active` (boolean) - Service status
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### 6. staff_services
    - `id` (uuid, primary key)
    - `staff_id` (uuid) - References business_staff
    - `service_id` (uuid) - References services
    - `created_at` (timestamptz)

  ### 7. staff_working_hours
    - `id` (uuid, primary key)
    - `staff_id` (uuid) - References business_staff
    - `day_of_week` (integer) - 0-6 (Sunday-Saturday)
    - `start_time` (time) - Start time
    - `end_time` (time) - End time
    - `is_available` (boolean) - Availability status
    - `created_at` (timestamptz)

  ### 8. bookings
    - `id` (uuid, primary key)
    - `customer_id` (uuid) - References profiles
    - `business_id` (uuid) - References businesses
    - `staff_id` (uuid) - References business_staff
    - `service_id` (uuid) - References services
    - `booking_date` (date) - Booking date
    - `start_time` (time) - Start time
    - `end_time` (time) - End time
    - `status` (text) - 'pending', 'confirmed', 'completed', 'cancelled'
    - `total_price` (numeric) - Total price
    - `notes` (text) - Customer notes
    - `cancellation_reason` (text) - Cancellation reason
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### 9. reviews
    - `id` (uuid, primary key)
    - `customer_id` (uuid) - References profiles
    - `business_id` (uuid) - References businesses
    - `staff_id` (uuid) - References business_staff (optional)
    - `booking_id` (uuid) - References bookings
    - `rating` (integer) - 1-5 rating
    - `comment` (text) - Review text
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### 10. favorites
    - `id` (uuid, primary key)
    - `user_id` (uuid) - References profiles
    - `business_id` (uuid) - References businesses
    - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated users
  - Implement role-based access control
  - Protect sensitive data with proper policies
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  phone text,
  avatar_url text,
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'business_owner', 'staff', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  address text,
  city text,
  phone text,
  email text,
  logo_url text,
  cover_url text,
  rating numeric(3,2) DEFAULT 0,
  review_count integer DEFAULT 0,
  latitude numeric(10,8),
  longitude numeric(11,8),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Business staff table
CREATE TABLE IF NOT EXISTS business_staff (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  name text NOT NULL,
  title text,
  avatar_url text,
  bio text,
  rating numeric(3,2) DEFAULT 0,
  review_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Service categories table
CREATE TABLE IF NOT EXISTS service_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  icon text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  category_id uuid REFERENCES service_categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  duration_minutes integer NOT NULL,
  price numeric(10,2) NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Staff services junction table
CREATE TABLE IF NOT EXISTS staff_services (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id uuid REFERENCES business_staff(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(staff_id, service_id)
);

-- Staff working hours table
CREATE TABLE IF NOT EXISTS staff_working_hours (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id uuid REFERENCES business_staff(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(staff_id, day_of_week)
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  staff_id uuid REFERENCES business_staff(id) ON DELETE SET NULL,
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,
  booking_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  total_price numeric(10,2) NOT NULL,
  notes text,
  cancellation_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  staff_id uuid REFERENCES business_staff(id) ON DELETE SET NULL,
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(booking_id)
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, business_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_businesses_owner ON businesses(owner_id);
CREATE INDEX IF NOT EXISTS idx_businesses_city ON businesses(city);
CREATE INDEX IF NOT EXISTS idx_businesses_rating ON businesses(rating DESC);
CREATE INDEX IF NOT EXISTS idx_business_staff_business ON business_staff(business_id);
CREATE INDEX IF NOT EXISTS idx_services_business ON services(business_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_business ON bookings(business_id);
CREATE INDEX IF NOT EXISTS idx_bookings_staff ON bookings(staff_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_reviews_business ON reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_staff ON reviews(staff_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_working_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Businesses policies
CREATE POLICY "Anyone can view active businesses"
  ON businesses FOR SELECT
  USING (is_active = true OR owner_id = auth.uid());

CREATE POLICY "Business owners can insert businesses"
  ON businesses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Business owners can update own businesses"
  ON businesses FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Business owners can delete own businesses"
  ON businesses FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Business staff policies
CREATE POLICY "Anyone can view active staff"
  ON business_staff FOR SELECT
  USING (
    is_active = true OR 
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM businesses WHERE id = business_staff.business_id AND owner_id = auth.uid())
  );

CREATE POLICY "Business owners can manage staff"
  ON business_staff FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM businesses WHERE id = business_id AND owner_id = auth.uid())
  );

CREATE POLICY "Business owners can update staff"
  ON business_staff FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM businesses WHERE id = business_id AND owner_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM businesses WHERE id = business_id AND owner_id = auth.uid())
  );

CREATE POLICY "Business owners can delete staff"
  ON business_staff FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM businesses WHERE id = business_id AND owner_id = auth.uid())
  );

-- Service categories policies (public read)
CREATE POLICY "Anyone can view categories"
  ON service_categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON service_categories FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Services policies
CREATE POLICY "Anyone can view active services"
  ON services FOR SELECT
  USING (
    is_active = true OR
    EXISTS (SELECT 1 FROM businesses WHERE id = business_id AND owner_id = auth.uid())
  );

CREATE POLICY "Business owners can manage services"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM businesses WHERE id = business_id AND owner_id = auth.uid())
  );

CREATE POLICY "Business owners can update services"
  ON services FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM businesses WHERE id = business_id AND owner_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM businesses WHERE id = business_id AND owner_id = auth.uid())
  );

CREATE POLICY "Business owners can delete services"
  ON services FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM businesses WHERE id = business_id AND owner_id = auth.uid())
  );

-- Staff services policies
CREATE POLICY "Anyone can view staff services"
  ON staff_services FOR SELECT
  USING (true);

CREATE POLICY "Business owners can manage staff services"
  ON staff_services FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_staff bs
      JOIN businesses b ON b.id = bs.business_id
      WHERE bs.id = staff_id AND b.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_staff bs
      JOIN businesses b ON b.id = bs.business_id
      WHERE bs.id = staff_id AND b.owner_id = auth.uid()
    )
  );

-- Staff working hours policies
CREATE POLICY "Anyone can view working hours"
  ON staff_working_hours FOR SELECT
  USING (true);

CREATE POLICY "Business owners can manage working hours"
  ON staff_working_hours FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_staff bs
      JOIN businesses b ON b.id = bs.business_id
      WHERE bs.id = staff_id AND b.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_staff bs
      JOIN businesses b ON b.id = bs.business_id
      WHERE bs.id = staff_id AND b.owner_id = auth.uid()
    )
  );

-- Bookings policies
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    customer_id = auth.uid() OR
    EXISTS (SELECT 1 FROM businesses WHERE id = business_id AND owner_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM business_staff WHERE id = staff_id AND user_id = auth.uid())
  );

CREATE POLICY "Customers can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    customer_id = auth.uid() OR
    EXISTS (SELECT 1 FROM businesses WHERE id = business_id AND owner_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM business_staff WHERE id = staff_id AND user_id = auth.uid())
  )
  WITH CHECK (
    customer_id = auth.uid() OR
    EXISTS (SELECT 1 FROM businesses WHERE id = business_id AND owner_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM business_staff WHERE id = staff_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can delete own bookings"
  ON bookings FOR DELETE
  TO authenticated
  USING (
    customer_id = auth.uid() OR
    EXISTS (SELECT 1 FROM businesses WHERE id = business_id AND owner_id = auth.uid())
  );

-- Reviews policies
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Customers can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = customer_id AND
    EXISTS (SELECT 1 FROM bookings WHERE id = booking_id AND customer_id = auth.uid() AND status = 'completed')
  );

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = customer_id)
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = customer_id);

-- Favorites policies
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_staff_updated_at BEFORE UPDATE ON business_staff
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update business rating
CREATE OR REPLACE FUNCTION update_business_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE businesses
  SET 
    rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE business_id = NEW.business_id),
    review_count = (SELECT COUNT(*) FROM reviews WHERE business_id = NEW.business_id)
  WHERE id = NEW.business_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update business rating after review
CREATE TRIGGER update_business_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_business_rating();

-- Function to update staff rating
CREATE OR REPLACE FUNCTION update_staff_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.staff_id IS NOT NULL THEN
    UPDATE business_staff
    SET 
      rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE staff_id = NEW.staff_id),
      review_count = (SELECT COUNT(*) FROM reviews WHERE staff_id = NEW.staff_id)
    WHERE id = NEW.staff_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update staff rating after review
CREATE TRIGGER update_staff_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_staff_rating();