# Project Structure - Detaylı Kurallar

## 1. Klasör Yapısı

```
src/
├── app/                 # Sayfalar/Rotalar
│   ├── (auth)/          # Auth route grubu
│   ├── (dashboard)/     # Dashboard route grubu
│   └── api/             # API Routes
├── components/
│   ├── ui/              # Temel UI bileşenleri
│   │   ├── Button/
│   │   ├── Input/
│   │   └── Card/
│   └── features/        # Feature bileşenleri
│       ├── booking/
│       └── calendar/
├── lib/
│   ├── supabase.ts      # Supabase client
│   ├── utils.ts         # Genel yardımcılar
│   └── constants.ts     # Sabitler
├── hooks/               # Custom hooks
├── stores/              # Zustand stores
├── types/               # TypeScript tipleri
└── locales/             # i18n çevirileri
```

---

## 2. İsimlendirme Kuralları

### Klasörler
✅ Doğru: `kebab-case`
```
components/
├── booking-form/
├── staff-calendar/
└── user-profile/
```

❌ Yanlış:
```
components/
├── BookingForm/      # PascalCase klasör
├── staff_calendar/   # snake_case
└── userprofile/      # birleşik
```

### Bileşen Dosyaları
✅ Doğru: `PascalCase.tsx`
```
booking-form/
├── BookingForm.tsx
├── BookingForm.test.tsx
└── index.ts
```

### Hook Dosyaları
✅ Doğru: `use` prefix + `camelCase`
```
hooks/
├── useBookings.ts
├── useAuth.ts
└── useLocalStorage.ts
```

### Store Dosyaları
✅ Doğru: `camelCase` + `Store` suffix
```
stores/
├── authStore.ts
├── bookingStore.ts
└── uiStore.ts
```

---

## 3. Index Dosyaları (Barrel Exports)

Her klasörde `index.ts` ile dışa aktarma:

```typescript
// components/ui/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Card } from './Card';

// Kullanım
import { Button, Input, Card } from '@/components/ui';
```

---

## 4. Mutlak Import (Alias)

`tsconfig.json` veya `app.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

✅ Doğru:
```typescript
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
```

❌ Yanlış:
```typescript
import { Button } from '../../../components/ui';  // Relative path
```

---

## 5. Bileşen Organizasyonu

### Tek Dosya Bileşeni (Basit)
```
Button.tsx
```

### Klasör Bileşeni (Karmaşık)
```
Button/
├── Button.tsx           # Ana bileşen
├── Button.types.ts      # Tipler
├── Button.styles.ts     # Stiller (opsiyonel)
├── Button.test.tsx      # Testler
└── index.ts             # Export
```

---

## 6. Feature-based vs Layer-based

### ✅ Tercih: Feature-based (Büyük projelerde)
```
features/
├── booking/
│   ├── components/
│   ├── hooks/
│   ├── stores/
│   └── types/
├── calendar/
│   ├── components/
│   ├── hooks/
│   └── types/
```

### Layer-based (Küçük projelerde kabul edilebilir)
```
components/
hooks/
stores/
types/
```

---

## 7. Kontrol Listesi

- [ ] Klasör isimleri `kebab-case`
- [ ] Bileşen dosyaları `PascalCase.tsx`
- [ ] Hook'lar `use` ile başlıyor
- [ ] Store'lar `Store` ile bitiyor
- [ ] Her klasörde `index.ts` var
- [ ] Mutlak import `@/` kullanılıyor
- [ ] Relative path yok (`../../../`)
