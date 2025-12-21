---
name: typescript
description: TypeScript tip güvenliği ve best practice kuralları. TypeScript kodu yazarken veya incelerken bu skill'i kullan.
---

# TypeScript Essentials

> Tip güvenliği ve TypeScript best practice kuralları.

## Quick Start

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
}

function getUser(id: string): User | null {
  // ...
}
```

## Key Principles

- `any` kullanma, doğru tip tanımla
- `interface` tercih et (`type` yerine)
- Optional chaining: `user?.name`
- Nullish coalescing: `value ?? 'default'`
- `enum` yerine `as const` objeler
- Fonksiyon dönüş tipini belirt
- `unknown` kullan, `any` değil

## References

See [rules.md](references/rules.md) for complete guidelines.
