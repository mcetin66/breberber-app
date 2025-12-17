import { Stack } from 'expo-router';

export default function PlatformLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* The Tab Navigator */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Detail Screens (Cover Tabs) */}
      <Stack.Screen
        name="audit"
        options={{
          headerShown: false,
          presentation: 'card',
          animation: 'slide_from_right'
        }}
      />
    </Stack>
  );
}
