import '../global.css';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '@/stores/authStore';

SplashScreen.preventAutoHideAsync().catch(() => { });

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const { user, isAuthenticated, isLoading, initialize } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, []);

  const isSplashHidden = React.useRef(false);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      if (!isSplashHidden.current) {
        try {
          SplashScreen.hideAsync()
            .then(() => { isSplashHidden.current = true; })
            .catch((e) => {
              console.log('Splash Screen Safe Error:', e);
              isSplashHidden.current = true;
            });
        } catch (e) {
          // Ignore synchronous errors
        }
      }
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if ((!fontsLoaded && !fontError) || isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inCustomerGroup = segments[0] === '(customer)';
    const inBusinessGroup = segments[0] === '(business)';
    const inStaffGroup = segments[0] === '(staff)';
    const inPlatformGroup = segments[0] === '(platform)';

    const isPublicRoute = segments[0] === 'barber' || segments[0] === 'detail' || segments[0] === 'business-role' || segments[0] === 'role-selection' || segments[0] === '(legal)';
    if (isPublicRoute) return;

    const { viewMode } = useAuthStore.getState();

    if (!isAuthenticated && !inAuthGroup && segments[0] !== undefined) {
      router.replace('/');
    } else if (isAuthenticated && user && segments[0] === undefined) {
      // Only redirect when at root (index) - not on tab switches
      const currentRole = user.role;
      const currentView = viewMode || (currentRole === 'business_owner' ? 'business' : currentRole === 'staff' ? 'staff' : currentRole === 'platform_admin' ? 'platform' : 'customer');

      if (currentView === 'customer') {
        router.replace('/(customer)/(tabs)/home' as any);
      } else if (currentView === 'business') {
        router.replace('/(business)/(tabs)/dashboard');
      } else if (currentView === 'staff') {
        router.replace('/(staff)/(tabs)/dashboard');
      } else if (currentView === 'platform') {
        router.replace('/(platform)/(tabs)/dashboard');
      }
    }
  }, [isAuthenticated, user, isLoading, fontsLoaded, fontError]); // Removed segments to prevent redirect on every tab switch

  if ((!fontsLoaded && !fontError) || isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f0f0f', alignItems: 'center', justifyContent: 'center' }} />
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#0f0f0f' }}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(legal)" />
        <Stack.Screen name="(customer)" />
        <Stack.Screen name="(business)" />
        <Stack.Screen name="(staff)" />
        <Stack.Screen name="(platform)" />
        <Stack.Screen name="business-role" />
        <Stack.Screen name="barber/[id]" options={{ presentation: 'card', headerTitle: 'Berber Detayı' }} />
      </Stack>
      <Toast />
    </GestureHandlerRootView>
  );
}
