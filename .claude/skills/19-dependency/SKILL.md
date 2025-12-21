---
name: dependency
description: Paket yönetimi, security audit ve upgrade stratejisi. npm paketleri yönetirken bu skill'i kullan.
---

# Dependency Management

> Paket yönetimi, güvenlik ve upgrade stratejisi.

## Security Audit

```bash
npm audit
npm audit fix
npm audit fix --force  # Dikkatli kullan
```

## Upgrade Stratejisi

1. **Minor/Patch**: Güvenle upgrade et
2. **Major**: CHANGELOG oku, breaking changes kontrol et
3. **Test**: Her upgrade sonrası test çalıştır

## Cleanup

```bash
npx depcheck  # Kullanılmayan paketleri bul
npm uninstall <unused-package>
```

## Key Principles

- Düzenli security audit
- Lockfile commit et
- Major upgrade'leri planlı yap
- Bundle size izle

## References

See [rules.md](references/rules.md) for complete guidelines.
