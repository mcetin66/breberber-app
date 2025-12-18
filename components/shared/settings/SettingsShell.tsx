import { View, Text, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { SettingsRow } from './SettingsRow';
import { SETTINGS_MENU, SettingsItem, SettingsCategory } from './SettingsConfig';
import { Role } from '@/types';
import { useState } from 'react';
import { Settings } from 'lucide-react-native';

interface SettingsShellProps {
    role: Role;
}

export function SettingsShell({ role }: SettingsShellProps) {
    const router = useRouter();
    const { signOut, user, viewMode, switchViewMode } = useAuthStore();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    // Determine which menu to show based on role and viewMode
    const getMenuKey = (): string => {
        if (role === 'business_owner' && viewMode === 'staff') {
            return 'business_owner_as_staff';
        }
        return role;
    };

    const menuKey = getMenuKey();
    const categories: SettingsCategory[] = SETTINGS_MENU[menuKey] || [];

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
            signOut();
        } else if (item.action === 'toggle_notifications') {
            setNotificationsEnabled(!notificationsEnabled);
        } else if (item.action === 'switch_to_staff') {
            switchViewMode('staff');
            router.replace('/(staff)/(tabs)/dashboard');
        } else if (item.action === 'switch_to_business') {
            switchViewMode('business');
            router.replace('/(business)/(tabs)/dashboard');
        } else if (item.route) {
            router.push(item.route as any);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#121212]" edges={['top']}>
            {/* Header with Gold Icon */}
            <View className="px-4 py-3 flex-row items-center border-b border-white/5">
                <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-full bg-[#d4af35] items-center justify-center">
                        <Settings size={20} color="#121212" />
                    </View>
                    <View>
                        <Text className="text-white text-lg font-bold">Ayarlar</Text>
                        <Text className="text-gray-500 text-xs">{user?.fullName || 'Kullanıcı'} • {getModeLabel()}</Text>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
                {categories.map((category, catIndex) => (
                    <View key={catIndex} className="mb-5">
                        {category.title && (
                            <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2 ml-2">
                                {category.title}
                            </Text>
                        )}
                        <View className="rounded-xl overflow-hidden bg-[#1E1E1E]">
                            {category.items.map((item, index) => (
                                <SettingsRow
                                    key={index}
                                    icon={item.icon}
                                    label={item.label}
                                    danger={item.danger}
                                    accent={item.accent}
                                    iconBg={item.iconBg}
                                    onPress={() => handleAction(item)}
                                    isLast={index === category.items.length - 1}
                                    rightElement={
                                        item.type === 'toggle' ? (
                                            <Switch
                                                value={notificationsEnabled}
                                                onValueChange={() => handleAction(item)}
                                                trackColor={{ false: '#374151', true: '#d4af35' }}
                                                thumbColor={'white'}
                                            />
                                        ) : undefined
                                    }
                                />
                            ))}
                        </View>
                    </View>
                ))}

                <View className="items-center py-6 pb-12">
                    <Text className="text-gray-600 text-xs">Versiyon 1.0.0 (Build 102)</Text>
                    <Text className="text-gray-700 text-[10px] mt-1">Breberber © 2025</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
