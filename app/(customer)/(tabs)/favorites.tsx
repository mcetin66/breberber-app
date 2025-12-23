import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Pressable, TextInput, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { BaseHeader } from '@/components/shared/layouts/BaseHeader';
import { Heart } from 'lucide-react-native';

// Mock Data
const FAVORITES = [
    {
        id: 1,
        name: "Royal Gentlemen's Lounge",
        location: 'Nişantaşı, İstanbul',
        distance: '1.2 km',
        rating: 4.9,
        reviewCount: 560,
        isOpen: true,
        image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        tags: ['Berber']
    },
    {
        id: 2,
        name: 'The Barber Club',
        location: 'Kadıköy, İstanbul',
        distance: '8.5 km',
        rating: 4.7,
        reviewCount: 210,
        isOpen: false,
        openTime: '10:00',
        image: 'https://images.unsplash.com/photo-1503951914875-befea74701c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        tags: ['Kuaför']
    },
    {
        id: 3,
        name: 'Golden Scissors',
        location: 'Etiler, İstanbul',
        distance: '2.4 km',
        rating: 5.0,
        reviewCount: 89,
        isOpen: true,
        image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        tags: ['Berber', 'Cilt Bakımı']
    }
];

const FILTERS = ['Tümü', 'Berber', 'Kuaför', 'Cilt Bakımı'];

export default function FavoritesScreen() {
    const router = useRouter();
    const [activeFilter, setActiveFilter] = useState('Tümü');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredFavorites = FAVORITES.filter(item => {
        const matchesFilter = activeFilter === 'Tümü' || item.tags.includes(activeFilter);
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <View className="flex-1 bg-[#121212]">
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
                            <Text className={`text-xs font-semibold tracking-wide ${activeFilter === filter ? 'text-[#121212]' : 'text-gray-300'}`}>{filter}</Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </BaseHeader>

            <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {filteredFavorites.map((item) => (
                    <Pressable
                        key={item.id}
                        onPress={() => router.push(`/(customer)/business/${item.id}`)}
                        className="bg-[#1E1E1E] rounded-2xl overflow-hidden mb-5 border border-white/5 hover:border-primary/30"
                    >
                        <View className="h-48 w-full relative">
                            <Image source={{ uri: item.image }} className="w-full h-full" resizeMode="cover" />
                            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} className="absolute inset-0" />

                            <Pressable className="absolute top-3 right-3 w-9 h-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-md">
                                <MaterialIcons name="favorite" size={20} color={COLORS.primary.DEFAULT} />
                            </Pressable>

                            <View className="absolute bottom-3 left-3 flex-row items-center gap-1 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10">
                                <MaterialIcons name="star" size={14} color={COLORS.primary.DEFAULT} />
                                <Text className="text-white text-xs font-bold">{item.rating}</Text>
                                <Text className="text-gray-300 text-[10px] ml-0.5">({item.reviewCount})</Text>
                            </View>
                        </View>

                        <View className="p-4 gap-3">
                            <View className="flex-row justify-between items-start">
                                <View>
                                    <Text className="text-white text-lg font-bold leading-tight mb-1">{item.name}</Text>
                                    <View className="flex-row items-center gap-1">
                                        <MaterialIcons name="location-on" size={14} color="#9ca3af" />
                                        <Text className="text-gray-400 text-xs">{item.location}</Text>
                                    </View>
                                </View>
                                <View className="items-end gap-1">
                                    {item.isOpen ? (
                                        <View className="bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                                            <Text className="text-primary text-xs font-medium">Açık</Text>
                                        </View>
                                    ) : (
                                        <View className="bg-white/5 px-2 py-0.5 rounded border border-white/10">
                                            <Text className="text-gray-400 text-xs font-medium">{item.openTime}'da</Text>
                                        </View>
                                    )}
                                    <Text className="text-gray-500 text-[10px]">{item.distance}</Text>
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
                                        router.push(`/(customer)/business/${item.id}`);
                                    }}
                                >
                                    <Text className="text-[#121212] text-sm font-bold">Randevu Al</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
}
