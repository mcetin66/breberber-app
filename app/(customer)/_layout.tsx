import { Stack } from 'expo-router';

export default function CustomerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="search" />
      <Stack.Screen name="profile-edit" />
      <Stack.Screen name="booking" />
      <Stack.Screen name="business" />
    </Stack>
  );
}
