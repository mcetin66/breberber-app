import { Tabs } from 'expo-router';
import { View } from 'react-native';

interface FloatingTabsProps {
  children: React.ReactNode;
}

export function FloatingTabs({ children }: FloatingTabsProps) {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1E293B', // Dark slate
          borderTopWidth: 0,
          position: 'absolute',
          bottom: 30, // Floating
          left: 15,
          right: 15,
          borderRadius: 25,
          height: 80,
          paddingBottom: 0,
          paddingHorizontal: 5,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 0.5,
          shadowRadius: 10,
          elevation: 20,
        },
        tabBarItemStyle: {
          height: 80,
          paddingTop: 15,
        },
        tabBarActiveTintColor: '#3B82F6', // Blue-500
        tabBarInactiveTintColor: '#64748B', // Slate-500
        tabBarLabelStyle: {
          fontFamily: 'Poppins_500Medium', // Updated from Manrope to match Admin
          fontSize: 9,
          marginTop: 5,
          marginBottom: 15,
        },
      }}
    >
      {children}
    </Tabs>
  );
}
