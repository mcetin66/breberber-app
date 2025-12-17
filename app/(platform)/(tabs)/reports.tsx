import { View, Text, ScrollView, RefreshControl, Pressable, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useAdminStore } from '@/stores/adminStore';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { COLORS } from '@/constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Color Constants
const COLORS_MAP = {
    // Plans
    silver: { main: '#94A3B8', active: '#CBD5E1', bg: 'bg-slate-700' },
    gold: { main: '#EAB308', active: '#FDE047', bg: 'bg-yellow-900/50' },
    platinum: { main: '#22D3EE', active: '#67E8F9', bg: 'bg-cyan-900/50' },

    // Types
    berber: { main: '#F97316', active: '#FDBA74', bg: 'bg-orange-900/50' }, // Orange for Barber
    kuafor: { main: '#8B5CF6', active: '#C4B5FD', bg: 'bg-purple-900/50' }, // Purple for Hairdresser
    guzellik_merkezi: { main: '#EC4899', active: '#F9A8D4', bg: 'bg-pink-900/50' }, // Pink for Beauty Center
};

export default function PlatformReportsScreen() {
    const { aggregateStats, fetchDashboardStats } = useAdminStore();
    const [refreshing, setRefreshing] = useState(false);

    // View Mode: 'plan' (Paket Bazlı) or 'type' (İşletme Tipi Bazlı)
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

    // Reset active tab when mode changes
    useEffect(() => {
        if (viewMode === 'plan') setActiveTab('silver');
        else setActiveTab('berber');
    }, [viewMode]);

    // Helper to calculate percentage
    const getPercentage = (count: number, total: number) => {
        if (!total || total === 0) return 0;
        return Math.round((count / total) * 100);
    };

    // --- DATA PREPARATION ---

    // Plan Mode Data
    const planDist = aggregateStats.planDistribution || {};
    const planTypeBreakdown = aggregateStats.planTypeBreakdown || {};

    // Type Mode Data
    const typeDist = aggregateStats.typeDistribution || {};
    const typePlanBreakdown = aggregateStats.typePlanBreakdown || {};

    // Dynamic Tabs Configuration
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

    // Breakdown Items Configuration (What to show in the list/bars)
    const breakdownItems = useMemo(() => {
        if (viewMode === 'plan') {
            // If viewing PLANS, we break down by TYPES
            return [
                { key: 'berber', label: 'Berber', ...COLORS_MAP.berber },
                { key: 'kuafor', label: 'Kuaför', ...COLORS_MAP.kuafor },
                { key: 'guzellik_merkezi', label: 'Güzellik', ...COLORS_MAP.guzellik_merkezi },
            ];
        } else {
            // If viewing TYPES, we break down by PLANS
            return [
                { key: 'silver', label: 'Silver Paket', ...COLORS_MAP.silver },
                { key: 'gold', label: 'Gold Paket', ...COLORS_MAP.gold },
                { key: 'platinum', label: 'Platinum Paket', ...COLORS_MAP.platinum },
            ];
        }
    }, [viewMode]);

    // Get current Active Tab Data
    const currentTotal = viewMode === 'plan'
        ? (planDist[activeTab] || 0)
        : (typeDist[activeTab] || 0);

    const currentBreakdown = viewMode === 'plan'
        ? (planTypeBreakdown[activeTab] || {})
        : (typePlanBreakdown[activeTab] || {});

    const activeTabConfig = currentTabs.find(t => t.id === activeTab) || currentTabs[0];

    return (
        <SafeAreaView className="flex-1 bg-[#0F172A]" edges={['top']}>
            <AdminHeader title="Raporlar" subtitle="Detaylı Analiz Paneli" showBack={false} />

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary.DEFAULT} />
                }
            >
                <View className="px-4 mt-4">

                    {/* View Mode Switcher */}
                    <View className="flex-row bg-[#1E293B] p-1 rounded-xl border border-white/5 mb-6">
                        <Pressable
                            onPress={() => setViewMode('plan')}
                            className={`flex-1 py-2 rounded-lg items-center justify-center ${viewMode === 'plan' ? 'bg-[#334155]' : ''}`}
                        >
                            <Text className={`font-semibold text-sm ${viewMode === 'plan' ? 'text-white' : 'text-slate-500'}`}>Paket Analizi</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setViewMode('type')}
                            className={`flex-1 py-2 rounded-lg items-center justify-center ${viewMode === 'type' ? 'bg-[#334155]' : ''}`}
                        >
                            <Text className={`font-semibold text-sm ${viewMode === 'type' ? 'text-white' : 'text-slate-500'}`}>İşletme Analizi</Text>
                        </Pressable>
                    </View>

                    {/* Dynamic Tabs */}
                    <View className="flex-row bg-[#1E293B] p-1 rounded-xl border border-white/5 mb-6">
                        {currentTabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <Pressable
                                    key={tab.id}
                                    onPress={() => setActiveTab(tab.id)}
                                    className={`flex-1 py-3 rounded-lg items-center justify-center ${isActive ? 'bg-slate-700' : ''}`}
                                    style={isActive ? { backgroundColor: tab.main + '20' } : {}}
                                >
                                    <View className="flex-row items-center gap-2">
                                        <View
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: isActive ? tab.main : '#64748B' }}
                                        />
                                        <Text
                                            className={`font-bold text-xs ${isActive ? 'text-white' : 'text-slate-400'}`}
                                            numberOfLines={1}
                                            style={isActive ? { color: tab.main } : {}}
                                        >
                                            {tab.label}
                                        </Text>
                                    </View>
                                </Pressable>
                            );
                        })}
                    </View>

                    {/* Report Content */}
                    <View className="min-h-[300px]">

                        {/* Summary Card */}
                        <View className="bg-[#1E293B] p-6 rounded-3xl border border-white/5 mb-6 items-center shadow-lg shadow-black/20">
                            <Text className="text-slate-400 text-xs font-semibold mb-2 uppercase tracking-widest text-center">
                                {viewMode === 'plan' ? `Toplam ${activeTabConfig.label} Paketi` : `Toplam ${activeTabConfig.label}`}
                            </Text>
                            <Text
                                className="text-5xl font-bold mb-4"
                                style={{ color: activeTabConfig.main }}
                            >
                                {currentTotal}
                            </Text>

                            {/* Stacked Bar Graph */}
                            <View className="w-full h-8 flex-row rounded-full overflow-hidden bg-slate-800 mt-2 border border-white/5">
                                {currentTotal === 0 ? (
                                    <View className="flex-1 bg-slate-800" />
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
                                <View className="flex-row gap-4 mt-6 flex-wrap justify-center">
                                    {breakdownItems.map(item => {
                                        const count = currentBreakdown[item.key] || 0;
                                        if (count === 0) return null;
                                        return (
                                            <View key={item.key} className="flex-row items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full">
                                                <View className="w-2 h-2 rounded-full" style={{ backgroundColor: item.main }} />
                                                <Text className="text-slate-300 text-xs font-medium">{item.label}</Text>
                                                <Text className="text-white text-xs font-bold ml-1">{count}</Text>
                                            </View>
                                        );
                                    })}
                                </View>
                            )}
                        </View>

                        {/* Detailed List */}
                        <View className="bg-[#1E293B] p-5 rounded-2xl border border-white/5 mb-6">
                            <Text className="text-white text-base font-bold mb-4">
                                {viewMode === 'plan' ? 'İşletme Türü Dağılımı' : 'Paket Dağılımı'}
                            </Text>
                            {currentTotal === 0 ? (
                                <Text className="text-slate-500 text-center py-4 italic">Veri bulunamadı.</Text>
                            ) : (
                                <View className="gap-5">
                                    {breakdownItems.map((item) => {
                                        const count = currentBreakdown[item.key] || 0;
                                        const pct = getPercentage(count, currentTotal);

                                        return (
                                            <View key={item.key}>
                                                <View className="flex-row justify-between mb-2">
                                                    <View className="flex-row items-center gap-3">
                                                        <View className="w-10 h-10 rounded-xl items-center justify-center opacity-90 shadow-sm" style={{ backgroundColor: item.main }}>
                                                            <Text className="text-white font-bold text-lg">{count}</Text>
                                                        </View>
                                                        <View>
                                                            <Text className="text-white font-semibold text-sm">{item.label}</Text>
                                                            <Text className="text-slate-400 text-[10px]">% {pct} Oran</Text>
                                                        </View>
                                                    </View>
                                                </View>

                                                {/* Advanced Bar */}
                                                <View className="h-2.5 bg-slate-800 rounded-full overflow-hidden border border-white/5">
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
                </View>
                <View className="h-10" />
            </ScrollView>
        </SafeAreaView>
    );
}
