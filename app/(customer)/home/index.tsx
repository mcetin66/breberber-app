import React from 'react';
import { View, Text, ScrollView, Image, Pressable, TextInput, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/theme';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'expo-router';

// Mock Data
const CATEGORIES = [
    { id: 1, name: 'Saç Kesimi', image: 'https://images.unsplash.com/photo-1599351431202-6e0000a4024a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80' },
    { id: 2, name: 'Sakal', image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80' },
    { id: 4, name: 'Cilt Bakımı', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80' },
    { id: 3, name: 'VIP Odalar', image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80' },
    { id: 5, name: 'Boyama', image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80' },
];

const FEATURED = [
    {
        id: 1,
        name: 'Gold Makas Etiler',
        rating: 4.9,
        location: 'Etiler, İstanbul',
        distance: '1.2 km',
        image: 'https://images.unsplash.com/photo-1503951914875-befea74701c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
        tags: ['Saç', 'Sakal', 'Cilt']
    },
    {
        id: 2,
        name: 'Barber King',
        rating: 4.8,
        location: 'Nişantaşı, İstanbul',
        distance: '2.5 km',
        image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
        tags: ['VIP', 'Masaj']
    },
];

const NEARBY = [
    {
        id: 3,
        name: 'Legendary Cuts',
        rating: 4.7,
        location: 'Beşiktaş, İstanbul',
        distance: '0.8 km',
        time: '14:30',
        image: 'https://images.unsplash.com/photo-1593702295094-aea8cdd39478?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
    }
];

export default function HomeScreen() {
    const { user } = useAuthStore();
    const router = useRouter();

    return (
        <View className="flex-1 bg-[#121212]">
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <SafeAreaView edges={['top']} className="bg-[#121212] z-40">
                <View className="px-5 pt-2 pb-2 flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                        <View className="relative">
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80' }}
                                className="w-12 h-12 rounded-full border-2 border-primary/30"
                            />
                            <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#121212]" />
                        </View>
                        <View>
                            <Text className="text-xs text-[#9dabb9] font-medium uppercase tracking-wider">Hoş geldin</Text>
                            <Text className="text-white text-lg font-bold">{user?.name || 'Misafir'}</Text>
                        </View>
                    </View>

                    <Pressable className="w-10 h-10 items-center justify-center rounded-full bg-[#1e1e1e] border border-white/5 relative">
                        <MaterialIcons name="notifications" size={22} color="white" />
                        <View className="absolute top-2.5 right-3 w-2 h-2 bg-primary rounded-full animate-pulse" />
                    </Pressable>
                </View>

                <View className="px-5 pb-4 pt-2">
                    <Text className="text-3xl text-white font-semibold leading-tight font-serif">Bugün ne arıyorsun?</Text>
                </View>

                {/* Search Bar */}
                <View className="px-5 pb-2">
                    <View className="flex-row gap-3">
                        <Pressable
                            className="flex-1 relative"
                            onPress={() => router.push('/(customer)/search')}
                        >
                            <View className="absolute inset-y-0 left-0 pl-4 justify-center pointer-events-none z-10">
                                <MaterialIcons name="search" size={24} color="#6a7785" />
                            </View>
                            <View
                                className="w-full pl-11 pr-4 py-3.5 bg-[#1e1e1e] rounded-xl border border-transparent"
                            >
                                <Text className="text-[#6a7785]">Salon, hizmet veya konum ara...</Text>
                            </View>
                        </Pressable>
                        <Pressable
                            className="w-[50px] items-center justify-center rounded-xl bg-[#1e1e1e] border border-transparent active:border-primary/30 active:bg-[#252525]"
                            onPress={() => router.push('/(customer)/search')}
                        >
                            <MaterialIcons name="tune" size={24} color="white" />
                        </Pressable>
                    </View>
                </View>
            </SafeAreaView>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Categories */}
                <View className="py-4">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 20 }}>
                        {CATEGORIES.map((cat) => (
                            <Pressable
                                key={cat.id}
                                className="items-center gap-2 group min-w-[72px]"
                                onPress={() => router.push({ pathname: '/(customer)/search', params: { category: cat.id } })}
                            >
                                <View className="w-[72px] h-[72px] rounded-full p-[2px] bg-gradient-to-tr from-primary/50 to-transparent">
                                    <View className="w-full h-full rounded-full bg-[#1e1e1e] items-center justify-center border-4 border-[#121212] overflow-hidden">
                                        <Image source={{ uri: cat.image }} className="w-full h-full opacity-80" resizeMode="cover" />
                                    </View>
                                </View>
                                <Text className="text-xs font-medium text-white/90">{cat.name}</Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>

                {/* Featured Section */}
                <View className="mt-4 mb-2">
                    <View className="px-5 flex-row items-end justify-between mb-4">
                        <Text className="text-xl font-bold text-white">Öne Çıkanlar</Text>
                        <Pressable onPress={() => router.push('/(customer)/search')}>
                            <Text className="text-primary text-sm font-medium">Tümünü gör</Text>
                        </Pressable>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}>
                        {FEATURED.map((item) => (
                            <Pressable
                                key={item.id}
                                className="w-[280px] bg-[#1e1e1e] rounded-2xl overflow-hidden border border-white/5"
                                onPress={() => router.push(`/(customer)/business/${item.id}`)}
                            >
                                <View className="absolute top-3 right-3 z-10 bg-black/60 rounded-full px-2 py-1 flex-row items-center gap-1 border border-white/10">
                                    <MaterialIcons name="star" size={14} color={COLORS.primary.DEFAULT} />
                                    <Text className="text-xs font-bold text-white">{item.rating}</Text>
                                </View>
                                <View className="h-40 w-full bg-gray-800 relative">
                                    <Image source={{ uri: item.image }} className="w-full h-full opacity-90" resizeMode="cover" />
                                    <LinearGradient colors={['transparent', 'rgba(30,30,30,1)']} className="absolute inset-x-0 bottom-0 h-10" />
                                </View>
                                <View className="p-4">
                                    <View className="flex-row items-center justify-between mb-1">
                                        <Text className="text-white font-bold text-lg truncate flex-1 mr-2">{item.name}</Text>
                                        <MaterialIcons name="verified" size={20} color={COLORS.primary.DEFAULT} />
                                    </View>
                                    <View className="flex-row items-center gap-1 mb-3">
                                        <MaterialIcons name="location-on" size={16} color="#9dabb9" />
                                        <Text className="text-[#9dabb9] text-sm">{item.location} • {item.distance}</Text>
                                    </View>
                                    <View className="flex-row gap-2">
                                        {item.tags.map((tag, idx) => (
                                            <View key={idx} className="px-2 py-1 rounded-md bg-[#2a2a2a] border border-white/5">
                                                <Text className="text-xs text-white/70">{tag}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>

                {/* Nearby Section */}
                <View className="mt-6 px-5">
                    <View className="flex-row items-end justify-between mb-4">
                        <Text className="text-xl font-bold text-white">Yakınındakiler</Text>
                        <Pressable onPress={() => router.push('/(customer)/search')}>
                            <Text className="text-primary text-sm font-medium">Haritada gör</Text>
                        </Pressable>
                    </View>
                    <View className="gap-4">
                        {NEARBY.map((item) => (
                            <Pressable
                                key={item.id}
                                className="flex-row bg-[#1e1e1e] rounded-xl p-3 border border-white/5 active:border-primary/30"
                                onPress={() => router.push(`/(customer)/business/${item.id}`)}
                            >
                                <View className="w-20 h-20 rounded-lg bg-gray-700 overflow-hidden">
                                    <Image source={{ uri: item.image }} className="w-full h-full" resizeMode="cover" />
                                </View>
                                <View className="ml-4 flex-1 justify-center">
                                    <View className="flex-row justify-between items-start">
                                        <View>
                                            <Text className="text-white font-bold text-base">{item.name}</Text>
                                            <Text className="text-[#9dabb9] text-xs mt-1">{item.location}</Text>
                                        </View>
                                        <View className="flex-row items-center gap-1">
                                            <MaterialIcons name="star" size={14} color={COLORS.primary.DEFAULT} />
                                            <Text className="text-xs font-bold text-white">{item.rating}</Text>
                                        </View>
                                    </View>
                                    <View className="mt-3 flex-row items-center justify-between">
                                        <Text className="text-xs text-white/60 bg-white/5 px-2 py-1 rounded">{item.distance}</Text>
                                        <Text className="text-xs text-primary font-medium">Müsait: {item.time}</Text>
                                    </View>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                </View>

            </ScrollView>
        </View>
    );
}
