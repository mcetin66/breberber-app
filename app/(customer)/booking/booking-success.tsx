
import { View, Text, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';

export default function BookingSuccessScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-background-light dark:bg-background-dark">
            {/* Top App Bar */}
            <View className="flex-row items-center justify-between p-4 pb-2 mt-8">
                <View className="w-10 h-10" />
                <Text className="text-lg font-bold leading-tight flex-1 text-center text-gray-900 dark:text-white">
                    Başarılı Randevu
                </Text>
                <Pressable
                    onPress={() => router.push('/(customer)/(tabs)/home' as any)}
                    className="w-10 h-10 items-center justify-center rounded-full hover:bg-black/5 dark:active:bg-white/10"
                >
                    <MaterialIcons name="close" size={24} color={COLORS.text.DEFAULT} />
                </Pressable>
            </View>

            {/* Main Content */}
            <View className="flex-1 items-center justify-center px-6 py-8 w-full max-w-md mx-auto">

                {/* Success Visual */}
                <View className="relative w-48 h-48 mb-8 items-center justify-center">
                    {/* Glow Effect */}
                    <View className="absolute inset-0 bg-primary/30 rounded-full blur-3xl opacity-60" />

                    {/* Icon Container */}
                    <View className="relative z-10 w-full h-full rounded-full bg-background-light dark:bg-background-dark border-4 border-primary/20 items-center justify-center overflow-hidden p-6 shadow-2xl shadow-primary/10">
                        <Image
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhb9xds_iW-mcSc6fgiHyXNrQE1iflGmwJGpMNyW9_nHb4p04tmFPp4FTACvHWjqf4fzyxhqZI7s4SP1-yMuKNgWKUUj1dKi5vuTNQds-AGd3BA2GWkCPIAKcoY3nLAWXkiwzCasBGWY7UDihf10MG5Slth7iwky1XUq_FObLGvjgYRUUqSzmEeIuwq66wOf0chgtQTGD3kUpQiLm81WJ6qh_cDKUzPL8oEC2rlfLi-G2vRUrusF0AqOpabp3eYz4qeRYskJErdcY' }}
                            className="w-full h-full opacity-80"
                            style={{ resizeMode: 'cover' }}
                        />
                        <View className="absolute inset-0 items-center justify-center">
                            <View className="bg-primary rounded-full p-2 shadow-lg scale-125">
                                <MaterialIcons name="check" size={32} color="white" />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Headline */}
                <Text className="text-[28px] font-bold leading-tight text-center mb-3 text-gray-900 dark:text-white">
                    Randevunuz oluşturuldu!
                </Text>

                {/* Body Text */}
                <Text className="text-base font-normal leading-relaxed text-center text-gray-500 dark:text-gray-400 mb-8 max-w-[320px]">
                    Berberiniz sizi bekliyor. Randevu detaylarına profilinizden ulaşabilirsiniz.
                </Text>

                {/* Appointment Summary Card (Mock) */}
                <View className="w-full bg-white dark:bg-[#1C252E] rounded-2xl p-4 mb-8 flex-row items-center gap-4 shadow-sm border border-gray-100 dark:border-gray-800/50">
                    <View className="h-14 w-14 rounded-full overflow-hidden border-2 border-primary/20">
                        <Image
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAD7IBzr9mL2dHlt7gHOodaL4eUCVAhFQ3c9F0teClAe67dTl18tlV4e_LP9D3PlbfnPUe9-DohUTrtNMQHaZXpIIVUBFjfIO1q8r0z0xg8SS0zDAFrGTV8W76DAMUs2ad_-xVNCW-vj_Y96a53OAHf7ulFmqFy9wfDRtKRaDSMzKO1z_CFzZLpTCT4aPAV0Bxh82svL5R4ZXWn3vjxLCQmlkvmPYKcp2OUM7aMatAJlFuQkovk0dtiQFr744qr8mFW3abnRd3aMyo' }}
                            className="w-full h-full"
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-base font-bold text-gray-900 dark:text-white" numberOfLines={1}>Barber King Studio</Text>
                        <View className="flex-row items-center gap-1 mt-0.5">
                            <MaterialIcons name="schedule" size={16} color="#9CA3AF" />
                            <Text className="text-sm text-gray-500 dark:text-gray-400" numberOfLines={1}>Bugün, 14:30 • Saç Kesimi</Text>
                        </View>
                    </View>
                    <View className="border-l border-gray-100 dark:border-gray-700/50 pl-2">
                        <Text className="text-sm font-bold text-primary">₺250</Text>
                    </View>
                </View>

                {/* Actions */}
                <View className="w-full gap-3">
                    <Pressable
                        onPress={() => router.push('/(customer)/(tabs)/home' as any)}
                        className="w-full h-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/25 active:scale-[0.98]"
                    >
                        <Text className="text-white text-base font-bold">Ana sayfaya dön</Text>
                    </Pressable>

                    <Pressable
                        className="w-full h-14 flex-row items-center justify-center rounded-full bg-transparent border border-primary/30 active:scale-[0.98]"
                    >
                        <MaterialIcons name="calendar-today" size={20} color={COLORS.primary.DEFAULT} style={{ marginRight: 8 }} />
                        <Text className="text-primary text-base font-bold">Takvime ekle</Text>
                    </Pressable>
                </View>

            </View>
        </View>
    );
}
