import { Tabs } from 'expo-router';
import { LayoutDashboard, Scissors, Wallet, Settings } from 'lucide-react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { COLORS } from '@/constants/theme';
import { View } from 'react-native';

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1E293B',
          borderTopWidth: 0,
          position: 'absolute',
          bottom: 40, // Increased to clear Home Indicator completely
          left: 20,
          right: 20,
          borderRadius: 30, // Slightly rounder
          height: 70, // Slightly taller
          paddingBottom: 0, // Reset padding
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999, // Ensure it's on top
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          elevation: 10,
        },
        tabBarItemStyle: {
          height: 70,
          paddingTop: 12,
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#64748B',
        tabBarLabelStyle: {
          fontFamily: 'Poppins_500Medium',
          fontSize: 10,
          marginTop: 4, // Space between icon and label
          marginBottom: 12, // Push label up
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Panel',
          tabBarIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="barbers"
        options={({ route }) => ({
          title: 'İşletmeler',
          tabBarIcon: ({ color, size }) => <Scissors size={size} color={color} />,
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route);
            // console.log('Current Route:', routeName); // For debugging if needed

            // Only show tab bar on the main list (index) or when undefined (initial load)
            if (routeName && routeName !== "index") {
              return { display: "none" };
            }

            // Keep the default style (floating) for the index
            return {
              backgroundColor: '#1E293B',
              borderTopWidth: 0,
              position: 'absolute',
              bottom: 40,
              left: 20,
              right: 20,
              borderRadius: 30,
              height: 70,
              paddingBottom: 0,
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 999,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
              elevation: 10,
            };
          })(route),
        })}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Finans',
          tabBarIcon: ({ color, size }) => <Wallet size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ayarlar',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
