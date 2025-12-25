
import { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, Pressable, ActivityIndicator, ImageBackground, Dimensions, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Instagram } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useBusinessStore } from '@/stores/businessStore';
import type { Barber } from '@/types';
import { COLORS } from '@/constants/theme';

const { width } = Dimensions.get('window');

// Mock data strictly matching template
const STAFF = [
    { id: 1, name: 'Alex', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyOTimQlSlAPDxHN2igQFka1ReE_GpD_9YXmxSLwhn9fUJlZ86gcdHzHFmHiiPkSWW1CKzFQDlv5bqU0X-M3EHvmbDMWAPKef2f0qNWmOLDASK6QqH52rllVP4skUxsWs9ly7jL5mdlmhQkvLwccYNFMtoANjJ3Reee1azEDy0oS_JQ7cE00HYNNJX43NSKeLTovpLcLHX5P7f_mw1MNTQn-84pU10qK8ATpvQGS4Dd6LS9Yw9mqa4LutJWOk8EOxzjVNOlCS1sAs', selected: true },
    { id: 2, name: 'Sarah', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5vpDGqIF031NIoclTWu5iBG7i1vdO_MxM3qjsbIsTscwiv6-GshgC-bxnBhE0KqiHM9nkOzz5wMx9RHStwzLPBKcGXxnGogLqxP7qfgrVMbJjDgc39Svawd4pt8LkO-PL9enddwLOqwVyh9t7u4GoU5I9Mo1Fh5AaqMMIVhpY-uD8LVz0xmXenJrg0gw9BL_LIimJ6_aUtoxNf_YvQwdy6BGJu4b5t70xOEY3Lnn6FWEy41mXBxxOcveyHRY8ZmBQiGIMNfyyAUg', selected: false },
    { id: 3, name: 'Mike', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCbsul-3ws8Vg-Fi_HwfcuTtzkDywFG7r5OGOsVyJLfTm8q3P3yDA-mI6l2fyIwOSpMlTMpeA8dHGGhUBNcoBaKrnqPW6tidPRJa82ABElyLWugPU3OuFpJSSNbl1Nj0Na3KaywhFuj8rfyy9ot2tC0J-OEA8O6mr5UcXWJZg-xGj249cTO0bGEHOAYbHvGt3Lo5X5NxsAKcuhLjNkixHb-9nvUDAHNfaUVyuyoxWIpedl41pToPk7K_dH9W40rSSfRnKLPxPEFsI', selected: false },
    { id: 4, name: 'David', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVYIChEBMKFj8D-YP0rJVEYlrntJJURViGTxHOz7Qijoogoo5H-VK-td-CyZ372ymKx1es3n7JkM8gUkuY4qJIvgPewWuTi6E6B0GWaFTeMQ_RwHSV-qm8u139DhP_Joy5gPk5LZlwWLuc-8Cyae7LttzMpSATlKjPTY8PkTNkpiOFmdyDLabXcv0w8dCvoU1RIueQ62ZQqkFqEwWdJMp_FVM24QTm6U6IlNJxe4tb5ktsvtSICOXXwVMaS_yufrVjH4hcOAfmXng', selected: false },
    { id: 5, name: 'John', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcGRx9-y0ZsUodIQT9zaud6eA61FKapIpPQW5IBJrqplNllAZeaNwj4l_YN31adghkw_nOa11U8Ag85fS06ntZCK2MmXkCeRHmLc3C1gHvWPBbDsMYFCKC30RhlpOMXCngWxAJumzI-HzyzUE6Wpf01eWryns9EntOLF7zr7SYUNt8rCvElvX03vg5qSUkU0JsDwUXtWJOJJsHttVv1VBa-NphKCdqkmRiQausHlqIpF0UjDCZSCWfPuoFnPjX47nOhIZXDcdcyo8', selected: false },
];

const SERVICES = [
    { id: 1, name: 'Classic Fade', duration: '30 mins', price: '$35', sub: 'Includes wash', icon: 'content-cut', iconColor: COLORS.primary.DEFAULT, iconBg: 'rgba(19, 127, 236, 0.1)' },
    { id: 2, name: 'Beard Trim', duration: '20 mins', price: '$25', sub: 'Hot towel', icon: 'face-3', iconColor: '#F97316', iconBg: 'rgba(249, 115, 22, 0.1)' },
    { id: 3, name: 'Royal Shave', duration: '45 mins', price: '$50', sub: 'Premium treatment', icon: 'spa', iconColor: '#A855F7', iconBg: 'rgba(168, 85, 247, 0.1)' },
];

export default function BarberDetailScreen() {
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams();
    console.log('--- DETAIL SCREEN MOUNTED ---', { id });
    const router = useRouter();
    const { businesses } = useBusinessStore();
    const [barber, setBarber] = useState<Barber | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            const found = businesses.find(b => b.id === id);
            if (found) {
                setBarber(found as Barber);
            }
            setLoading(false);
        }
    }, [id, businesses]);

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-background-light dark:bg-background-dark">
                <ActivityIndicator size="large" color={COLORS.primary.DEFAULT} />
            </View>
        );
    }

    const displayBarber = barber || {
        id: '1',
        name: "Gentleman's Cut",
        address: "123 Main St, New York, NY",
        rating: 4.8,
        reviewCount: 120,
        isOpen: true,
        coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7Qs566kscrlLA1thlAeFFkrTxOw0QP2tqwqfol923qv_1S7Az56ipfCSh202nIhGMnOrI2CUe9JxG7cZq00wnvOoYbcSNZZn4kG38e0xLr76P0CKNXIPbdhiPfLWtkJhsWrosvBXG5wRqsW5LtaoL87IO5-YN_dHX6E9aJietC9BxOk0fOcqJ1GFdnXVFOrOjz_mkIUYFkypM2hs9KdSwS78pGdKMDj_NHqQ9isYLJJ_NCbmmDfKCkZpvywTsnqFNG4vVXngOhuw"
    } as unknown as Barber;

    const openInstagram = () => {
        if (!displayBarber.instagram) return;
        const username = displayBarber.instagram.replace('@', '').trim();
        const appUrl = `instagram://user?username=${username}`;
        const webUrl = `https://www.instagram.com/${username}`;

        Linking.canOpenURL(appUrl).then(supported => {
            if (supported) Linking.openURL(appUrl);
            else Linking.openURL(webUrl);
        });
    };

    return (
        <View className="flex-1 bg-[#0f0f0f]">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

                {/* Header Image & Content */}
                <View className="relative w-full h-[340px]">
                    <ImageBackground
                        source={{ uri: displayBarber.coverImage }}
                        className="w-full h-full"
                        resizeMode="cover"
                    >
                        <LinearGradient
                            colors={['transparent', 'rgba(16, 25, 34, 0.5)', '#101922']}
                            className="absolute inset-0"
                            locations={[0, 0.6, 1]}
                        />
                    </ImageBackground>

                    {/* Top Navigation */}
                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, paddingTop: insets.top }} className="flex-row justify-between items-center px-4">
                        <Pressable
                            onPress={() => router.back()}
                            className="w-10 h-10 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm active:bg-black/50"
                        >
                            <MaterialIcons name="arrow-back" size={24} color="white" />
                        </Pressable>
                        <View className="flex-row gap-3">
                            <Pressable
                                onPress={() => alert('Paylaş özelliği yakında!')}
                                className="w-10 h-10 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm active:bg-black/50"
                            >
                                <MaterialIcons name="share" size={20} color="white" />
                            </Pressable>
                            {displayBarber.instagram && (
                                <Pressable
                                    onPress={openInstagram}
                                    className="w-10 h-10 items-center justify-center rounded-full bg-pink-500/20 backdrop-blur-sm active:bg-pink-500/40 border border-pink-500/30"
                                >
                                    <Instagram size={20} color="#F472B6" />
                                </Pressable>
                            )}
                            <Pressable
                                onPress={() => alert('Favorilere ekleme yakında!')}
                                className="w-10 h-10 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm active:bg-black/50"
                            >
                                <MaterialIcons name="favorite-border" size={20} color="white" />
                            </Pressable>
                        </View>
                    </View>

                    {/* Header Info */}
                    <View className="absolute bottom-6 left-0 right-0 px-5">
                        <View className="flex-row items-start justify-between">
                            <View className="flex-1 mr-4">
                                <Text className="text-3xl font-bold text-white leading-tight mb-2 shadow-sm">
                                    {displayBarber.name}
                                </Text>
                                <View className="flex-row items-center gap-1">
                                    <MaterialIcons name="location-on" size={18} color={COLORS.primary.DEFAULT} />
                                    <Text className="text-gray-300 text-sm font-medium shadow-sm">
                                        {displayBarber.address || 'Address not available'}
                                    </Text>
                                </View>
                            </View>

                            <View className="items-end gap-2">
                                <View className="flex-row items-center gap-1 bg-[#1a1a1a]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                                    <MaterialIcons name="star" size={18} color="#FACC15" />
                                    <Text className="text-white font-bold text-sm">{displayBarber.rating}</Text>
                                    <Text className="text-gray-400 text-xs">({displayBarber.reviewCount})</Text>
                                </View>
                                <View className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/20 border border-green-500/20">
                                    <View className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                    <Text className="text-green-400 text-xs font-bold">Şimdi Açık</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Main Content Card */}
                <View className="-mt-6 rounded-t-[2rem] bg-[#0f0f0f] px-4 pt-8 flex-1">

                    {/* Info Grid */}
                    <View className="flex-row gap-3 mb-8">
                        <View className="flex-1 bg-[#1a1a1a] p-4 rounded-xl border border-white/5 shadow-sm">
                            <View className="flex-row items-center gap-2 mb-1">
                                <MaterialIcons name="schedule" size={20} color={COLORS.primary.DEFAULT} />
                                <Text className="text-white font-bold text-sm">Hours</Text>
                            </View>
                            <Text className="text-gray-400 text-xs">Close at 9:00 PM</Text>
                        </View>
                        <View className="flex-1 bg-[#1a1a1a] p-4 rounded-xl border border-white/5 shadow-sm">
                            <View className="flex-row items-center gap-2 mb-1">
                                <MaterialIcons name="directions-car" size={20} color={COLORS.primary.DEFAULT} />
                                <Text className="text-white font-bold text-sm">Distance</Text>
                            </View>
                            <Text className="text-gray-500 dark:text-gray-400 text-xs">1.2 km away</Text>
                        </View>
                    </View>

                    {/* Staff Section */}
                    <View className="mb-8">
                        <View className="flex-row items-center justify-between mb-4 px-1">
                            <Text className="text-lg font-bold text-gray-900 dark:text-white">Our Specialists</Text>
                            <Pressable onPress={() => alert('Tüm personeli gör: Yakında!')}>
                                <Text className="text-primary text-sm font-semibold">View All</Text>
                            </Pressable>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingHorizontal: 4 }}>
                            {STAFF.map((staff) => (
                                <Pressable
                                    key={staff.id}
                                    onPress={() => alert(`Personel seçildi: ${staff.name}`)}
                                    className="items-center gap-2 min-w-[72px]"
                                >
                                    <View className={`relative w-16 h-16 rounded-full p-0.5 border-2 ${staff.selected ? 'border-primary' : 'border-transparent'}`}>
                                        <Image source={{ uri: staff.image }} className="w-full h-full rounded-full" />
                                        {staff.selected && (
                                            <View className="absolute bottom-0 right-0 bg-primary border-2 border-background-light dark:border-background-dark rounded-full w-5 h-5 items-center justify-center">
                                                <MaterialIcons name="check" size={12} color="white" />
                                            </View>
                                        )}
                                    </View>
                                    <Text className={`text-sm font-medium ${staff.selected ? 'text-primary font-bold' : 'text-gray-900 dark:text-white'}`}>
                                        {staff.name}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Services Section */}
                    <View className="mb-8">
                        <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-1">Popular Services</Text>
                        <View className="gap-3">
                            {SERVICES.map((service) => (
                                <Pressable
                                    key={service.id}
                                    onPress={() => alert(`Hizmet seçildi: ${service.name}`)}
                                    className="bg-white dark:bg-[#1a1a1a] p-4 rounded-2xl border border-gray-100 dark:border-white/5 flex-row items-center justify-between active:bg-gray-50 dark:active:bg-white/5"
                                >
                                    <View className="flex-row items-center gap-4">
                                        <View className="w-12 h-12 rounded-xl items-center justify-center" style={{ backgroundColor: service.iconBg }}>
                                            <MaterialIcons name={service.icon as any} size={24} color={service.iconColor} />
                                        </View>
                                        <View>
                                            <Text className="text-gray-900 dark:text-white font-bold text-base">{service.name}</Text>
                                            <Text className="text-gray-500 dark:text-gray-400 text-sm">{service.duration} • {service.sub}</Text>
                                        </View>
                                    </View>
                                    <View className="flex-row items-center gap-3">
                                        <Text className="text-gray-900 dark:text-white font-bold text-lg">{service.price}</Text>
                                        <View className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 items-center justify-center">
                                            <MaterialIcons name="add" size={14} color={COLORS.text.DEFAULT} />
                                        </View>
                                    </View>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    {/* Reviews Section */}
                    <View className="mb-24">
                        <View className="flex-row items-center justify-between mb-4 px-1">
                            <Text className="text-lg font-bold text-gray-900 dark:text-white">Recent Reviews</Text>
                            <Pressable onPress={() => alert('Tüm yorumları gör: Yakında!')}>
                                <Text className="text-primary text-sm font-semibold">See All</Text>
                            </Pressable>
                        </View>
                        <View className="bg-white dark:bg-[#1a1a1a] p-5 rounded-2xl border border-gray-100 dark:border-white/5">
                            <View className="flex-row gap-4 mb-3">
                                <Image
                                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdDM5o-GTLNMbdtdftH8q3jl9qVS-ifQ3ceZ9hO2pw7owNxGa0fzppjsH0t8-RIX3zARyNqNimSOhGwGutYjbq4gE7DeBg8gyns8ZsupV-hiG486rWLKMt_JqvtDkuScxOhEZ29LMq8d7-cXjKGWl6dOFdpW9dgB8Vl3BtQ97fxsWckRvzvZB0qLJG9qYoJQoYnmGLxQc8CqleS3yY9MfcaPwtEicRPa1wwOx4B-U5OeKg6ms6yYkqIR7iyEK_Ui6bECrLY_jhsQc' }}
                                    className="w-10 h-10 rounded-full"
                                />
                                <View>
                                    <View className="flex-row items-center gap-2">
                                        <Text className="text-gray-900 dark:text-white font-bold text-sm">James M.</Text>
                                        <Text className="text-gray-500 text-xs">• 2 days ago</Text>
                                    </View>
                                    <View className="flex-row gap-0.5 mt-0.5">
                                        {[1, 2, 3, 4, 5].map(s => <MaterialIcons key={s} name="star" size={16} color="#FACC15" />)}
                                    </View>
                                </View>
                            </View>
                            <Text className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                "Best cut I've had in years. Alex really pays attention to detail. The atmosphere is top notch as well."
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Sticky Bottom CTA */}
            <View className="absolute bottom-24 left-0 right-0 p-4 z-40">
                <Pressable
                    className="w-full bg-primary h-14 rounded-full shadow-lg shadow-primary/30 flex-row items-center justify-center gap-2 active:scale-[0.98]"
                    onPress={() => router.push(`/(customer)/booking/staff-selection?barberId=${displayBarber.id}`)}
                >
                    <Text className="text-white font-bold text-lg">Personel Seç</Text>
                    <MaterialIcons name="arrow-forward" size={24} color="white" />
                </Pressable>
            </View>
        </View>
    );
}
