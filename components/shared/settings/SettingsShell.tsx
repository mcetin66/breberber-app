import { View, Text, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { AppHeader } from '@/components/shared/layouts/AppHeader';
import { SettingsRow } from './SettingsRow';
import { SETTINGS_MENU, SettingsItem } from './SettingsConfig';
import { Role } from '@/types';
import { useState } from 'react';

interface SettingsShellProps {
    role: Role;
}

export function SettingsShell({ role }: SettingsShellProps) {
    const router = useRouter();
    const { signOut, user, viewMode, switchViewMode } = useAuthStore();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    // Determine which menu to show based on role and viewMode
    const getMenuKey = (): string => {
        // If business_owner is viewing as staff, show special menu
        if (role === 'business_owner' && viewMode === 'staff') {
            return 'business_owner_as_staff';
        }
        return role;
    };

    const menuKey = getMenuKey();
    const menuItems = SETTINGS_MENU[menuKey] || [];

    // Get display mode label
    const getModeLabel = (): string => {
        if (role === 'business_owner') {
            return viewMode === 'staff' ? 'Personel Modu' : 'İşletme Sahibi';
        }
        if (role === 'staff') return 'Personel';
        if (role === 'platform_admin') return 'Platform Yöneticisi';
        return 'Müşteri';
    };

    const handleAction = (item: SettingsItem) => {
        if (item.action === 'logout') {
            // Just sign out - route guard in _layout.tsx will detect
            // isAuthenticated change and redirect automatically
            signOut();
        } else if (item.action === 'toggle_notifications') {
            setNotificationsEnabled(!notificationsEnabled);
        } else if (item.action === 'switch_to_staff') {
            // Business owner switching to staff view
            switchViewMode('staff');
            router.replace('/(staff)/(tabs)/dashboard');
        } else if (item.action === 'switch_to_business') {
            // Business owner switching back to business view
            switchViewMode('business');
            router.replace('/(business)/(tabs)/dashboard');
        } else if (item.route) {
            router.push(item.route as any);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#0F172A]" edges={['top']}>
            <AppHeader
                title="Ayarlar"
                subtitle={`${user?.fullName || 'Kullanıcı'} (${getModeLabel()})`}
            />

            <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
                <View className="mb-6">
                    <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-3 ml-2">
                        GENEL AYARLAR
                    </Text>
                    <View className="rounded-2xl overflow-hidden">
                        {menuItems.map((item, index) => (
                            <SettingsRow
                                key={index}
                                icon={item.icon}
                                label={item.label}
                                danger={item.danger}
                                accent={item.accent}
                                onPress={() => handleAction(item)}
                                rightElement={
                                    item.type === 'toggle' ? (
                                        <Switch
                                            value={notificationsEnabled}
                                            onValueChange={() => handleAction(item)}
                                            trackColor={{ false: '#334155', true: '#3B82F6' }}
                                            thumbColor={'white'}
                                        />
                                    ) : undefined
                                }
                            />
                        ))}
                    </View>
                </View>

                <View className="items-center py-4">
                    <Text className="text-slate-600 text-xs">Versiyon 1.0.0 (Build 102)</Text>
                    <Text className="text-slate-700 text-[10px] mt-1">Breberber © 2025</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
