# 🗺️ BREBERBER: 0'dan 100'e Mükemmellik Yol Haritası

Bu doküman, **Mevcut Kod Yapısı (İskelet)** ile **UI Templates (Deri)** ve **Master Plan (Beyin)** bileşenlerini birleştirerek projeyi nihai haline getirmek için izlenecek adımdır.

> **Strateji:** "Refactor & Polish". Mevcut çalışan mantığı bozmadan, HTML şablonlarındaki tasarımı NativeWind (Tailwind) ile React Native bileşenlerine dönüştüreceğiz.

---

## 🔁 FAZ 0: Temel & Tasarım Sistemi (Foundation)
*Hedef: UI Kit'in temellerini projeye entegre etmek.*

- [ ] **Global Tema Tanımları**
    - `tailwind.config.js` güncellemesi: `ui-new` içindeki renk paleti (Gold `#d4af35`, Dark Backgrounds `#121212`, `#1E1E1E`) ve fontlar (Inter).
    - `global.css` içine custom utility sınıflarını ekle (`gold-glow`, `gradient-text`).
- [ ] **Shared UI Component Seti (Atomik)**
    - Button (Primary, Outline, Ghost) - *Referans: Giriş ekranı butonları*
    - Input & Select (Dark mode uyumlu) - *Referans: Kayıt formları*
    - Card & Container (Gradient borderlı) - *Referans: Dashboard kartları*
    - Badge & Status Chips - *Referans: Randevu durumları*
- [ ] **Layout Wrapper**
    - `components/ui/ScreenWrapper.tsx`: Tüm ekranlarda kullanılacak standart padding ve arka plan gradient yapısı.

---

## 🔐 FAZ 1: Kimlik Doğrulama & Onboarding (Auth)
*Hedef: Kullanıcıyı "Wow" etkisiyle içeri almak.*

- [ ] **Landing / Welcome**
    - *Kaynak:* `i̇şletme_onboarding_hoş_geldin_ekranı`
    - *Hedef:* `app/index.tsx`
- [ ] **Login (Giriş)**
    - *Kaynak:* `telefonla_giriş_ekranı` (Email versiyonuna uyarlanacak)
    - *Hedef:* `app/(auth)/login.tsx`
- [ ] **Register (Kayıt)**
    - *Kaynak:* `kayıt_ekranı` + `otp_doğrulama_ekranı`
    - *Hedef:* `app/(auth)/register.tsx`
- [ ] **Yasal Onaylar**
    - *Kaynak:* `kvkk_&_şartlar_ekranı`
    - *Hedef:* `app/(legal)/terms.tsx`

---

## 🏢 FAZ 2: Platform Admin (Super Admin)
*Hedef: Global kontrolü şık bir dashboard ile sağlamak.*

- [ ] **Admin Dashboard**
    - *Kaynak:* `admin_panel_dashboard`
    - *Hedef:* `app/(platform)/dashboard.tsx`
    - *Özellik:* KPI Kartları, Gelir Grafiği (Reanimated Chart), Son Başvurular.
- [ ] **İşletme Listesi & Onay**
    - *Kaynak:* `i̇şletme_onay_kuyruğu_ekranı`
    - *Hedef:* `app/(platform)/tenants/index.tsx`
- [ ] **Audit & Logs**
    - *Kaynak:* `denetim_kayıtları_ekranı`
    - *Hedef:* `app/(platform)/audit.tsx`

---

## ✂️ FAZ 3: İşletme Sahibi Deneyimi (Tenant Admin)
*Hedef: İşletme sahibine profesyonel bir yönetim aracı sunmak.*

- [ ] **Business Dashboard**
    - *Kaynak:* `i̇şletme_sahibi_dashboard_ekranı`
    - *Hedef:* `app/(business)/(tabs)/dashboard.tsx`
- [ ] **Personel Yönetimi**
    - *Kaynak:* `personel_yönetimi_ekranı` + `personel_ekle`
    - *Hedef:* `app/(business)/(tabs)/staff/index.tsx`
- [ ] **Hizmet Yönetimi**
    - *Kaynak:* `hizmetler_sekmesi_ekranı` + `hizmet_düzenleyici_ekranı`
    - *Hedef:* `app/(business)/(tabs)/services.tsx`
- [ ] **Galeri & Profil**
    - *Kaynak:* `galeri_yönetim_ekranı` + `i̇şletme_bilgileri_ekranı`
    - *Hedef:* `app/(business)/settings/gallery.tsx`
- [ ] **Finans & Raporlar**
    - *Kaynak:* `gelir_raporları_ekranı`
    - *Hedef:* `app/(business)/finance.tsx`

---

## 📅 FAZ 4: Operasyon & Takvim (Heart of the App)
*Hedef: Kusursuz randevu yönetimi.*

- [ ] **Takvim Görünümü (Business/Staff)**
    - *Kaynak:* `akıllı_takvim_ekranı` + `personel_takvimi_görüntüleme`
    - *Hedef:* `app/(business)/(tabs)/calendar.tsx`
    - *Teknik:* FlashList tabanlı, 10dk slot mantığı.
- [ ] **Randevu Detay & İşlem**
    - *Kaynak:* `randevu_detay_ekranı`
    - *Hedef:* `components/calendar/AppointmentModal.tsx`

---

## 📱 FAZ 5: Müşteri Deneyimi (B2C)
*Hedef: Kolay keşif ve hızlı randevu.*

- [ ] **Keşfet (Home)**
    - *Kaynak:* `keşfet_ana_ekranı` + `arama_sonuçları_ekranı`
    - *Hedef:* `app/(customer)/home.tsx`
- [ ] **İşletme Detay**
    - *Kaynak:* `salon_detay_ekranı` + `hizmet_seçim_ekranı` + `personel_seçim_ekranı`
    - *Hedef:* `app/(customer)/book/[id].tsx`
- [ ] **Randevu Akışı (Booking Wizard)**
    - *Kaynak:* `randevu_özeti_ekranı` + `randevu_onay_ekranı`
    - *Hedef:* `app/(customer)/book/confirmation.tsx`
- [ ] **Profil & Randevularım**
    - *Kaynak:* `randevularım_ekranı` + `müşteri_profil_ekranı`
    - *Hedef:* `app/(customer)/profile.tsx`

---

## ⚙️ FAZ 6: Eksik Parçalar & Bağlantılar (Gaps)
*Hedef: UI Kit'te olmayan ama Master Plan'da olanların tasarlanması.*

- [ ] **Mod Değişimi (View Mode Switcher)**
    - *Tasarım:* Ayarlar menüsüne entegre edilmiş şık bir toggle kartı.
    - *Konum:* `SettingsShell.tsx` içine eklenecek.
- [ ] **10 Dk Kuralı Enforcement**
    - Backend constraint'i karşılayacak frontend validasyonları.
- [ ] **Boş Durumlar (Empty States)**
    - Veri yokken gösterilecek şık ilustrasyonlu uyarılar.

---

## 🚀 FAZ 7: Final Polish & Optimization
- [ ] **Animasyonlar:** Sayfa geçişleri ve liste yükleme animasyonları (Lottie/Reanimated).
- [ ] **Loading States:** Skeleton ekranlar (UI Kit'teki layoutlara uygun).
- [ ] **Form Validasyonları:** Zod + React Hook Form entegrasyonu.
