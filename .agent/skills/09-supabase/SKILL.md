---
name: supabase
description: Supabase veritabanı, authentication ve storage kuralları. Backend işlemleri için bu skill'i kullan.
---

# Supabase Database + Auth

> Supabase client, authentication, database ve storage kuralları.

## Quick Start

```typescript
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

export const supabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);
```

## Veri Çekme

```typescript
const { data, error } = await supabase
  .from('bookings')
  .select('*, customer:customers(*)')
  .eq('staff_id', staffId)
  .order('date', { ascending: true });
```

## Key Principles

- Tek supabase client instance
- Row Level Security (RLS) her zaman aktif
- `supabase gen types` ile otomatik tipler
- Realtime subscription cleanup
- Error handling zorunlu

## References

See [rules.md](references/rules.md) for complete guidelines.
