import React, { useEffect } from 'react';
import { View, Text, Pressable, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { MaterialIcons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { useBusinessStore } from '@/store/useBusinessStore';
import { RoleIndicator } from '@/components/ui/RoleIndicator';
import { COLORS } from '@/constants/theme';
import { Service } from '@/types';

export default function ServiceListScreen() {
    const router = useRouter();
    const { serviceList, loadServices, isLoading, onboardingData } = useBusinessStore();

    useEffect(() => {
        // Mock tenant ID using business name or similar for now
        loadServices(onboardingData.businessName || 'default-tenant');
    }, []);

    const formatDuration = (mins?: number) => {
        if (!mins) return '0 dk';
        if (mins >= 60) {
            const h = Math.floor(mins / 60);
            const m = mins % 60;
            return m > 0 ? `${h}sa ${m}dk` : `${h} saat`;
        }
        return `${mins} dk`;
    };

    const renderItem = ({ item }: { item: Service }) => (
        <View className="bg-[#1E1E1E] p-4 rounded-xl mb-3 border border-white/5 flex-row items-center justify-between">
            <View className="flex-1">
                <Text className="text-white font-bold text-lg mb-1">{item.name}</Text>
                <View className="flex-row items-center gap-3">
                    <View className="flex-row items-center gap-1 bg-[#d4af35]/10 px-2 py-0.5 rounded-md">
                        <MaterialIcons name="access-time" size={12} color="#d4af35" />
                        <Text className="text-[#d4af35] text-xs font-medium">{formatDuration(item.duration_minutes || item.duration)}</Text>
                    </View>
                    <Text className="text-zinc-500 text-xs uppercase font-medium tracking-wider">{item.category}</Text>
                </View>
            </View>
            <View className="items-end">
                <Text className="text-white font-bold text-xl">{item.price} ₺</Text>
            </View>
        </View>
    );

    return (
        <ScreenWrapper noPadding>
            <View className="flex-1 bg-[#121212]">
                {/* Header */}
                <View className="px-5 py-4 border-b border-white/10 flex-row justify-between items-center bg-[#1E1E1E]">
                    <View className="flex-row items-center gap-3">
                        <Pressable onPress={() => router.back()} className="mr-2">
                            <MaterialIcons name="arrow-back" size={24} color="white" />
                        </Pressable>
                        <View>
                            <Text className="text-white font-bold text-xl">Hizmetler</Text>
                            <Text className="text-zinc-500 text-xs">Toplam {serviceList.length} hizmet</Text>
                        </View>
                    </View>
                    <RoleIndicator />
                </View>

                {/* List */}
                <View className="flex-1 px-5 pt-4">
                    <FlashList
                        data={serviceList}
                        renderItem={renderItem}
                        // @ts-ignore
                        estimatedItemSize={80}
                        keyExtractor={item => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={isLoading} onRefresh={() => loadServices('refresh')} tintColor="#d4af35" />
                        }
                        ListEmptyComponent={
                            <View className="mt-10 items-center">
                                <MaterialIcons name="content-cut" size={48} color="#333" />
                                <Text className="text-zinc-500 mt-2 text-center">Henüz hizmet eklemediniz.</Text>
                            </View>
                        }
                        contentContainerStyle={{ paddingBottom: 100 }}
                    />
                </View>

                {/* FAB */}
                <Pressable
                    onPress={() => router.push('/(business)/services/form')}
                    className="absolute bottom-10 right-6 w-14 h-14 bg-[#d4af35] rounded-full items-center justify-center shadow-lg shadow-black/50 active:scale-95 z-50"
                >
                    <MaterialIcons name="add" size={32} color="black" />
                </Pressable>
            </View>
        </ScreenWrapper>
    );
}
