---
name: sentry
description: Sentry hata takibi ve performans izleme. Production hata yakalama kurarken bu skill'i kullan.
---

# Sentry - Hata Takibi

> Production ortamında hata izleme ve performans monitoring.

## Kurulum

```typescript
// app/_layout.tsx
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.2,
  environment: __DEV__ ? 'development' : 'production',
});

export default Sentry.wrap(RootLayout);
```

## Manuel Hata Yakalama

```typescript
try {
  await riskyOperation();
} catch (error) {
  Sentry.captureException(error, {
    tags: { feature: 'payment' },
    extra: { userId, amount },
  });
  throw error;
}
```

## Key Principles

- Production'da Sentry aktif
- User context ekle
- Custom tags kullan
- Performance tracking aç

## References

See [rules.md](references/rules.md) for complete guidelines.
