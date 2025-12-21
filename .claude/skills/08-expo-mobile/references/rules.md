# Expo Mobile - Detaylı Kurallar

## 1. Yapı (Expo Router)

```
app/
├── _layout.tsx          # Root layout
├── index.tsx            # / (home)
├── (tabs)/              # Tab navigation
│   ├── _layout.tsx      # Tab layout
│   ├── home.tsx
│   ├── bookings.tsx
│   └── profile.tsx
├── (auth)/              # Auth screens
│   ├── _layout.tsx
│   ├── login.tsx
│   └── register.tsx
├── booking/
│   └── [id].tsx         # Dynamic route
└── +not-found.tsx       # 404
```

---

## 2. Layout

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';
import { ThemeProvider } from '@react-navigation/native';

export default function RootLayout() {
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="booking/[id]" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}

// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color }) => <Ionicons name="calendar" color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
```

---

## 3. SafeAreaView

Her ekranda kullan:

```typescript
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <View className="flex-1 p-4">
        <Text>Content</Text>
      </View>
    </SafeAreaView>
  );
}
```

---

## 4. Platform Kontrolü

```typescript
import { Platform } from 'react-native';

// Platform.select
const styles = Platform.select({
  ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 } },
  android: { elevation: 4 },
  web: { boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
});

// Platform.OS
if (Platform.OS === 'ios') {
  // iOS specific
}

// Dosya bazlı
// Button.ios.tsx
// Button.android.tsx
// Button.tsx (fallback/web)
```

---

## 5. Haptic Feedback

```typescript
import * as Haptics from 'expo-haptics';

function handlePress() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  // ...
}

// Butonlarda
<Pressable
  onPress={() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  }}
>
```

---

## 6. Navigation

```typescript
import { useRouter, useLocalSearchParams, Link } from 'expo-router';

// Programmatic navigation
function BookingCard({ id }: { id: string }) {
  const router = useRouter();
  
  return (
    <Pressable onPress={() => router.push(`/booking/${id}`)}>
      ...
    </Pressable>
  );
}

// Link component
<Link href="/profile" asChild>
  <Pressable>
    <Text>Go to Profile</Text>
  </Pressable>
</Link>

// Dynamic params
function BookingDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Text>Booking: {id}</Text>;
}
```

---

## 7. Web Uyumluluğu

```typescript
// Web-safe components
import { ScrollView, FlatList } from 'react-native';  // ✅
import { RecyclerListView } from 'recyclerlistview';  // ❌ Web'de çalışmaz

// Conditional rendering
const isWeb = Platform.OS === 'web';

{isWeb ? (
  <WebSpecificComponent />
) : (
  <NativeSpecificComponent />
)}

// Expo SDK web-compatible modüller
import * as SecureStore from 'expo-secure-store';  // ❌ Web'de çalışmaz
import AsyncStorage from '@react-native-async-storage/async-storage';  // ✅ Her yerde
```

---

## 8. Async Storage

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save
await AsyncStorage.setItem('user', JSON.stringify(user));

// Load
const userJson = await AsyncStorage.getItem('user');
const user = userJson ? JSON.parse(userJson) : null;

// Remove
await AsyncStorage.removeItem('user');
```

---

## 9. App Config

```typescript
// app.config.ts
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'My App',
  slug: 'my-app',
  version: '1.0.0',
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  },
});
```

---

## 10. Kontrol Listesi

- [ ] Expo Router kullanılıyor
- [ ] SafeAreaView her ekranda
- [ ] Platform.select shadow'lar için
- [ ] Haptic feedback butonlarda
- [ ] Web uyumluluğu test edildi
- [ ] AsyncStorage doğru kullanılıyor
- [ ] Environment variables EXPO_PUBLIC_ prefix'li
