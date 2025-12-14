-- Supabase Storage Bucket ve Policy Kurulumu
-- Bu SQL'i Supabase Dashboard > SQL Editor'de çalıştırın

-- 1. Bucket oluştur (eğer yoksa)
INSERT INTO storage.buckets (id, name, public)
VALUES ('app-media', 'app-media', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Public Access Policy (Herkes okuyabilir)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'app-media' );

-- 3. Authenticated Upload Policy (Giriş yapmış kullanıcılar yükleyebilir)
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK ( 
  bucket_id = 'app-media' 
  AND auth.role() = 'authenticated' 
);

-- 4. Update Policy (Kendi dosyalarını güncelleyebilir)
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
USING ( 
  bucket_id = 'app-media' 
  AND auth.role() = 'authenticated' 
);

-- 5. Delete Policy (Kendi dosyalarını silebilir)
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING ( 
  bucket_id = 'app-media' 
  AND auth.role() = 'authenticated' 
);
