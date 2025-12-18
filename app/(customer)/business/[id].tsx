import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Image, Pressable, StatusBar, Animated, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/theme';
import { BlurView } from 'expo-blur';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Mock Data
const SPECIALISTS = [
    { id: 1, name: 'Ahmet K.', role: 'Senior', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: 2, name: 'Mehmet Y.', role: 'Stylist', image: 'https://randomuser.me/api/portraits/men/44.jpg' },
    { id: 3, name: 'Elif S.', role: 'Colorist', image: 'https://randomuser.me/api/portraits/women/68.jpg' },
    { id: 4, name: 'Caner T.', role: 'Junior', image: 'https://randomuser.me/api/portraits/men/86.jpg' },
];

const SERVICES = [
    { id: 101, name: 'Lüks Saç Kesimi & Yıkama', duration: '45 dk', price: 350, description: 'Kişiye özel saç tasarımı, rahatlatıcı baş masajı ve premium şampuan ile yıkama.' },
    { id: 102, name: 'Sakal Tıraşı & Bakım', duration: '30 dk', price: 200, description: 'Sıcak havlu kompresi, ustura ile detaylı tıraş ve sakal yağı bakımı.' },
    { id: 103, name: 'Kral Bakım Paketi', duration: '90 dk', price: 850, description: 'Saç kesimi, sakal tıraşı, yüz maskesi ve kaş dizaynı içeren tam paket.' },
];

const GALLERY = [
    'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1503951914875-befea74701c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1599351431202-6e0000a4024a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
];

const REVIEWS_SUMMARY = { count: 120, rating: 4.9 };

const TABS = [
    { id: 'services', label: 'Hizmetler' },
    { id: 'staff', label: 'Uzmanlar' },
    { id: 'gallery', label: 'Galeri' },
    { id: 'reviews', label: 'Yorumlar' },
    { id: 'about', label: 'Hakkında' },
];

