import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, TextInput, Alert, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { useAuthStore } from '@/stores/authStore';

export default function OTPScreen() {
    const router = useRouter();
    const { phone, fullName } = useLocalSearchParams<{ phone: string; fullName?: string }>();
    const { signInWithPhone } = useAuthStore();
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const inputs = useRef<Array<TextInput | null>>([]);
    const [timer, setTimer] = useState(120);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleInput = (text: string, index: number) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        if (text && index < 5) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const fullCode = code.join('');
        if (fullCode === '111111') {
            setLoading(true);
            try {
                // Sign in and create/update user profile
                const result = await signInWithPhone(phone || '', fullName || 'Kullanıcı');
                if (result.success) {
                    Alert.alert('Başarılı', 'Telefon doğrulandı!', [
                        { text: 'Devam Et', onPress: () => router.replace('/(customer)/(tabs)/home' as any) }
                    ]);
                } else {
                    Alert.alert('Hata', result.error || 'Giriş başarısız.');
                }
            } catch (error) {
                Alert.alert('Hata', 'Beklenmedik bir hata oluştu.');
            } finally {
                setLoading(false);
            }
        } else {
            Alert.alert('Hata', 'Girdiğiniz kod hatalı. Lütfen tekrar deneyin. (Test Kodu: 111111)');
            setCode(['', '', '', '', '', '']);
            inputs.current[0]?.focus();
        }
    };

    return (
        <ScreenWrapper noPadding>
            <StatusBar barStyle="light-content" />
            <View className="flex-1 bg-[#121212]">

                {/* Header */}
                <View className="flex-row items-center justify-between px-6 pt-12 pb-2">
                    <Pressable
                        onPress={() => router.back()}
                        className="p-2 -ml-2 rounded-full active:bg-white/10"
                    >
                        <MaterialIcons name="arrow-back" size={28} color={COLORS.primary.DEFAULT} />
                    </Pressable>
                    <Text className="text-white text-lg font-bold tracking-tight">Doğrulama</Text>
                    <View className="w-10" />
                </View>

                {/* Content */}
                <View className="flex-1 px-6 pt-6 items-center">

                    {/* Icon */}
                    <View className="mb-8 p-5 rounded-full bg-[#1E1E1E] border border-primary/20 relative shadow-lg shadow-primary/10">
                        <MaterialIcons name="content-cut" size={40} color={COLORS.primary.DEFAULT} />
                    </View>

                    {/* Headlines */}
                    <View className="items-center mb-10 gap-3">
                        <Text className="text-3xl font-bold tracking-tight text-white">Kodu Girin</Text>
                        <Text className="text-gray-400 text-sm font-medium text-center leading-relaxed">
                            Lütfen <Text className="text-white font-bold">{phone || 'numaranıza'}</Text> gönderilen 6 haneli kodu giriniz.
                        </Text>
                        {fullName && (
                            <Text className="text-primary text-xs">Hoş geldin, {fullName}!</Text>
                        )}
                    </View>

                    {/* Inputs */}
                    <View className="w-full flex-row justify-center gap-2 mb-8">
                        {code.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => { inputs.current[index] = ref; }}
                                value={digit}
                                onChangeText={(text) => handleInput(text, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                keyboardType="number-pad"
                                maxLength={1}
                                className="w-12 h-14 text-center text-2xl font-bold bg-[#1E1E1E] text-white rounded-lg border-2 border-white/20 focus:border-primary"
                            />
                        ))}
                    </View>

                    {/* Timer */}
                    <View className="items-center mb-12">
                        <Text className="text-primary text-3xl font-bold tracking-tight mb-2">{formatTime(timer)}</Text>
                        <Pressable disabled={timer > 0}>
                            <Text className={timer > 0 ? 'text-gray-500 text-sm' : 'text-primary text-sm font-medium'}>
                                {timer > 0 ? 'Tekrar kod gönder' : 'Kodu tekrar gönder'}
                            </Text>
                        </Pressable>
                    </View>

                    {/* Button */}
                    <Pressable
                        onPress={handleVerify}
                        disabled={loading}
                        className="w-full bg-primary py-4 rounded-lg active:opacity-90 items-center justify-center"
                    >
                        <Text className="text-[#121212] text-lg font-bold">
                            {loading ? 'Doğrulanıyor...' : 'Doğrula'}
                        </Text>
                    </Pressable>
                </View>

            </View>
        </ScreenWrapper>
    );
}
