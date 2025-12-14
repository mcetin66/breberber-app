import { Tabs } from 'expo-router';
import { LayoutDashboard, Scissors, Wallet, Settings, Shield } from 'lucide-react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
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
          bottom: 30,
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
        tabBarInactiveTintColor: '#64748B',
        tabBarLabelStyle: {
          fontFamily: 'Poppins_500Medium',
          fontSize: 9,
          marginTop: 5,
          marginBottom: 15,
        },
      }}
    >
      <Tabs.Screen
        name="barbers"
        options={{
          title: 'İşletmeler',
          tabBarIcon: ({ color, size }) => <Scissors size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Finans',
          tabBarIcon: ({ color, size }) => <Wallet size={24} color={color} />,
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
          tabBarLabelStyle: { display: 'none' }, // Hide label for center button
        }}
      />
      <Tabs.Screen
        name="audit"
        options={{
          title: 'Kayıtlar',
          tabBarIcon: ({ color, size }) => <Shield size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ayarlar',
          tabBarIcon: ({ color, size }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
