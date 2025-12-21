---
name: multi-tenant
description: Multi-tenant sistemlerde UI ve veritabanı mimarisi. Rol bazlı ekranlar, tenant izolasyonu ve permission sistemi için bu skill'i kullan.
---

# Multi-tenant Architecture

> Birden fazla rol ve tenant içeren sistemler için mimari prensipler.

## Temel Prensipler

1. **Tekrar → Ortaklaştır:** Birden fazla rolün kullandığı pattern'i base + variant olarak tasarla
2. **Role Göre Farklı → Composable Yap:** Rol sayısından bağımsız, genişletilebilir yapılar
3. **Tenant'a Özel → İzole Et:** Tenant-owned veriler için izolasyon pattern'i
4. **Değişebilir → Genişletilebilir Tasarla:** Yeni rol/tenant eklenebilir şekilde

## Quick Start

```
app/
├── (role-a)/           # Her rol için izole layout
│   └── _layout.tsx
├── (role-b)/
│   └── _layout.tsx
└── components/shared/  # Ortak base bileşenler
```

## Key Principles

- Permission-based UI rendering
- RLS ile tenant izolasyonu
- Config-driven navigation
- Audit trail

## References

See [ui-patterns.md](references/ui-patterns.md) and [database-patterns.md](references/database-patterns.md).
