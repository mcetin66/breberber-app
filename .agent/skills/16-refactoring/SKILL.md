---
name: refactoring
description: Kod iyileştirme ve yeniden yapılandırma kuralları. Code smell temizliği, DRY uygulama için bu skill'i kullan.
---

# Refactoring - Kod İyileştirme

> Güvenli ve sistematik kod iyileştirme.

## Code Smells

| Smell | Refactoring |
|-------|-------------|
| Uzun fonksiyon | Extract Function |
| Duplicate kod | DRY - Birleştir |
| Büyük class | Single Responsibility |
| Magic numbers | Named constants |
| Deep nesting | Early return |

## Refactoring Süreci

1. ✅ Test yaz (yoksa)
2. ✅ Küçük adımlarla değiştir
3. ✅ Her adımda test çalıştır
4. ✅ Commit at

## Key Principles

- Önce test, sonra refactor
- Küçük adımlar
- Her adımda çalışır durumda kal
- Davranışı değiştirme

## References

See [rules.md](references/rules.md) for complete guidelines.
