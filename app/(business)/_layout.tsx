import { Stack } from 'expo-router';

export default function BusinessRootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* The Main Tabs Group */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Feature Stacks / Screens outside tabs */}
      <Stack.Screen name="services" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen name="finance" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" options={{ headerShown: false }} />
    </Stack>
  );
}
