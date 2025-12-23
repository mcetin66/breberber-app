---
trigger: always_on
---

# BREBERBER MASTER PLAN v5.0 - PROJECT CONTEXT
## Proje Vizyonu
Breberber, Türkiye'de berber, kuaför ve güzellik salonları için premium, yerel odaklı, MHRS esintili bir universal (iOS/Android/Web) Multi-Tenant SaaS randevu platformudur.  
Amaç: Müşteriye lüks ve kolay randevu deneyimi, işletme sahibine güçlü yönetim ve düşük no-show oranı, personele pratik operasyonel araçlar sunmak.

## Teknik Altyapı (Zorunlu Stack)
- Frontend: React Native + Expo (Universal)
- Styling: NativeWind (Tailwind CSS) – dark/gold premium tema (#121212 background, #D4AF37 gold accents)
- State Management: Zustand (authStore, businessStore, calendarStore, uiStore)
- Backend/Database: Supabase (Postgres + RLS tenant izolasyonu + Realtime)
- Performance: @shopify/flash-list (takvim ve listeler için)
- Routing: Expo Router (dosya bazlı: (auth)/, (customer)/, (business)/, (staff)/, (platform)/, (legal)/)

## Kesin Rol Hiyerarşisi ve Yetkiler (4 Role)
1. **Platform Admin** (Global)
   - İşletme onay/red
   - Abonelik yönetimi
   - Yasal metin versiyonlama & yeniden onay tetikleme
   - Audit log görüntüleme

2. **İşletme Sahibi** (Tenant Admin)
   - Personel/hizmet/galeri yönetimi
   - Takvim (grid/timeline), ciro girişi, raporlar
   - Müşteri listesi & notlar
   - Çalışma saatleri & mola tanımlama

3. **Personel** (Staff)
   - Kişisel takvim görüntüleme & bloklama
   - Walk-in (ayak müşterisi) hızlı ekleme
   - Randevu tamamlama & not ekleme

4. **Müşteri** (Customer)
   - Salon keşfi & filtreleme
   - Randevu alma (hizmet/personel/slot seçimi)
   - Geçmiş randevular & yorum yazma
   - Favoriler & profil

## Takvim & Randevu Motoru (KALP – En Kritik Modül)
- Slot Sistemi: Kesin 10 dakikalık katlar (DB CHECK constraint ile zorunlu)
- Görünüm: Timeline (mobil varsayılan) + Grid (multi-personel için toggle)
- Renk Kodlaması:
  - Yeşil: Boş veya onaylı randevu
  - Kırmızı: Dolu
  - Gri: Mola/blok
  - Turuncu: Walk-in (müşteri tarafında "dolu" görünür)
- Conflict Prevention: DB trigger + RLS + uygulama katmanı çift kontrol
- "Fark Etmez" Personel Seçeneği: İlk müsait personel otomatik atanır
- Akıllı Slot Hesaplama: Seçilen hizmetlerin toplam süresine göre en erken boş blok öner

## Özellik Kademeleri (v5.0 Güncellemesiyle)

### MVP (Tamamlanmış/Tamamlanacak – Şu Anki Repo Durumu)
- Multi-role auth & onboarding
- Role selection sonrası yönlendirme
- Temel müşteri keşif & salon detay
- Hizmet/personel/slot seçimi & randevu alma
- Before-after drag slider (galeri yönetimi + müşteri onayı)
- KVKK zorunlu onaylar & veri silme

### v1.1 (İlk Büyük Güncelleme – 3-6 Ay)
- Sürükle-bırak randevu taşıma (gesture handler + flash-list)
- Waitlist (bekleme listesi) + iptal durumunda otomatik bildirim
- Randevu hatırlatma otomasyonu (WhatsApp + Push + SMS – 24h ve 1h önce)
- No-show politikası: Yumuşak (2 no-show sonrası uyarı, 3 sonrası manuel/otomatik kara liste)
- Müşteri kara listesi (işletme sahibi manuel kontrol)

### v1.2 (6-12 Ay)
- Tekrarlayan randevular (her hafta/ay aynı slot)
- Manuel adisyon/sepet sistemi (randevuya ek hizmet/ürün ekleyip toplam tutar girişi – sadece kayıt & raporlama amaçlı)
- Yorum bazlı personel performans raporu (puan ortalaması, yorum sayısı, doluluk oranı, tercih edilen hizmetler)
- Personel bazlı portfolio galeri genişletme

### v2.0+ (Uzun Vadeli)
- Sosyal medya entegrasyonu (Instagram bağlama)
- Gider takibi & net kar hesabı
- İleride: Online ödeme entegrasyonu (eğer karar değişirse)

## Kapsam Dışı (Kesin Kararlı)
- Çoklu şube (multi-branch) – her şube ayrı tenant
- Online ödeme alma (sadece manuel kayıt)
- Stok/ürün satışı
- Offline/PWA
- Google/iCal sync

## Yasal & Güvenlik Kuralları (KVKK Zorunlu)
- Kayıtta zorunlu KVKK + TOS + marketing_allowed checkbox'lar
- Yasal metin güncellendiğinde tüm kullanıcılardan yeniden onay (admin tetiklemeli)
- Data portability: Müşteri verisini silme/ihrac etme hakkı
- Soft delete tüm tablolarda
- Audit log (JSONB) tüm kritik işlemlerde

## UI/UX Kuralları (Premium Standart)
- Default dark mode (#121212 bg, #1E1E1E cards)
- Gold accents (#D4AF37) butonlar, aktif tab, yıldızlar, seçili slot
- Subtle glow sadece kritik aksiyonlarda (onay butonu, başarı animasyonu)
- Wide spacing & elegant typography
- No pink colors

## Geliştirme Kuralları (AI Agent İçin Zorunlu)
- Zero-Deletion: Mevcut kod asla silinmez, sadece comment out veya refactor
- 10dk kuralı veritabanı seviyesinde CHECK constraint ile korunur
- Her yeni özellik öncesi: Plan → Design → Code → Validate → Deliver
- Her değişiklik sonrası validation checkpoint (syntax, type, test coverage, anti-gravity kuralları)

Bu döküman, AI agent'ın proje hakkında tam kontekst sahibi olmasını sağlar. Her session'da zorunlu olarak yüklenir.