---
name: multi-file
description: Çoklu dosya değişikliği, global rename ve migration kuralları. Birden fazla dosyayı etkileyen değişikliklerde bu skill'i kullan.
---

# Multi-file Sync

> Çoklu dosya değişikliği ve senkronizasyon kuralları.

## Tehlikeli Durumlar

| Durum | Risk | Önlem |
|-------|------|-------|
| Global rename | Tüm import'lar | TypeScript kullan |
| Type change | Breaking change | Kademeli migrate |
| API versioning | Eski client'lar | v1 + v2 paralel |

## Güvenli Süreç

1. ✅ Önce plan yap
2. ✅ Git branch oluştur
3. ✅ Küçük commit'ler
4. ✅ Her adımda test
5. ✅ Rollback hazır tut

## Key Principles

- Kademeli değişiklik
- TypeScript ile tip güvenliği
- IDE refactoring araçları kullan
- Her adımda test

## References

See [rules.md](references/rules.md) for complete guidelines.
