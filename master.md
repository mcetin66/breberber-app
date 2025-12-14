# Kuaför Randevu – FULL MASTER (Blueprint + Orijinal Master Prompt)

> Bu dosya, **Blueprint (mapping + kurallar)** ile **orijinal master.md promptunu** tek yerde birleştirir. Bolt/AI’ye tek dosya verilecekse **bu dosya** kullanılmalıdır.

---

## 0. Blueprint (Mapping + Kurallar)

Aşağıdaki bölüm, **React Native + Expo** ile geliştirilecek **Müşteri + Berber (Business) + Admin (PlatformOwner)** rollerine sahip kuaför randevu uygulamasının:

* Teknik mimarisini,
* Rol / route / ekran eşleşmelerini,
* Zustand store yapısını,
* Çoklu berber (multi-tenant) modelini,
* Test, hata yönetimi ve performans notlarını

ve **Stitch ile tasarlanmış 21 adet ekran prototipinin** mapping’ini içerir.

`menu.html` bu dokümanın bir **ek görsel referansı** olarak düşünülmelidir:

* Kod üretirken **asıl kaynak** bu `full-master.md`,
* Stitch HTML tasarımları (21 ekran) ise `menu.html` içinde **görsel tasarım referansı** olarak kullanılır.

---

## 1. DOSYA VE EKRAN HARİTASI (full-master.md ↔ menu.html ↔ Expo Router)

### 1.1. menu.html Template ID’leri

`menu.html` içinde her Stitch ekranı şu formatta saklanır:

```html
<!-- ============================
   SCREEN: Role Selection
   ROLE: anonymous (henüz login değil)
   ROUTE: / (app/index.tsx)
   SOURCE: stitch_role_selection/role_selection/code.html
============================= -->
<template id="screen-role-selection">
  <!-- Buraya orijinal code.html içeriği yapıştırılacak -->
</template>
```

Benzer şekilde 21 ekran için aşağıdaki ID’ler kullanılır:

* `screen-role-selection`
* `screen-auth-login`
* `screen-auth-register`
* `screen-business-sub-role`
* `screen-customer-home`
* `screen-barber-list`
* `screen-barber-detail`
* `screen-staff-and-services`
* `screen-available-slots`
* `screen-booking-summary`
* `screen-booking-success`
* `screen-customer-profile`
* `screen-business-dashboard`
* `screen-business-appointments`
* `screen-business-staff`
* `screen-business-services`
* `screen-business-finance`
* `screen-staff-dashboard`
* `screen-admin-dashboard`
* `screen-admin-barber-list`
* `screen-admin-barber-detail`
* `screen-admin-new-barber`

> Not: Gerçek Stitch klasör isimleri (örneğin `müşteri_profil`, `randevu_yönetimi`, `berber_listesi`, `i̇şletme_kontrol_paneli`, `personel_yönetimi` vb.) ilgili template yorumlarında ayrıca belirtilecektir.
>
> **Encoding Uyarısı (ZORUNLU):** Türkçe/özel karakterli klasör adlarını (örn. `i̇` / `ş` / `ğ`) koda dosya yolu olarak **birebir taşımayın**. `menu.html` içinde SOURCE yorumlarında kalabilir; ama proje içi path/route/ID’ler yalnızca **ASCII** olmalıdır (örn. `isletme_kontrol_paneli`).

---

### 1.2. Role → Route → menu.html Template Mapping

