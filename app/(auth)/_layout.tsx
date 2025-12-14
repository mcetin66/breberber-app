import { View } from 'react-native';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0f0f0f' }}>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
    </View>
  );
}
