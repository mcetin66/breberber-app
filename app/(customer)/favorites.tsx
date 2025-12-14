import { useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { FlashList as OriginalFlashList } from '@shopify/flash-list';
import { COLORS } from '@/constants/theme';
import { useAuthStore } from '@/stores/authStore';
import { favoriteService } from '@/services/favorites';
import BarberCard from '@/components/BarberCard';
import { ChevronLeft } from 'lucide-react-native';

// Cast FlashList to any to avoid strict type checks on estimatedItemSize
const FlashList = OriginalFlashList as any;

export default function FavoritesScreen() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [favorites, setFavorites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            let active = true;

            const loadFavorites = async () => {
                if (!user) return;
                try {
                    setLoading(true);
                    const data = await favoriteService.getMyFavorites(user.id);
                    if (active) {
                        const formatted = data.map((item: any) => ({
                            ...item.businesses,
                            isFavorite: true
                        }));
                        setFavorites(formatted);
                    }
                } catch (error) {
                    console.error(error);
                } finally {
                    if (active) setLoading(false);
                }
            };

            loadFavorites();

            return () => {
                active = false;
            };
        }, [user])
    );

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <View className="px-4 py-4 flex-row items-center border-b border-background-card">
                <Pressable
                    onPress={() => router.back()}
                    className="mr-4 p-2 -ml-2 rounded-full active:bg-background-card"
                >
                    <ChevronLeft size={24} color={COLORS.text.DEFAULT} />
                </Pressable>
                <Text className="text-white text-xl font-poppins-bold">Favorilerim</Text>
            </View>

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color={COLORS.primary.DEFAULT} />
                </View>
            ) : (
                <View className="flex-1 container px-4 py-4">
                    <FlashList
                        data={favorites}
                        renderItem={({ item }: { item: any }) => <BarberCard barber={item} />}
                        estimatedItemSize={200}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={() => (
                            <View className="flex-1 justify-center items-center mt-20">
                                <Text className="text-text-secondary font-poppins text-center">
                                    Henüz favori işletmeniz yok.
                                </Text>
                            </View>
                        )}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                </View>
            )}
        </SafeAreaView>
    );
}
