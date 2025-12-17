import { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, Image, FlatList, Switch, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus, MapPin, ChevronRight, MoreHorizontal } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useAdminStore } from '@/stores/adminStore';
import AddBusinessModal from '@/components/admin/AddBusinessModal';
import { getPlanDetails } from '@/constants/plans';
import { AdminHeader } from '@/components/admin/AdminHeader';

// Mock Data Types
type PlanType = 'Pro Plan' | 'Basic' | 'Gold Plan' | 'Starter';
type BusinessStatus = 'active' | 'expired' | 'suspended' | 'passive';

interface BusinessMock {
    id: string;
    name: string;
    location: string;
    plan: PlanType;
    expiryDate: string;
    status: BusinessStatus;
    image: string;
    isActiveToggle: boolean;
}

const FILTER_TABS = [
    { id: 'all', label: 'Tümü' },
    { id: 'active', label: 'Aktif' },
    { id: 'expired', label: 'Süresi Doldu' },
    { id: 'suspended', label: 'Askıda' },
];

const TYPE_TABS = [
    { id: 'all', label: 'Tümü' },
    { id: 'berber', label: 'Berber' },
    { id: 'kuafor', label: 'Kuaför' },
    { id: 'guzellik_merkezi', label: 'Güzellik' },
];

export default function AdminBarbersScreen() {
    const router = useRouter();
    const { barbers, fetchBarbers, loading, hasMore, page } = useAdminStore();
    const [activeTab, setActiveTab] = useState('all');
    const [activeTypeTab, setActiveTypeTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);

    useEffect(() => {
        // Initial load (refresh)
        fetchBarbers(1, true);
    }, []);

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            fetchBarbers(page + 1, false);
        }
    };

    const handleRefresh = () => {
        fetchBarbers(1, true);
    };

    // --- FILTERING LOGIC ---
    const filteredBarbers = barbers.filter(barber => {
        // 1. Search Filter
        const query = searchQuery.toLowerCase();
        const matchesSearch =
            barber.name.toLowerCase().includes(query) ||
            (barber.city || '').toLowerCase().includes(query) ||
            (barber.subscriptionTier || '').toLowerCase().includes(query);

        if (!matchesSearch) return false;

        // 2. Tab Filter
        const now = new Date();
        const endDate = barber.subscriptionEndDate ? new Date(barber.subscriptionEndDate) : null;
        const isExpired = endDate ? endDate < now : false;

        // 3. Type Filter
        const matchesType = activeTypeTab === 'all' || (barber as any).businessType === activeTypeTab;
        if (!matchesType) return false;

        switch (activeTab) {
            case 'active':
                return barber.isOpen && !isExpired;
            case 'suspended': // Using 'suspended' for inactive/passive state
                return !barber.isOpen;
            case 'expired':
                return isExpired;
            case 'all':
            default:
                return true;
        }
    });

    const renderBusinessCard = ({ item }: { item: any }) => {
        const isExpired = false; // Logic needed if we had expiry date in DB
        const expiryColor = isExpired ? 'text-red-400' : 'text-gray-400';

        // Use shared helper for consistent display
        const planDetails = getPlanDetails(item.subscriptionTier);

        return (
            <View className="bg-[#1E293B] rounded-2xl p-4 mb-4 border border-white/5 shadow-sm">
                <View className="flex-row items-start mb-4">
                    <View className="relative">
                        <Image
                            source={{ uri: item.coverImage || 'https://via.placeholder.com/150' }}
                            className="w-16 h-16 rounded-xl bg-gray-800"
                        />
                        <View className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#1E293B] ${item.isOpen ? 'bg-green-500' : 'bg-gray-500'}`} />
                    </View>

                    <View className="flex-1 ml-4 justify-between min-h-[64px]">
                        <View>
                            <Text className="text-white text-lg font-bold leading-tight mb-1" numberOfLines={1}>{item.name}</Text>
                            <View className="flex-row items-center">
                                <MapPin size={12} color="#94A3B8" />
                                <Text className="text-slate-400 text-xs ml-1 font-medium">{item.city || 'Konum Belirtilmemiş'}</Text>
                                {item.businessType && (
                                    <View className="ml-2 bg-blue-500/20 px-1.5 py-0.5 rounded ml-2 border border-blue-500/20">
                                        <Text className="text-[10px] text-blue-400 font-bold uppercase">
                                            {item.businessType === 'guzellik_merkezi' ? 'GÜZELLİK' : item.businessType === 'kuafor' ? 'KUAFÖR' : 'BERBER'}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Old Plan Badge Location Removed */}
                    </View>

                    {/* New Switch Location (Top Right) */}
                    <View className="items-end pl-2">
                        <Switch
                            value={item.isOpen}
                            onValueChange={(val) => useAdminStore.getState().updateBusinessStatus(item.id, val)}
                            trackColor={{ false: '#334155', true: COLORS.primary.DEFAULT }}
                            thumbColor={'#fff'}
                            ios_backgroundColor="#334155"
                            style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }} // Slightly smaller
                        />
                        <Text className={`text-[10px] font-medium mt-1 ${item.isOpen ? 'text-primary' : 'text-gray-400'}`}>
                            {item.isOpen ? 'Aktif' : 'Pasif'}
                        </Text>
                    </View>
                </View>

                <View className="h-[1px] bg-white/5 w-full mb-3" />

                <View className="flex-row items-center justify-between">
                    {/* New Plan Badge Location (Bottom Left) */}
                    <View className="flex-row items-center gap-2">
                        <View
                            className="px-2 py-0.5 rounded-md border"
                            style={{
                                backgroundColor: planDetails.color + '20', // 20% opacity
                                borderColor: planDetails.color + '30'
                            }}
                        >
                            <Text
                                className="text-[10px] font-bold"
                                style={{ color: planDetails.color }}
                            >
                                {planDetails.label.toUpperCase()}
                            </Text>
                        </View>
                    </View>

                    <Pressable
                        onPress={() => router.push(`/(platform)/business-detail/${item.id}`)}
                        className="flex-row items-center active:opacity-70"
                    >
                        <Text className="text-primary text-sm font-semibold mr-1">Detayları Gör</Text>
                        <ChevronRight size={16} color={COLORS.primary.DEFAULT} />
                    </Pressable>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-[#0F172A]" edges={['top']}>
            {/* Header */}
            <AdminHeader
                title="İşletme Listesi"
                subtitle="Platform Yönetimi"
                rightElement={
                    <Pressable
                        onPress={() => setIsAddModalVisible(true)}
                        className="w-10 h-10 rounded-full bg-primary items-center justify-center shadow-lg shadow-primary/30 active:scale-95"
                    >
                        <Plus size={24} color="white" />
                    </Pressable>
                }
            />

            <View className="flex-1 px-4">
                {/* Search Bar */}
                <View className="bg-[#1E293B] border border-white/5 rounded-xl h-12 flex-row items-center px-4 mb-6">
                    <Search size={20} color="#64748B" />
                    <TextInput
                        className="flex-1 ml-3 text-white text-sm font-medium h-full"
                        placeholder="Berber adı, şehir veya plan ara..."
                        placeholderTextColor="#64748B"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Filter Tabs */}
                <View className="mb-6">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                        {FILTER_TABS.map(tab => {
                            const isActive = activeTab === tab.id;
                            return (
                                <Pressable
                                    key={tab.id}
                                    onPress={() => setActiveTab(tab.id)}
                                    className={`px-5 py-2 rounded-full border ${isActive ? 'bg-primary border-primary' : 'bg-[#1E293B] border-white/5'}`}
                                >
                                    <Text className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-slate-400'}`}>
                                        {tab.label}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Type Filters */}
                <View className="mb-4">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                        {TYPE_TABS.map(tab => {
                            const isActive = activeTypeTab === tab.id;
                            return (
                                <Pressable
                                    key={tab.id}
                                    onPress={() => setActiveTypeTab(tab.id)}
                                    className={`px-4 py-1.5 rounded-full border ${isActive ? 'bg-blue-500 border-blue-500' : 'bg-[#1E293B] border-white/5'}`}
                                >
                                    <Text className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-slate-400'}`}>
                                        {tab.label}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* List */}
                <FlatList
                    data={filteredBarbers}
                    renderItem={renderBusinessCard}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    style={{ flex: 1 }}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.8}
                    refreshControl={
                        <RefreshControl refreshing={loading && page === 1} onRefresh={handleRefresh} tintColor={COLORS.primary.DEFAULT} />
                    }
                    ListFooterComponent={
                        loading && page > 1 ? (
                            <View className="py-4">
                                <ActivityIndicator color={COLORS.primary.DEFAULT} />
                            </View>
                        ) : null
                    }
                />
            </View>

            <AddBusinessModal
                visible={isAddModalVisible}
                onClose={() => setIsAddModalVisible(false)}
            />
        </SafeAreaView>
    );
}
