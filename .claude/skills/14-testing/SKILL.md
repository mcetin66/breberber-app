---
name: testing
description: Test yazma stratejisi, Jest, React Testing Library ve E2E testler. Test yazmak için bu skill'i kullan.
---

# Testing - Test Stratejisi

> Unit, Integration ve E2E test kuralları.

## Test Piramidi

```
     /\
    /E2E\        ← Az ama kritik
   /------\
  /Integration\ ← API, DB testleri
 /--------------\
/   Unit Tests   \ ← Çok, hızlı
------------------
```

## Ne Zaman Test?

| Test Edilecek | Test Edilmeyecek |
|---------------|------------------|
| ✅ Authentication | ❌ UI styling |
| ✅ Ödeme işlemleri | ❌ Basit CRUD |
| ✅ Kritik hesaplamalar | ❌ Statik sayfalar |
| ✅ Form validation | |

## Key Principles

- Test piramidine uy
- Kritik yerlere test yaz
- Jest + React Testing Library
- E2E için Playwright/Maestro

## References

See [rules.md](references/rules.md) for complete guidelines.
