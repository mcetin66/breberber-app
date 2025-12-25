import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, Pressable, TextInput, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { BaseHeader } from '@/components/shared/layouts/BaseHeader';
import { Heart } from 'lucide-react-native';
import { favoriteService } from '@/services/favorites';
import { useAuthStore } from '@/stores/authStore';

const FILTERS = ['Tümü', 'berber', 'kuafor', 'guzellik_merkezi'];
const FILTER_LABELS: Record<string, string> = {
    'Tümü': 'Tümü',
    'berber': 'Berber',
    'kuafor': 'Kuaför',
    'guzellik_merkezi': 'Güzellik'
};

export default function FavoritesScreen() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [activeFilter, setActiveFilter] = useState('Tümü');
    const [searchQuery, setSearchQuery] = useState('');
    const [favorites, setFavorites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            loadFavorites();
        }
    }, [user?.id]);

    const loadFavorites = async () => {
        try {
            const data = await favoriteService.getMyFavorites(user?.id || '');
            setFavorites(data);
        } catch (error) {
            console.error('Error loading favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredFavorites = favorites.filter(item => {
        const business = item.businesses;
        if (!business) return false;

        const matchesFilter = activeFilter === 'Tümü' || business.business_type === activeFilter;
        const matchesSearch = business.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            business.city?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <SafeAreaView className="flex-1 bg-[#121212]" edges={['top']}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <BaseHeader
                title="Favorilerim"
                noBorder
                leftElement={
                    <View className="w-10 h-10 rounded-full bg-[#d4af35] items-center justify-center">
                        <Heart size={20} color="#121212" />
                    </View>
                }
                rightElement={
                    <Pressable className="w-10 h-10 items-center justify-center rounded-full bg-[#1E1E1E] border border-white/5">
                        <MaterialIcons name="filter-list" size={24} color={COLORS.primary.DEFAULT} />
                    </Pressable>
                }
            >
                {/* Search Bar */}
                <View className="pb-3 mt-2">
                    <View className="flex-row items-center bg-[#1E1E1E] rounded-xl h-12 border border-white/5 px-3">
                        <MaterialIcons name="search" size={22} color="#9ca3af" />
                        <TextInput
                            className="flex-1 text-white text-sm ml-2 h-full"
                            placeholder="Salon, semt veya hizmet ara..."
                            placeholderTextColor="#6b7280"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                {/* Filter Chips */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 16 }}>
                    {FILTERS.map((filter) => (
                        <Pressable
                            key={filter}
                            onPress={() => setActiveFilter(filter)}
                            className={`h-9 px-5 rounded-full items-center justify-center border ${activeFilter === filter ? 'bg-primary border-primary' : 'bg-[#1E1E1E] border-white/5'}`}
                        >
                            <Text className={`text-xs font-semibold tracking-wide ${activeFilter === filter ? 'text-[#121212]' : 'text-gray-300'}`}>{FILTER_LABELS[filter]}</Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </BaseHeader>

            <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {loading ? (
                    <View className="flex-1 items-center justify-center py-20">
                        <ActivityIndicator size="large" color={COLORS.primary.DEFAULT} />
                        <Text className="text-gray-400 mt-4">Yükleniyor...</Text>
                    </View>
                ) : filteredFavorites.length > 0 ? filteredFavorites.map((item) => {
                    const business = item.businesses;
                    return (
                        <Pressable
                            key={item.id}
                            onPress={() => router.push(`/(customer)/business/${business.id}`)}
                            className="bg-[#1E1E1E] rounded-2xl overflow-hidden mb-5 border border-white/5 hover:border-primary/30"
                        >
                            <View className="h-48 w-full relative">
                                <Image source={{ uri: business.cover_url || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800' }} className="w-full h-full" resizeMode="cover" />
                                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} className="absolute inset-0" />

                                <Pressable className="absolute top-3 right-3 w-9 h-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-md">
                                    <MaterialIcons name="favorite" size={20} color={COLORS.primary.DEFAULT} />
                                </Pressable>

                                <View className="absolute bottom-3 left-3 flex-row items-center gap-1 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10">
                                    <MaterialIcons name="star" size={14} color={COLORS.primary.DEFAULT} />
                                    <Text className="text-white text-xs font-bold">{business.rating?.toFixed(1) || '0.0'}</Text>
                                    <Text className="text-gray-300 text-[10px] ml-0.5">({business.review_count || 0})</Text>
                                </View>
                            </View>

                            <View className="p-4 gap-3">
                                <View className="flex-row justify-between items-start">
                                    <View>
                                        <Text className="text-white text-lg font-bold leading-tight mb-1">{business.name}</Text>
                                        <View className="flex-row items-center gap-1">
                                            <MaterialIcons name="location-on" size={14} color="#9ca3af" />
                                            <Text className="text-gray-400 text-xs">{business.city || 'Türkiye'}</Text>
                                        </View>
                                    </View>
                                    <View className="items-end gap-1">
                                        <View className="bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                                            <Text className="text-primary text-xs font-medium">{FILTER_LABELS[business.business_type] || 'Salon'}</Text>
                                        </View>
                                    </View>
                                </View>

                                <View className="h-[1px] bg-white/10 w-full" />

                                <View className="flex-row items-center justify-between">
                                    <View className="flex-row items-center gap-1">
                                        <MaterialIcons name="content-cut" size={16} color="#9ca3af" />
                                        <Text className="text-gray-400 text-xs">Saç & Sakal</Text>
                                    </View>
                                    <Pressable
                                        className="bg-primary rounded-full px-5 py-2 items-center justify-center"
                                        onPress={(e) => {
                                            e.stopPropagation();
                                            router.push(`/(customer)/business/${business.id}`);
                                        }}
                                    >
                                        <Text className="text-[#121212] text-sm font-bold">Randevu Al</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </Pressable>
                    );
                }) : (
                    <View className="flex-1 items-center justify-center py-20">
                        <View className="w-20 h-20 rounded-full bg-[#1E1E1E] items-center justify-center mb-4 border border-white/5">
                            <MaterialIcons name="favorite-border" size={32} color="#64748B" />
                        </View>
                        <Text className="text-white text-lg font-bold mb-2">Henüz Favori Yok</Text>
                        <Text className="text-[#A0A0A0] text-sm text-center">
                            Beğendiğiniz salonları favorilere ekleyin.
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
