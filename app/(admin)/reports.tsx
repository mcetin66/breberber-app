import { View, Text, ScrollView, Dimensions, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAdminStore } from '@/stores/adminStore';
import { TrendingUp, TrendingDown, DollarSign, Calendar, CreditCard, ChevronRight, BarChart2, PieChart } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { VictoryPie, VictoryLabel, VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory-native';

export default function AdminReportsScreen() {
    const { aggregateStats, fetchDashboardStats } = useAdminStore();
    const screenWidth = Dimensions.get('window').width;
    const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

    useEffect(() => {
        // Refresh stats when entering reports just in case
        fetchDashboardStats();
    }, []);

    // Prepare Chart Data
    // Tiers: basic, premium, enterprise, gold, silver, platinum (legacy)
    const rawPlans = aggregateStats.planDistribution || {};

    // Normalized Data for Chart
    const planData = [
        { x: 'Silver', y: (rawPlans['silver'] || 0) + (rawPlans['basic'] || 0) + (rawPlans['başlangıç'] || 0), color: '#CBD5E1' }, // Merge legacies into Silver
        { x: 'Gold', y: rawPlans['gold'] || 0, color: '#FBBF24' }, // Amber-400
        { x: 'Platinum', y: rawPlans['platinum'] || 0, color: '#E2E8F0' }, // Slate-200
        { x: 'Premium', y: rawPlans['premium'] || 0, color: '#60A5FA' }, // Blue-400
        { x: 'Ent.', y: rawPlans['enterprise'] || 0, color: '#818CF8' }, // Indigo-400
    ].filter(d => d.y > 0);

    const ReportCard = ({ title, value, subtext, type = 'neutral' }: any) => {
        let color = 'text-white';
        let bg = 'bg-[#1E293B]';

        if (type === 'success') color = 'text-green-400';
        if (type === 'chart') bg = 'bg-blue-600';

        return (
            <View className={`${bg} rounded-2xl p-5 mb-4 border border-white/5`}>
                <Text className="text-slate-400 text-xs font-bold uppercase mb-2 mr-2">{title}</Text>
                <Text className="text-white text-3xl font-bold mb-1">{value}</Text>
                <Text className={`text-xs ${color}`}>{subtext}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-[#0F172A]" edges={['top']}>
            <View className="flex-1 px-5 pt-2">
                <Text className="text-white text-2xl font-bold mb-6">Finansal Raporlar</Text>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Main Summary */}
                    <ReportCard
                        title="Toplam Gelir"
                        value={`₺${aggregateStats.totalRevenue.toLocaleString('tr-TR')}`}
                        subtext="+12.5% geçen aya göre"
                        type="success"
                    />

                    {/* GRAPH SECTION */}
                    {planData.length > 0 && (
                        <View className="mb-6 bg-[#1E293B] rounded-2xl p-5 border border-white/5">
                            <View className="flex-row items-center justify-between mb-4">
                                <Text className="text-white text-lg font-bold">Paket Dağılımı</Text>
                                <Pressable
                                    onPress={() => setChartType(prev => prev === 'pie' ? 'bar' : 'pie')}
                                    className="bg-white/5 p-2 rounded-lg active:bg-white/10"
                                >
                                    {chartType === 'pie' ? (
                                        <BarChart2 size={20} color="#94A3B8" />
                                    ) : (
                                        <PieChart size={20} color="#94A3B8" />
                                    )}
                                </Pressable>
                            </View>

                            <View className="items-center">
                                {chartType === 'pie' ? (
                                    <VictoryPie
                                        data={planData}
                                        colorScale={planData.map(d => d.color)}
                                        innerRadius={70}
                                        radius={({ datum }) => 100 + (datum.y * 2)} // Dynamic radius
                                        padAngle={2}
                                        height={300}
                                        width={screenWidth - 80}
                                        labels={({ datum }) => `${datum.x}\n${datum.y}`}
                                        style={{
                                            labels: { fill: "white", fontSize: 13, fontWeight: "bold", textAlign: "center" }
                                        }}
                                    />
                                ) : (
                                    <VictoryChart
                                        width={screenWidth - 80}
                                        height={300}
                                        domainPadding={{ x: 50 }}
                                        theme={VictoryTheme.material}
                                    >
                                        <VictoryAxis
                                            tickFormat={(t) => t}
                                            style={{
                                                axis: { stroke: "#64748B" },
                                                tickLabels: { fill: "#94A3B8", fontSize: 12, fontWeight: 'bold' },
                                                grid: { stroke: "none" }
                                            }}
                                        />
                                        <VictoryBar
                                            data={planData}
                                            barWidth={40}
                                            cornerRadius={4}
                                            style={{
                                                data: {
                                                    fill: ({ datum }) => datum.color,
                                                },
                                                labels: { fill: "white" }
                                            }}
                                            labels={({ datum }) => datum.y}
                                            labelComponent={<VictoryLabel dy={-10} />}
                                        />
                                    </VictoryChart>
                                )}
                            </View>
                        </View>
                    )}

                    <View className="flex-row gap-4 mb-4">
                        <View className="flex-1">
                            <ReportCard
                                title="Toplam Randevu"
                                value={aggregateStats.totalAppointments}
                                subtext="Bugün 12 yeni"
                            />
                        </View>
                        <View className="flex-1">
                            <ReportCard
                                title="Ortalama Sepet"
                                value={`₺${aggregateStats.averageBasket}`}
                                subtext="İşlem başına"
                            />
                        </View>
                    </View>

                    <View className="bg-[#1E293B] rounded-2xl p-5 border border-white/5 mb-8">
                        <View className="flex-row justify-between items-center">
                            <Text className="text-slate-300 font-medium">Detaylı Excel Raporu</Text>
                            <View className="flex-row items-center">
                                <Text className="text-blue-400 text-xs font-bold mr-1">İNDİR</Text>
                                <ChevronRight size={14} color="#60A5FA" />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
