import { useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Wallet, TrendingUp, CreditCard, ArrowUpRight, ArrowDownLeft, ChevronRight, BarChart3, Crown, Calendar, RefreshCw } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAdminStore } from '@/stores/adminStore';

export default function PlatformFinanceScreen() {
    const router = useRouter();
    const { aggregateStats, fetchDashboardStats, loading } = useAdminStore();

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    // Calculate monthly from distribution
    const planDistribution = aggregateStats.planDistribution || {};
    const silverCount = planDistribution['silver'] || 0;
    const goldCount = planDistribution['gold'] || 0;
    const platinumCount = planDistribution['platinum'] || 0;

    // Estimated monthly revenue (mock prices)
    const PRICES = { silver: 499, gold: 999, platinum: 1999 };
    const estimatedMonthly = (silverCount * PRICES.silver) + (goldCount * PRICES.gold) + (platinumCount * PRICES.platinum);

    // Revenue bars from aggregateStats
    const revenueHistory = aggregateStats.revenueHistory || [];

    return (
        <SafeAreaView className="flex-1 bg-[#121212]" edges={['top']}>
            {/* Simple Header */}
            <View className="px-4 py-3 flex-row items-center border-b border-white/5">
                <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-full bg-[#d4af35] items-center justify-center">
                        <Wallet size={20} color="#121212" />
                    </View>
                    <View>
                        <Text className="text-white text-lg font-bold">Finans</Text>
                        <Text className="text-gray-500 text-xs">Gelir ve abonelik takibi</Text>
                    </View>
                </View>
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={fetchDashboardStats}
                        tintColor="#d4af35"
                        colors={['#d4af35']}
                    />
                }
            >
                {/* Summary Cards */}
                <View className="px-4 py-4 flex-row gap-3">
                    {/* Total Revenue */}
                    <View className="flex-1 bg-[#1E1E1E] p-4 rounded-xl border border-white/5">
                        <View className="flex-row items-center justify-between mb-3">
                            <View className="w-10 h-10 rounded-xl bg-[#d4af35]/10 items-center justify-center">
                                <Wallet size={20} color="#d4af35" />
                            </View>
                            <View className="flex-row items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-full">
                                <TrendingUp size={12} color="#10b981" />
                                <Text className="text-emerald-400 text-[10px] font-bold">Toplam</Text>
                            </View>
                        </View>
                        <Text className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider">Toplam Gelir</Text>
                        <Text className="text-[#d4af35] text-2xl font-bold mt-1">
                            ₺{(aggregateStats.totalRevenue || 0).toLocaleString('tr-TR')}
                        </Text>
                    </View>

                    {/* Monthly Revenue */}
                    <View className="flex-1 bg-[#1E1E1E] p-4 rounded-xl border border-white/5">
                        <View className="flex-row items-center justify-between mb-3">
                            <View className="w-10 h-10 rounded-xl bg-[#d4af35]/10 items-center justify-center">
                                <Calendar size={20} color="#d4af35" />
                            </View>
                            <View className="flex-row items-center gap-1 bg-[#d4af35]/10 px-2 py-1 rounded-full">
                                <Crown size={12} color="#d4af35" />
                                <Text className="text-[#d4af35] text-[10px] font-bold">Aylık</Text>
                            </View>
                        </View>
                        <Text className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider">Tahmini Aylık</Text>
                        <Text className="text-white text-2xl font-bold mt-1">
                            ₺{estimatedMonthly.toLocaleString('tr-TR')}
                        </Text>
                    </View>
                </View>

                {/* Plan Distribution with Visual Bar */}
                <View className="px-4 mb-4">
                    <Text className="text-white text-base font-bold mb-3">Abonelik Dağılımı</Text>
                    <View className="bg-[#1E1E1E] rounded-xl p-4 border border-white/5">
                        {/* Visual Bar */}
                        <View className="h-4 rounded-full overflow-hidden flex-row mb-4 bg-[#2a2a2a]">
                            {silverCount > 0 && (
                                <View
                                    className="h-full bg-[#94A3B8]"
                                    style={{ flex: silverCount }}
                                />
                            )}
                            {goldCount > 0 && (
                                <View
                                    className="h-full bg-[#d4af35]"
                                    style={{ flex: goldCount }}
                                />
                            )}
                            {platinumCount > 0 && (
                                <View
                                    className="h-full bg-[#22D3EE]"
                                    style={{ flex: platinumCount }}
                                />
                            )}
                        </View>

                        {/* Legend */}
                        <View className="flex-row justify-between">
                            {[
                                { label: 'Silver', count: silverCount, price: PRICES.silver, color: '#94A3B8' },
                                { label: 'Gold', count: goldCount, price: PRICES.gold, color: '#d4af35' },
                                { label: 'Platinum', count: platinumCount, price: PRICES.platinum, color: '#22D3EE' },
                            ].map((plan) => (
                                <View key={plan.label} className="items-center">
                                    <View className="flex-row items-center gap-1.5 mb-1">
                                        <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: plan.color }} />
                                        <Text className="text-gray-400 text-xs">{plan.label}</Text>
                                    </View>
                                    <Text className="text-white text-lg font-bold">{plan.count}</Text>
                                    <Text className="text-gray-600 text-[10px]">₺{(plan.count * plan.price).toLocaleString('tr-TR')}/ay</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Revenue Chart - Enhanced */}
                <View className="px-4 mb-4">
                    <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-white text-base font-bold">Son 7 Gün</Text>
                        <Text className="text-[#d4af35] text-sm font-bold">
                            ₺{revenueHistory.reduce((sum: number, d: any) => sum + (d.amount || 0), 0).toLocaleString('tr-TR')}
                        </Text>
                    </View>
                    <View className="bg-[#1E1E1E] rounded-xl p-4 border border-white/5">
                        <View className="flex-row items-end justify-between h-36 gap-1">
                            {revenueHistory.map((day: any, idx: number) => (
                                <View key={idx} className="flex-1 items-center">
                                    <Text className="text-[#d4af35] text-[8px] font-bold mb-1">
                                        {day.amount > 0 ? `₺${(day.amount / 1000).toFixed(0)}K` : ''}
                                    </Text>
                                    <View
                                        className="w-full rounded-t-lg bg-gradient-to-t"
                                        style={{
                                            height: Math.max(12, day.height || 0),
                                            backgroundColor: idx === revenueHistory.length - 1 ? '#d4af35' : '#d4af35aa'
                                        }}
                                    />
                                    <Text className="text-gray-500 text-[9px] mt-2 text-center font-medium">{day.label}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>



                {/* Reports Link */}
                <View className="px-4 mb-4">
                    <Pressable
                        onPress={() => router.navigate('/(platform)/(tabs)/reports')}
                        className="bg-[#1E1E1E] rounded-xl p-4 border border-white/5 flex-row items-center justify-between"
                    >
                        <View className="flex-row items-center gap-3">
                            <View className="w-10 h-10 rounded-xl bg-[#d4af35]/10 items-center justify-center">
                                <BarChart3 size={20} color="#d4af35" />
                            </View>
                            <View>
                                <Text className="text-white font-bold">Detaylı Raporlar</Text>
                                <Text className="text-gray-500 text-xs">İşletme ve plan analizleri</Text>
                            </View>
                        </View>
                        <ChevronRight size={20} color="#6B7280" />
                    </Pressable>
                </View>

                <View className="h-24" />
            </ScrollView>
        </SafeAreaView>
    );
}
