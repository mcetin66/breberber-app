import { Tabs } from 'expo-router';
import { LayoutDashboard, Users, Calendar, Settings, Wallet } from 'lucide-react-native';
import { useAuthStore } from '@/stores/authStore';
import { View, Platform } from 'react-native';

export default function BusinessLayout() {
  const user = useAuthStore(state => state.user);
  const isOwner = user?.subRole === 'owner';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1E293B', // Dark slate, same as Admin
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
          fontFamily: 'Manrope_500Medium',
          fontSize: 9, // Smaller font mainly for labels
          marginTop: 5,
          marginBottom: 15,
        },
      }}
    >
      {isOwner ? (
        <>
          <Tabs.Screen
            name="calendar"
            options={{
              title: 'Takvim',
              tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="staff"
            options={{
              title: 'Ekip',
              tabBarIcon: ({ color }) => <Users size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="dashboard"
            options={{
              title: '',
              tabBarIcon: ({ focused }) => (
                <View
                  className="w-[72px] h-[72px] rounded-full items-center justify-center -mt-4 shadow-xl border-[4px] border-[#0F172A]"
                  style={{ backgroundColor: focused ? '#3B82F6' : '#334155' }}
                >
                  <LayoutDashboard size={32} color={focused ? 'white' : '#94A3B8'} />
                </View>
              ),
              tabBarLabelStyle: { display: 'none' },
            }}
          />
          <Tabs.Screen
            name="finance"
            options={{
              title: 'Finans',
              tabBarIcon: ({ color }) => <Wallet size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: 'Ayarlar',
              tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
            }}
          />
          {/* Hidden Tabs */}
          <Tabs.Screen name="services" options={{ href: null }} />
          <Tabs.Screen name="staff-detail" options={{ href: null }} />
          <Tabs.Screen name="service-detail" options={{ href: null }} />
          <Tabs.Screen name="staff-dashboard" options={{ href: null }} />
          <Tabs.Screen name="_layout" options={{ href: null }} />
          <Tabs.Screen name="index" options={{ href: null }} />
        </>
      ) : (
        <>
          <Tabs.Screen name="staff-dashboard" options={{ title: 'Panel', tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} /> }} />
          <Tabs.Screen name="dashboard" options={{ href: null }} />
          <Tabs.Screen name="calendar" options={{ href: null }} />
          <Tabs.Screen name="staff" options={{ href: null }} />
          <Tabs.Screen name="settings" options={{ href: null }} />
          <Tabs.Screen name="services" options={{ href: null }} />
          <Tabs.Screen name="finance" options={{ href: null }} />
          <Tabs.Screen name="staff-detail" options={{ href: null }} />
          <Tabs.Screen name="service-detail" options={{ href: null }} />
          <Tabs.Screen name="index" options={{ href: null }} />
        </>
      )}
    </Tabs>
  );
}
