# React Patterns + Zustand - Detaylı Kurallar

## 1. Functional Components

✅ Doğru:
```typescript
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({ title, onPress, variant = 'primary', disabled }: ButtonProps) {
  return (
    <Pressable 
      onPress={onPress} 
      disabled={disabled}
      className={buttonVariants[variant]}
    >
      <Text>{title}</Text>
    </Pressable>
  );
}
```

❌ Yanlış: Class component
```typescript
class Button extends React.Component { ... }
```

---

## 2. Props Destructuring

✅ Doğru:
```typescript
function UserCard({ name, email, avatar }: UserCardProps) {
  return (
    <View>
      <Image source={{ uri: avatar }} />
      <Text>{name}</Text>
      <Text>{email}</Text>
    </View>
  );
}
```

❌ Yanlış:
```typescript
function UserCard(props: UserCardProps) {
  return (
    <View>
      <Text>{props.name}</Text>  {/* props. tekrarı */}
    </View>
  );
}
```

---

## 3. Custom Hooks

```typescript
// hooks/useBookings.ts
export function useBookings(staffId: string) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true);
        const data = await getBookings(staffId);
        setBookings(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [staffId]);

  return { bookings, loading, error, refetch: fetch };
}

// Kullanım
function BookingList({ staffId }: { staffId: string }) {
  const { bookings, loading, error } = useBookings(staffId);
  
  if (loading) return <Skeleton />;
  if (error) return <ErrorView message={error} />;
  return <FlatList data={bookings} ... />;
}
```

---

## 4. Zustand Store

```typescript
// stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const { user, token } = await authService.login(email, password);
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      setUser: (user) => set({ user }),
    }),
    { name: 'auth-storage' }
  )
);
```

---

## 5. Selector Kullanımı

✅ Doğru: Sadece gerekli state'i al
```typescript
// Tek değer
const user = useAuthStore(state => state.user);
const isAuthenticated = useAuthStore(state => state.isAuthenticated);

// Birden fazla değer (shallow compare)
import { shallow } from 'zustand/shallow';

const { user, logout } = useAuthStore(
  state => ({ user: state.user, logout: state.logout }),
  shallow
);
```

❌ Yanlış: Tüm store'u al (her değişiklikte re-render)
```typescript
const store = useAuthStore();
```

---

## 6. Memoization

```typescript
// useMemo - hesaplama sonucu
const totalPrice = useMemo(() => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}, [items]);

// useCallback - fonksiyon referansı
const handlePress = useCallback(() => {
  onItemSelect(item.id);
}, [item.id, onItemSelect]);

// React.memo - bileşen
const ExpensiveList = React.memo(function ExpensiveList({ items }: Props) {
  return items.map(item => <ExpensiveItem key={item.id} item={item} />);
});
```

**Ne zaman kullan:**
- `useMemo`: Pahalı hesaplamalar
- `useCallback`: Child'a geçilen fonksiyonlar
- `React.memo`: Sık render olan bileşenler

---

## 7. Early Return

✅ Doğru:
```typescript
function UserProfile({ userId }: Props) {
  const { user, loading, error } = useUser(userId);

  if (loading) return <Skeleton />;
  if (error) return <ErrorView message={error} />;
  if (!user) return <NotFound />;

  return (
    <View>
      <Text>{user.name}</Text>
    </View>
  );
}
```

❌ Yanlış: Nested conditionals
```typescript
function UserProfile({ userId }: Props) {
  const { user, loading, error } = useUser(userId);

  return (
    <View>
      {loading ? (
        <Skeleton />
      ) : error ? (
        <ErrorView />
      ) : user ? (
        <Text>{user.name}</Text>
      ) : (
        <NotFound />
      )}
    </View>
  );
}
```

---

## 8. Event Handler Naming

```typescript
// Props: on + Event
interface ButtonProps {
  onPress: () => void;
  onLongPress?: () => void;
}

// Handler: handle + Event
function BookingForm() {
  const handleSubmit = () => { ... };
  const handleCancel = () => { ... };
  
  return (
    <View>
      <Button onPress={handleSubmit} title="Submit" />
      <Button onPress={handleCancel} title="Cancel" />
    </View>
  );
}
```

---

## 9. Kontrol Listesi

- [ ] Functional components (class yok)
- [ ] Props destructure edilmiş
- [ ] Custom hook'lar `use` ile başlıyor
- [ ] Zustand store'lar feature-based
- [ ] Selector ile sadece gerekli state alınıyor
- [ ] Memoization gerektiğinde kullanılıyor
- [ ] Early return pattern uygulanmış
- [ ] Event handler isimlendirmesi tutarlı
