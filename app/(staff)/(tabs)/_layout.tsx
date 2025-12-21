import { Tabs } from 'expo-router';
import { LayoutDashboard, User, Calendar, Settings } from 'lucide-react-native';
import { View } from 'react-native';

export default function StaffTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1E1E1E', // Dark Card Background
          borderTopWidth: 1,
          borderTopColor: 'rgba(212, 175, 53, 0.2)', // Subtle Gold
          height: 90,
          paddingTop: 10,
          paddingBottom: 30,
        },
        tabBarItemStyle: {
          height: 50,
        },
        tabBarActiveTintColor: '#d4af35', // Gold
        tabBarInactiveTintColor: '#64748B',
        tabBarLabelStyle: {
          fontFamily: 'Poppins_500Medium',
          fontSize: 10,
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Takvimim',
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Panel',
          tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
