---
name: dashboard
description: Dashboard bileşenleri, React Hook Form + Zod formlar, Victory grafikler. Admin panel geliştirirken bu skill'i kullan.
---

# Dashboard Components

> Form, grafik, tablo ve dashboard bileşenleri.

## Form (React Hook Form + Zod)

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter'),
  email: z.string().email('Geçerli email girin'),
});

const { control, handleSubmit } = useForm({
  resolver: zodResolver(schema),
});
```

## Grafik (Victory Native)

```tsx
import { VictoryChart, VictoryBar } from 'victory-native';

<VictoryChart>
  <VictoryBar data={data} x="month" y="revenue" />
</VictoryChart>
```

## Key Principles

- React Hook Form + Zod validation
- Victory Native grafikler
- Skeleton loader
- Empty state görselleri
- Error state handling

## References

See [rules.md](references/rules.md) for complete guidelines.