| Role / SubRole        | Expo Router Route                 | menu.html Template ID          | Stitch Kaynak Örneği                       | Açıklama                  |
| --------------------- | --------------------------------- | ------------------------------ | ------------------------------------------ | ------------------------- |
| anonymous             | `/` (app/index.tsx)               | `screen-role-selection`        | `role_selection/code.html` (varsayılan)    | İlk giriş, role selection |
| anonymous / all       | `/(auth)/login.tsx`               | `screen-auth-login`            | `auth_-_login/code.html`                   | Giriş ekranı              |
| anonymous / all       | `/(auth)/register.tsx`            | `screen-auth-register`         | `auth_-_register/code.html`                | Üyelik ekranı             |
| business (no subRole) | `/business-role`                  | `screen-business-sub-role`     | `business_sub-role_selection/code.html`    | Owner vs Staff seçimi     |
| customer              | `/(customer)/home.tsx`            | `screen-customer-home`         | `customer_home_screen/code.html`           | Müşteri ana ekranı        |
| customer              | `/(customer)/barbers.tsx`         | `screen-barber-list`           | `berber_listesi/code.html`                 | Berber listele            |
| customer              | `/(customer)/barber/[id].tsx`     | `screen-barber-detail`         | `barber_detail/code.html`                  | Berber detay              |
| customer              | `/(customer)/staff/[id].tsx`      | `screen-staff-and-services`    | `personel_detay_&_hizmet_seçimi/code.html` | Personel + Hizmet seçimi  |
| customer              | `/(customer)/booking/slots.tsx`   | `screen-available-slots`       | `uygun_saat_seçimi/code.html`              | Uygun saat seçimi         |
| customer              | `/(customer)/booking/summary.tsx` | `screen-booking-summary`       | `randevu_özeti/code.html`                  | Randevu özeti             |
| customer              | `/(customer)/booking/success.tsx` | `screen-booking-success`       | `başarılı_randevu/code.html`               | Başarılı randevu          |
| customer              | `/(customer)/profile.tsx`         | `screen-customer-profile`      | `müşteri_profil/code.html`                 | Profil / geçmiş           |
| businessOwner         | `/(business)/dashboard.tsx`       | `screen-business-dashboard`    | `i̇şletme_kontrol_paneli/code.html`        | İşletme dashboard         |
| businessOwner         | `/(business)/appointments.tsx`    | `screen-business-appointments` | `randevu_yönetimi/code.html`               | Randevu yönetimi          |
| businessOwner         | `/(business)/staff.tsx`           | `screen-business-staff`        | `personel_yönetimi/code.html`              | Personel yönetimi         |
| businessOwner         | `/(business)/services.tsx`        | `screen-business-services`     | `hizmet_yönetimi/code.html`                | Hizmet yönetimi           |
| businessOwner         | `/(business)/finance.tsx`         | `screen-business-finance`      | `gelir_&_kasa/code.html`                   | Gelir & kasa (chart’lı)   |
| staff                 | `/(business)/staff-dashboard.tsx` | `screen-staff-dashboard`       | `personel_paneli/code.html`                | Personel paneli           |
| platformOwner         | `/(admin)/dashboard.tsx`          | `screen-admin-dashboard`       | `admin_kontrol_paneli/code.html`           | Admin dashboard           |
| platformOwner         | `/(admin)/barbers.tsx`            | `screen-admin-barber-list`     | `berber_listesi_(admin)/code.html`         | Berber listesi (admin)    |
| platformOwner         | `/(admin)/barbers/[id].tsx`       | `screen-admin-barber-detail`   | `berber_detayı_(admin)_/code.html`         | Berber detay (admin)      |
| platformOwner         | `/(admin)/barbers/new.tsx`        | `screen-admin-new-barber`      | `yeni_berber_ekle/code.html`               | Yeni berber ekleme        |

---

## 2. TEKNİK STACK VE GENEL KURALLAR (ÖZET)

#### 2.1. Stack (STRICT)

* **Platform:** React Native + Expo (**latest stable**)
* **Dil:** TypeScript
* **Navigation:** Expo Router (file-based routing, route groups: `(auth)`, `(customer)`, `(business)`, `(admin)`)
* **Styling:** NativeWind (`className` ile)
* **State:** Zustand + `@react-native-async-storage/async-storage`
* **Listeler:** `@shopify/flash-list` (**zorunlu**, `estimatedItemSize`)
* **Animasyon:** `react-native-reanimated` v3+, `lottie-react-native`
* **Gradient:** `expo-linear-gradient`
* **Font:** `@expo-google-fonts/poppins` (Regular, Medium, SemiBold, Bold)
* **Inputs:** `react-native-otp-textinput`, `react-native-safe-area-context`
* **Chart:** `victory-native` + `react-native-svg`
* **Toasts:** `react-native-toast-message`
* **Test:** `jest-expo` + Jest + `@testing-library/react-native`
* **Backend (şimdilik):** Mock async services + lokal persist, ileride `USE_REAL_API` flag
* **Auth Social (opsiyonel UI):** Google/Apple butonları “Yakında”; ileride `expo-auth-session` ile gerçek entegrasyona açık

