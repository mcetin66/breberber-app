---
name: project-structure
description: Proje yapısı, klasör düzeni ve dosya organizasyonu kuralları. Yeni proje oluştururken veya mevcut projeyi yapılandırırken bu skill'i kullan.
---

# Project Structure - Proje Yapısı

> Tutarlı klasör düzeni ve dosya organizasyonu kuralları.

## Quick Start

```
src/
├── app/                 # Sayfalar/Rotalar (Next.js/Expo Router)
├── components/          # Yeniden kullanılabilir bileşenler
│   ├── ui/              # Temel UI (Button, Input, Card)
│   └── features/        # Özellik bileşenleri
├── lib/                 # Yardımcı fonksiyonlar
├── hooks/               # Custom React hooks
├── stores/              # Zustand store'ları
├── types/               # TypeScript tipleri
└── locales/             # Çeviri dosyaları
```

## Key Principles

- Klasör isimleri `kebab-case`
- Bileşen dosyaları `PascalCase`
- Her klasörde `index.ts` ile export
- Mutlak import: `@/components/Button`

## References

See [rules.md](references/rules.md) for complete guidelines.
