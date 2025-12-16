import { View, Text, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { AppHeader } from '@/components/shared/layouts/AppHeader';
import { SettingsRow } from './SettingsRow';
import { SETTINGS_MENU, SettingsItem } from './SettingsConfig';
import { Role } from '@/types';
import { useState } from 'react';

interface SettingsLayoutProps {
    role: Role;
}

export function SettingsLayout({ role }: SettingsLayoutProps) {
    const router = useRouter();
    const { signOut, user } = useAuthStore();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const menuItems = SETTINGS_MENU[role] || [];

    const handleAction = (item: SettingsItem) => {
        if (item.action === 'logout') {
            signOut();
            router.replace('/(auth)/login');
        } else if (item.action === 'toggle_notifications') {
            setNotificationsEnabled(!notificationsEnabled);
        } else if (item.route) {
            router.push(item.route as any);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#0F172A]" edges={['top']}>
            <AppHeader
                title="Ayarlar"
                subtitle={`${user?.fullName || 'Kullanıcı'} (${role === 'business_owner' ? 'İşletme Sahibi' : role === 'staff' ? 'Personel' : role})`}
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
