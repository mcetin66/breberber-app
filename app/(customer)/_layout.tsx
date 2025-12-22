import { Tabs } from 'expo-router';
import { Home, Calendar, Heart, User } from 'lucide-react-native';
import { TAB_BAR_STYLES, TAB_BAR_COLORS } from '@/constants/navigation';

export default function CustomerLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          ...TAB_BAR_STYLES.container,
          borderTopWidth: 1,
        },
        tabBarItemStyle: TAB_BAR_STYLES.item,
        tabBarActiveTintColor: TAB_BAR_COLORS.active,
        tabBarInactiveTintColor: TAB_BAR_COLORS.inactive,
        tabBarLabelStyle: TAB_BAR_STYLES.label,
      }}
    >
      {/* Visible Tabs */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Keşfet',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Randevular',
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoriler',
          tabBarIcon: ({ color }) => <Heart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />

      {/* Hidden Routes - Tab bar'da görünmez */}
      <Tabs.Screen name="search" options={{ href: null }} />
      <Tabs.Screen name="profile-edit" options={{ href: null }} />
      <Tabs.Screen name="booking" options={{ href: null }} />
      <Tabs.Screen name="business" options={{ href: null }} />
    </Tabs>
  );
}
