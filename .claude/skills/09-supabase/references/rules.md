# Supabase - Detaylı Kurallar

## 1. Client Setup

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

---

## 2. Type Generation

```bash
# Supabase CLI ile tip üret
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts
```

```typescript
// types/supabase.ts (otomatik üretilir)
export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: { id: string; date: string; ... };
        Insert: { date: string; ... };
        Update: { date?: string; ... };
      };
    };
  };
}
```

---

## 3. Data Fetching

```typescript
// Basit sorgu
const { data, error } = await supabase
  .from('bookings')
  .select('*')
  .eq('status', 'confirmed');

// İlişkili veri
const { data, error } = await supabase
  .from('bookings')
  .select(`
    *,
    customer:customers(*),
    staff:staff(*),
    service:services(*)
  `)
  .eq('tenant_id', tenantId)
  .order('date', { ascending: true });

// Pagination
const { data, error, count } = await supabase
  .from('bookings')
  .select('*', { count: 'exact' })
  .range(0, 9);  // İlk 10
```

---

## 4. Insert / Update / Delete

```typescript
// Insert
const { data, error } = await supabase
  .from('bookings')
  .insert({
    customer_id: customerId,
    staff_id: staffId,
    date: '2024-01-15',
    start_time: '10:00',
  })
  .select()
  .single();

// Update
const { data, error } = await supabase
  .from('bookings')
  .update({ status: 'confirmed' })
  .eq('id', bookingId)
  .select()
  .single();

// Delete
const { error } = await supabase
  .from('bookings')
  .delete()
  .eq('id', bookingId);
```

---

## 5. Authentication

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: { name, role: 'customer' },
  },
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

// Sign out
await supabase.auth.signOut();

// Get current user
const { data: { user } } = await supabase.auth.getUser();

// Listen to auth changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // User signed in
  } else if (event === 'SIGNED_OUT') {
    // User signed out
  }
});
```

---

## 6. Row Level Security (RLS)

```sql
-- Tablo için RLS aktif
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Kullanıcı sadece kendi booking'lerini görsün
CREATE POLICY "Users see own bookings" ON bookings
  FOR SELECT
  USING (customer_id = auth.uid());

-- Policy: Staff kendi tenant'ının booking'lerini görsün
CREATE POLICY "Staff sees tenant bookings" ON bookings
  FOR SELECT
  USING (
    tenant_id = (
      SELECT tenant_id FROM staff WHERE user_id = auth.uid()
    )
  );

-- Policy: Insert için
CREATE POLICY "Customers can create bookings" ON bookings
  FOR INSERT
  WITH CHECK (customer_id = auth.uid());
```

---

## 7. Realtime Subscriptions

```typescript
// Subscribe
const subscription = supabase
  .channel('bookings-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'bookings',
      filter: `tenant_id=eq.${tenantId}`,
    },
    (payload) => {
      if (payload.eventType === 'INSERT') {
        // Yeni booking
      } else if (payload.eventType === 'UPDATE') {
        // Güncelleme
      } else if (payload.eventType === 'DELETE') {
        // Silme
      }
    }
  )
  .subscribe();

// Cleanup (useEffect return)
return () => {
  supabase.removeChannel(subscription);
};
```

---

## 8. Storage

```typescript
// Upload
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.jpg`, file, {
    cacheControl: '3600',
    upsert: true,
  });

// Get public URL
const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl(`${userId}/avatar.jpg`);

// Delete
await supabase.storage
  .from('avatars')
  .remove([`${userId}/avatar.jpg`]);
```

---

## 9. Error Handling

```typescript
async function getBookings() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*');

  if (error) {
    console.error('Supabase error:', error.message);
    throw new Error(error.message);
  }

  return data;
}

// Hook ile
function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      try {
        const { data, error } = await supabase.from('bookings').select('*');
        if (error) throw error;
        setBookings(data ?? []);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  return { bookings, loading, error };
}
```

---

## 10. Kontrol Listesi

- [ ] Tek supabase client instance
- [ ] Types generate edilmiş
- [ ] RLS her tabloda aktif
- [ ] Error handling her sorguda
- [ ] Realtime subscription cleanup var
- [ ] Storage bucket policy'leri tanımlı
- [ ] Auth state listener var
