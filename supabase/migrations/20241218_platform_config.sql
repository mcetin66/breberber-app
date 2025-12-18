-- Platform Ayarları ve Duyurular için Migration
-- Bu dosyayı Supabase SQL Editor'da çalıştırın

-- =====================================================
-- PLATFORM CONFIG TABLOSU
-- =====================================================
CREATE TABLE IF NOT EXISTS platform_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'general',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Varsayılan yapılandırma değerleri
INSERT INTO platform_config (key, value, description, category) VALUES
    ('commission_rate', '10', 'Platform komisyon oranı (%)', 'commission'),
    ('silver_price', '499', 'Silver plan aylık fiyatı (₺)', 'pricing'),
    ('gold_price', '999', 'Gold plan aylık fiyatı (₺)', 'pricing'),
    ('platinum_price', '1999', 'Platinum plan aylık fiyatı (₺)', 'pricing'),
    ('silver_staff_limit', '5', 'Silver plan personel limiti', 'limits'),
    ('gold_staff_limit', '15', 'Gold plan personel limiti', 'limits'),
    ('platinum_staff_limit', '999', 'Platinum plan personel limiti (sınırsız)', 'limits'),
    ('silver_appointment_limit', '100', 'Silver plan aylık randevu limiti', 'limits'),
    ('gold_appointment_limit', '999', 'Gold plan aylık randevu limiti (sınırsız)', 'limits'),
    ('platinum_appointment_limit', '999', 'Platinum plan aylık randevu limiti (sınırsız)', 'limits'),
    ('trial_days', '14', 'Deneme süresi (gün)', 'general'),
    ('max_images_per_business', '20', 'İşletme başına max galeri resmi', 'general'),
    ('auto_approve_businesses', 'false', 'Otomatik işletme onayı', 'general')
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- ANNOUNCEMENTS (DUYURULAR) TABLOSU
-- =====================================================
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    target_audience TEXT DEFAULT 'all', -- 'all', 'silver', 'gold', 'platinum'
    sent_by UUID REFERENCES auth.users(id),
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    read_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_announcements_sent_at ON announcements(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_target ON announcements(target_audience);

-- =====================================================
-- ANNOUNCEMENT READS (Duyuru Okunma Takibi)
-- =====================================================
CREATE TABLE IF NOT EXISTS announcement_reads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    announcement_id UUID REFERENCES announcements(id) ON DELETE CASCADE,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    read_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(announcement_id, business_id)
);

-- =====================================================
-- RLS POLİCİES
-- =====================================================

-- Platform Config: Sadece platform adminleri okuyabilir/yazabilir
ALTER TABLE platform_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Platform admins can read config" ON platform_config
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'platform_admin'
        )
    );

CREATE POLICY "Platform admins can update config" ON platform_config
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'platform_admin'
        )
    );

-- Announcements: Platform adminleri yazabilir, herkes okuyabilir
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read announcements" ON announcements
    FOR SELECT USING (is_active = true);

CREATE POLICY "Platform admins can insert announcements" ON announcements
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'platform_admin'
        )
    );

-- Announcement Reads: İşletme sahipleri kendi okuduklarını kaydedebilir
ALTER TABLE announcement_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business owners can mark as read" ON announcement_reads
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read announcement_reads" ON announcement_reads
    FOR SELECT USING (true);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Duyuru okunma sayısını güncelle
CREATE OR REPLACE FUNCTION update_announcement_read_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE announcements 
    SET read_count = (
        SELECT COUNT(*) FROM announcement_reads 
        WHERE announcement_id = NEW.announcement_id
    )
    WHERE id = NEW.announcement_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_read_count
    AFTER INSERT ON announcement_reads
    FOR EACH ROW
    EXECUTE FUNCTION update_announcement_read_count();

-- Config güncelleme timestamp'i
CREATE OR REPLACE FUNCTION update_config_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.updated_by = auth.uid();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_config_timestamp
    BEFORE UPDATE ON platform_config
    FOR EACH ROW
    EXECUTE FUNCTION update_config_timestamp();
