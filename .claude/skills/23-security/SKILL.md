---
name: security
description: Güvenlik best practice'leri, input validation, XSS/CSRF koruması ve API güvenliği. Güvenlik konularında bu skill'i kullan.
---

# Security - Güvenlik Kuralları

> Güvenlik, hız veya kolaylıktan ASLA taviz vermez.

## Ne Zaman Kullanılmalı?

| Senaryo | Örnek |
|---------|-------|
| Input validation | "Kullanıcı girişini doğrula" |
| Authentication | "Login sistemi kur" |
| Authorization | "Yetki kontrolü ekle" |
| API security | "Rate limiting ekle" |
| Data protection | "Hassas veriyi koru" |

## Key Principles

- Tüm input'ları validate et (Zod)
- RLS her tabloda aktif
- API key'leri env'de
- HTTPS zorunlu
- Rate limiting aktif
- Sensitive data loglanmaz

## References

See [rules.md](references/rules.md) for complete guidelines.
