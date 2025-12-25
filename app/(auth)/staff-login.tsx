import { useState } from 'react';
import { View, Text, Pressable, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { useAuthStore } from '@/stores/authStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, Mail, Lock, User } from 'lucide-react-native';

import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
    email: z.string().min(1, 'E-posta gerekli').email('Geçerli bir e-posta adresi giriniz'),
    password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function StaffLoginScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { signIn } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' }
    });

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        try {
            const result = await signIn(data.email, data.password);

            if (result.success) {
                // Check if user is actually a staff member
                const user = useAuthStore.getState().user;
                if (user?.role !== 'staff') {
                    Alert.alert(
                        'Yetkisiz Erişim',
                        'Bu giriş ekranı sadece personel içindir. Lütfen doğru giriş sayfasını kullanın.',
                        [{ text: 'Tamam' }]
                    );
                    await useAuthStore.getState().signOut();
                    return;
                }
                router.replace('/(staff)/(tabs)/calendar');
            } else {
                Alert.alert('Hata', result.error || 'Giriş başarısız.');
            }
        } catch (error) {
            Alert.alert('Hata', 'Beklenmedik bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-[#121212]" style={{ paddingTop: insets.top }}>
            <View className="flex-1">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View className="flex-1 px-6">
                        {/* Header */}
                        <View className="flex-row items-center py-3 -mx-2">
                            <Pressable
                                onPress={() => router.back()}
                                className="w-10 h-10 items-center justify-center rounded-full bg-[#1E1E1E]"
                            >
                                <ChevronLeft size={24} color="white" />
                            </Pressable>
                        </View>

                        {/* Title */}
                        <View className="items-center mb-8 mt-8">
                            <View className="w-20 h-20 rounded-full bg-purple-500/20 items-center justify-center mb-4">
                                <User size={40} color="#8B5CF6" />
                            </View>
                            <View className="px-3 py-1 rounded-full bg-purple-500/20 mb-3">
                                <Text className="text-purple-400 text-xs font-bold">PERSONEL</Text>
                            </View>
                            <Text className="text-white text-2xl font-bold mb-2">Personel Girişi</Text>
                            <Text className="text-gray-400 text-center text-sm">
                                İşletme tarafından oluşturulan hesabınızla giriş yapın.
                            </Text>
                        </View>

                        {/* Form */}
                        <View className="gap-4">
                            <Controller
                                control={control}
                                name="email"
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        label="E-POSTA"
                                        placeholder="personel@email.com"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        value={value}
                                        onChangeText={onChange}
                                        icon={<Mail size={20} color="#6a7785" />}
                                        error={errors.email?.message}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="password"
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        label="ŞİFRE"
                                        placeholder="••••••••"
                                        secureTextEntry={!showPassword}
                                        value={value}
                                        onChangeText={onChange}
                                        icon={<Lock size={20} color="#6a7785" />}
                                        error={errors.password?.message}
                                        rightIcon={
                                            <Pressable onPress={() => setShowPassword(!showPassword)}>
                                                <MaterialIcons
                                                    name={showPassword ? 'visibility-off' : 'visibility'}
                                                    size={20}
                                                    color="#6a7785"
                                                />
                                            </Pressable>
                                        }
                                    />
                                )}
                            />

                            {/* Forgot Password */}
                            <Pressable
                                onPress={() => router.push('/(auth)/forgot-password')}
                                className="self-end"
                            >
                                <Text className="text-primary text-sm font-medium">Şifremi Unuttum</Text>
                            </Pressable>
                        </View>

                        {/* Submit Button */}
                        <View className="mt-6">
                            <Button
                                label={loading ? "Giriş yapılıyor..." : "Giriş Yap"}
                                onPress={handleSubmit(onSubmit)}
                                loading={loading}
                                disabled={loading}
                            />
                        </View>

                        {/* Info Box - NO REGISTRATION */}
                        <View className="mt-8 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                            <View className="flex-row items-center gap-3">
                                <MaterialIcons name="info-outline" size={20} color="#8B5CF6" />
                                <View className="flex-1">
                                    <Text className="text-purple-400 text-sm font-medium mb-1">
                                        Hesabınız yok mu?
                                    </Text>
                                    <Text className="text-gray-400 text-xs leading-relaxed">
                                        Personel hesapları işletme yetkilisi tarafından oluşturulur. Hesap oluşturulması için işletme yetkilinize başvurun.
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Back to main login */}
                        <View className="mt-auto mb-8 flex-row justify-center items-center gap-1.5">
                            <Text className="text-gray-400 text-sm">Müşteri misiniz?</Text>
                            <Pressable onPress={() => router.replace('/(auth)/login')}>
                                <Text className="text-primary font-bold text-sm">Ana Giriş</Text>
                            </Pressable>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </View>
    );
}
