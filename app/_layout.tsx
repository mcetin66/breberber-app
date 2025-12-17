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

    console.log('ROOT LAYOUT: Segments', JSON.stringify(segments));
    console.log('ROOT LAYOUT: Auth State', { role: user?.role, isAuthenticated });

    const isPublicRoute = segments[0] === 'barber' || segments[0] === 'detail' || segments[0] === 'business-role';
    if (isPublicRoute) return;

    const { viewMode } = useAuthStore.getState(); // direct access to avoid stale closure

    if (!isAuthenticated && !inAuthGroup && !inPlatformGroup && segments[0] !== undefined) {
      console.log('Redirecting to /');
      router.replace('/');
    } else if (isAuthenticated && user) {
      const currentRole = user.role;
      const currentView = viewMode || (currentRole === 'business_owner' ? 'business' : currentRole === 'staff' ? 'staff' : currentRole === 'platform_admin' ? 'platform' : 'customer');

      if (currentView === 'customer' && !inCustomerGroup) {
        console.log('Redirecting to /(customer)/home');
        router.replace('/(customer)/home');
      }
      else if (currentView === 'business' && !inBusinessGroup) {
        console.log('Redirecting to /(business)/(tabs)/dashboard');
        router.replace('/(business)/(tabs)/dashboard');
      }
      // Staff view redirection (allows business_owner in staff mode)
      else if (currentView === 'staff' && !inStaffGroup) {
        console.log('Redirecting to /(staff)/(tabs)/dashboard');
        router.replace('/(staff)/(tabs)/dashboard');
      }
      else if (currentView === 'platform' && !inPlatformGroup) {
        console.log('Redirecting to /(platform)/dashboard');
        router.replace('/(platform)/dashboard');
      }
    }
  }, [isAuthenticated, user, segments, isLoading]); // removed viewMode from dep to avoid loops, access via getState

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