> Web hedefi nedeniyle uyumsuz paketler için `Platform.select` fallback zorunludur (bkz. 2.5.1).

### 2.2. Tema (Dark / Gold)

* Arkaplan: `#0f0f0f`
* Card yüzeyi: `#1a1a1a`
* Primary accent: `#d4af37`
* Başlık: `#FFFFFF`
* Gövde: `#B0B0B0`

---

## 2.5 Proje Kurulum Kararları (Auth, RLS, Roller, Ödeme, Platform)

1️⃣ **Authentication** → **c) Custom Backend API + JWT** (ileride Supabase Auth ile uyumlu)

2️⃣ **Database RLS** → **b) RLS Açık (Policy’lerle)**

3️⃣ **Roller** → **Customer + Business(Owner/Staff) + PlatformOwner**

4️⃣ **Ödeme** → **a) Şimdilik yok**

* Finance ekranındaki gelir/ciro grafikleri **mock / lokal hesaplama** ile çalışır.
* İleride ödeme ekleneceği için (Stripe/iyzico/PayTR vb.) **payment modülü placeholder** (service + flag) hazır bırakılır.

5️⃣ **Platform Hedefi** → **c) iOS + Android + Web (tek codebase)**

* Tek bir **Expo + React Native** codebase ile **iOS + Android + Web** hedeflenecek (Expo Web / RN for Web).
* Web’de uyumsuz bileşenlerde **platform bazlı fallback** uygulanacak.

### 2.5.1 Web Fallback Kuralları (ZORUNLU)

* **FlashList (web):** mümkünse FlashList web desteği; sorun çıkarsa `Platform.select` ile web’de `FlatList` fallback.
* **OTPTextInput (web):** web’de basit `<TextInput>` + mask/validation fallback.
* **Native-only API’ler:** `Platform.OS === 'web'` kontrolüyle alternatif UI/behavior.
* Bu fallback’ler için `components/platform/` altında küçük adaptör bileşenleri oluştur.

### 2.5.2 Expo SDK Notu

* Metinde “SDK 54” geçse de gerçek projede **“latest stable”** esas alınır (bkz. Stack).

---

## 3. ROLE MODEL, ROUTING VE LAYOUT

* `role: 'customer' | 'business' | 'platformOwner'`
* `subRole (business only): 'owner' | 'staff'`

### 3.1 PlatformOwner (Admin) Ulaşımı — NET KURAL

* **Role Selection ekranında 2 seçenek kalır:** `customer` ve `business`.
* **PlatformOwner son kullanıcıya açık bir seçim değildir.** Aşağıdaki yollardan biriyle açılır (uygulamada en az 1’i uygulanmalı):

  * **Ayrı route:** `/(auth)/admin-login.tsx` (gizli deep link / QR / env ile açılabilir)
  * **Gizli gesture:** Role Selection ekranında logoya **uzun basma (örn. 7 sn)** → Admin Login’e gider
  * **Credential-based:** Login sonrası API `role=platformOwner` döndürürse otomatik admin layout’a geçilir

> Böylece “iki buton var ama role set’te platformOwner da var” çelişkisi kalkar.

#### 3.1.1 Bu yazılmasaydı Bolt/AI neyi yanlış yapardı?

* **Role Selection’a 3. buton eklerdi** (PlatformOwner seçilebilir olur) → güvenlik ve ürün akışı bozulur.
* **PlatformOwner’ı business gibi ele alırdı** (owner drawer’ına düşürür) → admin ekranları/erişim modeli karışır.
* **Admin login’i auth akışına yamardı** (register/login tablarına “admin” ekler) → kullanıcı deneyimi ve route guard’ları çorba olur.
* **RBAC’i client tarafına bırakırdı** (“admin görmesin”i sadece UI ile gizler) → veri sızıntısı riski doğar.
* **Mock user DB’de rol dönüşünü belirsiz bırakırdı** → testler ve yönlendirme mantığı (redirect) tutarsızlaşır.

