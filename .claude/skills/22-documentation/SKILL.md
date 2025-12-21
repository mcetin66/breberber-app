---
name: documentation
description: README, API dokümantasyonu, CHANGELOG ve ADR yazma kuralları. Dokümantasyon yazarken bu skill'i kullan.
---

# Documentation

> README, API docs, CHANGELOG ve ADR (Architecture Decision Records).

## README Yapısı

```markdown
# Project Name

Brief description.

## Installation
npm install

## Usage
npm run dev

## Contributing
...

## License
MIT
```

## API Documentation

```typescript
/**
 * Kullanıcıyı ID ile getirir.
 * @param id - Kullanıcı ID'si
 * @returns Kullanıcı objesi veya null
 * @throws {AuthError} Yetki yoksa
 */
async function getUser(id: string): Promise<User | null> {
  // ...
}
```

## ADR Format

```markdown
# ADR-001: Database Seçimi

## Status: Accepted
## Decision: PostgreSQL
## Reason: RLS desteği, Supabase uyumu
## Consequences: ...
```

## Key Principles

- Self-documenting code
- API'de JSDoc kullan
- Mimari kararlarda ADR yaz
- CHANGELOG güncel tut

## References

See [rules.md](references/rules.md) for complete guidelines.
