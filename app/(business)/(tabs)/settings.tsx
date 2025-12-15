import { View, Text, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Store, Clock, Image as ImageIcon, Wallet, Bell, Shield, LogOut, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useAuthStore } from '@/stores/authStore';
import { useState } from 'react';

const SettingsSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <View className="mb-6">
        <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3 px-1">{title}</Text>
        <View className="bg-[#1E293B] rounded-2xl overflow-hidden border border-white/5">
            {children}
        </View>
    </View>
);

const SettingsRow = ({
    icon: Icon,
    label,
    value,
    isLast,
    onPress,
    type = 'link',
    toggleValue,
    onToggle
}: {
    icon: any,
    label: string,
    value?: string,
    isLast?: boolean,
    onPress?: () => void,
    type?: 'link' | 'toggle',
    toggleValue?: boolean,
    onToggle?: (val: boolean) => void
}) => (
    <Pressable
        onPress={type === 'link' ? onPress : undefined}
        className={`flex-row items-center justify-between p-4 active:bg-white/5 ${!isLast ? 'border-b border-white/5' : ''}`}
    >
        <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-lg bg-[#0F172A] items-center justify-center border border-white/5">
                <Icon size={16} color={COLORS.primary.DEFAULT} />
            </View>
            <Text className="text-white font-medium ml-3 text-sm">{label}</Text>
        </View>

        {type === 'link' ? (
            <View className="flex-row items-center">
                {value && <Text className="text-slate-500 text-xs mr-2">{value}</Text>}
                <ChevronRight size={16} color="#64748B" />
            </View>
        ) : (
            <Switch
                value={toggleValue}
                onValueChange={onToggle}
                trackColor={{ false: '#334155', true: COLORS.primary.DEFAULT }}
                thumbColor={'#fff'}
                ios_backgroundColor="#334155"
                style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            />
        )}
    </Pressable>
);

export default function SettingsScreen() {
    const router = useRouter();
    const signOut = useAuthStore(state => state.signOut);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const handleLogout = () => {
        Alert.alert(
            'Çıkış Yap',
            'Hesabınızdan çıkış yapmak istediğinize emin misiniz?',
            [
                { text: 'İptal', style: 'cancel' },
                {
                    text: 'Çıkış Yap',
                    style: 'destructive',
                    onPress: () => {
                        signOut();
                        router.replace('/(auth)/login');
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-[#0F172A]" edges={['top']}>
            <AdminHeader
                title="Ayarlar"
                subtitle="İşletme Yönetimi"
            />

            <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>

                {/* General Management */}
                <SettingsSection title="Genel Yönetim">
                    <SettingsRow
                        icon={Store}
                        label="İşletme Profili"
                        onPress={() => router.push('/(business)/settings/profile')}
                    />
                    <SettingsRow
                        icon={Clock}
                        label="Çalışma Saatleri"
                        onPress={() => router.push('/(business)/settings/hours')}
                    />
                    <SettingsRow
                        icon={ImageIcon}
                        label="Galeri Yönetimi"
                        onPress={() => router.push('/(business)/settings/gallery')}
                    />
                    <SettingsRow
                        icon={Wallet}
                        label="Finans & Raporlar"
                        isLast
                        onPress={() => router.push('/(business)/finance')}
                    />
                </SettingsSection>

                {/* App Settings */}
                <SettingsSection title="Uygulama">
                    <SettingsRow
                        icon={Bell}
                        label="Bildirimler"
                        type="toggle"
                        toggleValue={notificationsEnabled}
                        onToggle={setNotificationsEnabled}
                    />
                    <SettingsRow
                        icon={Shield}
                        label="Güvenlik & Şifre"
                        isLast
                        onPress={() => Alert.alert('Güvenlik', 'Şifre değiştirme ekranı yakında eklenecek.')}
                    />
                </SettingsSection>

                {/* Account Actions */}
                <View className="mt-4 mb-12">
                    <Pressable
                        onPress={handleLogout}
                        className="flex-row items-center justify-center bg-red-500/10 border border-red-500/20 rounded-2xl p-4 active:bg-red-500/20"
                    >
                        <LogOut size={18} color="#EF4444" />
                        <Text className="text-red-500 font-bold ml-2">Çıkış Yap</Text>
                    </Pressable>
                    <Text className="text-center text-slate-600 text-[10px] mt-4">
                        Breberber Business v1.0.0
                    </Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
