import React, { useState } from 'react';
import { View, Text, Pressable, Switch, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';

export default function TermsScreen() {
    const router = useRouter();
    const [kvkkAccepted, setKvkkAccepted] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [marketingAccepted, setMarketingAccepted] = useState(false);

    const canProceed = kvkkAccepted && termsAccepted;

    return (
        <ScreenWrapper noPadding>
            <View className="flex-1 bg-[#121212]">

                {/* Header */}
                <View className="flex-row items-center justify-between px-6 pt-12 pb-2">
                    <Pressable
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center rounded-full bg-[#1E1E1E] border border-white/10"
                    >
                        <MaterialIcons name="arrow-back" size={20} color="white" />
                    </Pressable>
                    <Text className="text-white text-lg font-bold tracking-tight">Yasal İzinler</Text>
                    <View className="w-10" />
                </View>

                {/* Content */}
                <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>
                    <Text className="text-gray-400 text-sm leading-relaxed mb-8">
                        Size en seçkin deneyimi sunabilmemiz için, lütfen yasal metinleri inceleyip gerekli onayları veriniz.
                    </Text>

                    {/* KVKK */}
                    <View className="bg-[#1E1E1E] rounded-xl p-4 border border-white/5 shadow-lg mb-4">
                        <View className="flex-row gap-4">
                            <View className="w-12 h-12 rounded-lg bg-[#2A2A2A] items-center justify-center border border-white/5">
                                <MaterialIcons name="security" size={24} color={COLORS.primary.DEFAULT} />
                            </View>
                            <View className="flex-1">
                                <View className="flex-row justify-between items-start mb-1">
                                    <Text className="text-white font-medium text-sm">KVKK Aydınlatma Metni</Text>
                                    <Switch
                                        value={kvkkAccepted}
                                        onValueChange={setKvkkAccepted}
                                        trackColor={{ false: '#334155', true: COLORS.primary.DEFAULT }}
                                        thumbColor={'white'}
                                    />
                                </View>
                                <Text className="text-gray-500 text-xs leading-tight mb-2">Kişisel verilerinizin işlenmesi ve korunması hakkında detaylı yasal bilgilendirme.</Text>
                                <Text className="text-primary text-xs font-medium">Metni Oku</Text>
                            </View>
                        </View>
                    </View>

                    {/* Terms */}
                    <View className="bg-[#1E1E1E] rounded-xl p-4 border border-white/5 shadow-lg mb-4">
                        <View className="flex-row gap-4">
                            <View className="w-12 h-12 rounded-lg bg-[#2A2A2A] items-center justify-center border border-white/5">
                                <MaterialIcons name="description" size={24} color={COLORS.primary.DEFAULT} />
                            </View>
                            <View className="flex-1">
                                <View className="flex-row justify-between items-start mb-1">
                                    <Text className="text-white font-medium text-sm">Üyelik Sözleşmesi</Text>
                                    <Switch
                                        value={termsAccepted}
                                        onValueChange={setTermsAccepted}
                                        trackColor={{ false: '#334155', true: COLORS.primary.DEFAULT }}
                                        thumbColor={'white'}
                                    />
                                </View>
                                <Text className="text-gray-500 text-xs leading-tight mb-2">Hizmet kullanım koşulları, iptal şartları ve üyelik haklarınız.</Text>
                                <Text className="text-primary text-xs font-medium">Metni Oku</Text>
                            </View>
                        </View>
                    </View>

                    {/* Marketing */}
                    <View className="bg-[#1E1E1E] rounded-xl p-4 border border-white/5 shadow-lg mb-4 relative">
                        <View className="absolute -top-2 -right-2 bg-primary/20 px-2 py-0.5 rounded-full border border-primary/20 z-10">
                            <Text className="text-primary text-[10px]">İsteğe Bağlı</Text>
                        </View>
                        <View className="flex-row gap-4">
                            <View className="w-12 h-12 rounded-lg bg-[#2A2A2A] items-center justify-center border border-white/5">
                                <MaterialIcons name="campaign" size={24} color={COLORS.primary.DEFAULT} />
                            </View>
                            <View className="flex-1">
                                <View className="flex-row justify-between items-start mb-1">
                                    <Text className="text-white font-medium text-sm">Kampanya İzinleri</Text>
                                    <Switch
                                        value={marketingAccepted}
                                        onValueChange={setMarketingAccepted}
                                        trackColor={{ false: '#334155', true: COLORS.primary.DEFAULT }}
                                        thumbColor={'white'}
                                    />
                                </View>
                                <Text className="text-gray-500 text-xs leading-tight mb-2">Size özel indirimler, yeni hizmetler ve randevu hatırlatmaları için iletişim izni.</Text>
                                <Text className="text-primary text-xs font-medium">Detaylar</Text>
                            </View>
                        </View>
                    </View>

                    <View className="flex-row justify-center items-center gap-2 opacity-40 mt-4">
                        <MaterialIcons name="lock" size={14} color="white" />
                        <Text className="text-white text-[10px] uppercase tracking-wider">Verileriniz 256-bit SSL ile korunmaktadır</Text>
                    </View>

                </ScrollView>

                {/* Footer */}
                <View className="absolute bottom-0 left-0 w-full p-6 bg-[#121212]/90 border-t border-white/5">
                    <Pressable
                        onPress={() => canProceed && router.replace('/(customer)/(tabs)/home' as any)}
                        className={`w-full py-4 rounded-lg flex-row items-center justify-center gap-2 ${canProceed ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-gray-800 opacity-50'
                            }`}
                        disabled={!canProceed}
                    >
                        <Text className={`text-lg font-bold ${canProceed ? 'text-[#121212]' : 'text-gray-500'}`}>
                            Onayla ve Devam Et
                        </Text>
                        <MaterialIcons name="arrow-forward" size={20} color={canProceed ? '#121212' : '#6b7280'} />
                    </Pressable>
                </View>

            </View>
        </ScreenWrapper>
    );
}
