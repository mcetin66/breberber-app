---
name: react-patterns
description: React bileşen patterns ve Zustand state yönetimi kuralları. React bileşeni yazarken veya state yönetimi kurarken bu skill'i kullan.
---

# React Patterns + Zustand

> React bileşen yapısı ve Zustand state yönetimi kuralları.

## Quick Start

```tsx
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ title, onPress, variant = 'primary' }: ButtonProps) {
  return (
    <Pressable onPress={onPress}>
      <Text>{title}</Text>
    </Pressable>
  );
}
```

## Zustand Store

```typescript
import { create } from 'zustand';

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  login: async (email, password) => { /* ... */ },
  logout: () => set({ user: null }),
}));
```

## Key Principles

- Fonksiyonel bileşenler (class değil)
- Props'ları destructure et
- Custom hooks `use` prefix'i ile
- State yönetimi için Zustand
- Selector ile sadece gerekli state'i al

## References

See [rules.md](references/rules.md) for complete guidelines.
