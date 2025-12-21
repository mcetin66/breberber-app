---
name: nativewind
description: NativeWind (TailwindCSS) ile UI styling kuralları. Bileşen stilleri, dark mode ve responsive tasarım için bu skill'i kullan.
---

# NativeWind - TailwindCSS for React Native

> NativeWind (TailwindCSS) ile styling kuralları.

## Quick Start

```tsx
<View className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg">
  <Text className="text-lg font-bold text-gray-900 dark:text-white">
    {title}
  </Text>
</View>
```

## Dark Mode

```tsx
<View className="bg-white dark:bg-gray-900">
  <Text className="text-gray-900 dark:text-white">Merhaba</Text>
</View>
```

## Key Principles

- `className` ile Tailwind syntax
- Dark mode için `dark:` prefix
- Tutarlı spacing: 4, 8, 12, 16, 24, 32
- Tutarlı renkler: primary, secondary
- `twMerge` ile conditional styling

## References

See [rules.md](references/rules.md) for complete guidelines.
