# ⚓ BREBERBER: Ultimate Universal SaaS Master Plan (v4.0)

## 1. STRATEJİK VİZYON & TEKNOLOJİ YIĞINI

Breberber, berber ve güzellik merkezleri için geliştirilmiş, **React Native + Expo** altyapısıyla çalışan, web ve mobil uyumlu (Universal) bir **Multi-Tenant SaaS** platformudur.

*   **Platform:** Universal (iOS, Android, Web).
*   **Core Tech:** React Native + Expo + Supabase.
*   **State Management:** Zustand (`authStore`, `businessStore`, `calendarStore`, `viewModeStore` – işletme sahibinin personel moduna geçişi için).
*   **Styling:** NativeWind (Tailwind CSS - Hızlı ve tutarlı UI).
*   **Data Handling:** Supabase RLS (Tenant izolasyonu) + Realtime (Anlık takvim güncelleme).
*   **Performance:** `@shopify/flash-list` (Mobil cihazlarda takılmayan takvim ve listeler).

---

## 2. KESİN ROL HİYERARŞİSİ (4-ROLE & CONTEXT)

Sistem, verinin kime ait olduğunu (**Tenant Context**) ve kimin neyi görebileceğini (**Role**) katı bir şekilde ayırır.

| Rol | Kapsam | Temel Sorumluluklar |
| :--- | :--- | :--- |
| **Platform Admin** (Super Admin) | Global Sistem | İşletme onayları, paket yönetimi, yasal metin (KVKK/TOS) versiyonlama. |
| **İşletme Sahibi** (Tenant Admin) | İşletme (Tenant) | Personel/Hizmet yönetimi, ciro raporları, görsel galeri kontrolü. |
| **Personel** (Staff) | Operasyonel | Kişisel takvim, 10dk slot bloklama, randevu tamamlama, ayak müşterisi girişi. |
| **Müşteri** (Customer) | Son Kullanıcı | İşletme keşfi (Filtreli), randevu alma (Kayıtsız başlama), profil & sadakat. |

---

## 3. VERİTABANI & GÜVENLİK (SUPABASE STANDARDS)

*   **10 Dakika Kuralı (DB Constraint):** `services` tablosunda `duration % 10 == 0` kontrolü veritabanı seviyesinde (Postgres CHECK) zorunludur.
*   **Soft Delete:** Tüm tablolarda `deleted_at` kolonu ile veri güvenliği sağlanır.
*   **Audit Log (JSONB):** Her değişim `old_values` ve `new_values` olarak kaydedilir.
*   **Tenant Isolation (RLS):** Hiçbir işletme diğerinin verisini (müşteri listesi dahil) göremez.
*   **Time Zone Integrity:** Tüm randevular `timestamptz` (Timezone aware) olarak saklanır.

---

## 4. TAKVİM & RANDEVU MOTORU (MHRS STYLE)

Takvim, uygulamanın kalbidir ve React Native tarafında yüksek performanslı çalışmalıdır.

*   **MHRS Slot Mantığı:** Takvim 09:00, 09:10, 09:20 gibi **10 dakikalık kesin slotlar** üzerine kuruludur.
*   **Çift Görünüm Desteği:**
    *   **Grid View:** Çok personelli işletmeler için personel sütunları (Tablet ve Web için ideal).
    *   **MHRS Style:** Tek personel odaklı 10dk liste görünüm (Mobil için varsayılan ve hızlı kullanım).
*   **Hizmet Süreleri:** Tüm hizmetler 10 dakikanın katı (10, 20, 60 dk vb.) olmalıdır.

### Renk Kodlu Operasyon

*   🟢 **Yeşil:** Onaylı randevu.
*   ⚪ **Gri:** Bloklanmış zaman (Mola/Kişisel).
*   🟠 **Turuncu:** Ayak müşterisi (Müşteri tarafında sadece "Dolu" görünür).

