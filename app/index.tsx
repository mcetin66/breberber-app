import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, Pressable, StatusBar, Dimensions, FlatList, PanResponder } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { COLORS } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

const SLIDES = [
    {
        id: 1,
        title: 'Elit Hizmet',
        description: "Türkiye'nin en seçkin berberlerinden ve kuaförlerinden saniyeler içinde, beklemeden randevu alın.",
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1dagMdGe19oCPhP_VbK15epl4sD-Bs9K8psL5enp_Uy7OwfGzEf_RUtIzsKeHsSW1vpoeIS-YCppwF0ufDLH-oTAcYOievT-3nhGVPU9hO3Iu353tdeiKe85GgeWXrfZHh3MU5ZKD1bgC8cxCrKkpy-RXWo78-fyyz0xBDRIAt8oFNyeMb9iV5nZqjqnwhG6aub12-3hPM6UK9hGemNgBZomZSs-lnzAZ5ACidhE_14_TwyYiEvgLR0ZHTmULtPekxWWSQzMgSj2z',
    },
    {
        id: 2,
        title: 'Kolay Randevu',
        description: 'Size en uygun zamanı seçin, takviminizi yönetin. Beklemek yok, karmaşa yok.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCi5zbfJqdH9P9HlpP75JSLZFAtUpzgJA1fmWGlNrVvO0LA7ZwgR44D-CEEW2y-GMFBm7xOa7PTVsxlkTNbpcYTjPWIIppkjdCq6XqYac47Q92kDfks8iObUP-cpnCOSDI_WApsYT9PXW3oGllgUWHgLE_3wStSpack-rBiyNsDWCcC0VmX-NRt_K65ElyjKLKmSpzl0z3FbCcCf-fp7Fi2izP5_yLxjr6GS8ZpgGIvYQVYfgHW_PEg4gOVbwLhlYizmpitXqwiJtk8',
    },
    {
        id: 3,
        title: 'Uzman Kadro',
        description: 'Alanında en iyi uzmanları keşfedin, portfolyolarını inceleyin ve tarzınızı emanet edin.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPhFqydvpCyE2qKe3UU52rO1-E8IR3XrsOQw7glrRuBsn73JQG_gIAczb247jwMLbIbWPKyxgoj2qlm7-5QCS-rh6UiQnL2KBIrHO9zahyPM8L-b8dW8z_G2ZERjCnukrtOFmzEPdKMC4LWY1gbUqNJczEIOh62q6DtZcof6fBbfQ5_O2MomUIbJbFBSiGTRk4YpDlNtdjF1CNstlGgL33QeXPhASxfm68AmqEbwE0lEuOgRLbwM8oqahJ-UaC4OIGKWznQYSNLGWa',
    },
    {
        id: 4,
        title: 'Premium Deneyim',
        description: 'Sadece bir tıraş değil, kendinizi özel hissedeceğiniz bir bakım ritüeli.',
        image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=2070&auto=format&fit=crop',
    },
];

