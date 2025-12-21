---
name: nextjs-web
description: Next.js App Router ve web geliştirme kuralları. Web projesi oluştururken veya geliştirirken bu skill'i kullan.
---

# Next.js Web (App Router)

> Next.js App Router ve web geliştirme kuralları.

## Quick Start

```
app/
├── layout.tsx           # Root layout
├── page.tsx             # Ana sayfa
├── loading.tsx          # Loading UI
├── error.tsx            # Error UI
├── (auth)/              # Route group
│   ├── login/page.tsx
│   └── register/page.tsx
└── api/                 # API Routes
    └── users/route.ts
```

## Server vs Client

```tsx
// Server Component (varsayılan)
async function UserList() {
  const users = await getUsers();
  return <ul>...</ul>;
}

// Client Component
'use client';
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

## Key Principles

- App Router kullan (pages/ değil)
- Varsayılan Server Component
- Her sayfada metadata (SEO)
- Loading/Error UI kullan

## References

See [rules.md](references/rules.md) for complete guidelines.
