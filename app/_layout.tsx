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

// Prevent auto hide, but ignore errors if safe
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading */
});

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
        // Wrap in immediate try-catch to satisfy linter and runtime
        try {
          SplashScreen.hideAsync()
            .then(() => { isSplashHidden.current = true; })
            .catch((e) => {
              // Vital: Ignore "No native splash screen" error during hot reload
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
    const inAdminGroup = segments[0] === '(admin)';

    console.log('ROOT LAYOUT: Segments changed', JSON.stringify(segments));
    console.log('ROOT LAYOUT: Auth State', { role: user?.role, isAuthenticated });


    // Allow access to shared/public routes regardless of role
    const isPublicRoute = segments[0] === 'barber' || segments[0] === 'detail' || segments[0] === 'business-role';
    if (isPublicRoute) return;

    if (!isAuthenticated && !inAuthGroup && !inAdminGroup && segments[0] !== undefined) {
      console.log('Redirecting to /');
      router.replace('/');
    } else if (isAuthenticated && user) {
      if (user.role === 'customer' && !inCustomerGroup) {
        console.log('Redirecting to /(customer)/home');
        router.replace('/(customer)/home');
      } else if (user.role === 'business') {
        if (!user.subRole && (segments[1] as string) !== 'business-role') {
          router.replace('/business-role');
        } else if (user.subRole === 'owner' && !inBusinessGroup) {
          router.replace('/(business)/dashboard');
        } else if (user.subRole === 'staff' && !inBusinessGroup) {
          router.replace('/(business)/staff-dashboard');
        }
      } else if (user.role === 'admin' && !inAdminGroup && segments[0] !== undefined) {
        router.replace('/(admin)/dashboard');
      }
    }
  }, [isAuthenticated, user, segments, isLoading]);

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
        <Stack.Screen name="(admin)" />
        <Stack.Screen name="business-role" />
        <Stack.Screen name="barber/[id]" options={{ presentation: 'card', headerTitle: 'Berber Detayı' }} />
      </Stack>
      <Toast />
    </GestureHandlerRootView>
  );
}
