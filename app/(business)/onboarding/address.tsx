import React, { useEffect } from 'react';
import { View, Text, Pressable, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { BusinessAddressForm } from '@/components/business/onboarding/BusinessAddressForm';
import { useBusinessStore } from '@/store/useBusinessStore';
import { ChevronLeft } from 'lucide-react-native';

export default function OnboardingAddressScreen() {
    const router = useRouter();
    const { onboardingData, setBusinessInfo, setStep, completeOnboarding, isLoading, error } = useBusinessStore();

    useEffect(() => {
        setStep(2);
    }, []);

    const handleComplete = async (data: any) => {
        setBusinessInfo(data);

        // Call store action to submit everything
        const success = await completeOnboarding();

        if (success) {
            Alert.alert("Başarılı", "İşletme kaydınız oluşturuldu.", [
                { text: "Panele Git", onPress: () => router.replace('/(business)/(tabs)/dashboard') }
            ]);
        } else {
            Alert.alert("Hata", error || "Kayıt oluşturulamadı.");
        }
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
                            <Text className="text-zinc-400 text-xs uppercase tracking-widest">Adım 2 / 2</Text>
                        </View>
                    </View>

                    <View className="mb-8">
                        <Text className="text-white text-3xl font-bold mb-2">Konum & Adres</Text>
                        <Text className="text-zinc-400">Müşterilerin sizi bulabilmesi için adresinizi girin.</Text>
                    </View>

                    <BusinessAddressForm
                        initialValues={onboardingData}
                        onSubmit={handleComplete}
                        isLoading={isLoading}
                    />
                </View>
            </TouchableWithoutFeedback>
        </ScreenWrapper>
    );
}
