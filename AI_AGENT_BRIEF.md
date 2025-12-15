# AI Agent Görev Özeti

**Proje:** Breberber App (React Native / Expo)  
**Tarih:** 15 Aralık 2025

---

## 📌 Durum Özeti

Bu, 4 farklı kullanıcı rolü olan bir berber/kuaför randevu uygulamasıdır:

| Rol | Açıklama | Mevcut Ekran |
|-----|----------|--------------|
| **Admin** | Platform sahibi, tüm işletmeleri yönetir | `(admin)/` ✅ |
| **Business Owner** | İşletme sahibi | `(business)/(tabs)/` ✅ |
| **Staff** | İşletme personeli | `(business)/staff-dashboard.tsx` ⚠️ |
| **Customer** | Müşteri, randevu alır | `(customer)/` ✅ |

**Ana Sorun:** Staff (Personel) paneli tam değil. Şu an `(business)` klasörü içinde kaybolmuş durumda. Ayrı bir route grubu olmalı.

---

## 🎯 Yapılması Gereken (Öncelik Sırasıyla)

### GÖREV 1: Staff Route Grubu Oluştur
```
app/(staff)/
├── _layout.tsx        # FloatingTabBar navigasyonu
├── (tabs)/
│   ├── _layout.tsx    # Tab konfigürasyonu
│   ├── dashboard.tsx  # Ana ekran (staff-dashboard'dan taşı)
│   ├── calendar.tsx   # Kendi takvimi
│   └── profile.tsx    # Profil sayfası
```

**Yapılacaklar:**
1. `app/(staff)/` klasörünü oluştur
2. `app/(business)/staff-dashboard.tsx` içeriğini `app/(staff)/(tabs)/dashboard.tsx`'e taşı
3. `_layout.tsx` dosyalarını (admin veya business'tan kopyalayarak) oluştur
4. `app/(auth)/login.tsx`'deki yönlendirmeyi güncelle:
   ```tsx
   } else if (user?.subRole === 'staff') {
     router.replace('/(staff)/(tabs)/dashboard');
   }
   ```
5. `app/_layout.tsx`'deki yönlendirmeyi de güncelle

### GÖREV 2: Paylaşımlı Bileşenler Oluştur
```
components/shared/
├── layouts/
│   ├── FloatingTabBar.tsx   # Admin, Business, Staff için ortak tab bar
│   └── AppHeader.tsx        # Ortak header bileşeni
├── settings/
│   ├── SettingsLayout.tsx   # Role bazlı ayarlar sayfası
│   ├── SettingsRow.tsx      # Tekrar kullanılabilir satır
│   └── SettingsConfig.ts    # Role bazlı menü konfigürasyonu
```

### GÖREV 3: Ayarlar Sayfalarını Birleştir
Şu an 3 ayrı ayarlar dosyası var:
- `app/(admin)/settings.tsx` (312 satır)
- `app/(business)/(tabs)/settings.tsx` (159 satır)
- `app/(customer)/profile.tsx` (229 satır)

Bunları tek bir `SettingsLayout` bileşeniyle değiştir.

---

## 📂 Önemli Dosyalar

| Dosya | Açıklama |
|-------|----------|
| `app/_layout.tsx` | Merkezi yönlendirme mantığı |
| `app/(auth)/login.tsx` | Giriş sonrası role bazlı yönlendirme |
| `stores/authStore.ts` | Kullanıcı durumu, role bilgisi |
| `stores/businessStore.ts` | İşletme verileri, randevular |
| `types/index.ts` | Role, User, Staff, Appointment tipleri |
| `ARCHITECTURE_REPORT.md` | Detaylı mimari analiz raporu |

---

## 🔧 Teknik Notlar

### Role Tipleri
```typescript
type Role = 'customer' | 'business_owner' | 'staff' | 'admin' | 'business';
// 'business' ve 'business_owner' aynı anlama geliyor (tutarsızlık)

interface User {
  role: Role;
  subRole?: 'owner' | 'staff';  // İşletme tarafı için
  barberId?: string;            // İşletme ID'si
}
```

### Veritabanı Yapısı (Supabase)
- `profiles` - Kullanıcı profilleri
- `businesses` - İşletmeler
- `business_staff` - Personel kayıtları
- `services` - Hizmetler
- `bookings` - Randevular

### Tab Bar Stili (Tüm panellerde ortak)
```tsx
tabBarStyle: {
  backgroundColor: '#1E293B',
  borderTopWidth: 0,
  position: 'absolute',
  bottom: 30,
  left: 15,
  right: 15,
  borderRadius: 25,
  height: 80,
}
```

---

## ⚠️ Dikkat Edilmesi Gerekenler

1. **Expo Router kullanılıyor** - Dosya bazlı routing
2. **NativeWind (Tailwind)** - Stil için className kullanılıyor
3. **Zustand** - State management
4. **TypeScript** - Tip güvenliği önemli
5. **Türkçe UI** - Tüm metinler Türkçe olmalı

---

## 🚀 Başlangıç Komutu

```bash
cd /Users/aysebetul/Documents/breberber-app-main
npx expo start
```

---

## 📋 Checklist

- [ ] `app/(staff)/` klasör yapısını oluştur
- [ ] Staff dashboard'u taşı
- [ ] Staff _layout.tsx'i oluştur (tab navigasyonu)
- [ ] Login yönlendirmesini güncelle
- [ ] Root _layout.tsx yönlendirmesini güncelle
- [ ] `components/shared/` yapısını oluştur
- [ ] FloatingTabBar paylaşımlı bileşenini yaz
- [ ] SettingsLayout paylaşımlı bileşenini yaz
- [ ] Mevcut settings sayfalarını refactör et

---

*Detaylı mimari analiz için: `/ARCHITECTURE_REPORT.md`*
