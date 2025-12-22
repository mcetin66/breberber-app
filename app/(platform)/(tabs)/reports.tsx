import { View, Text, ScrollView, RefreshControl, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAdminStore } from '@/stores/adminStore';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { BarChart3, TrendingUp, Users, Store, FileBarChart } from 'lucide-react-native';
import { BaseHeader } from '@/components/shared/layouts/BaseHeader';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Color Constants - Updated to Gold/Dark Theme
const COLORS_MAP = {
    // Plans
    silver: { main: '#94A3B8', bg: '#1E1E1E' },
    gold: { main: '#d4af35', bg: '#1E1E1E' },
    platinum: { main: '#22D3EE', bg: '#1E1E1E' },

    // Types
    berber: { main: '#F97316', bg: '#1E1E1E' },
    kuafor: { main: '#8B5CF6', bg: '#1E1E1E' },
    guzellik_merkezi: { main: '#EC4899', bg: '#1E1E1E' },
};

export default function PlatformReportsScreen() {
    const { aggregateStats, fetchDashboardStats } = useAdminStore();
    const [refreshing, setRefreshing] = useState(false);
    const [viewMode, setViewMode] = useState<'plan' | 'type'>('plan');
    const [activeTab, setActiveTab] = useState<string>('silver');

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchDashboardStats();
        setRefreshing(false);
    }, []);

    useEffect(() => {
        if (aggregateStats.totalBusinesses === 0) {
            fetchDashboardStats();
        }
    }, []);

    useEffect(() => {
        if (viewMode === 'plan') setActiveTab('silver');
        else setActiveTab('berber');
    }, [viewMode]);

    const getPercentage = (count: number, total: number) => {
        if (!total || total === 0) return 0;
        return Math.round((count / total) * 100);
    };

    // Data
    const planDist = aggregateStats.planDistribution || {};
    const planTypeBreakdown = aggregateStats.planTypeBreakdown || {};
    const typeDist = aggregateStats.typeDistribution || {};
    const typePlanBreakdown = aggregateStats.typePlanBreakdown || {};

    const currentTabs = useMemo(() => {
        if (viewMode === 'plan') {
            return [
                { id: 'silver', label: 'Silver', ...COLORS_MAP.silver },
                { id: 'gold', label: 'Gold', ...COLORS_MAP.gold },
                { id: 'platinum', label: 'Platinum', ...COLORS_MAP.platinum },
            ];
        } else {
            return [
                { id: 'berber', label: 'Berber', ...COLORS_MAP.berber },
                { id: 'kuafor', label: 'Kuaför', ...COLORS_MAP.kuafor },
                { id: 'guzellik_merkezi', label: 'Güzellik', ...COLORS_MAP.guzellik_merkezi },
            ];
        }
    }, [viewMode]);

    const breakdownItems = useMemo(() => {
        if (viewMode === 'plan') {
            return [
                { key: 'berber', label: 'Berber', ...COLORS_MAP.berber },
                { key: 'kuafor', label: 'Kuaför', ...COLORS_MAP.kuafor },
                { key: 'guzellik_merkezi', label: 'Güzellik', ...COLORS_MAP.guzellik_merkezi },
            ];
        } else {
            return [
                { key: 'silver', label: 'Silver', ...COLORS_MAP.silver },
                { key: 'gold', label: 'Gold', ...COLORS_MAP.gold },
                { key: 'platinum', label: 'Platinum', ...COLORS_MAP.platinum },
            ];
        }
    }, [viewMode]);

    const currentTotal = viewMode === 'plan'
        ? (planDist[activeTab] || 0)
        : (typeDist[activeTab] || 0);

    const currentBreakdown = viewMode === 'plan'
        ? (planTypeBreakdown[activeTab] || {})
        : (typePlanBreakdown[activeTab] || {});

    const activeTabConfig = currentTabs.find(t => t.id === activeTab) || currentTabs[0];

    return (
        <SafeAreaView className="flex-1 bg-[#121212]" edges={['top']}>
            <BaseHeader
                title="Raporlar"
                subtitle="Detaylı analiz"
                variant="settings"
                rightElement={
                    <View className="flex-row items-center gap-2 bg-[#1E1E1E] px-3 py-2 rounded-lg border border-white/5">
                        <BarChart3 size={16} color="#d4af35" />
                        <Text className="text-white text-xs font-semibold">{aggregateStats.totalBusinesses || 0} işletme</Text>
                    </View>
                }
            />

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#d4af35" />
                }
            >
                <View className="px-4 py-4">

                    {/* View Mode Switcher */}
                    <View className="flex-row bg-[#1E1E1E] p-1 rounded-xl border border-white/5 mb-4">
                        <Pressable
                            onPress={() => setViewMode('plan')}
                            className={`flex-1 py-2.5 rounded-lg items-center justify-center ${viewMode === 'plan' ? 'bg-[#d4af35]' : ''}`}
                        >
                            <Text className={`font-semibold text-sm ${viewMode === 'plan' ? 'text-black' : 'text-gray-500'}`}>Paket Analizi</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setViewMode('type')}
                            className={`flex-1 py-2.5 rounded-lg items-center justify-center ${viewMode === 'type' ? 'bg-[#d4af35]' : ''}`}
                        >
                            <Text className={`font-semibold text-sm ${viewMode === 'type' ? 'text-black' : 'text-gray-500'}`}>İşletme Analizi</Text>
                        </Pressable>
                    </View>

                    {/* Dynamic Tabs */}
                    <View className="flex-row bg-[#1E1E1E] p-1 rounded-xl border border-white/5 mb-6">
                        {currentTabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <Pressable
                                    key={tab.id}
                                    onPress={() => setActiveTab(tab.id)}
                                    className={`flex-1 py-3 rounded-lg items-center justify-center`}
                                    style={isActive ? { backgroundColor: tab.main + '20' } : {}}
                                >
                                    <View className="flex-row items-center gap-2">
                                        <View
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: isActive ? tab.main : '#6B7280' }}
                                        />
                                        <Text
                                            className={`font-bold text-xs ${isActive ? 'text-white' : 'text-gray-500'}`}
                                            numberOfLines={1}
                                        >
                                            {tab.label}
                                        </Text>
                                    </View>
                                </Pressable>
                            );
                        })}
                    </View>

                    {/* Summary Card */}
                    <View className="bg-[#1E1E1E] p-6 rounded-2xl border border-white/5 mb-4 items-center">
                        <Text className="text-gray-500 text-xs font-semibold mb-2 uppercase tracking-widest text-center">
                            {viewMode === 'plan' ? `Toplam ${activeTabConfig.label} Paketi` : `Toplam ${activeTabConfig.label}`}
                        </Text>
                        <Text
                            className="text-5xl font-bold mb-4"
                            style={{ color: activeTabConfig.main }}
                        >
                            {currentTotal}
                        </Text>

                        {/* Stacked Bar */}
                        <View className="w-full h-6 flex-row rounded-full overflow-hidden bg-[#2a2a2a] mt-2">
                            {currentTotal === 0 ? (
                                <View className="flex-1 bg-[#2a2a2a]" />
                            ) : (
                                breakdownItems.map(item => {
                                    const count = currentBreakdown[item.key] || 0;
                                    if (count === 0) return null;
                                    const pct = (count / currentTotal) * 100;
                                    return (
                                        <View
                                            key={item.key}
                                            style={{ width: `${pct}%`, backgroundColor: item.main }}
                                        />
                                    );
                                })
                            )}
                        </View>

                        {/* Legend */}
                        {currentTotal > 0 && (
                            <View className="flex-row gap-3 mt-4 flex-wrap justify-center">
                                {breakdownItems.map(item => {
                                    const count = currentBreakdown[item.key] || 0;
                                    if (count === 0) return null;
                                    return (
                                        <View key={item.key} className="flex-row items-center gap-2 bg-[#2a2a2a] px-3 py-1.5 rounded-full">
                                            <View className="w-2 h-2 rounded-full" style={{ backgroundColor: item.main }} />
                                            <Text className="text-gray-400 text-xs font-medium">{item.label}</Text>
                                            <Text className="text-white text-xs font-bold ml-1">{count}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        )}
                    </View>

                    {/* Detailed List */}
                    <View className="bg-[#1E1E1E] p-4 rounded-2xl border border-white/5 mb-6">
                        <Text className="text-white text-base font-bold mb-4">
                            {viewMode === 'plan' ? 'İşletme Türü Dağılımı' : 'Paket Dağılımı'}
                        </Text>
                        {currentTotal === 0 ? (
                            <Text className="text-gray-600 text-center py-4 italic">Veri bulunamadı.</Text>
                        ) : (
                            <View className="gap-4">
                                {breakdownItems.map((item) => {
                                    const count = currentBreakdown[item.key] || 0;
                                    const pct = getPercentage(count, currentTotal);

                                    return (
                                        <View key={item.key}>
                                            <View className="flex-row justify-between mb-2">
                                                <View className="flex-row items-center gap-3">
                                                    <View
                                                        className="w-10 h-10 rounded-xl items-center justify-center"
                                                        style={{ backgroundColor: item.main + '20' }}
                                                    >
                                                        <Text className="font-bold text-lg" style={{ color: item.main }}>{count}</Text>
                                                    </View>
                                                    <View>
                                                        <Text className="text-white font-semibold text-sm">{item.label}</Text>
                                                        <Text className="text-gray-500 text-[10px]">%{pct} oran</Text>
                                                    </View>
                                                </View>
                                            </View>

                                            <View className="h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                                                <View
                                                    style={{ width: `${pct}%`, backgroundColor: item.main }}
                                                    className="h-full rounded-full"
                                                />
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        )}
                    </View>
                </View>
                <View className="h-24" />
            </ScrollView>
        </SafeAreaView>
    );
}
