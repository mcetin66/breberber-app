import { View } from 'react-native';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0f0f0f' }}>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="customer-register" />
        <Stack.Screen name="business-register" />
        <Stack.Screen name="staff-login" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="otp" />
      </Stack>
    </View>
  );
}
