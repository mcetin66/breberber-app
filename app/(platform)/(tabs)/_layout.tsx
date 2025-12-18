import { Tabs } from 'expo-router';
import { LayoutDashboard, Scissors, Wallet, Settings, Shield, FileBarChart } from 'lucide-react-native';
import { View } from 'react-native';

export default function PlatformLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1E1E1E', // Dark Card Background
          borderTopWidth: 1,
          borderTopColor: 'rgba(212, 175, 53, 0.2)', // Subtle Gold
          height: 90, // Taller footer
          paddingTop: 10,
          paddingBottom: 30, // Handle bottom inset manually for control or rely on Safe Area
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: 10,
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
        name="businesses"
        options={{
          title: 'İşletmeler',
          tabBarIcon: ({ color }) => <Scissors size={24} color={color} />,
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
        name="dashboard"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <View
              className="w-[64px] h-[64px] rounded-full items-center justify-center -mt-6 shadow-lg shadow-black/50 border-[4px] border-[#121212]"
              style={{
                backgroundColor: focused ? '#d4af35' : '#1E1E1E',
                shadowColor: focused ? '#d4af35' : '#000',
                shadowOpacity: focused ? 0.4 : 0.2,
                shadowRadius: 10,
                elevation: 8
              }}
            >
              <LayoutDashboard size={28} color={focused ? '#121212' : '#64748B'} />
            </View>
          ),
          tabBarLabelStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Raporlar',
          tabBarIcon: ({ color }) => <FileBarChart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ayarlar',
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />

      {/* Hidden Screens */}
      <Tabs.Screen name="reports-new" options={{ href: null }} />
    </Tabs>
  );
}