Bu nedenle bu madde, yeni özellik eklemek için değil; **mevcut rol modelinin yanlış uygulanmasını önlemek** için zorunludur.

Root `_layout.tsx` guard mantığı:

* Auth yok → `(auth)`
* customer → `(customer)`
* business+owner → `(business)` owner
* business+staff → `(business)` staff
* platformOwner → `(admin)`

---

## 4. STATE MANAGEMENT & DATA PERSISTENCE (TAM MODEL)

* `useAuthStore` (persist)
* `useBookingStore` (partial)
* `useBusinessStore` (multi-tenant)
* `useAdminStore` (aggregate-only)
* Mock services + mockUsers + error injection

---

## 5. UI/UX, HATA YÖNETİMİ, CHARTS, ANİMASYONLAR

* **FlashList** zorunlu
* Reanimated plugin en sonda
* Charts 20–30 datapoint
* Toast pattern + ErrorBoundary

---

## 6. TESTING & EDGE CASES (ZORUNLU)

* Jest + `jest-expo` + `@testing-library/react-native`
* **Zorunlu test senaryoları (minimum):**

  * `useAuthStore.validateRoles` (role/subRole override + yönlendirme)
  * Routing guard (staff → owner route erişemez)
  * Multi-tenant veri ayrımı (`barberId` karışmayacak)
  * PlatformOwner privacy (aggregate-only; appointment detayı sızmayacak)
  * Booking flow slot validation (dolu slot → toast + geri dönüş)

> Mock backend tarafında da RBAC simülasyonu yapılmalı: staff/customer/admin erişimleri ayrı fonksiyonlarla sınırlandırılmalı.

## 7. ACTION PLAN

1. Expo init + paketler + `expo upgrade` + `expo doctor`
2. Route groups oluştur
3. Store’ları kur
4. Role selection → login/register → customer flow → business flow → admin flow
5. Test altyapısı

---

## 8. ORİJİNAL MASTER PROMPT (GÜNCEL – PLATFORM: iOS+Android+Web)

Aşağıdaki metin, senin verdiğin **orijinal master.md** içeriğidir ve **platform hedefi** kısmı (web dahil) ile uyumlu olacak şekilde korunmuştur.

---

# Role: Senior React Native Mobile Architect & Product Designer

# Objective: Build a Production-Ready, Dual-Role Barber Application (Customer + Business)

**Target Platforms (STRICT):**

* The app MUST run fully cross-platform on **iOS & Android** using a single React Native + Expo codebase.
* * **PLUS (UPDATED):** The same codebase MUST support **Web** via **Expo Web / React Native for Web** (universal-first).
  * Web’de native-only paketlerde `Platform.OS === 'web'` ile **fallback UI** zorunludur (OTP, list, native APIs).
* **Orientation:** Portrait only (locked in `app.json`).

**Technical Stack (STRICT):**

* **Framework:** Expo SDK **latest stable** (build zamanında güncel stable) — ardından mutlaka `expo upgrade` + `expo doctor` ile doğrula. (Promptta SDK 54 referansı korunur ama uygulamada “latest stable” esas alınır.)
* **Language:** TypeScript.
* **Styling:** NativeWind (Tailwind CSS) – use `className` exclusively.
* **Icons:** `lucide-react-native`.
* **Navigation:** Expo Router (file-based routing) with route groups.
* **State Management:** Zustand + `@react-native-async-storage/async-storage`.
* **Lists:** `@shopify/flash-list` (**MUST** be used for all lists, with `estimatedItemSize`).
* **Animations:** `react-native-reanimated` (v3+) + `lottie-react-native`.
* **Gradients:** `expo-linear-gradient`.
* **Fonts:** `@expo-google-fonts/poppins` (Regular, Medium, SemiBold, Bold).
* **Inputs:** `react-native-otp-textinput` (for SMS/OTP UI) + `react-native-safe-area-context`.
* **Charts:** `victory-native` + `react-native-svg` (for Finance graphs).
* **SVG Transformer (Optional):** `react-native-svg-transformer` for custom SVG asset imports (follow official docs when needed).
* **Testing Preset:** `jest-expo` preset alongside Jest for proper Expo-managed testing.
* **Optional Backend SDKs:** (Future) `@expo/firebase-core` or similar can be added when switching `syncWithBackend` from mock to real API using a `USE_REAL_API` flag.
* **Toasts & Global Feedback:** `react-native-toast-message` (for non-blocking error/success notifications).
* **Data Layer:** Mock async services (simulating backend latency, but data persisted via Zustand + AsyncStorage).
* **Images:** Use placeholder image services (e.g. `https://picsum.photos`) for mock content.
* **Testing (Recommended):** Jest + `jest-expo` + `@testing-library/react-native` for unit and integration tests (especially stores, navigation guards, and critical booking logic).

