import React from 'react';
import { View, Text, Pressable, Image, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { Building2, ArrowRight } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';

export default function OnboardingWelcomeScreen() {
    const router = useRouter();

    return (
        <ScreenWrapper noPadding>
            <View className="flex-1 bg-[#121212] justify-center px-6">

                <View className="items-center mb-10">
                    <View className="w-24 h-24 rounded-full bg-[#d4af35]/10 items-center justify-center border border-[#d4af35]/30 mb-6">
                        <Building2 size={48} color="#d4af35" />
                    </View>
                    <Text className="text-white text-3xl font-bold text-center mb-3">İşletmeni Kur</Text>
                    <Text className="text-zinc-400 text-center leading-6 px-4">
                        Sadece birkaç adımda işletme profilini oluştur, randevularını yönetmeye başla.
                    </Text>
                </View>

                <View className="gap-4">
                    <View className="flex-row items-center gap-4 bg-[#1E1E1E] p-4 rounded-xl border border-white/5">
                        <View className="w-8 h-8 rounded-full bg-zinc-800 items-center justify-center">
                            <Text className="text-white font-bold">1</Text>
                        </View>
                        <Text className="text-zinc-300 font-medium">Temel Bilgiler</Text>
                    </View>
                    <View className="flex-row items-center gap-4 bg-[#1E1E1E] p-4 rounded-xl border border-white/5">
                        <View className="w-8 h-8 rounded-full bg-zinc-800 items-center justify-center">
                            <Text className="text-white font-bold">2</Text>
                        </View>
                        <Text className="text-zinc-300 font-medium">Adres Detayları</Text>
                    </View>
                    <View className="flex-row items-center gap-4 bg-[#1E1E1E] p-4 rounded-xl border border-white/5 opacity-50">
                        <View className="w-8 h-8 rounded-full bg-zinc-800 items-center justify-center">
                            <Text className="text-white font-bold">3</Text>
                        </View>
                        <Text className="text-zinc-300 font-medium">Belge Doğrulama (Sonra)</Text>
                    </View>
                </View>

                <Pressable
                    onPress={() => router.push('/(business)/onboarding/info')}
                    className="mt-12 bg-[#d4af35] py-4 rounded-xl flex-row items-center justify-center gap-2 active:opacity-90"
                >
                    <Text className="text-black font-bold text-base uppercase tracking-wide">Kuruluma Başla</Text>
                    <ArrowRight size={20} color="black" />
                </Pressable>

            </View>
        </ScreenWrapper>
    );
}
