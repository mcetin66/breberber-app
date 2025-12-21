---
name: debugging
description: Sistematik bug çözme protokolü. Runtime error, performance issue veya intermittent bug çözerken bu skill'i kullan.
---

# Debugging - Bug Çözme Protokolü

> 7 adımlı sistematik hata ayıklama süreci.

## 7 Adım

1. **REPRODUCE** → Hatayı tekrarla
2. **OBSERVE** → Tüm bilgiyi topla
3. **ISOLATE** → Sorunu izole et
4. **HYPOTHESIZE** → Hipotez üret
5. **TEST** → Hipotezi test et
6. **FIX** → Düzelt
7. **REFLECT** → Post-mortem yap

## Common Patterns

| Hata Tipi | Strateji |
|-----------|----------|
| Runtime Error | Stack trace takip et |
| Intermittent | Timing/race condition ara |
| Performance | Profiler kullan |
| Memory Leak | Heap snapshot al |

## Key Principles

- Binary search ile izole et
- Bir seferde tek değişiklik
- Her adımı belgele
- Post-mortem yap

## References

See [rules.md](references/rules.md) for complete protocol.
