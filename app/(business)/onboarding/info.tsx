import React, { useEffect } from 'react';
import { View, Text, Pressable, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { BusinessInfoForm } from '@/components/business/onboarding/BusinessInfoForm';
import { useBusinessStore } from '@/store/useBusinessStore';
import { ChevronLeft } from 'lucide-react-native';

export default function OnboardingInfoScreen() {
    const router = useRouter();
    const { onboardingData, setBusinessInfo, setStep } = useBusinessStore();

    useEffect(() => {
        setStep(1);
    }, []);

    const handleNext = (data: any) => {
        setBusinessInfo(data);
        router.push('/(business)/onboarding/address');
    };

    return (
        <ScreenWrapper noPadding>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1 bg-[#121212] px-6">
                    {/* Header */}
                    <View className="mt-8 mb-6 flex-row items-center">
                        <Pressable onPress={() => router.back()} className="p-2 -ml-2 rounded-full active:bg-white/10">
                            <ChevronLeft size={24} color="white" />
                        </Pressable>
                        <View className="flex-1 items-center mr-8">
                            <Text className="text-zinc-400 text-xs uppercase tracking-widest">Adım 1 / 2</Text>
                        </View>
                    </View>

                    <View className="mb-8">
                        <Text className="text-white text-3xl font-bold mb-2">İşletme Bilgileri</Text>
                        <Text className="text-zinc-400">Markanızı oluşturmak için temel bilgileri girin.</Text>
                    </View>

                    <BusinessInfoForm
                        initialValues={onboardingData}
                        onSubmit={handleNext}
                    />
                </View>
            </TouchableWithoutFeedback>
        </ScreenWrapper>
    );
}
