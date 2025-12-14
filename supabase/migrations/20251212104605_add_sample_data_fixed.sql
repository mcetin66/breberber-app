/*
  # Add Sample Data

  ## Overview
  Populates the database with sample data for testing and development.

  ## Data Added
  
  ### 1. Service Categories
    - Saç Kesimi
    - Sakal Tıraşı
    - Cilt Bakımı
    - Masaj

  ### 2. Sample Businesses
    - 3 sample barbershop businesses in different cities
    - Each with logo, cover image, and contact information

  ### 3. Sample Staff
    - Multiple staff members for each business
    - Each with ratings and bio

  ### 4. Sample Services
    - Various services for each business
    - Different prices and durations

  ### 5. Working Hours
    - Standard working hours for each staff member
*/

-- Insert service categories
INSERT INTO service_categories (name, icon, display_order) VALUES
  ('Saç Kesimi', 'Scissors', 1),
  ('Sakal Tıraşı', 'Razor', 2),
  ('Cilt Bakımı', 'Sparkles', 3),
  ('Masaj', 'Hand', 4)
ON CONFLICT (name) DO NOTHING;

-- Insert businesses
INSERT INTO businesses (name, description, address, city, phone, email, logo_url, cover_url, rating, review_count, latitude, longitude, is_active)
VALUES
  (
    'Elite Berber Salonu',
    'İstanbul''un en prestijli berber salonu. Modern ekipman ve deneyimli ekibimizle hizmetinizdeyiz.',
    'Bağdat Caddesi No:123, Kadıköy',
    'İstanbul',
    '0212 555 0101',
    'info@eliteberber.com',
    'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=800',
    4.8,
    156,
    40.9858,
    29.0316,
    true
  ),
  (
    'Modern Tarz Kuaför',
    'Ankara''da modern ve şık saç tasarımları. Profesyonel ekibimizle her zaman yanınızdayız.',
    'Tunalı Hilmi Caddesi No:45, Çankaya',
    'Ankara',
    '0312 555 0202',
    'iletisim@moderntarz.com',
    'https://images.pexels.com/photos/1570807/pexels-photo-1570807.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1570807/pexels-photo-1570807.jpeg?auto=compress&cs=tinysrgb&w=800',
    4.6,
    89,
    39.9208,
    32.8541,
    true
  ),
  (
    'Klasik Berber',
    'İzmir''in köklü berberi. Geleneksel ustalık ve modern tekniklerle hizmet veriyoruz.',
    'Alsancak, 1482 Sokak No:67, Konak',
    'İzmir',
    '0232 555 0303',
    'info@klasikberber.com',
    'https://images.pexels.com/photos/1805600/pexels-photo-1805600.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1805600/pexels-photo-1805600.jpeg?auto=compress&cs=tinysrgb&w=800',
    4.7,
    124,
    38.4189,
    27.1287,
    true
  )
ON CONFLICT DO NOTHING;

DO $$
DECLARE
  cat_sac_id uuid;
  cat_sakal_id uuid;
  cat_cilt_id uuid;
  cat_masaj_id uuid;
  
  biz1_id uuid;
  biz2_id uuid;
  biz3_id uuid;
