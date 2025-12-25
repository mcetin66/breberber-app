import { useEffect } from 'react';
import { View, Text, Pressable, Switch, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { useBusinessStore } from '@/stores/businessStore';
import { ChevronRight, LogOut, Moon, Bell, User, Clock, Image as ImageIcon, Scissors, Users, Wallet, UserCog, Store, Settings } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { StandardScreen } from '@/components/ui/StandardScreen';

export default function BusinessSettingsScreen() {
    const router = useRouter();
    const { user, signOut, switchViewMode } = useAuthStore();
    const { businesses, fetchBusinesses, currentBusiness, getBusinessById } = useBusinessStore();

    useEffect(() => {
        if (user?.barberId) {
            console.log('Settings: User Barber ID:', user.barberId);
            if (!currentBusiness || currentBusiness.id !== user.barberId) {
                console.log('Settings: Fetching fresh business data...');
                getBusinessById(user.barberId);
            }
        }
        if (businesses.length === 0) fetchBusinesses(); // Fetch all as backup for other screens?
    }, [user?.barberId]);

    const activeBusiness = (currentBusiness && currentBusiness.id === user?.barberId)
        ? currentBusiness
        : businesses.find(b => b.id === user?.barberId);

    const businessName = activeBusiness?.name || 'Yükleniyor...';
    const businessLogo = activeBusiness?.cover_url;

    // Debug Log
    useEffect(() => {
        if (user?.barberId) {
            console.log('[Settings] Debug:', {
                userId: user.id,
                wantedBarberId: user.barberId,
                currentBusinessId: currentBusiness?.id,
                foundInList: !!businesses.find(b => b.id === user?.barberId),
                activeName: activeBusiness?.name
            });
        }
    }, [user, currentBusiness, businesses, activeBusiness]);

    const handleLogout = () => {
        Alert.alert('Çıkış Yap', 'Çıkış yapmak istediğinize emin misiniz?', [
            { text: 'İptal', style: 'cancel' },
            { text: 'Çıkış Yap', style: 'destructive', onPress: () => signOut() }
        ]);
    };

    const menuItems = [
        { icon: User, label: 'İşletme Profili', route: '/(business)/settings/profile', desc: 'Logo, İsim ve Kategori' },
        { icon: Clock, label: 'Çalışma Saatleri', route: '/(business)/settings/hours', desc: 'Açılış ve Kapanış Saatleri' },
        { icon: ImageIcon, label: 'Galeri Yönetimi', route: '/(business)/settings/gallery', desc: 'Fotoğraf ve Video' },
        { icon: Scissors, label: 'Hizmetler', route: '/(business)/(tabs)/services', desc: 'Fiyat ve Süre Ayarları' },
        { icon: Users, label: 'Personel Yönetimi', route: '/(business)/(tabs)/staff', desc: 'Ekip ve İzinler' },
        { icon: Wallet, label: 'Ödeme ve Finans', route: '/(business)/(tabs)/finance', desc: 'Raporlar ve Gelir' },
    ];

    return (
        <StandardScreen
            title="Ayarlar"
            subtitle={activeBusiness?.name ? `${activeBusiness.name} • İşletme Sahibi` : 'İşletme Sahibi'}
            headerIcon={<Settings size={20} color="#121212" />}
            noPadding
        >
            <View className="px-4 py-6">

                {/* Profile Card */}
                <View className="mb-8 rounded-2xl overflow-hidden bg-[#1E1E1E] border border-white/5 relative shadow-lg shadow-black/50">
                    <View className="absolute top-0 right-0 w-32 h-32 bg-[#d4af35]/10 rounded-full blur-2xl -mr-10 -mt-10" />

                    <View className="p-4 flex-row items-center gap-4">
                        <View className="relative">
                            <View className="w-16 h-16 rounded-full border-2 border-[#d4af35] overflow-hidden bg-gray-800 items-center justify-center">
                                {businessLogo ? (
                                    <Image source={{ uri: businessLogo }} className="w-full h-full" resizeMode="cover" />
                                ) : (
                                    <Store size={32} color={COLORS.primary.DEFAULT} />
                                )}
                            </View>
                            <View className="absolute -bottom-1 -right-1 bg-[#d4af35] px-2 py-0.5 rounded-full border border-[#1E1E1E]">
                                <Text className="text-[#121212] text-[10px] font-bold">GOLD</Text>
                            </View>
                        </View>

                        <View className="flex-1">
                            <Text className="text-white text-lg font-bold">{businessName}</Text>
                            <Text className="text-[#d4af35] text-sm font-medium mb-1">Gold Üyelik</Text>
                            <Pressable onPress={() => router.push('/(business)/settings/profile')} className="flex-row items-center">
                                <Text className="text-gray-400 text-xs mr-1">Profili Düzenle</Text>
                                <ChevronRight size={12} color="#9CA3AF" />
                            </Pressable>
                        </View>
                    </View>
                </View>

                {/* Management Section */}
                <View className="mb-6">
                    <Text className="text-gray-500 text-xs font-bold uppercase tracking-wider ml-2 mb-2">Yönetim</Text>
                    <View className="bg-[#1E1E1E] rounded-xl overflow-hidden border border-white/5 divide-y divide-white/5">
                        {menuItems.map((item, index) => (
                            <Pressable
                                key={index}
                                onPress={() => router.push(item.route as any)}
                                className="flex-row items-center p-4 active:bg-white/5"
                            >
                                <View className="w-10 h-10 rounded-lg bg-white/5 items-center justify-center mr-3">
                                    <item.icon size={20} color={COLORS.primary.DEFAULT} />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-medium text-base">{item.label}</Text>
                                    <Text className="text-gray-500 text-xs">{item.desc}</Text>
                                </View>
                                <ChevronRight size={20} color="#4B5563" />
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Switch Mode */}
                <View className="mb-6">
                    <Text className="text-gray-500 text-xs font-bold uppercase tracking-wider ml-2 mb-2">Mod Değiştir</Text>
                    <Pressable
                        onPress={() => {
                            switchViewMode('staff');
                            router.replace('/(staff)/(tabs)/dashboard');
                        }}
                        className="bg-[#1E1E1E] rounded-xl border border-white/5 p-4 flex-row items-center active:bg-white/5"
                    >
                        <View className="w-10 h-10 rounded-lg bg-purple-500/10 items-center justify-center mr-3">
                            <UserCog size={20} color="#A855F7" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-medium text-base">Personel Moduna Geç</Text>
                            <Text className="text-gray-500 text-xs">Personel görünümüne geçiş yap</Text>
                        </View>
                        <ChevronRight size={20} color="#4B5563" />
                    </Pressable>
                </View>

                {/* App Settings */}
                <View className="mb-6">
                    <Text className="text-gray-500 text-xs font-bold uppercase tracking-wider ml-2 mb-2">Uygulama Ayarları</Text>
                    <View className="bg-[#1E1E1E] rounded-xl overflow-hidden border border-white/5 divide-y divide-white/5">
                        <View className="flex-row items-center justify-between p-4">
                            <View className="flex-row items-center">
                                <View className="w-9 h-9 rounded-lg bg-white/5 items-center justify-center mr-3">
                                    <Moon size={18} color={COLORS.primary.DEFAULT} />
                                </View>
                                <Text className="text-white font-medium">Karanlık Mod</Text>
                            </View>
                            <Switch value={true} trackColor={{ false: '#333', true: COLORS.primary.DEFAULT }} thumbColor={COLORS.primary.DEFAULT ? '#121212' : 'white'} />
                        </View>
                        <View className="flex-row items-center justify-between p-4">
                            <View className="flex-row items-center">
                                <View className="w-9 h-9 rounded-lg bg-white/5 items-center justify-center mr-3">
                                    <Bell size={18} color={COLORS.primary.DEFAULT} />
                                </View>
                                <Text className="text-white font-medium">Bildirimler</Text>
                            </View>
                            <Switch value={true} trackColor={{ false: '#333', true: COLORS.primary.DEFAULT }} thumbColor={COLORS.primary.DEFAULT ? '#121212' : 'white'} />
                        </View>
                    </View>
                </View>

                {/* Actions */}
                <View className="gap-3 mb-10">
                    <Pressable
                        onPress={handleLogout}
                        className="w-full h-12 rounded-xl border border-[#d4af35]/50 flex-row items-center justify-center gap-2 active:bg-[#d4af35]/10"
                    >
                        <LogOut size={20} color={COLORS.primary.DEFAULT} />
                        <Text className="text-[#d4af35] font-bold text-base">Çıkış Yap</Text>
                    </Pressable>
                    <Pressable
                        className="w-full py-2 flex-row items-center justify-center gap-2"
                    >
                        <Text className="text-red-500/70 font-medium text-sm">Hesabımı Sil</Text>
                    </Pressable>
                </View>

                <View className="items-center pb-8">
                    <Text className="text-gray-600 text-xs">Versiyon 1.0.0</Text>
                </View>

            </View>
        </StandardScreen>
    );
}