export default function BusinessDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [selectedServices, setSelectedServices] = useState<number[]>([]);
    const [activeTab, setActiveTab] = useState('services');
    const scrollY = useRef(new Animated.Value(0)).current;

    // Header Animation
    const headerHeight = 320;
    const headerTranslateY = scrollY.interpolate({
        inputRange: [0, headerHeight],
        outputRange: [0, -headerHeight / 1.5],
        extrapolate: 'clamp',
    });
    const headerOpacity = scrollY.interpolate({
        inputRange: [0, headerHeight / 2],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const toggleService = (serviceId: number) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        if (selectedServices.includes(serviceId)) {
            setSelectedServices(selectedServices.filter(id => id !== serviceId));
        } else {
            setSelectedServices([...selectedServices, serviceId]);
        }
    };

    const totalPrice = selectedServices.reduce((sum, id) => {
        const service = SERVICES.find(s => s.id === id);
        return sum + (service?.price || 0);
    }, 0);

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/(customer)/home');
        }
    };

    const handleBooking = () => {
        router.push({
            pathname: '/(customer)/booking/staff-selection', // Or services if logic dictates
            params: { salonId: id, services: JSON.stringify(selectedServices) }
        });
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#121212' }}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Parallax Header Image */}
            <Animated.View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: headerHeight,
                transform: [{ translateY: headerTranslateY }],
                zIndex: 0,
            }}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80' }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['rgba(18,18,18,0.1)', '#121212']}
                    style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '100%' }}
                />
            </Animated.View>

            {/* Top Navigation Bar (Fixed) */}
            <SafeAreaView edges={['top']} style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16 }}>
                <Pressable onPress={handleBack} className="w-10 h-10 rounded-full bg-black/30 items-center justify-center border border-white/10 backdrop-blur-md">
                    <MaterialIcons name="arrow-back" size={24} color="white" />
                </Pressable>
                <View className="flex-row gap-3">
                    <Pressable className="w-10 h-10 rounded-full bg-black/30 items-center justify-center border border-white/10 backdrop-blur-md">
                        <MaterialIcons name="share" size={20} color="white" />
                    </Pressable>
                    <Pressable className="w-10 h-10 rounded-full bg-black/30 items-center justify-center border border-white/10 backdrop-blur-md">
                        <MaterialIcons name="favorite-border" size={20} color="white" />
                    </Pressable>
                </View>
            </SafeAreaView>

            {/* Main Content */}
            <Animated.ScrollView
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: headerHeight - 100, paddingBottom: 120 }}
            >
                {/* Salon Info Overlay (Within ScrollView but visually part of header initially) */}
                <View className="px-5 pb-6">
                    <Animated.View style={{ opacity: headerOpacity }}>
                        <View className="flex-row items-center gap-2 mb-2">
                            <View className="bg-primary/20 border border-primary/30 px-2 py-0.5 rounded">
                                <Text className="text-primary text-[10px] font-bold uppercase tracking-wider">Premium</Text>
                            </View>
                            <View className="flex-row items-center gap-1 bg-green-900/30 px-2 py-0.5 rounded border border-green-500/20">
                                <View className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                <Text className="text-green-400 text-xs font-medium">Açık</Text>
                            </View>
                        </View>
                        <Text className="text-3xl font-bold text-white mb-1 font-serif">Vogue Barber Studio</Text>
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center gap-1">
                                <MaterialIcons name="location-on" size={16} color="#9ca3af" />
                                <Text className="text-gray-400 text-sm">Nişantaşı, İstanbul • 0.8 km</Text>
                            </View>
                            <View className="flex-row items-center bg-[#1e1e1e] border border-white/10 rounded-lg px-2 py-1 gap-1">
                                <MaterialIcons name="star" size={14} color={COLORS.primary.DEFAULT} />
                                <Text className="text-white font-bold text-sm">4.9</Text>
                                <Text className="text-gray-500 text-xs">(120)</Text>
                            </View>
                        </View>
                    </Animated.View>
                </View>

                {/* Sticky Tabs (Simplified Visual) */}
                <View className="bg-[#121212]/95 backdrop-blur-lg border-b border-white/5 py-1 mb-6 sticky top-0 z-40">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                        {TABS.map((tab) => (
                            <Pressable
                                key={tab.id}
                                onPress={() => setActiveTab(tab.id)}
                                className="min-w-[80px] items-center py-2 px-2 mr-2 relative"
                            >
                                <Text className={`text-sm font-medium ${activeTab === tab.id ? 'text-primary' : 'text-gray-400'}`}>
                                    {tab.label}
                                </Text>
                                {activeTab === tab.id && (
                                    <View className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-t-full" />
                                )}
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>

                {/* Content Sections */}
                <View className="px-4 space-y-8">

                    {/* Specialists */}
                    <View>
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-lg font-bold text-white font-serif">Uzman Kadro</Text>
                            <Text className="text-primary text-xs font-bold uppercase">Tümünü Gör</Text>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
                            {SPECIALISTS.map((staff) => (
                                <View key={staff.id} className="items-center mr-2">
                                    <View className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#1e1e1e] mb-2">
                                        <Image source={{ uri: staff.image }} className="w-full h-full" resizeMode="cover" />
                                    </View>
                                    <Text className="text-white text-xs font-bold">{staff.name}</Text>
                                    <Text className="text-gray-500 text-[10px]">{staff.role}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Services */}
                    <View>
                        <View className="flex-row items-center gap-3 mb-4">
                            <Text className="text-xl font-bold text-primary font-serif">Popüler Hizmetler</Text>
                            <View className="h-[1px] bg-primary/30 flex-1" />
                        </View>
                        <View className="gap-3">
                            {SERVICES.map((service) => (
                                <Pressable
                                    key={service.id}
                                    onPress={() => toggleService(service.id)}
                                    className={`bg-[#1e1e1e] border ${selectedServices.includes(service.id) ? 'border-primary' : 'border-white/5'} rounded-xl p-4 flex-row justify-between items-center`}
                                >
                                    <View className="flex-1 pr-4">
                                        <Text className={`font-medium text-base mb-1 ${selectedServices.includes(service.id) ? 'text-primary' : 'text-white'}`}>{service.name}</Text>
                                        <Text className="text-gray-500 text-xs leading-relaxed" numberOfLines={2}>{service.description}</Text>
                                        <View className="flex-row items-center gap-2 mt-2">
                                            <MaterialIcons name="schedule" size={14} color="#6b7280" />
                                            <Text className="text-gray-400 text-xs">{service.duration}</Text>
                                        </View>
                                    </View>
                                    <View className="items-end gap-2">
                                        <Text className="text-white font-semibold text-lg">{service.price} ₺</Text>
                                        <View className={`w-8 h-8 rounded-full items-center justify-center border ${selectedServices.includes(service.id) ? 'bg-primary border-primary' : 'bg-[#2a2a2a] border-white/10'}`}>
                                            <MaterialIcons
                                                name={selectedServices.includes(service.id) ? "check" : "add"}
                                                size={20}
                                                color={selectedServices.includes(service.id) ? "black" : COLORS.primary.DEFAULT}
                                            />
                                        </View>
                                    </View>
                                </Pressable>
                            ))}
                        </View>
                        <Pressable className="mt-4 flex-row items-center justify-center py-2 gap-1">
                            <Text className="text-gray-400 text-sm font-medium">Tüm Hizmetleri Gör</Text>
                            <MaterialIcons name="expand-more" size={18} color="#9ca3af" />
                        </Pressable>
                    </View>

                    {/* Gallery */}
                    <View>
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-lg font-bold text-white font-serif">Galeri</Text>
                            <Text className="text-primary text-xs font-bold uppercase">Tümünü Gör</Text>
                        </View>
                        <View className="flex-row flex-wrap gap-2">
                            {GALLERY.map((img, idx) => (
                                <View key={idx} className="w-[48%] aspect-square rounded-lg overflow-hidden bg-gray-800">
                                    <Image source={{ uri: img }} className="w-full h-full" resizeMode="cover" />
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Reviews */}
                    <View className="bg-[#1e1e1e] border border-white/5 rounded-xl p-5 mt-2">
                        <View className="flex-row items-center justify-between mb-4">
                            <View>
                                <Text className="text-lg font-bold text-white font-serif">Müşteri Yorumları</Text>
                                <Text className="text-gray-500 text-xs">Son 30 günde 24 yorum</Text>
                            </View>
                            <View className="items-end">
                                <Text className="text-3xl font-bold text-white">4.9</Text>
                                <View className="flex-row">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <MaterialIcons key={i} name="star" size={14} color={COLORS.primary.DEFAULT} />
                                    ))}
                                </View>
                            </View>
                        </View>
                        <View className="border-t border-white/10 pt-4">
                            <View className="flex-row items-center gap-3 mb-2">
                                <View className="w-8 h-8 rounded-full bg-gray-600 items-center justify-center">
                                    <Text className="text-white text-xs font-bold">MK</Text>
                                </View>
                                <View>
                                    <Text className="text-white text-sm font-medium">Murat Kaya</Text>
                                    <Text className="text-gray-500 text-[10px]">2 gün önce</Text>
                                </View>
                                <View className="ml-auto flex-row">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <MaterialIcons key={i} name="star" size={12} color={COLORS.primary.DEFAULT} />
                                    ))}
                                </View>
                            </View>
                            <Text className="text-gray-400 text-sm leading-snug">Ahmet Bey işinin ehli. Saç kesimi tam istediğim gibi oldu. Mekan çok temiz ve kaliteli.</Text>
                        </View>
                    </View>
                </View>
            </Animated.ScrollView>

            {/* Bottom Action Bar */}
            <View className="absolute bottom-0 left-0 right-0 bg-[#121212]/95 border-t border-white/10 px-5 pt-4 pb-8 backdrop-blur-md">
                <View className="flex-row items-center gap-4">
                    <View>
                        <Text className="text-gray-400 text-xs">Toplam Tutar</Text>
                        <Text className="text-white font-bold text-xl">{totalPrice} ₺</Text>
                    </View>
                    <Pressable
                        onPress={handleBooking}
                        className="flex-1 rounded-lg overflow-hidden"
                    >
                        <LinearGradient
                            colors={[COLORS.primary.DEFAULT, '#c49b25']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            className="py-3.5 items-center justify-center flex-row gap-2"
                        >
                            <Text className="text-black font-bold text-base">Randevu Al</Text>
                            <MaterialIcons name="arrow-forward" size={20} color="black" />
                        </LinearGradient>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}
