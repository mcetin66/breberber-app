# Breberber App - Mimari Analiz ve Yeniden Yapılandırma Raporu

**Tarih:** 15 Aralık 2025  
**Hazırlayan:** Antigravity AI

---

## 1. Mevcut Durum Özeti

### 1.1 Rol Hiyerarşisi (Doğru Anlaşılan)

```
┌─────────────────────────────────────────────────────────────┐
│                       ADMIN (Platform)                       │
│                    Tüm işletmeleri yönetir                   │
├─────────────────────────────────────────────────────────────┤
│                   BUSINESS OWNER (İşletme)                   │
│               Kendi işletmesi + personelleri                 │
├─────────────────────────────────────────────────────────────┤
│                      STAFF (Personel)                        │
│              Kendi randevuları + müşterileri                 │
├─────────────────────────────────────────────────────────────┤
│                    CUSTOMER (Müşteri)                        │
│                    Randevu alır / yönetir                    │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Mevcut Klasör Yapısı

```
app/
├── (admin)/          # Platform Yöneticisi Paneli
│   ├── _layout.tsx   # Tab Navigasyon (5 sekme)
│   ├── dashboard.tsx
│   ├── barbers/      # İşletme Listesi
│   ├── reports.tsx
│   ├── audit.tsx
│   └── settings.tsx  ⚠️ AYRI DOSYA (312 satır)
│
├── (business)/       # İşletme Sahibi + Personel
│   ├── _layout.tsx   # Stack Navigasyon
│   ├── (tabs)/       # İşletme Sahibi Tab Grubu
│   │   ├── _layout.tsx   # Tab Nav (5 sekme)
│   │   ├── dashboard.tsx
│   │   ├── calendar.tsx
│   │   ├── staff/
│   │   ├── services/
│   │   └── settings.tsx  ⚠️ AYRI DOSYA (159 satır)
│   ├── staff-dashboard.tsx  # Personel Ana Sayfası (Yeni Ekledik)
│   ├── settings/
│   │   ├── profile.tsx
│   │   ├── hours.tsx
│   │   └── gallery.tsx
│   └── finance.tsx
│
├── (customer)/       # Müşteri Paneli
│   ├── _layout.tsx   # Custom Tab Bar
│   ├── home.tsx
│   ├── appointments.tsx
│   ├── favorites.tsx
│   ├── profile.tsx   ⚠️ AYRI DOSYA (229 satır)
│   └── booking/      # Randevu Akışı
│
└── (auth)/           # Kimlik Doğrulama
    ├── login.tsx
    ├── register.tsx
    └── admin-login.tsx