BEGIN
  -- Get category IDs
  SELECT id INTO cat_sac_id FROM service_categories WHERE name = 'Saç Kesimi';
  SELECT id INTO cat_sakal_id FROM service_categories WHERE name = 'Sakal Tıraşı';
  SELECT id INTO cat_cilt_id FROM service_categories WHERE name = 'Cilt Bakımı';
  SELECT id INTO cat_masaj_id FROM service_categories WHERE name = 'Masaj';

  -- Get business IDs
  SELECT id INTO biz1_id FROM businesses WHERE name = 'Elite Berber Salonu' LIMIT 1;
  SELECT id INTO biz2_id FROM businesses WHERE name = 'Modern Tarz Kuaför' LIMIT 1;
  SELECT id INTO biz3_id FROM businesses WHERE name = 'Klasik Berber' LIMIT 1;

  -- Insert staff for business 1
  IF NOT EXISTS (SELECT 1 FROM business_staff WHERE business_id = biz1_id) THEN
    INSERT INTO business_staff (business_id, name, title, avatar_url, bio, rating, review_count, is_active)
    VALUES
      (
        biz1_id,
        'Ahmet Yılmaz',
        'Usta Berber',
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
        '15 yıllık tecrübe. Klasik ve modern saç kesimi konusunda uzman.',
        4.9,
        78,
        true
      ),
      (
        biz1_id,
        'Mehmet Kaya',
        'Saç Tasarımcısı',
        'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=200',
        'Modern saç tasarımları ve renklendirme uzmanı. 10 yıllık deneyim.',
        4.7,
        65,
        true
      );
  END IF;

  -- Insert staff for business 2
  IF NOT EXISTS (SELECT 1 FROM business_staff WHERE business_id = biz2_id) THEN
    INSERT INTO business_staff (business_id, name, title, avatar_url, bio, rating, review_count, is_active)
    VALUES
      (
        biz2_id,
        'Can Demir',
        'Stil Danışmanı',
        'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=200',
        'Modern tarzlar ve trend saç modelleri konusunda uzman.',
        4.8,
        52,
        true
      ),
      (
        biz2_id,
        'Emre Çelik',
        'Berber',
        'https://images.pexels.com/photos/1222269/pexels-photo-1222269.jpeg?auto=compress&cs=tinysrgb&w=200',
        'Sakal tıraşı ve cilt bakımı konusunda 8 yıllık deneyim.',
        4.6,
        41,
        true
      );
  END IF;

  -- Insert staff for business 3
  IF NOT EXISTS (SELECT 1 FROM business_staff WHERE business_id = biz3_id) THEN
    INSERT INTO business_staff (business_id, name, title, avatar_url, bio, rating, review_count, is_active)
    VALUES
      (
        biz3_id,
        'Mustafa Öz',
        'Usta Berber',
        'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=200',
        'Geleneksel usul tıraş ve saç kesimi. 20 yıllık tecrübe.',
        4.9,
        98,
        true
      ),
      (
        biz3_id,
        'Burak Arslan',
        'Berber',
        'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=200',
        'Çağdaş teknikler ve klasik ustalık birleşimi.',
        4.7,
        73,
        true
      );
  END IF;

  -- Insert services for business 1
  IF NOT EXISTS (SELECT 1 FROM services WHERE business_id = biz1_id) THEN
    INSERT INTO services (business_id, category_id, name, description, duration_minutes, price, is_active)
    VALUES
      (biz1_id, cat_sac_id, 'Klasik Saç Kesimi', 'Kişiye özel saç kesimi ve şekillendirme', 45, 150, true),
      (biz1_id, cat_sac_id, 'Komple Bakım', 'Saç kesimi + Yıkama + Şekillendirme', 60, 200, true),
      (biz1_id, cat_sakal_id, 'Sakal Düzenleme', 'Sakal kesim ve şekillendirme', 30, 100, true),
      (biz1_id, cat_sakal_id, 'Ustura Tıraşı', 'Geleneksel ustura ile tıraş', 45, 150, true),
      (biz1_id, cat_cilt_id, 'Yüz Maskesi', 'Cilt tipine özel maske uygulaması', 30, 120, true);
  END IF;

  -- Insert services for business 2
  IF NOT EXISTS (SELECT 1 FROM services WHERE business_id = biz2_id) THEN
    INSERT INTO services (business_id, category_id, name, description, duration_minutes, price, is_active)
    VALUES
      (biz2_id, cat_sac_id, 'Modern Kesim', 'Trend saç modelleri ve kesim', 50, 180, true),
      (biz2_id, cat_sac_id, 'Saç Boyama', 'Profesyonel saç boyama hizmeti', 90, 350, true),
      (biz2_id, cat_sakal_id, 'Sakal Bakımı', 'Sakal kesim, şekillendirme ve bakım', 40, 120, true),
      (biz2_id, cat_cilt_id, 'Cilt Bakımı', 'Detaylı yüz temizliği ve bakım', 45, 180, true);
  END IF;

  -- Insert services for business 3
  IF NOT EXISTS (SELECT 1 FROM services WHERE business_id = biz3_id) THEN
    INSERT INTO services (business_id, category_id, name, description, duration_minutes, price, is_active)
    VALUES
      (biz3_id, cat_sac_id, 'Geleneksel Kesim', 'Klasik berber usulü saç kesimi', 40, 130, true),
      (biz3_id, cat_sac_id, 'Saç + Sakal', 'Komple saç ve sakal bakımı', 60, 180, true),
      (biz3_id, cat_sakal_id, 'Köpük Tıraşı', 'Sıcak havlu ve köpük ile tıraş', 35, 100, true),
      (biz3_id, cat_masaj_id, 'Yüz Masajı', 'Rahatlatıcı yüz ve baş masajı', 25, 80, true);
  END IF;

  -- Insert working hours for all staff (Monday to Saturday, 09:00-18:00)
  IF NOT EXISTS (SELECT 1 FROM staff_working_hours LIMIT 1) THEN
    INSERT INTO staff_working_hours (staff_id, day_of_week, start_time, end_time, is_available)
    SELECT 
      s.id,
      d.day,
      '09:00'::time,
      '18:00'::time,
      true
    FROM business_staff s
    CROSS JOIN (VALUES (1), (2), (3), (4), (5), (6)) AS d(day)
    WHERE s.business_id IN (biz1_id, biz2_id, biz3_id);
  END IF;

  -- Assign all services to all staff in their respective businesses
  IF NOT EXISTS (SELECT 1 FROM staff_services LIMIT 1) THEN
    INSERT INTO staff_services (staff_id, service_id)
    SELECT 
      s.id,
      srv.id
    FROM business_staff s
    JOIN services srv ON srv.business_id = s.business_id;
  END IF;

END $$;