# NativeWind - Detaylı Kurallar

## 1. Temel Kullanım

```tsx
import { View, Text } from 'react-native';

export function Card({ title, description }: CardProps) {
  return (
    <View className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg">
      <Text className="text-lg font-bold text-gray-900 dark:text-white">
        {title}
      </Text>
      <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
        {description}
      </Text>
    </View>
  );
}
```

---

## 2. Dark Mode

```tsx
// Otomatik dark mode
<View className="bg-white dark:bg-gray-900">
  <Text className="text-gray-900 dark:text-white">
    Light/Dark text
  </Text>
</View>

// Provider'da theme
import { useColorScheme } from 'nativewind';

function App() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  
  return (
    <Pressable onPress={toggleColorScheme}>
      <Text>Current: {colorScheme}</Text>
    </Pressable>
  );
}
```

---

## 3. Spacing Sistemi (8-point grid)

```
p-1  = 4px
p-2  = 8px
p-3  = 12px
p-4  = 16px
p-6  = 24px
p-8  = 32px
p-12 = 48px
```

✅ Doğru:
```tsx
<View className="p-4 gap-4">  {/* 16px padding, 16px gap */}
  <Text className="mb-2">...</Text>  {/* 8px margin-bottom */}
</View>
```

❌ Yanlış:
```tsx
<View className="p-[13px]">  {/* Rastgele değer */}
```

---

## 4. Renk Sistemi

```tsx
// Semantic colors
<View className="bg-primary-500">  {/* Marka rengi */}
<View className="bg-success-500">  {/* Başarı */}
<View className="bg-warning-500">  {/* Uyarı */}
<View className="bg-error-500">    {/* Hata */}

// Text renkleri
<Text className="text-gray-900 dark:text-white">     {/* Primary */}
<Text className="text-gray-600 dark:text-gray-400">  {/* Secondary */}
<Text className="text-gray-400 dark:text-gray-500">  {/* Muted */}
```

tailwind.config.js:
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf4e7',
          500: '#D4A574',  // Gold
          600: '#B8956A',
        },
      },
    },
  },
};
```

---

## 5. Conditional Styling

```tsx
import { twMerge } from 'tailwind-merge';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
}

const variantClasses = {
  primary: 'bg-primary-500 text-white',
  secondary: 'bg-gray-200 text-gray-800',
  outline: 'border border-gray-300 text-gray-800',
};

export function Button({ variant = 'primary', disabled }: ButtonProps) {
  return (
    <Pressable
      className={twMerge(
        'px-4 py-3 rounded-xl',
        variantClasses[variant],
        disabled && 'opacity-50'
      )}
    >
      ...
    </Pressable>
  );
}
```

---

## 6. Layout Patterns

```tsx
// Flex row with gap
<View className="flex-row items-center gap-3">
  <Avatar />
  <Text>Name</Text>
</View>

// Centering
<View className="flex-1 items-center justify-center">
  <Text>Centered</Text>
</View>

// Space between
<View className="flex-row justify-between">
  <Text>Left</Text>
  <Text>Right</Text>
</View>

// Absolute positioning
<View className="relative">
  <Image className="w-full h-48" />
  <View className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded">
    <Text className="text-white text-xs">Badge</Text>
  </View>
</View>
```

---

## 7. Platform Shadows

```tsx
// iOS shadow
<View className="ios:shadow-lg ios:shadow-black/10">

// Android elevation
<View className="android:elevation-4">

// Birlikte (NativeWind 4+)
<View className="shadow-lg shadow-black/10 elevation-4">
```

---

## 8. Input Styling

```tsx
<TextInput
  className="
    border border-gray-300 dark:border-gray-600
    bg-white dark:bg-gray-800
    text-gray-900 dark:text-white
    px-4 py-3 rounded-xl
    focus:border-primary-500
  "
  placeholderTextColor="#9CA3AF"
/>
```

---

## 9. Typography

```tsx
// Sizes
<Text className="text-xs">12px</Text>
<Text className="text-sm">14px</Text>
<Text className="text-base">16px</Text>
<Text className="text-lg">18px</Text>
<Text className="text-xl">20px</Text>
<Text className="text-2xl">24px</Text>

// Weights
<Text className="font-normal">Normal</Text>
<Text className="font-medium">Medium</Text>
<Text className="font-semibold">Semibold</Text>
<Text className="font-bold">Bold</Text>

// Heading example
<Text className="text-2xl font-bold text-gray-900 dark:text-white">
  Page Title
</Text>
```

---

## 10. Kontrol Listesi

- [ ] Dark mode her bileşende
- [ ] 8-point grid spacing
- [ ] Semantic color isimleri
- [ ] twMerge conditional styling için
- [ ] Platform-aware shadows
- [ ] Tutarlı typography
- [ ] Input focus states
