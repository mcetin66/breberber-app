import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, TextInput, Alert, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';

export default function OTPScreen() {
    const router = useRouter();
    const { phone } = useLocalSearchParams();
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const inputs = useRef<Array<TextInput | null>>([]);
    const [timer, setTimer] = useState(120);

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

    const handleVerify = () => {
        const fullCode = code.join('');
        if (fullCode === '111111') {
            Alert.alert('Başarılı', 'Telefon doğrulandı!', [
                { text: 'Devam Et', onPress: () => router.replace('/(customer)/home') }
            ]);
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
                                className={`w-12 h-14 rounded-xl bg-[#1E1E1E] border text-center text-xl font-bold text-white ${digit ? 'border-primary shadow-lg shadow-primary/30' : 'border-white/10'
                                    }`}
                                selectionColor={COLORS.primary.DEFAULT}
                            />
                        ))}
                    </View>

                    {/* Timer */}
                    <View className="items-center gap-3 mb-8">
                        <View className="flex-row items-center gap-2 px-4 py-2 bg-[#1E1E1E]/50 rounded-full border border-white/5">
                            <MaterialIcons name="timer" size={16} color={COLORS.primary.DEFAULT} />
                            <Text className="text-primary font-bold">{formatTime(timer)}</Text>
                        </View>
                        <Pressable onPress={() => setTimer(120)}>
                            <Text className="text-sm font-medium text-gray-500">
                                Kodu almadınız mı? <Text className="text-white font-semibold underline">Tekrar Gönder</Text>
                            </Text>
                        </Pressable>
                    </View>

                    {/* Verify Button */}
                    <Pressable
                        onPress={handleVerify}
                        className="w-full py-4 bg-primary rounded-full shadow-lg shadow-primary/20 active:scale-[0.98] flex-row items-center justify-center gap-2"
                    >
                        <Text className="text-[#121212] text-lg font-bold">Doğrula</Text>
                        <MaterialIcons name="check-circle" size={20} color="#121212" />
                    </Pressable>

                </View>
            </View>
        </ScreenWrapper>
    );
}
