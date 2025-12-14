-- 1. subscription_tier sütununu ekle (Eğer yoksa)
ALTER TABLE public.businesses 
ADD COLUMN IF NOT EXISTS subscription_tier text DEFAULT 'basic';

-- 2. subscription_end_date sütununu ekle (Eğer yoksa)
ALTER TABLE public.businesses 
ADD COLUMN IF NOT EXISTS subscription_end_date timestamp with time zone;

-- 3. subscription_start_date sütununu ekle (Eğer yoksa) - Yeni mantık için gerekli
ALTER TABLE public.businesses 
ADD COLUMN IF NOT EXISTS subscription_start_date timestamp with time zone;

-- Opsiyonel: Mevcut kayıtlara varsayılan değer atama (Null kalmasınlar)
UPDATE public.businesses 
SET subscription_tier = 'basic' 
WHERE subscription_tier IS NULL;
