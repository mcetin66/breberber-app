# PROJECT_CONTEXT.md - Breberber Proje Bağlamı

> Bu dosya Breberber projesine özel iş kurallarını, veritabanı yapısını ve tasarım kararlarını içerir.
> Universal Engine kuralları ile birlikte çalışır.

---

## 📋 Proje Bilgileri

### Proje Adı
**Breberber (Universal SaaS Platform)**

### Vizyon
Türkiye genelindeki berber, kuaför ve güzellik merkezleri için geliştirilmiş, React Native + Expo tabanlı, çok kiracılı (multi-tenant) bir SaaS platformudur. Sadece hizmet ve randevu yönetimine odaklanır; stok veya ürün satışı yapmaz. Amacı, işletmelere dijital bir işletim sistemi sunarken, son kullanıcılara (müşterilere) sürtünmesiz ve hızlı bir randevu deneyimi yaşatmaktır.

---

## 👥 Roller ve Yetkilendirme

### Rol Hiyerarşisi

| Rol | Yetkiler | Erişim Kapsamı |
|-----|----------|----------------|
| **Platform Admin** | Sistem geneli onay, paket yönetimi, yasal metin güncelleme. | Global (Tüm Tenantlar) |
| **İşletme Sahibi** | Personel, hizmet, galeri yönetimi, ciro raporları. | Sadece Kendi Tenant'ı |
| **Çalışan (Staff)** | Kendi takvimini yönetme, vakit bloklama, işlem tamamlama. | Kendi Tenant'ı + Kendi Verisi |
| **Müşteri** | İşletme keşfi, randevu alma, profil ve sadakat takibi. | Genel Keşif + Kendi Verisi |

---

## 📊 Veritabanı (Supabase)

### Ana Tablolar ve Güvenlik

| Tablo | Açıklama | RLS (Row Level Security) |
|-------|----------|-------------------------|
| `tenants` | İşletme profilleri ve ayarları | ✅ (Tenant ID) |
| `staff_profiles` | Çalışan detayları ve yetkinlikleri | ✅ (Tenant ID) |
| `services` | Hizmet tanımları (Süre: 10'un katı) | ✅ (Tenant ID) |
| `appointments` | Randevu kayıtları ve durumları | ✅ (Tenant ID + User ID) |
| `user_consents` | KVKK ve TOS onay versiyonları | ✅ (User ID) |
| `audit_logs` | İşlem geçmişi (Eski/Yeni değer JSONB) | ✅ (Admin Only) |

---

## 📏 İş Kuralları (Business Logic)

### Kritik Kurallar
- [x] **10 Dakika Kuralı:** Tüm hizmet süreleri ve randevu aralıkları 10 dakikanın katı (10, 20, 30...) olmak zorundadır.
- [x] **Paket Limitleri:**
    - **Silver:** Maksimum 2 Personel (1 Sahip + 1 Çalışan).
    - **Gold:** Maksimum 3 Personel.
    - **Platinum:** Maksimum 5 Personel.
- [x] **Ödeme Yok:** Uygulama içi kredi kartı/ödeme alınmaz. Fiyat sadece raporlama için girilir.
- [x] **Çakışma Kontrolü:** Aynı personele, aynı zaman diliminde (10dk slot) ikinci randevu verilemez (DB Trigger + App Logic).
- [x] **Ayak Müşterisi:** Personel, randevusuz gelen müşteri için takvimde ilgili slotu "Dolu" olarak işaretler (Müşteri detay görmez).

### Renk Kodları (Takvim Durumları)

| Durum | Renk (Tailwind/Hex) | Anlamı |
|-------|---------------------|--------|
| **Müsait** | `bg-white` | Boş zaman dilimi |
| **Randevu** | `bg-green-100` / `#DCFCE7` | Onaylanmış müşteri randevusu |
| **Blok/Mola** | `bg-gray-200` / `#E5E7EB` | Personel molası veya kapalılık |
| **Ayak Müşterisi** | `bg-orange-100` / `#FFEDD5` | Randevusuz işlem (Dışarıya 'Dolu' görünür) |

---

## 🔐 Güvenlik ve Uyumluluk

### KVKK / GDPR
- [x] **Zorunlu Onay:** Kayıt sırasında KVKK, TOS ve Pazarlama İzni checkbox'ları zorunludur.
- [x] **Versiyonlama:** Yasal metin değiştiğinde sistem kullanıcıyı "Yeniden Onay" ekranına zorlar.
- [x] **Veri İzolasyonu:** Bir şubenin verisi asla başka bir şube ile paylaşılmaz (Multi-branch olsa bile).

---

## 🎨 UI/UX Kararları (NativeWind)

### Tema ve Stil
*   **Primary:** Koyu Gri / Siyah (`bg-slate-900`) - Premium hissi.
*   **Secondary:** Altın Sarısı / Bronz (`text-amber-500`) - Vurgular ve CTA butonları.
*   **Font:** Inter (Sistem fontu), Başlıklar için opsiyonel Serif.

### Özel Bileşenler
- **Smart Calendar:** Hem Grid (Personel sütunları) hem MHRS (Dikey liste) görünümü.
- **Before-After Slider:** `react-native-reanimated` ile yapılan, parmakla kaydırılan karşılaştırma bileşeni.
- **FlashList:** Tüm listeler `@shopify/flash-list` performans bileşeni ile kurulur.

---

## 📝 Notlar ve Kısıtlamalar

- **Offline Mod Yok:** Uygulama aktif internet bağlantısı gerektirir (PWA kapsam dışı).
- **Google Calendar Sync Yok:** Dış takvim entegrasyonu MVP kapsamındadır.
- **Form Yönetimi:** React Hook Form + Zod zorunludur.
- **State Yönetimi:** Zustand (auth, calendar, business store) zorunludur.

**Son Güncelleme:** 21.12.2025 (Master Plan v4.0 Uyumlu)
