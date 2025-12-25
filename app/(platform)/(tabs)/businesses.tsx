import { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, Image, FlatList, RefreshControl, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, Star, ChevronRight, Plus, Store, Users, TrendingUp, Crown, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAdminStore } from '@/stores/adminStore';
import { LinearGradient } from 'expo-linear-gradient';
import AddBusinessModal from '@/components/admin/AddBusinessModal';
import { BaseHeader } from '@/components/shared/layouts/BaseHeader';

// İşletme Türü Filtreleri
const TYPE_FILTERS = [
    { id: 'all', label: 'Tümü' },
    { id: 'berber', label: 'Berber' },
    { id: 'kuafor', label: 'Kuaför' },
    { id: 'guzellik_merkezi', label: 'Güzellik' },
];

// Paket Filtreleri
const PLAN_FILTERS = [
    { id: 'all', label: 'Tümü' },
    { id: 'silver', label: 'Silver' },
    { id: 'gold', label: 'Gold' },
    { id: 'platinum', label: 'Platinum' },
];

// Contextual Default Images (Safe, Salon/Barber Focused)
const DEFAULT_IMAGES: Record<string, string> = {
    berber: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80', // Barber Interior
    kuafor: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80', // Salon Interior
    guzellik_merkezi: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80', // Spa Interior
    default: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80' // Generic Salon
};

