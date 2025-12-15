# Breberber Scripts Rehberi

Bu klasördeki scriptler ve kullanım amaçları:

## 📦 Seed (Veri Oluşturma)

| Script | Açıklama | Kullanım |
|--------|----------|----------|
| `seed_00_clean.ts` | Tüm verileri temizler | `npx ts-node scripts/seed_00_clean.ts` |
| `seed_01_businesses.ts` | İşletme + Personel oluşturur | `npx ts-node scripts/seed_01_businesses.ts` |
| `seed_03_customers.ts` | Müşteri hesapları oluşturur | `npx ts-node scripts/seed_03_customers.ts` |
| `seed_04_bookings.ts` | Örnek randevular oluşturur | `npx ts-node scripts/seed_04_bookings.ts` |
| `seed_database.ts` | Tüm seed'leri sırayla çalıştırır | `npx ts-node scripts/seed_database.ts` |

## 🔧 Utility (Yardımcı)

| Script | Açıklama |
|--------|----------|
| `create_auth_users_for_staff.ts` | Personeller için Auth hesabı oluşturur |
| `link_staff_users.ts` | business_staff.user_id ile Auth'u bağlar |
| `check_staff_auth.ts` | Personel Auth durumunu kontrol eder |
| `find_staff.ts` | Belirli işletmenin personellerini listeler |
| `export_schema.ts` | Veritabanı şemasını konsola yazdırır |

## 🗄️ Storage

| Script | Açıklama |
|--------|----------|
| `setup_storage.ts` | Storage bucket'ları oluşturur |
| `setup_storage.js` | Storage kurulum (JS versiyonu) |
| `setup_storage.sql` | Storage SQL kurulumu |
| `setup_storage_sdk.js` | SDK ile storage kurulum |

## 🚀 Tam Kurulum Sırası

```bash
# 1. Veritabanını temizle (opsiyonel)
npx ts-node scripts/seed_00_clean.ts

# 2. İşletmeleri oluştur
npx ts-node scripts/seed_01_businesses.ts

# 3. Müşterileri oluştur  
npx ts-node scripts/seed_03_customers.ts

# 4. Personel Auth hesaplarını oluştur
npx ts-node scripts/create_auth_users_for_staff.ts

# 5. Staff <-> Auth bağlantısını kur
npx ts-node scripts/link_staff_users.ts

# 6. Örnek randevular oluştur
npx ts-node scripts/seed_04_bookings.ts
```

## 📋 Şema Dosyası

Ana veritabanı şeması: `supabase/schema.sql`

Bu dosya canlı veritabanından dışa aktarılmış güncel yapıyı içerir.
