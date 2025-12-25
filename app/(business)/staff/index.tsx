import React, { useEffect } from 'react';
import { View, Text, Pressable, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { useBusinessStore } from '@/stores/businessStore';
import { useAuthStore } from '@/stores/authStore';
import { ChevronLeft, Plus, MoreVertical } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { StaffProfile } from '@/types';

export default function StaffListScreen() {
    const router = useRouter();
    const { fetchStaff, getStaff, isLoading } = useBusinessStore();
    const { user } = useAuthStore();
    const businessId = user?.barberId;
    const staffList = businessId ? getStaff(businessId) : [];

    useEffect(() => {
        if (businessId) {
            fetchStaff(businessId);
        }
    }, [businessId]);

    const renderItem = ({ item }: { item: StaffProfile }) => (
        <View className="flex-row items-center bg-[#1E1E1E] p-4 rounded-xl border border-white/5 mb-3">
            <Image
                source={{ uri: item.avatar_url || 'https://via.placeholder.com/150' }}
                className="w-12 h-12 rounded-full bg-zinc-800"
            />
            <View className="flex-1 ml-4">
                <Text className="text-white font-bold text-base">{item.name}</Text>
                <Text className="text-zinc-400 text-xs mt-0.5 capitalize">{item.title || 'Personel'}</Text>
            </View>
            <Pressable className="p-2 -mr-2">
                <MoreVertical size={20} color="#666" />
            </Pressable>
        </View>
    );

    return (
        <ScreenWrapper noPadding>
            <View className="flex-1 bg-[#121212] px-6">
                {/* Header */}
                <View className="mt-8 mb-6 flex-row items-center justify-between">
                    <View className="flex-row items-center gap-4">
                        <Pressable onPress={() => router.back()} className="p-2 -ml-2 rounded-full active:bg-white/10">
                            <ChevronLeft size={24} color="white" />
                        </Pressable>
                        <Text className="text-white text-xl font-bold">Personel</Text>
                    </View>

                    <Pressable
                        onPress={() => router.push('/(business)/staff/form')}
                        className="w-10 h-10 rounded-full bg-[#d4af35] items-center justify-center active:opacity-90"
                    >
                        <Plus size={24} color="black" />
                    </Pressable>
                </View>

                {isLoading && staffList.length === 0 ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator color="#d4af35" />
                    </View>
                ) : (
                    <View className="flex-1 w-full h-full min-h-[2px]">
                        <FlashList
                            data={staffList}
                            renderItem={renderItem}
                            // @ts-ignore
                            estimatedItemSize={80}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 100 }}
                            refreshControl={
                                <RefreshControl refreshing={isLoading} onRefresh={() => businessId && fetchStaff(businessId)} tintColor="#d4af35" />
                            }
                        />
                    </View>
                )}
            </View>
        </ScreenWrapper>
    );
}
