# Next.js App Router - Detaylı Kurallar

## 1. Yapı

```
app/
├── layout.tsx           # Root layout
├── page.tsx             # / route
├── loading.tsx          # Loading UI
├── error.tsx            # Error UI
├── not-found.tsx        # 404 page
├── (auth)/              # Route group (URL'de görünmez)
│   ├── login/page.tsx
│   └── register/page.tsx
├── dashboard/
│   ├── layout.tsx       # Nested layout
│   ├── page.tsx
│   └── settings/page.tsx
└── api/
    └── users/
        └── route.ts     # API Route
```

---

## 2. Server vs Client Components

### Server Component (Varsayılan)
```typescript
// app/users/page.tsx
async function UsersPage() {
  const users = await getUsers();  // Doğrudan async
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Client Component
```typescript
// components/Counter.tsx
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}
```

### Ne Zaman Client?
- `useState`, `useEffect` kullanıyorsan
- Event handlers (onClick, onChange)
- Browser API'leri
- Custom hooks with state

---

## 3. Metadata (SEO)

```typescript
// app/layout.tsx - Global
export const metadata: Metadata = {
  title: {
    default: 'My App',
    template: '%s | My App',
  },
  description: 'My awesome app',
};

// app/dashboard/page.tsx - Sayfa özel
export const metadata: Metadata = {
  title: 'Dashboard',  // "Dashboard | My App" olur
  description: 'User dashboard',
};

// Dinamik metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = await getUser(params.id);
  return {
    title: user.name,
    description: `Profile of ${user.name}`,
  };
}
```

---

## 4. Loading & Error States

```typescript
// app/dashboard/loading.tsx
export default function Loading() {
  return <Skeleton className="w-full h-96" />;
}

// app/dashboard/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

---

## 5. Route Groups

URL'de görünmeyen gruplar:
```
app/
├── (marketing)/         # Marketing sayfaları
│   ├── layout.tsx       # Marketing layout
│   ├── page.tsx         # /
│   └── about/page.tsx   # /about
├── (dashboard)/         # Dashboard sayfaları
│   ├── layout.tsx       # Dashboard layout
│   └── settings/page.tsx # /settings
```

---

## 6. API Routes

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const users = await getUsers();
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Validation
  const result = userSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const user = await createUser(result.data);
  return NextResponse.json(user, { status: 201 });
}

// Dynamic route: app/api/users/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser(params.id);
  if (!user) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(user);
}
```

---

## 7. Server Actions

```typescript
// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function createBooking(formData: FormData) {
  const data = {
    date: formData.get('date') as string,
    time: formData.get('time') as string,
  };

  // Validation
  const result = bookingSchema.safeParse(data);
  if (!result.success) {
    return { error: result.error.message };
  }

  await db.bookings.create({ data: result.data });
  
  revalidatePath('/bookings');
  return { success: true };
}

// Kullanım (Client Component)
'use client';

function BookingForm() {
  const [state, formAction] = useFormState(createBooking, null);

  return (
    <form action={formAction}>
      <input name="date" type="date" />
      <input name="time" type="time" />
      <button type="submit">Book</button>
      {state?.error && <p className="text-red-500">{state.error}</p>}
    </form>
  );
}
```

---

## 8. Kontrol Listesi

- [ ] App Router kullanılıyor (pages/ yok)
- [ ] Server Component varsayılan
- [ ] 'use client' sadece gerektiğinde
- [ ] Her sayfada metadata var
- [ ] loading.tsx ve error.tsx var
- [ ] Route groups mantıklı
- [ ] API Routes doğru yapıda
- [ ] Server Actions validation içeriyor