**Conflict Prevention:** Supabase DB trigger + RLS + uygulama katmanı çift kontrol (realtime çakışma önleyici). Aynı personele aynı slotta çakışan randevu verilmesi kesin olarak engellenir.

**Önerilen Kütüphane:** `@schedule-x/react-native` veya `react-native-big-calendar` (FlashList entegrasyonlu custom slot rendering ile 10dk hücreler).

---

## 5. SAYFA YAPISI & UX (EXPO ROUTER)

```text
app/
├── (auth)/              # Giriş, Kayıt (OTP destekli), Yasal Onaylar
├── (platform)/          # Super Admin (Global Dashboard & Onaylar)
├── (business)/          # İşletme Sahibi (Yönetim, Personel, Raporlar)
│   └── (tabs)/          # Calendar, Customers, Reports, Settings
├── (staff)/             # Personel (Kişisel Takvim & Bloklama)
│   └── (tabs)/          # My-Calendar, Performance, Profile
├── (customer)/          # Müşteri (Keşif, Rezervasyon, Geçmiş)
│   ├── home.tsx         # Şehir/İlçe/Hizmet filtreli keşif
│   └── booking/         # 3 Adımlı Guest-Booking akışı
└── (legal)/             # KVKK, TOS, Privacy sayfaları
```

---

## 6. OTOMASYON & CRM (SAAS TIERS)

Sistem, paket seviyesine göre özellik açar.

*   **WhatsApp Hatırlatma:** Silver dahil tüm paketlerde en az 1 hatırlatıcı mesaj (2 saat kala). Gold ve Platinum'da tam otomasyon.
*   **Geri Bildirim:** Randevu sonrası otomatik bildirim ve puanlama.
*   **Görsel Merkezi:** Personel portfolyoları, hizmet görselleri ve müşteri onaylı Before-After slider (Reanimated animated compare).

---

## 7. ABONELİK PAKETLERİ VE KISITLAMALAR

| Özellik | Silver (Duo) | Gold (Team) | Platinum (Pro) |
| :--- | :--- | :--- | :--- |
| **Kapasite** | 1 Sahip + 1 Personel (2) | 1 Sahip + 2 Personel (3) | 1 Sahip + 4 Personel (5) |
| **Hatırlatma** | Minimum 1 Mesaj | Tam Otomasyon | Sınırsız Senaryo |
| **Raporlar** | Temel Liste | Standart Dashboard | Gelişmiş Grafik & Analiz |
| **Ekstralar** | Temel Galeri | CRM + Galeri | Before-After + Segmentasyon |

---

## 8. YASAL UYUMLULUK (KVKK/GDPR)

*   **Zorunlu Onaylar:** Kayıt aşamasında `kvkk`, `tos` ve `marketing_allowed` onayı.
*   **Versiyonlama:** Yasal metin güncellendiğinde tüm kullanıcılardan (Admin tarafından tetiklenerek) yeniden onay alınması.
*   **Data Portability:** Müşterinin kendi verisini talep etme/silme hakkı modülü.

---

## 9. KAPSAM DIŞI (OUT OF SCOPE)

*   ❌ **Stok/Ürün Satışı:** Sadece hizmet odaklı.
*   ❌ **Online Ödeme:** Sadece ciro raporlama (Manuel giriş).
*   ❌ **Offline/PWA:** Uygulama aktif internet bağlantısı gerektirir.
*   ❌ **Takvim Sync:** Google/iCal senkronizasyonu yoktur.
*   ❌ **Multi-Branch:** Her şube bağımsız bir tenant'tır.

---

## 10. DEĞERLENDİRİLMEYEN ALANLAR (YENİ FİKİRLER)

*   💡 Personel motivasyonu için ciro dışı (puanlama bazlı) prim sistemleri.
*   💡 Müşteri tarafında "Sadık Müşteri" rozetleri.
*   💡 Erkek/Kadın salonları için dinamik renk temaları.