export default function LandingScreen() {
    const router = useRouter();
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleSkip = () => {
        // Force navigation using legacy push if needed, or replace. 
        // Using replace correctly to avoid back-stack.
        router.replace('/role-selection');
    };

    const handleNext = () => {
        if (currentIndex < SLIDES.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
        } else {
            handleSkip();
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            flatListRef.current?.scrollToIndex({ index: currentIndex - 1, animated: true });
        }
    }

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    // Use PanResponder to detect swipes on the overlay card
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                // Ensure it's a horizontal swipe
                return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dx < -50) {
                    // Swipe Left (Next)
                    handleNext();
                } else if (gestureState.dx > 50) {
                    // Swipe Right (Prev)
                    handlePrev();
                }
            }
        })
    ).current;

    // Auto-Play
    useEffect(() => {
        const timer = setInterval(() => {
            if (currentIndex < SLIDES.length - 1) {
                flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
            } else {
                // Loop back to start
                flatListRef.current?.scrollToIndex({ index: 0, animated: true });
            }
        }, 5000); // 5s for better readability

        return () => clearInterval(timer);
    }, [currentIndex]);

    const renderItem = ({ item }: { item: typeof SLIDES[0] }) => {
        return (
            <View style={{ width, height }} className="relative">
                <View className="w-full h-full">
                    <Image
                        source={{ uri: item.image }}
                        className="w-full h-full object-cover"
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.3)', 'transparent', '#121212']}
                        className="absolute inset-0"
                    />
                    <LinearGradient
                        colors={['#121212', '#121212', 'transparent']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        className="absolute bottom-0 left-0 w-full h-56 opacity-90"
                    />
                </View>
            </View>
        );
    };

    const currentContent = SLIDES[currentIndex];

    return (
        <View className="flex-1 bg-[#121212]">
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Skip Button */}
            <View className="absolute top-14 right-6 z-50">
                <Pressable
                    onPress={handleSkip}
                    hitSlop={20}
                    style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                    className="px-4 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-md"
                >
                    <Text className="text-white/90 text-sm font-semibold tracking-wide">Atla</Text>
                </Pressable>
            </View>

            {/* Carousel */}
            <FlatList
                ref={flatListRef}
                data={SLIDES}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                bounces={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                initialNumToRender={1}
                maxToRenderPerBatch={1}
                windowSize={2}
                scrollEventThrottle={16}
                className="flex-1 w-full h-full"
            />

            {/* Bottom Content Card - Interactive via PanResponder */}
            <View
                pointerEvents="box-none"
                className="absolute bottom-0 left-0 w-full z-40 px-5 pb-8 justify-end"
                style={{ height: height * 0.45 }}
            >
                <Animated.View
                    entering={FadeInUp.delay(200).springify()}
                    {...panResponder.panHandlers}
                    className="w-full bg-[#1E1E1E] rounded-3xl p-6 md:p-8 border border-white/5 overflow-hidden shadow-lg"
                    style={{
                        shadowColor: '#d4af35',
                        shadowOffset: { width: 0, height: 10 },
                        shadowOpacity: 0.15,
                        shadowRadius: 20,
                    }}
                >
                    {/* Top Gold Border Accent */}
                    <LinearGradient
                        colors={['transparent', 'rgba(212, 175, 53, 0.5)', 'transparent']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className="absolute top-0 left-0 w-full h-[1px] opacity-50"
                    />

                    <View className="items-center text-center">
                        <Text className="text-primary text-[28px] font-bold leading-tight mb-3 tracking-tight text-center">
                            {currentContent.title}
                        </Text>

                        {/* Removed fixed height so text can expand if needed, but min-height prevents layout jump */}
                        <Text className="text-gray-300 text-[15px] font-normal leading-relaxed text-center px-2 mb-8 min-h-[64px]">
                            {currentContent.description}
                        </Text>

                        {/* Pagination Dots */}
                        <View className="flex-row items-center gap-2 mb-8">
                            {SLIDES.map((_, index) => (
                                <View
                                    key={index}
                                    className={`rounded-full transition-all duration-300 ${index === currentIndex
                                        ? 'h-2 w-8 bg-primary'
                                        : 'h-2 w-2 bg-white/10'
                                        }`}
                                />
                            ))}
                        </View>

                        {/* Action Button */}
                        <Pressable
                            onPress={handleNext}
                            hitSlop={10}
                            style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] })}
                            className="w-full bg-primary rounded-xl py-4 flex-row items-center justify-center gap-3"
                        >
                            <Text className="text-[#121212] text-lg font-bold tracking-wide">
                                {currentIndex === SLIDES.length - 1 ? 'Başlayalım' : 'İleri'}
                            </Text>
                            <MaterialIcons
                                name={currentIndex === SLIDES.length - 1 ? "check" : "arrow-forward"}
                                size={22}
                                color="#121212"
                            />
                        </Pressable>
                    </View>
                </Animated.View>
            </View>
        </View>
    );
}
