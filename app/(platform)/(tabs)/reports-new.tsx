import { View, Text, ScrollView, Pressable, Image, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Share, ChevronDown, Eye, TrendingUp, Download } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { useState } from 'react';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Path, Circle, Line } from 'react-native-svg';
import { AdminHeader } from '@/components/admin/AdminHeader';

const DATE_FILTERS = ['Günlük', 'Haftalık', 'Aylık'];
const TABS = ['Personel Bazlı', 'Hizmet Bazlı'];

export default function PlatformReportsNewScreen() {
    const insets = useSafeAreaInsets();
    const [activeDateFilter, setActiveDateFilter] = useState('Aylık');
    const [activeTab, setActiveTab] = useState('Personel Bazlı');

    // Chart Dimensions
    const screenWidth = Dimensions.get('window').width;

    return (
        <View className="flex-1 bg-[#121212]">
            {/* Header */}
            <AdminHeader
                title="Gelir Raporları (Yeni)"
                subtitle="Finansal Analiz"
                rightElement={
                    <Pressable className="w-10 h-10 items-center justify-center rounded-full bg-[#d4af35]/10">
                        <Share size={20} color="#d4af35" />
                    </Pressable>
                }
            />

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                {/* Date Filter Segmented Control */}
                <View className="px-4 py-4">
                    <View className="flex-row p-1 rounded-xl bg-[#1E1E1E] border border-white/5">
                        {DATE_FILTERS.map((filter) => {
                            const isActive = activeDateFilter === filter;
                            return (
                                <Pressable
                                    key={filter}
                                    onPress={() => setActiveDateFilter(filter)}
                                    className={`flex-1 py-2 items-center rounded-lg transition-all ${isActive ? 'bg-[#d4af35]' : 'bg-transparent'}`}
                                >
                                    <Text className={`text-sm font-bold ${isActive ? 'text-black' : 'text-gray-400'}`}>
                                        {filter}
                                    </Text>
                                </Pressable>
                            )
                        })}
                    </View>
                    <View className="flex-row justify-center mt-3 items-center gap-1 opacity-60">
                        <Text className="text-xs text-gray-400 font-medium">1 Ekim - 31 Ekim 2023</Text>
                        <ChevronDown size={14} color="#9ca3af" />
                    </View>
                </View>

                {/* Hero Stats Card */}
                <View className="px-4 mb-6">
                    <View className="bg-[#1E1E1E] rounded-3xl p-6 border border-white/5 relative overflow-hidden shadow-lg shadow-[#d4af35]/10">
                        {/* Decorative Blur */}
                        <View className="absolute -top-10 -right-10 w-32 h-32 bg-[#d4af35]/10 rounded-full blur-3xl" />

                        <View className="flex-row justify-between items-start mb-2 relative z-10">
                            <Text className="text-gray-400 text-sm font-medium">Toplam Ciro</Text>
                            <Pressable>
                                <Eye size={20} color="#9ca3af" />
                            </Pressable>
                        </View>

                        <View className="mb-4">
                            <Text className="text-4xl font-bold tracking-tighter text-white">₺142.500</Text>
                        </View>

                        <View className="flex-row items-center gap-2">
                            <View className="flex-row items-center gap-1 bg-green-500/10 px-2 py-1 rounded-md border border-green-500/20">
                                <TrendingUp size={14} color="#22c55e" />
                                <Text className="text-green-500 text-xs font-bold">%15</Text>
                            </View>
                            <Text className="text-xs text-gray-500">geçen aya göre</Text>
                        </View>
                    </View>
                </View>

                {/* Chart Section */}
                <View className="px-4 mb-6">
                    <View className="bg-[#1E1E1E] rounded-2xl p-5 border border-white/5">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-white font-semibold text-sm">Ciro Trendi</Text>
                            <Pressable className="bg-[#d4af35]/10 px-2.5 py-1 rounded border border-[#d4af35]/20">
                                <Text className="text-[#d4af35] text-xs font-bold">Detaylar</Text>
                            </Pressable>
                        </View>

                        {/* Chart Graphic Area (SVG) */}
                        <View className="h-40 w-full overflow-hidden">
                            <Svg height="100%" width="100%" viewBox="0 0 400 150">
                                <Defs>
                                    <SvgLinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                                        <Stop offset="0" stopColor="#d4af35" stopOpacity="0.3" />
                                        <Stop offset="1" stopColor="#d4af35" stopOpacity="0" />
                                    </SvgLinearGradient>
                                </Defs>
                                {/* Grid Lines */}
                                <Line x1="0" y1="50" x2="400" y2="50" stroke="#333" strokeWidth="1" strokeDasharray="4 4" />
                                <Line x1="0" y1="100" x2="400" y2="100" stroke="#333" strokeWidth="1" strokeDasharray="4 4" />

                                <Path
                                    d="M0,120 C50,120 50,80 100,80 C150,80 150,40 200,40 C250,40 250,90 300,70 C350,50 350,10 400,10 V150 H0 Z"
                                    fill="url(#grad)"
                                />
                                <Path
                                    d="M0,120 C50,120 50,80 100,80 C150,80 150,40 200,40 C250,40 250,90 300,70 C350,50 350,10 400,10"
                                    fill="none"
                                    stroke="#d4af35"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                                <Circle cx="300" cy="70" r="4" fill="#121212" stroke="#d4af35" strokeWidth="2" />
                            </Svg>
                        </View>

                        {/* X Axis Labels */}
                        <View className="flex-row justify-between mt-2 px-1">
                            {['1 Eki', '8 Eki', '15 Eki', '22 Eki', '29 Eki'].map((date, i) => (
                                <Text key={i} className="text-[10px] text-gray-500 font-medium">{date}</Text>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Tabs Section */}
                <View className="px-4 mb-4">
                    <View className="flex-row border-b border-white/10">
                        {TABS.map((tab) => {
                            const isActive = activeTab === tab;
                            return (
                                <Pressable
                                    key={tab}
                                    onPress={() => setActiveTab(tab)}
                                    className={`flex-1 pb-3 border-b-2 items-center ${isActive ? 'border-[#d4af35]' : 'border-transparent'}`}
                                >
                                    <Text className={`text-sm font-bold ${isActive ? 'text-white' : 'text-gray-500'}`}>{tab}</Text>
                                </Pressable>
                            )
                        })}
                    </View>
                </View>

                {/* List Content (Staff) */}
                <View className="px-4 gap-3">
                    {[
                        { name: 'Ahmet Yılmaz', rev: '₺45.000', pct: 85, img: 'https://randomuser.me/api/portraits/men/32.jpg' },
                        { name: 'Mehmet Demir', rev: '₺32.450', pct: 60, img: 'https://randomuser.me/api/portraits/men/44.jpg' },
                        { name: 'Ayşe Kaya', rev: '₺28.100', pct: 45, img: 'https://randomuser.me/api/portraits/women/44.jpg' },
                    ].map((staff, idx) => (
                        <View key={idx} className="bg-[#1E1E1E] p-4 rounded-xl border border-white/5 flex-row items-center gap-4">
                            <Image
                                source={{ uri: staff.img }}
                                className="w-12 h-12 rounded-full border-2 border-white/5"
                            />
                            <View className="flex-1">
                                <View className="flex-row justify-between items-center mb-1">
                                    <Text className="text-white font-bold text-sm">{staff.name}</Text>
                                    <Text className="text-[#d4af35] font-bold text-sm">{staff.rev}</Text>
                                </View>
                                <View className="flex-row items-center gap-2">
                                    <View className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <View
                                            className="h-full bg-[#d4af35] rounded-full"
                                            style={{ width: `${staff.pct}%` }}
                                        />
                                    </View>
                                    <Text className="text-gray-500 text-xs w-8 text-right">{staff.pct}%</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Bottom Action */}
                <View className="items-end px-6 mt-6">
                    <Pressable className="bg-[#d4af35] w-14 h-14 rounded-full items-center justify-center shadow-lg shadow-[#d4af35]/30 active:scale-95">
                        <Download size={24} color="black" />
                    </Pressable>
                </View>

            </ScrollView>
        </View>
    );
}
