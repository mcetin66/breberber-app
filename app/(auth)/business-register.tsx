import { useState } from 'react';
import { View, Text, Pressable, Alert, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { useAuthStore } from '@/stores/authStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LegalTextModal } from '@/components/modals/LegalTextModal';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, User, Mail, Lock, Phone, Building, MapPin } from 'lucide-react-native';

import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const businessRegisterSchema = z.object({
    fullName: z.string().min(2, 'Ad Soyad en az 2 karakter olmalıdır'),
    email: z.string().email('Geçerli bir e-posta adresi giriniz'),
    password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
    businessName: z.string().min(2, 'İşletme adı en az 2 karakter olmalıdır'),
    phone: z.string().min(10, 'Geçerli bir telefon numarası giriniz'),
    city: z.string().min(2, 'Şehir seçiniz'),
});

type BusinessRegisterFormData = z.infer<typeof businessRegisterSchema>;

export default function BusinessRegisterScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Consents
    const [kvkkAccepted, setKvkkAccepted] = useState(false);
    const [commercialAccepted, setCommercialAccepted] = useState(false);
    const [marketingAccepted, setMarketingAccepted] = useState(false);
    const [modalType, setModalType] = useState<'kvkk' | 'terms' | 'marketing' | null>(null);

    const { control, handleSubmit, formState: { errors } } = useForm<BusinessRegisterFormData>({
        resolver: zodResolver(businessRegisterSchema),
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            businessName: '',
            phone: '',
            city: '',
        }
    });

    const canProceed = kvkkAccepted && commercialAccepted;

    const onSubmit = async (data: BusinessRegisterFormData) => {
        if (!canProceed) {
            Alert.alert('Uyarı', 'Devam etmek için zorunlu sözleşmeleri onaylamanız gerekmektedir.');
            return;
        }

        setLoading(true);
        try {
            // 1. Create auth user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
            });

            if (authError) {
                const errorMsg = authError.message.toLowerCase();
                if (errorMsg.includes('already') || errorMsg.includes('exists')) {
                    Alert.alert(
                        'E-posta Zaten Kayıtlı',
                        'Bu e-posta adresi ile daha önce kayıt olunmuş.',
                        [
                            { text: 'Giriş Yap', onPress: () => router.replace('/(auth)/login') },
                            { text: 'Şifremi Unuttum', onPress: () => router.push('/(auth)/forgot-password') },
                            { text: 'İptal', style: 'cancel' }
                        ]
                    );
                    return;
                }
                throw authError;
            }

            if (!authData.user) throw new Error('Kayıt başarısız');

            // 2. Create profile
            await supabase.from('profiles').insert({
                id: authData.user.id,
                email: data.email,
                full_name: data.fullName,
                phone: data.phone,
                role: 'business_owner',
            });

            // 3. Create business
            await supabase.from('businesses').insert({
                owner_id: authData.user.id,
                name: data.businessName,
                city: data.city,
                phone: data.phone,
                email: data.email,
                is_active: false, // Pending approval
                contact_name: data.fullName,
            });

            Alert.alert(
                'Kayıt Başarılı!',
                'İşletmeniz inceleme sürecine alınmıştır. Onaylandığında e-posta ile bilgilendirileceksiniz.',
                [{ text: 'Tamam', onPress: () => router.replace('/(business)/(tabs)/dashboard') }]
            );
        } catch (error: any) {
            Alert.alert('Hata', error.message || 'Kayıt sırasında bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-[#121212]" style={{ paddingTop: insets.top }}>
            <View className="flex-1">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                        {/* Header */}
                        <View className="flex-row items-center px-4 py-3">
                            <Pressable
                                onPress={() => router.back()}
                                className="w-10 h-10 items-center justify-center rounded-full bg-[#1E1E1E]"
                            >
                                <ChevronLeft size={24} color="white" />
                            </Pressable>
                        </View>

                        <View className="px-6 pb-8">
                            {/* Title */}
                            <View className="items-center mb-6">
                                <View className="w-16 h-16 rounded-full bg-primary/20 items-center justify-center mb-4">
                                    <Building size={32} color={COLORS.primary.DEFAULT} />
                                </View>
                                <Text className="text-white text-2xl font-bold mb-2">İşletme Kaydı</Text>
                                <Text className="text-gray-400 text-center text-sm">
                                    İşletmenizi Breberber'e kaydedin ve müşterilerinize ulaşın.
                                </Text>
                            </View>

                            {/* Form */}
                            <View className="gap-3">
                                <Controller
                                    control={control}
                                    name="fullName"
                                    render={({ field: { onChange, value } }) => (
                                        <Input
                                            label="AD SOYAD"
                                            placeholder="Adınız Soyadınız"
                                            value={value}
                                            onChangeText={onChange}
                                            icon={<User size={20} color="#6a7785" />}
                                            error={errors.fullName?.message}
                                        />
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name="businessName"
                                    render={({ field: { onChange, value } }) => (
                                        <Input
                                            label="İŞLETME ADI"
                                            placeholder="İşletmenizin adı"
                                            value={value}
                                            onChangeText={onChange}
                                            icon={<Building size={20} color="#6a7785" />}
                                            error={errors.businessName?.message}
                                        />
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name="email"
                                    render={({ field: { onChange, value } }) => (
                                        <Input
                                            label="E-POSTA"
                                            placeholder="isletme@email.com"
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
                                    name="phone"
                                    render={({ field: { onChange, value } }) => (
                                        <Input
                                            label="TELEFON"
                                            placeholder="+90 (5XX) XXX XX XX"
                                            keyboardType="phone-pad"
                                            value={value}
                                            onChangeText={onChange}
                                            icon={<Phone size={20} color="#6a7785" />}
                                            error={errors.phone?.message}
                                        />
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name="city"
                                    render={({ field: { onChange, value } }) => (
                                        <Input
                                            label="ŞEHİR"
                                            placeholder="İstanbul"
                                            value={value}
                                            onChangeText={onChange}
                                            icon={<MapPin size={20} color="#6a7785" />}
                                            error={errors.city?.message}
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
                            </View>

                            {/* Consents */}
                            <View className="gap-3 mt-6 mb-6">
                                {/* KVKK */}
                                <Pressable
                                    onPress={() => setModalType('kvkk')}
                                    className="flex-row items-start gap-3"
                                >
                                    <View className={`w-5 h-5 rounded border-2 items-center justify-center mt-0.5 ${kvkkAccepted ? 'bg-primary border-primary' : 'border-gray-500'}`}>
                                        {kvkkAccepted && <MaterialIcons name="check" size={14} color="black" />}
                                    </View>
                                    <Text className="flex-1 text-gray-400 text-xs leading-relaxed">
                                        <Text className="text-red-500">*</Text>{" "}
                                        <Text className="text-primary">KVKK Aydınlatma Metni</Text>'ni okudum ve kabul ediyorum.
                                    </Text>
                                </Pressable>

                                {/* Commercial Agreement */}
                                <Pressable
                                    onPress={() => setModalType('terms')}
                                    className="flex-row items-start gap-3"
                                >
                                    <View className={`w-5 h-5 rounded border-2 items-center justify-center mt-0.5 ${commercialAccepted ? 'bg-primary border-primary' : 'border-gray-500'}`}>
                                        {commercialAccepted && <MaterialIcons name="check" size={14} color="black" />}
                                    </View>
                                    <Text className="flex-1 text-gray-400 text-xs leading-relaxed">
                                        <Text className="text-red-500">*</Text>{" "}
                                        <Text className="text-primary">Ticari Sözleşme</Text>'yi okudum ve kabul ediyorum.
                                    </Text>
                                </Pressable>

                                {/* Marketing */}
                                <Pressable
                                    onPress={() => setModalType('marketing')}
                                    className="flex-row items-start gap-3"
                                >
                                    <View className={`w-5 h-5 rounded border-2 items-center justify-center mt-0.5 ${marketingAccepted ? 'bg-primary border-primary' : 'border-gray-500'}`}>
                                        {marketingAccepted && <MaterialIcons name="check" size={14} color="black" />}
                                    </View>
                                    <Text className="flex-1 text-gray-400 text-xs leading-relaxed">
                                        Ticari iletişim izni veriyorum. (İsteğe bağlı)
                                    </Text>
                                </Pressable>
                            </View>

                            {/* Submit Button */}
                            <Button
                                label={loading ? "Kaydediliyor..." : "İşletmemi Kaydet"}
                                onPress={handleSubmit(onSubmit)}
                                loading={loading}
                                disabled={loading || !canProceed}
                            />

                            {/* Login Link */}
                            <View className="mt-6 flex-row justify-center items-center gap-1.5">
                                <Text className="text-gray-400 text-sm">Hesabınız var mı?</Text>
                                <Pressable onPress={() => router.replace('/(auth)/login')}>
                                    <Text className="text-primary font-bold text-sm">Giriş Yap</Text>
                                </Pressable>
                            </View>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>

                {/* Legal Text Modal */}
                {modalType && (
                    <LegalTextModal
                        visible={!!modalType}
                        onClose={() => setModalType(null)}
                        onAccept={() => {
                            if (modalType === 'kvkk') setKvkkAccepted(true);
                            if (modalType === 'terms') setCommercialAccepted(true);
                            if (modalType === 'marketing') setMarketingAccepted(true);
                        }}
                        type={modalType}
                    />
                )}
            </View>
        </View>
    );
}
