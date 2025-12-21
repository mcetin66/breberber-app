# i18n - Detaylı Kurallar

## 1. Setup

```typescript
// lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import tr from '@/locales/tr.json';
import en from '@/locales/en.json';

i18n.use(initReactI18next).init({
  resources: {
    tr: { translation: tr },
    en: { translation: en },
  },
  lng: 'tr',
  fallbackLng: 'tr',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
```

---

## 2. Çeviri Dosyası Yapısı

```json
// locales/tr.json
{
  "common": {
    "save": "Kaydet",
    "cancel": "İptal",
    "delete": "Sil",
    "edit": "Düzenle",
    "loading": "Yükleniyor...",
    "error": "Bir hata oluştu"
  },
  "auth": {
    "login": "Giriş Yap",
    "logout": "Çıkış Yap",
    "email": "E-posta",
    "password": "Şifre"
  },
  "booking": {
    "title": "Randevular",
    "new": "Yeni Randevu",
    "empty": "Henüz randevu yok",
    "status": {
      "pending": "Bekliyor",
      "confirmed": "Onaylandı",
      "cancelled": "İptal"
    }
  }
}
```

---

## 3. Kullanım

```tsx
import { useTranslation } from 'react-i18next';

function BookingScreen() {
  const { t } = useTranslation();

  return (
    <View>
      <Text className="text-xl font-bold">{t('booking.title')}</Text>
      <Button title={t('booking.new')} onPress={...} />
    </View>
  );
}
```

---

## 4. Interpolation (Değişken)

```json
// locales/tr.json
{
  "greeting": "Merhaba {{name}}!",
  "booking": {
    "count": "{{count}} randevu bulundu"
  }
}
```

```tsx
<Text>{t('greeting', { name: user.name })}</Text>
<Text>{t('booking.count', { count: bookings.length })}</Text>
```

---

## 5. Pluralization

```json
// locales/tr.json
{
  "items_one": "{{count}} öğe",
  "items_other": "{{count}} öğe"
}

// locales/en.json
{
  "items_one": "{{count}} item",
  "items_other": "{{count}} items"
}
```

```tsx
<Text>{t('items', { count: 1 })}</Text>   // "1 öğe" / "1 item"
<Text>{t('items', { count: 5 })}</Text>   // "5 öğe" / "5 items"
```

---

## 6. Dil Değiştirme

```tsx
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: 'tr' | 'en') => {
    i18n.changeLanguage(lng);
    // AsyncStorage'a kaydet
    AsyncStorage.setItem('language', lng);
  };

  return (
    <View className="flex-row gap-2">
      <Button
        title="TR"
        variant={i18n.language === 'tr' ? 'primary' : 'outline'}
        onPress={() => changeLanguage('tr')}
      />
      <Button
        title="EN"
        variant={i18n.language === 'en' ? 'primary' : 'outline'}
        onPress={() => changeLanguage('en')}
      />
    </View>
  );
}
```

---

## 7. Tarih Formatı

```typescript
// lib/formatters.ts
export function formatDate(date: Date, locale: string = 'tr-TR'): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatTime(date: Date, locale: string = 'tr-TR'): string {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatCurrency(amount: number, locale: string = 'tr-TR', currency: string = 'TRY'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

// Kullanım
formatDate(new Date(), i18n.language);  // "21 Aralık 2024"
formatCurrency(150, i18n.language);     // "₺150,00"
```

---

## 8. RTL Desteği

```typescript
// lib/i18n.ts
import { I18nManager } from 'react-native';

const RTL_LANGUAGES = ['ar', 'he', 'fa'];

export function setLanguage(lng: string) {
  i18n.changeLanguage(lng);
  
  const isRTL = RTL_LANGUAGES.includes(lng);
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.forceRTL(isRTL);
    // App restart gerekebilir
  }
}
```

---

## 9. Namespace ile Modüler Yapı

```
locales/
├── tr/
│   ├── common.json
│   ├── auth.json
│   ├── booking.json
│   └── settings.json
└── en/
    ├── common.json
    ├── auth.json
    ├── booking.json
    └── settings.json
```

```typescript
i18n.init({
  ns: ['common', 'auth', 'booking', 'settings'],
  defaultNS: 'common',
});

// Kullanım
const { t } = useTranslation('booking');
t('title');  // booking.json'dan
t('common:save');  // common.json'dan
```

---

## 10. Kontrol Listesi

- [ ] Tüm metinler çeviri dosyasında
- [ ] Hardcoded string yok
- [ ] Interpolation değişkenler için
- [ ] Pluralization gerektiğinde
- [ ] Dil AsyncStorage'da saklanıyor
- [ ] Tarih/para Intl ile formatlanıyor
- [ ] RTL diller düşünüldü
