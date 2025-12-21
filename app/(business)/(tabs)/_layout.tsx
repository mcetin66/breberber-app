import { Tabs } from 'expo-router';
import { LayoutDashboard, Calendar, Wallet, Settings, Scissors } from 'lucide-react-native';
import { View } from 'react-native';
import { useAuthStore } from '@/stores/authStore';

export default function BusinessTabsLayout() {
    const { user } = useAuthStore();
    const isStaff = user?.role === 'staff';

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
                    paddingBottom: 30, // Handle bottom inset manually
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
            {/* 1. Calendar (Left) */}
            < Tabs.Screen
                name="calendar"
                options={{
                    title: 'Takvim',
                    tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
                }}
            />

            {/* 2. Services (Left) - Using the folder 'services' */}
            <Tabs.Screen
                name="services"
                options={{
                    title: 'Hizmetler',
                    tabBarIcon: ({ color }) => <Scissors size={24} color={color} />,
                    href: isStaff ? null : '/(business)/(tabs)/services', // Helper: Hide for staff
                }}
            />

            {/* 3. Dashboard (Standard) */}
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Panel',
                    tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} />,
                }}
            />

            {/* 4. Finance (Right) */}
            <Tabs.Screen
                name="finance"
                options={{
                    title: 'Finans',
                    tabBarIcon: ({ color }) => <Wallet size={24} color={color} />,
                    href: isStaff ? null : '/(business)/(tabs)/finance', // Helper: Hide for staff
                }}
            />

            {/* 5. Settings (Right) */}
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Ayarlar',
                    tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
                }}
            />
            {/* Hidden Routes */}
            <Tabs.Screen name="staff" options={{ href: null }} />
        </Tabs >
    );
}