```

---

## 2. Tespit Edilen Sorunlar

### 2.1 🔴 Kritik Sorunlar

| # | Sorun | Açıklama |
|---|-------|----------|
| 1 | **Rol Yönlendirmesi** | `login.tsx` içinde role bazlı yönlendirme var ama `app/_layout.tsx`'de de benzer mantık var. Çakışma riski. |
| 2 | **Personel Paneli Eksik** | `staff-dashboard.tsx` yeni oluşturuldu ama kendi Tab barı yok, sadece "BottomView" var. Navigasyon tutarsız. |
| 3 | **Ayarlar Sayfası Tekrarı** | Admin, Business, Customer için 3 ayrı ayarlar dosyası. %80 benzer kod. |
| 4 | **Profile Tekrarı** | Customer ve Business için ayrı profile sayfaları. |

### 2.2 🟡 Orta Seviye Sorunlar

| # | Sorun | Açıklama |
|---|-------|----------|
| 5 | **Bileşen Tutarsızlığı** | `AdminHeader` hem Admin hem Business'ta kullanılıyor ama ismi yanıltıcı. |
| 6 | **Store Ayrımı** | `adminStore`, `businessStore`, `bookingStore` var ama bazı fonksiyonlar çakışıyor. |
| 7 | **Type Karışıklığı** | `User.role` hem `business_owner` hem `business` olabiliyor. Standart yok. |

### 2.3 🟢 İyileştirme Fırsatları

| # | Durum | Açıklama |
|---|-------|----------|
| 8 | Tab Bar Stilleri | Admin ve Business tab barları %95 aynı, tekrar kullanılabilir. |
| 9 | Kart Bileşenleri | `StatCard`, `SettingsRow` gibi yapılar paylaşılabilir. |
| 10 | Modal Yapıları | `FormModal`, detay modalleri standardize edilebilir. |

---

## 3. Önerilen Yeni Mimari

### 3.1 Paylaşımlı Bileşen Yapısı

```
components/
├── shared/                    # TÜM ROLLER İÇİN ORTAK
│   ├── layouts/
│   │   ├── AppHeader.tsx      # Miras alınabilir Header
│   │   ├── FloatingTabBar.tsx # Admin, Business, Staff için
│   │   └── BottomNav.tsx      # Customer için
│   │
│   ├── settings/
│   │   ├── SettingsLayout.tsx      # Ayarlar ana şablonu
│   │   ├── SettingsSection.tsx     # Grup başlığı
│   │   ├── SettingsRow.tsx         # Tek satır
│   │   └── SettingsConfig.ts       # Role bazlı menü konfigürasyonu
│   │
│   ├── profile/
│   │   ├── ProfileCard.tsx
│   │   ├── ProfileForm.tsx
│   │   └── ProfileConfig.ts        # Role bazlı alanlar
│   │
│   ├── stats/
│   │   ├── StatCard.tsx
│   │   └── StatGrid.tsx
│   │
│   └── modals/
│       ├── ConfirmModal.tsx
│       ├── FormModal.tsx
│       └── DetailModal.tsx
│
├── admin/                     # Sadece Admin'e özel
├── business/                  # İşletme Sahibi'ne özel
├── staff/                     # Personele özel
└── customer/                  # Müşteriye özel
```

### 3.2 Yönlendirme Değişiklikleri

```typescript
// app/_layout.tsx - Merkezi Yönlendirme Mantığı
const ROLE_ROUTES = {
  admin: '/(admin)/dashboard',
  business_owner: '/(business)/(tabs)/dashboard',
  staff: '/(staff)/(tabs)/dashboard',          // YENİ KLASÖR
  customer: '/(customer)/home',
};

// Ayrı Staff klasörü oluşturulmalı:
app/
├── (staff)/              # YENİ - Personel Paneli
│   ├── _layout.tsx       # FloatingTabBar kullanır
│   ├── (tabs)/
│   │   ├── dashboard.tsx # staff-dashboard'dan taşınır
│   │   ├── calendar.tsx  # Kendi takvimi (filtrelenmiş)
│   │   └── profile.tsx   # Ortak ProfileLayout kullanır
│   └── settings.tsx      # Ortak SettingsLayout kullanır
```

### 3.3 Konfigürasyon Bazlı Menü Örneği

```typescript
// components/shared/settings/SettingsConfig.ts

export const SETTINGS_MENU: Record<string, SettingsItem[]> = {
  admin: [
    { icon: 'Users', label: 'Kullanıcı Yönetimi', route: '/admin/users' },
    { icon: 'Shield', label: 'Sistem Ayarları', route: '/admin/system' },
    { icon: 'Bell', label: 'Bildirimler', type: 'toggle', key: 'notifications' },
    { icon: 'Key', label: 'Şifre Değiştir', modal: 'password' },
    { icon: 'LogOut', label: 'Çıkış', action: 'logout', danger: true },
  ],
  business_owner: [
    { icon: 'Store', label: 'İşletme Profili', route: '/business/settings/profile' },
    { icon: 'Clock', label: 'Çalışma Saatleri', route: '/business/settings/hours' },
    { icon: 'Image', label: 'Galeri', route: '/business/settings/gallery' },
    { icon: 'Wallet', label: 'Finans', route: '/business/finance' },
    { icon: 'Bell', label: 'Bildirimler', type: 'toggle', key: 'notifications' },
    { icon: 'LogOut', label: 'Çıkış', action: 'logout', danger: true },
  ],
  staff: [
    { icon: 'User', label: 'Profilim', route: '/staff/profile' },
    { icon: 'Clock', label: 'Çalışma Saatlerim', route: '/staff/hours' },
    { icon: 'Bell', label: 'Bildirimler', type: 'toggle', key: 'notifications' },
    { icon: 'LogOut', label: 'Çıkış', action: 'logout', danger: true },
  ],
  customer: [
    { icon: 'User', label: 'Hesap Bilgileri', route: '/customer/profile-edit' },
    { icon: 'Bell', label: 'Bildirimler', type: 'toggle', key: 'notifications' },
    { icon: 'CreditCard', label: 'Ödeme Yöntemler', route: '/customer/payments' },
    { icon: 'LogOut', label: 'Çıkış', action: 'logout', danger: true },
  ],
};
```

### 3.4 Paylaşımlı Layout Örneği

```tsx
// components/shared/settings/SettingsLayout.tsx

