---
name: expo-mobile
description: Expo ve React Native cross-platform geliştirme kuralları. Mobil uygulama (iOS/Android/Web) geliştirirken bu skill'i kullan.
---

# Expo Mobile (Cross-Platform)

> Expo SDK ve cross-platform (iOS/Android/Web) geliştirme kuralları.

## Quick Start

```
app/
├── _layout.tsx          # Root layout
├── index.tsx            # Ana ekran
├── (tabs)/              # Tab navigation
│   ├── _layout.tsx
│   ├── home.tsx
│   └── profile.tsx
└── booking/
    └── [id].tsx         # Dynamic route
```

## Platform Kontrolü

```tsx
import { Platform } from 'react-native';

const styles = Platform.select({
  ios: { shadowColor: '#000' },
  android: { elevation: 4 },
  web: { boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
});
```

## Key Principles

- Expo Router ile file-based routing
- `SafeAreaView` her ekranda
- Platform-specific kod için `Platform.select()`
- Haptic feedback (butonlar)
- Web uyumluluğunu test et

## References

See [rules.md](references/rules.md) for complete guidelines.