**Optional Target:**

* Structure components so they can be adapted later to Expo Web (React Native for Web), but focus on Mobile UX first.

---

## 1. PROJECT SPECIFICATIONS & SCREEN DETAILS

🔵 **NEW: Multi-Tenant Veri Modeli & Ölçeklenebilirlik Notu**

* Uygulama artık çoklu berber/işletme (multi-tenant) yapısını destekleyecek şekilde genişletilmiştir.
* Business verileri tek bir store yerine **barberId bazlı** tutulmalıdır.
* `useBusinessStore` içerikleri `Record<string, BusinessData>` formatında yönetilmelidir.
* Customer → Barber Detail ekranında tüm bilgiler `barberId` filtresiyle alınmalıdır.
* PlatformOwner tüm berberlere erişir fakat yalnızca **aggregate** veri görebilir.

## 1. PROJECT SPECIFICATIONS & SCREEN DETAILS

The app must be **Dark, Premium, Minimalist** (Black/Gold theme) and support **two main roles** in a single codebase: Customer & Business (Barber). Business rolü kendi içinde **alt rol** olarak Owner ve Staff’e ayrılabilir.

---

### Global Role Model

* `role: 'customer' | 'business' | 'platformOwner'`
* `subRole (business only): 'owner' | 'staff'`

  * `owner`: tam işletme paneli (dashboard, personel, hizmet, takvim, finance).
  * `staff`: kısıtlı panel (sadece kendi randevuları ve basit istatistikler, personel/hizmet/finance yönetimi yok).
* `platformOwner`: SaaS yazılımını işleten üst yönetici / sistem sahibi. Tüm berber/işletmeleri, abonelik planlarını, lisans haklarını ve genel istatistikleri görebilen üst rol.

Routing, veri görünürlüğü ve menü öğeleri `role` + `subRole` üzerinden koşullu yönetilir.

====================================

1. Role Selection Screen (Entry) ====================================

* **Route:** `/index` (Initial screen).
* **Design:**

  * Full-screen `LinearGradient` background (`#0f0f0f` → `#1a1a1a`).
  * Minimal logo centered at top.
  * Font: Poppins (premium feel).
* **Actions (Two Large Cards/Buttons):**

  * “Müşteri Olarak Devam Et”
  * “Berber / İşletme Olarak Devam Et”
* **Logic:**

  * Mock API, login/register sonrasında **canonical** bir user object döner (içinde `role` ve varsa `subRole`).

  * Bu user objesi tek gerçek kaynak kabul edilir:

    * Daha önce local olarak seçilmiş `role`/`subRole` değerleri, API user objesindeki değerlerle **override** edilir.
    * `useAuthStore.validateRoles(userFromApi)` çağrılarak olası mismatch durumları tespit edilir.

  * **Loop önleme kuralı (ZORUNLU):**

    * `validateRoles` mismatch yakalarsa, en fazla **1 kez** `business-role` ekranına yönlendirsin.
    * Kullanıcı tekrar mismatch üretirse (edge-case), `logout()` + güvenli fallback (`/(auth)/login`) uygulanır ve toast gösterilir.
    * `useAuthStore.validateRoles(userFromApi)` çağrılarak olası mismatch durumları tespit edilir (gerekirse user’a sub-role yeniden seçtirilir veya business-role ekranına yönlendirilir).

  * Store token & user info in **persisted** `useAuthStore`.

  * Auth sonrası yönlendirme:

    * Eğer user.role === 'customer' → navigate to `/(customer)/home`.
    * Eğer user.role === 'platformOwner' → navigate to `/(admin)/dashboard` (SaaS admin panel).
    * Eğer user.role === 'business' ve user.subRole === 'owner' → navigate to `/(business)/dashboard`.
    * Eğer user.role === 'business' ve user.subRole === 'staff' → navigate to `/(business)/staff-dashboard` (kısıtlı panel).
    * Eğer user.role === 'business' ama user.subRole yoksa → `/business-role` ekranına git; seçim sonrasında uygun business layout’a yönlendir.

