import { View, Text, ScrollView, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Store, ChevronLeft, ChevronRight, Users, Crown, TrendingUp, MapPin, Calendar, Wallet, Star, Building2 } from 'lucide-react-native';
import { useState, useCallback, useEffect } from 'react';
import { useAdminStore } from '@/stores/adminStore';

export default function BusinessManagementScreen() {
    const router = useRouter();
    const { aggregateStats, fetchDashboardStats, loading } = useAdminStore();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchDashboardStats();
        setRefreshing(false);
    }, []);

    const planDist = aggregateStats.planDistribution || {};
    const typeDist = aggregateStats.typeDistribution || {};

    const stats = [
        { label: 'Toplam İşletme', value: aggregateStats.totalBusinesses || 0, icon: Store, color: '#d4af35' },
        { label: 'Aktif İşletme', value: aggregateStats.totalActiveBusinesses || 0, icon: Building2, color: '#10B981' },
        { label: 'Toplam Personel', value: (aggregateStats as any).totalStaff || 0, icon: Users, color: '#3B82F6' },
        { label: 'Toplam Randevu', value: aggregateStats.totalAppointments || 0, icon: Calendar, color: '#8B5CF6' },
    ];

    const quickActions = [
        { label: 'İşletme Listesi', subtitle: 'Tüm işletmeleri görüntüle', route: '/(platform)/(tabs)/businesses', icon: Store, color: '#d4af35' },
        { label: 'Onay Bekleyenler', subtitle: 'Yeni başvuruları incele', route: '/(platform)/pending', icon: Building2, color: '#F97316' },
        { label: 'Abonelik Planları', subtitle: 'Plan detayları', route: '/(platform)/plans', icon: Crown, color: '#22D3EE' },
    ];

    return (
        <SafeAreaView className="flex-1 bg-[#121212]" edges={['top']}>
            {/* Header */}
            <View className="px-4 py-3 flex-row items-center gap-3 border-b border-white/5">
                <Pressable
                    onPress={() => router.back()}
                    className="w-10 h-10 rounded-full bg-[#1E1E1E] items-center justify-center border border-white/10"
                >
                    <ChevronLeft size={20} color="#fff" />
                </Pressable>
                <View className="flex-row items-center gap-3 flex-1">
                    <View className="w-10 h-10 rounded-full bg-[#d4af35] items-center justify-center">
                        <Store size={20} color="#121212" />
                    </View>
                    <View>
                        <Text className="text-white text-lg font-bold">İşletme Yönetimi</Text>
                        <Text className="text-gray-500 text-xs">Platform özeti ve hızlı işlemler</Text>
                    </View>
                </View>
            </View>

            <ScrollView
                className="flex-1 px-4 pt-4"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#d4af35" />
                }
            >
                {/* Stats Grid */}
                <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-3 ml-1">GENEL BAKIŞ</Text>
                <View className="flex-row flex-wrap gap-3 mb-6">
                    {stats.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <View key={idx} className="flex-1 min-w-[45%] bg-[#1E1E1E] rounded-xl p-4 border border-white/5">
                                <View className="flex-row items-center gap-2 mb-2">
                                    <View
                                        className="w-8 h-8 rounded-lg items-center justify-center"
                                        style={{ backgroundColor: stat.color + '20' }}
                                    >
                                        <Icon size={16} color={stat.color} />
                                    </View>
                                </View>
                                <Text className="text-white text-2xl font-bold">{stat.value}</Text>
                                <Text className="text-gray-500 text-xs mt-1">{stat.label}</Text>
                            </View>
                        );
                    })}
                </View>

                {/* Plan Distribution */}
                <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-3 ml-1">ABONELİK DAĞILIMI</Text>
                <View className="bg-[#1E1E1E] rounded-xl p-4 border border-white/5 mb-6">
                    <View className="flex-row justify-between">
                        {[
                            { key: 'silver', label: 'Silver', color: '#94A3B8' },
                            { key: 'gold', label: 'Gold', color: '#d4af35' },
                            { key: 'platinum', label: 'Platinum', color: '#22D3EE' },
                        ].map((plan) => (
                            <View key={plan.key} className="items-center flex-1">
                                <View className="w-12 h-12 rounded-full items-center justify-center mb-2" style={{ backgroundColor: plan.color + '20' }}>
                                    <Crown size={20} color={plan.color} />
                                </View>
                                <Text className="text-white text-lg font-bold">{planDist[plan.key] || 0}</Text>
                                <Text className="text-gray-500 text-xs">{plan.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Type Distribution */}
                <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-3 ml-1">İŞLETME TÜRLERİ</Text>
                <View className="bg-[#1E1E1E] rounded-xl p-4 border border-white/5 mb-6">
                    <View className="flex-row justify-between">
                        {[
                            { key: 'berber', label: 'Berber', color: '#F97316' },
                            { key: 'kuafor', label: 'Kuaför', color: '#8B5CF6' },
                            { key: 'guzellik_merkezi', label: 'Güzellik', color: '#EC4899' },
                        ].map((type) => (
                            <View key={type.key} className="items-center flex-1">
                                <View className="w-12 h-12 rounded-full items-center justify-center mb-2" style={{ backgroundColor: type.color + '20' }}>
                                    <Store size={20} color={type.color} />
                                </View>
                                <Text className="text-white text-lg font-bold">{typeDist[type.key] || 0}</Text>
                                <Text className="text-gray-500 text-xs">{type.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Quick Actions */}
                <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-3 ml-1">HIZLI İŞLEMLER</Text>
                <View className="bg-[#1E1E1E] rounded-xl overflow-hidden mb-6">
                    {quickActions.map((action, idx) => {
                        const Icon = action.icon;
                        return (
                            <Pressable
                                key={idx}
                                onPress={() => router.push(action.route as any)}
                                className={`flex-row items-center p-4 ${idx < quickActions.length - 1 ? 'border-b border-white/5' : ''} active:bg-white/5`}
                            >
                                <View
                                    className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                                    style={{ backgroundColor: action.color + '20' }}
                                >
                                    <Icon size={20} color={action.color} />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-semibold">{action.label}</Text>
                                    <Text className="text-gray-500 text-xs">{action.subtitle}</Text>
                                </View>
                                <ChevronRight size={18} color="#4B5563" />
                            </Pressable>
                        );
                    })}
                </View>

                <View className="h-12" />
            </ScrollView>
        </SafeAreaView>
    );
}
