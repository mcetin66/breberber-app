import { Stack } from 'expo-router';

export default function BusinessRootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* The Main Tabs Group */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Feature Stacks / Screens outside tabs */}
      <Stack.Screen name="services" options={{ headerShown: false }} />
      <Stack.Screen name="staff-dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
