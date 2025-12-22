# TypeScript - Detaylı Kurallar

## 1. any Yasak

❌ Yanlış:
```typescript
function processData(data: any) {
  return data.value;
}
```

✅ Doğru:
```typescript
interface DataItem {
  value: string;
  count: number;
}

function processData(data: DataItem) {
  return data.value;
}
```

---

## 2. unknown Kullan

API'den veya dışarıdan gelen veri için:

```typescript
// API response
async function fetchUser(id: string): Promise<unknown> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// Type guard ile kullan
function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'email' in data
  );
}

const data = await fetchUser('123');
if (isUser(data)) {
  console.log(data.email); // Güvenli
}
```

---

## 3. interface vs type

✅ Tercih: `interface` (genişletilebilir)
```typescript
interface User {
  id: string;
  name: string;
}

interface Admin extends User {
  permissions: string[];
}
```

`type` kullan: Union, intersection, primitives için
```typescript
type Status = 'pending' | 'confirmed' | 'cancelled';
type UserOrAdmin = User | Admin;
```

---

## 4. as const (enum yerine)

❌ Yanlış:
```typescript
enum BookingStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
}
```

✅ Doğru:
```typescript
const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
} as const;

type BookingStatus = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];
```

---

## 5. Optional Chaining & Nullish Coalescing

```typescript
// Optional chaining
const userName = user?.profile?.name;

// Nullish coalescing
const displayName = user?.name ?? 'Anonymous';

// Birlikte
const avatar = user?.profile?.avatar ?? '/default-avatar.png';
```

❌ Yanlış:
```typescript
const displayName = user?.name || 'Anonymous';  // '' false olur
```

---

## 6. Function Return Types

✅ Her zaman belirt:
```typescript
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

async function getUser(id: string): Promise<User | null> {
  // ...
}
```

---

## 7. Generic Kullanımı

```typescript
// Generic fonksiyon
function first<T>(array: T[]): T | undefined {
  return array[0];
}

// Generic interface
interface ApiResponse<T> {
  data: T;
  error: string | null;
  loading: boolean;
}

// Kullanım
const response: ApiResponse<User[]> = await fetchUsers();
```

---

## 8. Type Guards

```typescript
// typeof guard
function padLeft(value: string, padding: string | number): string {
  if (typeof padding === 'number') {
    return ' '.repeat(padding) + value;
  }
  return padding + value;
}

// in guard
interface Bird { fly(): void; }
interface Fish { swim(): void; }

function move(animal: Bird | Fish) {
  if ('fly' in animal) {
    animal.fly();
  } else {
    animal.swim();
  }
}

// Custom type guard
function isError(response: unknown): response is { error: string } {
  return typeof response === 'object' && response !== null && 'error' in response;
}
```

---

## 9. Utility Types

```typescript
// Partial - tüm alanlar opsiyonel
type UpdateUser = Partial<User>;

// Pick - belirli alanlar
type UserPreview = Pick<User, 'id' | 'name'>;

// Omit - belirli alanları çıkar
type CreateUser = Omit<User, 'id' | 'createdAt'>;

// Required - tüm alanlar zorunlu
type CompleteUser = Required<User>;

// Record
type UserMap = Record<string, User>;
```

---

## 10. Strict Mode

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

---

## 11. Kontrol Listesi

- [ ] `any` yok (zorunlu durumlarda `unknown`)
- [ ] Fonksiyon return tipleri belirtilmiş
- [ ] `interface` tercih edilmiş
- [ ] `as const` kullanılmış (enum yerine)
- [ ] Optional chaining ve nullish coalescing doğru
- [ ] Type guard'lar tanımlı
- [ ] Strict mode aktif