# ==================================== 3) Customer Flow (Müşteri)

* **Route Group:** `(customer)` with its own `_layout.tsx`.
* **Navigation:** Bottom Tab Bar (Ana Sayfa, Ara, Randevular, Profil).

---

## A) Ana Sayfa – Berber Listesi

* **Route:** `(customer)/home.tsx`.
* **Component:** `FlashList` with `estimatedItemSize={250}`.
* **Card Design:**

  * Background: `#1a1a1a`.
  * Content: Barber photo, barber name, rating (gold star), location, “Open/Closed” badge.
* **Header:**

  * Sticky search bar.
  * Filter chips: “En yakın”, “En iyi puan”.

---

## B) Berber Detay Ekranı

* **Route:** `(customer)/barber/[id].tsx`.
* **Hero:**

  * Large cover photo (Parallax effect is **optional enhancement**, not mandatory).
* **Info:**

  * Name, rating, address, working hours.
* **Staff List:**

  * Horizontal `FlashList` of staff avatars/cards.
* **Action:**

  * “Personel Seç” → navigate to staff detail & services.

---

## C) Personel Detay & Hizmet Seçimi

* **Route:** `(customer)/staff/[id].tsx`.
* **Header:**

  * Staff photo, name, expertise.
* **Services List:**

  * Items: service name, duration (min), price (₺).
  * Interaction: multi-select checkboxes.
* **Footer (Sticky):**

  * Dynamic **Total Price** + **Total Duration** from `useBookingStore`.
  * Primary CTA: Gold button “Uygun Saat Seç”.

---

## D) Uygun Saat (Takvim Slot Seçimi)

* **Route:** `(customer)/booking/slots.tsx`.
* **Date:**

  * Horizontal date slider (next 14 days).
* **Time Slots:**

  * Grid layout of time slots.
* **Logic:**

  * Calculate availability based on:

    * Total service duration.
    * Existing appointments (from `useBusinessStore`).
  * Visual:

    * Available: white border.
    * Selected: gold fill (`#d4af37`).
    * Taken: gray/disabled, low opacity.

---

## E) Randevu Özeti

* **Route:** `(customer)/booking/summary.tsx`.
* **Content:**

  * Barber, staff, services, total price, total duration, selected date/time.
* **Input:**

  * “Not Ekle” (Add Note) text area.
* **CTA:**

  * Gold button: “Randevuyu Tamamla”.
* **Logic:**

  * On submit, create a new appointment in `useBookingStore` **and** `useBusinessStore`.
  * Navigate to Success screen.

---

## F) Başarılı Randevu Ekranı

* **Route:** `(customer)/booking/success.tsx`.
* **Animation:**

  * Full-screen Lottie confetti animation (assets under `assets/animations`).
* **Message:**

  * “Randevunuz oluşturuldu!”
* **Actions:**

  * “Ana sayfaya dön”.
  * “Takvime ekle” (mock behavior).

---

## G) Profil / Ayarlar / Geçmiş

* **Route:** `(customer)/profile.tsx`.
* **Tabs or sections:**

  * “Geçmiş” (Past appointments).
  * “Yaklaşan” (Upcoming appointments).
* **Settings:**

  * Notifications toggle.
* Language (UI only).

> **Not (i18n):** Şimdilik sadece UI toggle. İleride çok dil için `i18n` (örn. `i18next`) entegrasyonuna uygun yapı (strings dosyası / key bazlı metinler) bırakılmalı.

* “Rol Değiştir” → updates `role` (ve gerekirse `subRole`) in `useAuthStore` and calls `router.replace('/')`.
* Logout → clears `useAuthStore` and `useBookingStore`, then `router.replace('/')`.

