import { useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { Mail, ChevronLeft } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleResetPassword = async () => {
        if (!email) {
            Alert.alert('Hata', 'Lütfen e-posta adresinizi girin.');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: 'breberber://reset-password',
            });

            if (error) throw error;

            setSent(true);
            Alert.alert(
                'E-posta Gönderildi',
                'Şifre sıfırlama linki e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.',
                [{ text: 'Tamam' }]
            );
        } catch (error: any) {
            Alert.alert('Hata', error.message || 'Şifre sıfırlama e-postası gönderilemedi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-[#121212]" style={{ paddingTop: insets.top }}>
            <View className="flex-1">
                {/* Header */}
                <View className="flex-row items-center px-4 py-3">
                    <Pressable
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center rounded-full bg-[#1E1E1E]"
                    >
                        <ChevronLeft size={24} color="white" />
                    </Pressable>
                </View>

                <View className="flex-1 px-6 pt-8">
                    {/* Icon */}
                    <View className="items-center mb-8">
                        <View className="w-20 h-20 rounded-full bg-primary/20 items-center justify-center mb-4">
                            <MaterialIcons name="lock-reset" size={40} color={COLORS.primary.DEFAULT} />
                        </View>
                        <Text className="text-white text-2xl font-bold mb-2">Şifremi Unuttum</Text>
                        <Text className="text-gray-400 text-center text-sm">
                            E-posta adresinizi girin, size şifre sıfırlama linki gönderelim.
                        </Text>
                    </View>

                    {!sent ? (
                        <>
                            <Input
                                label="E-POSTA"
                                placeholder="ornek@email.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                                icon={<Mail size={20} color="#6a7785" />}
                            />

                            <Button
                                label={loading ? "Gönderiliyor..." : "Sıfırlama Linki Gönder"}
                                onPress={handleResetPassword}
                                loading={loading}
                                disabled={loading || !email}
                                className="mt-6"
                            />
                        </>
                    ) : (
                        <View className="items-center">
                            <View className="w-16 h-16 rounded-full bg-green-500/20 items-center justify-center mb-4">
                                <MaterialIcons name="check" size={32} color="#22c55e" />
                            </View>
                            <Text className="text-white text-lg font-bold mb-2">E-posta Gönderildi!</Text>
                            <Text className="text-gray-400 text-center text-sm mb-6">
                                {email} adresine şifre sıfırlama linki gönderdik.
                            </Text>
                            <Pressable onPress={() => router.replace('/(auth)/login')}>
                                <Text className="text-primary font-bold">Giriş Sayfasına Dön</Text>
                            </Pressable>
                        </View>
                    )}

                    {!sent && (
                        <View className="mt-8 flex-row justify-center items-center gap-1.5">
                            <Text className="text-gray-400 text-sm">Şifrenizi hatırlıyor musunuz?</Text>
                            <Pressable onPress={() => router.replace('/(auth)/login')}>
                                <Text className="text-primary font-bold text-sm">Giriş Yap</Text>
                            </Pressable>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}
