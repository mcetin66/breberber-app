import { View, Text, ScrollView, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Crown, ChevronLeft, Check, Users, Star } from 'lucide-react-native';
import { useState, useCallback } from 'react';
import { useAdminStore } from '@/stores/adminStore';
import { BaseHeader } from '@/components/shared/layouts/BaseHeader';

const PLANS = [
    {
        id: 'silver',
        name: 'Silver',
        price: 499,
        color: '#94A3B8',
        features: ['5 Personel', '100 Randevu/ay', 'Temel Raporlar', 'E-posta Desteği'],
    },
    {
        id: 'gold',
        name: 'Gold',
        price: 999,
        color: '#d4af35',
        features: ['15 Personel', 'Sınırsız Randevu', 'Detaylı Raporlar', 'Öncelikli Destek', 'SMS Bildirimleri'],
        popular: true,
    },
    {
        id: 'platinum',
        name: 'Platinum',
        price: 1999,
        color: '#22D3EE',
        features: ['Sınırsız Personel', 'Sınırsız Randevu', 'Gelişmiş Analitik', '7/24 Destek', 'Özel Entegrasyonlar', 'API Erişimi'],
    },
];

export default function PlansScreen() {
    const router = useRouter();
    const { aggregateStats, fetchDashboardStats } = useAdminStore();
    const [refreshing, setRefreshing] = useState(false);

    const planDistribution = aggregateStats.planDistribution || {};

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchDashboardStats();
        setRefreshing(false);
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-[#121212]" edges={['top']}>
            <BaseHeader
                title="Abonelik Planları"
                subtitle="Plan yönetimi ve fiyatlandırma"
                showBack
                variant="settings"
            />

            <ScrollView
                className="flex-1 px-4 pt-4"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#d4af35" />
                }
            >
                {/* Stats Row */}
                <View className="flex-row gap-2 mb-6">
                    {PLANS.map((plan) => (
                        <View key={plan.id} className="flex-1 bg-[#1E1E1E] rounded-xl p-3 border border-white/5">
                            <View className="flex-row items-center gap-1 mb-1">
                                <View className="w-2 h-2 rounded-full" style={{ backgroundColor: plan.color }} />
                                <Text className="text-gray-400 text-[10px] font-bold uppercase">{plan.name}</Text>
                            </View>
                            <Text className="text-white text-xl font-bold">{planDistribution[plan.id] || 0}</Text>
                        </View>
                    ))}
                </View>

                {/* Plans */}
                {PLANS.map((plan) => (
                    <View
                        key={plan.id}
                        className="bg-[#1E1E1E] rounded-xl p-5 mb-4 border"
                        style={{ borderColor: plan.popular ? plan.color : 'rgba(255,255,255,0.05)' }}
                    >
                        {plan.popular && (
                            <View className="absolute -top-3 right-4 px-3 py-1 rounded-full flex-row items-center gap-1" style={{ backgroundColor: plan.color }}>
                                <Star size={12} color="#121212" fill="#121212" />
                                <Text className="text-[#121212] text-[10px] font-bold">EN POPÜLER</Text>
                            </View>
                        )}

                        <View className="flex-row items-center justify-between mb-4">
                            <View className="flex-row items-center gap-3">
                                <Crown size={24} color={plan.color} />
                                <View>
                                    <Text className="text-white text-lg font-bold">{plan.name}</Text>
                                    <Text className="text-gray-500 text-xs">{planDistribution[plan.id] || 0} aktif abonelik</Text>
                                </View>
                            </View>
                            <View className="items-end">
                                <Text className="text-2xl font-bold" style={{ color: plan.color }}>₺{plan.price}</Text>
                                <Text className="text-gray-500 text-xs">/ay</Text>
                            </View>
                        </View>

                        <View className="border-t border-white/5 pt-4">
                            {plan.features.map((feature, idx) => (
                                <View key={idx} className="flex-row items-center gap-2 mb-2">
                                    <Check size={14} color={plan.color} />
                                    <Text className="text-gray-300 text-sm">{feature}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}

                <View className="h-12" />
            </ScrollView>
        </SafeAreaView>
    );
}
