---
name: i18n
description: Çoklu dil desteği (i18next) ve yerelleştirme kuralları. Uygulamayı farklı dillerde sunmak için bu skill'i kullan.
---

# i18n - Çoklu Dil Desteği

> i18next ile çoklu dil desteği ve yerelleştirme.

## Quick Start

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: { tr: { translation: tr }, en: { translation: en } },
  lng: 'tr',
  fallbackLng: 'tr',
});
```

## Kullanım

```tsx
import { useTranslation } from 'react-i18next';

function WelcomeScreen() {
  const { t } = useTranslation();
  return <Text>{t('welcome.title')}</Text>;
}
```

## Key Principles

- Tüm metinler çeviri dosyasında
- Namespace ile modüler yapı
- Tarih/para için locale formatters
- RTL (sağdan sola) desteği

## References

See [rules.md](references/rules.md) for complete guidelines.