export function SettingsLayout({ role }: { role: Role }) {
  const router = useRouter();
  const { signOut, user } = useAuthStore();
  const menuItems = SETTINGS_MENU[role] || [];

  const handleAction = (item: SettingsItem) => {
    if (item.route) router.push(item.route);
    if (item.action === 'logout') handleLogout();
    if (item.modal === 'password') showPasswordModal();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <AppHeader title="Ayarlar" subtitle={getSubtitle(role)} />
      <ScrollView>
        {menuItems.map((item, idx) => (
          <SettingsRow 
            key={idx} 
            {...item} 
            onPress={() => handleAction(item)} 
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// Kullanımı:
// app/(admin)/settings.tsx
export default () => <SettingsLayout role="admin" />;

// app/(business)/(tabs)/settings.tsx  
export default () => <SettingsLayout role="business_owner" />;

// app/(staff)/(tabs)/settings.tsx
export default () => <SettingsLayout role="staff" />;
```

---

## 4. Uygulama Planı

### Faz 1: Temel Altyapı (1-2 gün)
- [ ] `components/shared/` klasör yapısını oluştur
- [ ] `FloatingTabBar.tsx` paylaşımlı bileşeni yaz
- [ ] `AppHeader.tsx` paylaşımlı bileşeni yaz
- [ ] `SettingsLayout.tsx` ve config dosyasını oluştur

### Faz 2: Staff Paneli (1 gün)
- [ ] `app/(staff)/` klasörünü oluştur
- [ ] `staff-dashboard.tsx` içeriğini taşı
- [ ] Staff için tab navigasyonu ekle
- [ ] Login yönlendirmesini güncelle

### Faz 3: Mevcut Sayfaları Refactör (2-3 gün)
- [ ] Admin settings → SettingsLayout kullan
- [ ] Business settings → SettingsLayout kullan
- [ ] Customer profile → ortak ProfileCard/Form kullan
- [ ] Tekrar eden kodları temizle

### Faz 4: Tip Standardizasyonu (yarım gün)
- [ ] `Role` tipini sadeleştir (`business_owner` | `staff` | `customer` | `admin`)
- [ ] `User.subRole` kaldır veya netleştir
- [ ] Store'larda tutarlı alanlar kullan

---

## 5. Sonuç ve Öneri

**Acil Eylem:**  
Personel panelini (`(staff)`) ayrı bir route grubu olarak oluşturmak. Şu an `(business)/staff-dashboard.tsx` olarak kalan yapı, hem navigasyon hem de yetkilendirme açısından karışıklık yaratıyor.

**Uzun Vadeli Hedef:**  
"Bir kez yaz, her yerde kullan" prensibiyle paylaşımlı bileşenler oluşturmak. Bu sayede:
- Tasarım tutarlılığı sağlanır
- Bakım kolaylaşır
- Yeni özellikler daha hızlı eklenir

**Tahmini Toplam Süre:** 4-6 gün (tamamı için)

---

## 6. Dosya Sayıları ve İstatistikler

| Klasör | Dosya Sayısı | Toplam Satır (tahmini) |
|--------|--------------|------------------------|
| (admin) | 6 | ~600 |
| (business) | 17 | ~1500 |
| (customer) | 15 | ~1200 |
| (auth) | 4 | ~400 |
| components | 12 | ~800 |
| stores | 4 | ~700 |
| **TOPLAM** | **58** | **~5200** |

---

*Bu rapor, mevcut kod tabanının detaylı incelenmesi sonucu hazırlanmıştır.*