# ==================================== 4) Berber / İşletme Yönetim Paneli (Business Flow)

* **Route Group:** `(business)` with its own `_layout.tsx`.
* **Navigation:**

  * Owner için: Drawer (Side menu) – Dashboard, Staff, Services, Calendar, Finance.
  * Staff için: Daha kısıtlı menü – örn. “Bugünkü Randevularım”, “Profil”.

---

## A) İşletme Ana Paneli (Dashboard – Owner)

* **Route:** `(business)/dashboard.tsx`.
* **Stats:**

  * Today’s appointments count.
  * Total revenue (Day/Week).
  * Busiest hours indicator.
* **Quick Actions:**

  * “Personel Ekle”.
  * “Hizmetleri Yönet”.

---

## B) Personel Yönetimi (Owner)

* **Route:** `(business)/staff.tsx` + `(business)/staff/[id].tsx`.
* **List:**

  * Staff cards: photo, name, expertise, active/passive toggle.
* **Add/Edit Staff:**

  * Photo, name, phone, expertise.
  * Working days and hours.
  * Breaks (mola) definition.
* **Override Feature:**

  * Custom price/duration per staff for specific services (stored in `useBusinessStore`).

---

## C) Hizmet (İşlem) Yönetimi (Owner)

* **Route:** `(business)/services.tsx`.
* **CRUD:**

  * Name, duration, price, optional description.
  * Assign which staff can perform each service.

---

## D) Randevu Yönetimi (Takvim – Owner)

* **Route:** `(business)/calendar.tsx`.
* **View:**

  * Daily agenda with time blocks.
* **Filter:**

  * By staff member.
* **Actions:**

  * View appointment details.
  * Cancel / Reschedule (mock operations, updating `useBusinessStore`).

---

## E) Gelir & Kasa (Finance – Owner)

* **Route:** `(business)/finance.tsx`.
* **Charts (Victory):**

  * Line/Bar charts using `victory-native` + `react-native-svg`.
  * Limited data points (max 20–30) for performance.
* **Breakdown:**

  * Revenue per staff.
  * Revenue per service type.

---

## F) Personel Paneli (Staff Sub-Role)

* **Route:** `(business)/staff-dashboard.tsx`.
* **Content:**

  * "Bugünkü Randevularım" listesi.
  * Basit istatistikler (örneğin bugün kaç müşteri, toplam tahmini ciro).
* **Restrictions:**

  * Staff rolü: personel ekleme, hizmet yönetimi, finance ekranlarına erişemez (menu item’ları gizli veya disabled).

==================================== 5) Platform Owner

🟠 **UPDATED: Admin Veri Güvenliği & RBAC Açıklığı**

* PlatformOwner tüm berberlere erişebilir fakat yalnızca aggregate veri görebilir.
* Kişisel müşteri randevu detaylarına erişim kesinlikle yasaktır.
* Admin panelde gösterilen bilgiler:

  * Toplam randevu sayısı
  * Toplam gelir
  * Berber bazında toplam hizmet sayısı
  * Abonelik başlangıç/bitiş tarihleri
* Veri erişimi RBAC mantığıyla backend'e uygun şekilde tasarlanmıştır.

---

## 2. STATE MANAGEMENT & DATA PERSISTENCE

🔵 **NEW: Multi-Barber Store Yapısı**

* `useBusinessStore` → `barberData: Record<string, {...}>`
* Staff sadece kendi `barberId` scope
* PlatformOwner aggregate-only

---

## 3. UI/UX, ERROR HANDLING & CONFIG RULES

* Tema, font, FlashList, Reanimated, Lottie, Charts, Toasts, ErrorBoundary kuralları geçerlidir.

---

## 4. ROUTING & ROLE-BASED LAYOUT

* Root `_layout.tsx` role/subRole/token ile route mount eder; unauthorized → redirect.

---

## 5. TESTING & EDGE CASES (Önerilen)

* Jest + RTL + jest-expo; multi-tenant + admin privacy testleri.

---

## 6. ACTION PLAN (WHAT TO GENERATE NOW)

* Expo init + folder structure + store’lar + role selection + auth + admin skeleton + test starter.