export default function PlatformBusinessesScreen() {
    const router = useRouter();
    const { barbers, fetchBarbers, loading, updateBusinessStatus, hasMore, page } = useAdminStore();
    const [typeFilter, setTypeFilter] = useState('all');
    const [planFilter, setPlanFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    // İlk yükleme - tüm sayfaları yükle
    useEffect(() => {
        loadAllBusinesses();
    }, []);

    const loadAllBusinesses = async () => {
        await fetchBarbers(1, true);
    };

    // Load more if needed
    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            fetchBarbers(page + 1, false);
        }
    }, [loading, hasMore, page]);

    // Refresh
    const onRefresh = useCallback(() => {
        fetchBarbers(1, true);
    }, []);

    // Filter businesses - hem türe hem pakete göre
    const displayData = barbers.filter(b => {
        const matchesType = typeFilter === 'all' || b.businessType === typeFilter;
        const matchesPlan = planFilter === 'all' || b.subscriptionTier === planFilter;
        const matchesSearch = !searchQuery || b.name?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesPlan && matchesSearch;
    });

    // Stats
    const activeCount = barbers.filter(b => b.isOpen).length;
    const totalCount = barbers.length;

    return (
        <SafeAreaView className="flex-1 bg-[#121212]" edges={['top']}>
            <BaseHeader
                title="İşletmeler"
                subtitle={`${totalCount} kayıtlı • ${activeCount} aktif`}
                variant="settings"
                headerIcon={<Store size={20} color="#121212" />}
                rightElement={
                    <Pressable
                        onPress={() => setShowAddModal(true)}
                        className="w-10 h-10 rounded-full bg-[#1E1E1E] border border-white/10 items-center justify-center"
                    >
                        <Plus size={20} color="#d4af35" />
                    </Pressable>
                }
            />

            {/* Standard Search Bar */}
            <View className="px-4 py-3">
                <View className="bg-[#1E1E1E] rounded-xl h-11 flex-row items-center px-4 border border-white/5">
                    <Search size={18} color="#6B7280" />
                    <TextInput
                        className="flex-1 ml-3 text-white text-sm h-full"
                        placeholder="İşletme ara..."
                        placeholderTextColor="#6B7280"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* Standard Filters */}
            <View className="px-4 mb-3">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                    {TYPE_FILTERS.map(filter => {
                        const isActive = typeFilter === filter.id;
                        return (
                            <Pressable
                                key={filter.id}
                                onPress={() => setTypeFilter(filter.id)}
                                className={`h-8 px-4 rounded-full items-center justify-center border ${isActive
                                    ? 'bg-[#d4af35] border-[#d4af35]'
                                    : 'bg-[#1E1E1E] border-white/10'
                                    }`}
                            >
                                <Text className={`text-xs font-semibold ${isActive ? 'text-black' : 'text-gray-400'}`}>
                                    {filter.label}
                                </Text>
                            </Pressable>
                        )
                    })}
                </ScrollView>
            </View>

            {/* List */}
            <FlatList
                data={displayData}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor="#d4af35" />
                }
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={
                    <View className="items-center py-16 opacity-50">
                        <Store size={48} color="#6B7280" />
                        <Text className="text-gray-500 mt-4">Görüntülenecek işletme yok</Text>
                    </View>
                }
                renderItem={({ item }) => {
                    // Logic to select relevant default image
                    const fallbackImage = DEFAULT_IMAGES[item.businessType || 'default'] || DEFAULT_IMAGES.default;

                    return (
                        <Pressable
                            onPress={() => router.push(`/(platform)/business-detail/${item.id}`)}
                            className="mb-6 bg-[#18181b] rounded-2xl overflow-hidden border border-white/5"
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 10 },
                                shadowOpacity: 0.3,
                                shadowRadius: 15,
                                elevation: 5
                            }}
                        >
                            {/* Immersive Image Section - PRESERVED */}
                            <View className="h-52 relative">
                                <Image
                                    source={{ uri: item.coverImage || fallbackImage }}
                                    className="w-full h-full"
                                    style={{ opacity: 1 }}
                                    resizeMode="cover"
                                />
                                <LinearGradient
                                    colors={['transparent', 'rgba(24,24,27,0.4)', 'rgba(24,24,27,1)']}
                                    locations={[0, 0.6, 1]}
                                    className="absolute inset-0"
                                />

                                {/* Status Badge - PRESERVED (Zinc for closed) */}
                                <View className="absolute top-4 right-4">
                                    <View className={`px-3 py-1.5 rounded-full backdrop-blur-md border shadow-lg ${item.isOpen ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-zinc-800/90 border-zinc-600/50'}`}>
                                        <Text className={`text-[10px] font-black ${item.isOpen ? 'text-emerald-400' : 'text-zinc-400'} tracking-wider`}>
                                            {item.isOpen ? 'AÇIK' : 'KAPALI'}
                                        </Text>
                                    </View>
                                </View>

                                {/* Plan Badge - PRESERVED (Solid background) */}
                                <View className="absolute bottom-4 left-5">
                                    <View
                                        className="px-3 py-1.5 rounded-lg shadow-lg border border-white/10"
                                        style={{
                                            backgroundColor: '#09090b',
                                            borderColor: item.subscriptionTier === 'platinum' ? '#22D3EE' : item.subscriptionTier === 'gold' ? '#fbbf24' : '#94A3B8',
                                            borderWidth: 1.5
                                        }}
                                    >
                                        <Text
                                            className="text-[10px] font-black tracking-widest"
                                            style={{ color: item.subscriptionTier === 'platinum' ? '#22D3EE' : item.subscriptionTier === 'gold' ? '#fbbf24' : '#94A3B8' }}
                                        >
                                            {(item.subscriptionTier || 'silver').toUpperCase()}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Content Body - PRESERVED */}
                            <View className="px-4 pb-4 pt-2 bg-[#18181b]">
                                <View className="flex-row justify-between items-start mb-4">
                                    <View className="flex-1 mr-4">
                                        <View className="flex-row items-center gap-2 mb-1.5">
                                            <Text className="text-white text-xl font-bold tracking-tight leading-tight">{item.name}</Text>
                                            {item.subscriptionTier === 'gold' && <Crown size={14} color="#d4af35" fill="#d4af35" />}
                                        </View>
                                        <View className="flex-row items-center gap-1.5">
                                            <MapPin size={13} color="#71717a" />
                                            <Text className="text-zinc-500 text-sm font-medium tracking-wide">{item.city || 'Merkez, İstanbul'}</Text>
                                        </View>
                                    </View>

                                    {/* Right Side: Type & Rating - PRESERVED */}
                                    <View className="items-end gap-2">
                                        <View className="bg-zinc-800/80 px-2.5 py-1 rounded-md border border-white/10">
                                            <Text className="text-[10px] font-bold text-zinc-300 tracking-wide uppercase">
                                                {item.businessType === 'kuafor' ? 'KUAFÖR' : item.businessType === 'guzellik_merkezi' ? 'GÜZELLİK' : 'BERBER'}
                                            </Text>
                                        </View>
                                        <View className="flex-row items-center gap-1.5">
                                            <Text className="text-white text-xs font-bold">{item.rating?.toFixed(1) || '4.8'}</Text>
                                            <Star size={14} color="#FCD34D" fill="#FCD34D" />
                                        </View>
                                    </View>
                                </View>

                                <View className="h-[1px] bg-zinc-800/50 mb-4" />

                                <View className="flex-row items-center justify-between">
                                    {/* Staff Avatars + Count Text - PRESERVED */}
                                    <View className="flex-row items-center gap-3">
                                        <View className="flex-row items-center">
                                            {((item as any).staffList || []).slice(0, 4).map((staff: any, idx: number) => (
                                                <Image
                                                    key={staff.id || idx}
                                                    source={{ uri: staff.avatarUrl || `https://ui-avatars.com/api/?name=${staff.name}&background=random` }}
                                                    className="w-8 h-8 rounded-full border-2 border-[#18181b]"
                                                    style={{ marginLeft: idx === 0 ? 0 : -10 }}
                                                />
                                            ))}
                                            {((item as any).staffCount || 0) > 4 && (
                                                <View className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-[#18181b] items-center justify-center -ml-2.5">
                                                    <Text className="text-zinc-400 text-[10px] font-bold">+{((item as any).staffCount || 0) - 4}</Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text className="text-zinc-500 text-xs font-medium">
                                            {(item as any).staffCount || 0} Personel
                                        </Text>
                                    </View>

                                    <View className="flex-row items-center gap-4">
                                        <Switch
                                            value={item.isOpen}
                                            onValueChange={(val) => updateBusinessStatus(item.id, val)}
                                            trackColor={{ false: '#27272a', true: '#d4af35' }}
                                            thumbColor={item.isOpen ? '#fff' : '#52525b'}
                                            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                                        />
                                        <View className="w-8 h-8 rounded-full bg-zinc-800/50 items-center justify-center border border-white/5">
                                            <ChevronRight size={16} color="#71717a" />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Pressable>
                    );
                }}
            />

            {/* Add Business Modal */}
            <AddBusinessModal
                visible={showAddModal}
                onClose={() => setShowAddModal(false)}
            />
        </SafeAreaView>
    );
}
