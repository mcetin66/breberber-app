
import { View, Text, ScrollView, Pressable, Image, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';

export default function BookingSummaryScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-background-light dark:bg-background-dark">
            {/* Top App Bar */}
            <View className="sticky top-0 z-50 flex-row items-center justify-between p-4 pb-2 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-black/5 dark:border-white/5">
                <Pressable
                    onPress={() => router.back()}
                    className="w-12 h-12 items-center justify-center rounded-full hover:bg-black/5 dark:active:bg-white/10"
                >
                    <MaterialIcons name="arrow-back" size={24} color={COLORS.text.DEFAULT} />
                </Pressable>
                <Text className="text-lg font-bold leading-tight flex-1 text-center pr-12 text-black dark:text-white">
                    Randevu Özeti
                </Text>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
                <View className="gap-6">
                    {/* Barber/Staff Profile Card */}
                    <View className="bg-white dark:bg-[#2c281b] rounded-xl p-4 shadow-sm border border-black/5 dark:border-white/5">
                        <View className="flex-row items-center gap-4">
                            <View className="relative shrink-0">
                                <Image
                                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBl_zevtGPF6GxExe6Z3usKX9Pv1rOCInJfdNgqIzkrCsnSx23XdyhVD5GtlHuts7z_T_GqrZolNJ9E07g7A8_pCHnC2SAS4t2BDJXo8JUh2Lg0FkQA-NOL2CSWAzFG66TpJJUnr04NpqJXfGMQWnGYu9mHRu2kuNF2w0tvS0x6XCB0jog8RAGPJGJIxPau8_o4cfk6gzlP2mNQCQOiUYNY4hcA3T7iRsolURYiXVDPFpRndugR69gSQJR7_tLYfxSz62es9mdLumE' }}
                                    className="w-20 h-20 rounded-xl"
                                    resizeMode="cover"
                                />
                                <View className="absolute -bottom-2 -right-2 bg-primary rounded-full p-1 border-2 border-[#2c281b]">
                                    <MaterialIcons name="verified" size={16} color={COLORS.background.dark} />
                                </View>
                            </View>
                            <View className="flex-1">
                                <Text className="text-lg font-bold leading-tight text-black dark:text-white" numberOfLines={1}>Golden Scissors</Text>
                                <View className="flex-row items-center gap-1 mt-1">
                                    <MaterialIcons name="person" size={16} color="#6B7280" />
                                    <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">Ahmet Yılmaz</Text>
                                </View>
                                <View className="flex-row items-center gap-1 mt-0.5">
                                    <MaterialIcons name="location-on" size={16} color="#9CA3AF" />
                                    <Text className="text-xs text-gray-400 dark:text-gray-500">Beşiktaş, İstanbul</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Date & Time Section */}
                    <View className="gap-3">
                        <Text className="text-base font-bold px-1 text-black dark:text-white">Tarih ve Saat</Text>
                        <View className="bg-white dark:bg-[#2c281b] rounded-xl p-4 flex-row items-center justify-between border border-black/5 dark:border-white/5">
                            <View className="flex-row items-center gap-3">
                                <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
                                    <MaterialIcons name="calendar-month" size={20} color={COLORS.primary.DEFAULT} />
                                </View>
                                <View>
                                    <Text className="font-bold text-sm text-black dark:text-white">14 Ekim, Cuma</Text>
                                    <Text className="text-xs text-gray-500 dark:text-gray-400">2023</Text>
                                </View>
                            </View>
                            <View className="h-8 w-[1px] bg-gray-200 dark:bg-white/10 mx-2" />
                            <View className="flex-row items-center gap-3">
                                <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
                                    <MaterialIcons name="schedule" size={20} color={COLORS.primary.DEFAULT} />
                                </View>
                                <View>
                                    <Text className="font-bold text-sm text-black dark:text-white">15:30</Text>
                                    <Text className="text-xs text-gray-500 dark:text-gray-400">45 Dk.</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Services Section */}
                    <View className="gap-3">
                        <Text className="text-base font-bold px-1 text-black dark:text-white">Hizmetler</Text>
                        <View className="bg-white dark:bg-[#2c281b] rounded-xl overflow-hidden border border-black/5 dark:border-white/5 divide-y divide-gray-100 dark:divide-white/5">
                            {/* Service 1 */}
                            <View className="flex-row items-center justify-between p-4">
                                <View className="flex-row items-start gap-3">
                                    <MaterialIcons name="content-cut" size={20} color="#9CA3AF" className="mt-0.5" />
                                    <View>
                                        <Text className="text-sm font-medium text-black dark:text-white">Saç Kesimi</Text>
                                        <Text className="text-xs text-gray-500 dark:text-gray-400">30 Dk.</Text>
                                    </View>
                                </View>
                                <Text className="font-bold text-primary">250 TL</Text>
                            </View>
                            {/* Service 2 */}
                            <View className="flex-row items-center justify-between p-4">
                                <View className="flex-row items-start gap-3">
                                    <MaterialIcons name="face" size={20} color="#9CA3AF" className="mt-0.5" />
                                    <View>
                                        <Text className="text-sm font-medium text-black dark:text-white">Sakal Tıraşı</Text>
                                        <Text className="text-xs text-gray-500 dark:text-gray-400">15 Dk.</Text>
                                    </View>
                                </View>
                                <Text className="font-bold text-primary">100 TL</Text>
                            </View>
                        </View>
                    </View>

                    {/* Note Section */}
                    <View className="gap-3">
                        <Text className="text-base font-bold px-1 text-black dark:text-white">Not Ekle</Text>
                        <View className="relative">
                            <TextInput
                                className="w-full bg-white dark:bg-[#2c281b] rounded-xl border border-black/5 dark:border-white/5 p-4 text-sm text-black dark:text-white placeholder:text-gray-400 h-24"
                                placeholder="Berbere özel bir isteğiniz var mı?"
                                placeholderTextColor="#9CA3AF"
                                multiline
                                textAlignVertical="top"
                            />
                            <View className="absolute bottom-3 right-3">
                                <MaterialIcons name="edit-note" size={20} color="#9CA3AF" />
                            </View>
                        </View>
                    </View>

                    {/* Payment Summary */}
                    <View className="mt-2 p-4 rounded-xl bg-primary/5 border border-primary/20 gap-3">
                        <View className="flex-row justify-between items-center text-sm">
                            <Text className="text-gray-600 dark:text-gray-300">Ara Toplam</Text>
                            <Text className="text-gray-600 dark:text-gray-300">350 TL</Text>
                        </View>
                        <View className="flex-row justify-between items-center text-sm">
                            <Text className="text-gray-600 dark:text-gray-300">Vergi & Hizmet</Text>
                            <Text className="text-gray-600 dark:text-gray-300">0 TL</Text>
                        </View>
                        <View className="h-[1px] w-full bg-primary/20" />
                        <View className="flex-row justify-between items-center">
                            <Text className="font-bold text-lg text-black dark:text-white">Toplam</Text>
                            <Text className="font-bold text-xl text-primary">350 TL</Text>
                        </View>
                    </View>

                </View>
            </ScrollView>

            {/* Sticky Footer CTA */}
            <View className="absolute bottom-0 left-0 w-full bg-background-light dark:bg-background-dark border-t border-black/5 dark:border-white/5 p-4 pb-8 z-40">
                <Pressable
                    onPress={() => router.push('/(customer)/booking/booking-success')}
                    className="w-full h-14 bg-primary rounded-full flex-row items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.99] group"
                >
                    <Text className="text-background-dark font-bold text-lg">Randevuyu Tamamla</Text>
                    <MaterialIcons name="arrow-forward" size={20} color={COLORS.background.dark} />
                </Pressable>
            </View>
        </View>
    );
}
