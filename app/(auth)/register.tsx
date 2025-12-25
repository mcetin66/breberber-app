import { useState } from 'react';
import { View, Text, Pressable, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { useAuthStore } from '@/stores/authStore';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ArrowRight, ChevronLeft, User, Mail, Lock, Phone } from 'lucide-react-native';

// Validation
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Schema Definitions
const emailSchema = z.object({
  fullName: z.string().min(2, 'Ad Soyad en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
});

const phoneSchema = z.object({
  fullName: z.string().min(2, 'Ad Soyad en az 2 karakter olmalıdır'),
  phoneNumber: z.string().min(10, 'Geçerli bir telefon numarası giriniz'),
});

type RegisterFormData = {
  fullName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
};

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuthStore();

  const [registerMethod, setRegisterMethod] = useState<'phone' | 'email'>('email');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // KVKK Consents
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [tosAccepted, setTosAccepted] = useState(false);
  const [marketingAllowed, setMarketingAllowed] = useState(false);

  // Setup Form
  const { control, handleSubmit, formState: { errors }, reset } = useForm<RegisterFormData>({
    resolver: zodResolver(registerMethod === 'email' ? emailSchema : phoneSchema) as any,
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      phoneNumber: '',
    }
  });

  const onSubmit = async (data: RegisterFormData) => {
    if (registerMethod === 'phone') {
      router.push({ pathname: '/(auth)/otp', params: { phone: data.phoneNumber, fullName: data.fullName } });
      return;
    }

    setLoading(true);
    try {
      // Data is guaranteed to be valid per schema here
      const result = await signUp(data.email!, data.password!, data.fullName!, data.phoneNumber);

      if (result.success) {
        Alert.alert('Başarılı', 'Kayıt işleminiz başarıyla tamamlandı.', [
          { text: 'Tamam', onPress: () => router.replace('/(customer)/(tabs)/home') }
        ]);
      } else {
        Alert.alert('Hata', result.error || 'Kayıt başarısız.');
      }
    } catch (error) {
      Alert.alert('Hata', 'Beklenmedik bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMethod = () => {
    setRegisterMethod(prev => prev === 'phone' ? 'email' : 'phone');
    reset(); // Clear form errors and values when switching
  };

  return (
    <ScreenWrapper noPadding>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1">
          {/* Header */}
          <View className="px-4 py-4 mt-8 flex-row items-center justify-between z-10">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full active:bg-white/5 items-center justify-center -ml-2"
            >
              <ChevronLeft size={28} color={COLORS.primary.DEFAULT} />
            </Pressable>

            <View className="flex-row items-center gap-2">
              <MaterialIcons name="content-cut" size={20} color={COLORS.primary.DEFAULT} />
            </View>

            {/* Empty view for balance */}
            <View className="w-10" />
          </View>

          <View className="flex-1 px-6">
            <View className="mb-8 mt-2">
              <Text className="text-3xl font-bold text-white leading-tight mb-2 tracking-tight">Hesap Oluştur</Text>
              <Text className="text-[#b6b1a0] text-sm font-normal leading-normal">
                Lüks berber deneyimi için bilgilerinizi girin.
              </Text>
            </View>

            {registerMethod === 'phone' ? (
              <View className="gap-2">
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
                  name="phoneNumber"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      label="TELEFON NUMARASI"
                      placeholder="+90 (5XX) XXX XX XX"
                      keyboardType="phone-pad"
                      value={value}
                      onChangeText={onChange}
                      icon={<Phone size={20} color="#6a7785" />}
                      error={errors.phoneNumber?.message}
                    />
                  )}
                />
                <View className="flex-row items-center justify-between mt-1 mb-6">
                  <Text className="text-xs text-text-muted">Doğrulama kodu gönderilecektir.</Text>
                </View>
              </View>
            ) : (
              <View className="gap-2">
                <Controller
                  control={control}
                  name="fullName"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      label="AD SOYAD"
                      placeholder="Ad Soyad"
                      value={value}
                      onChangeText={onChange}
                      icon={<User size={20} color="#6a7785" />}
                      error={errors.fullName?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      label="E-POSTA"
                      placeholder="ornek@email.com"
                      value={value}
                      onChangeText={onChange}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      icon={<Mail size={20} color="#6a7785" />}
                      error={errors.email?.message}
                    />
                  )}
                />

                <View className="relative">
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        label="ŞİFRE"
                        placeholder="En az 6 karakter"
                        value={value}
                        onChangeText={onChange}
                        secureTextEntry={!showPassword}
                        icon={<Lock size={20} color="#6a7785" />}
                        error={errors.password?.message}
                      />
                    )}
                  />
                  <Pressable
                    className="absolute right-4 top-[38px]"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <MaterialIcons
                      name={showPassword ? "visibility-off" : "visibility"}
                      size={20}
                      color="#6a7785"
                    />
                  </Pressable>
                </View>
              </View>
            )}

            <View className="items-end mt-2 mb-6">
              <Pressable onPress={toggleMethod}>
                <Text className="text-primary text-sm font-medium hover:underline">
                  {registerMethod === 'phone' ? 'E-posta ile kayıt ol' : 'Telefon Numarası ile kayıt ol'}
                </Text>
              </Pressable>
            </View>

            {/* KVKK Consent Checkboxes */}
            <View className="gap-3 mb-4">
              {/* KVKK Checkbox - Required */}
              <Pressable
                onPress={() => setKvkkAccepted(!kvkkAccepted)}
                className="flex-row items-start gap-3"
              >
                <View className={`w-5 h-5 rounded border-2 items-center justify-center mt-0.5 ${kvkkAccepted ? 'bg-primary border-primary' : 'border-gray-500'
                  }`}>
                  {kvkkAccepted && <MaterialIcons name="check" size={14} color="black" />}
                </View>
                <Text className="flex-1 text-gray-400 text-xs leading-relaxed">
                  <Text className="text-red-500">*</Text>{" "}
                  <Text className="text-primary" onPress={() => router.push('/(legal)/terms')}>KVKK Aydınlatma Metni</Text>'ni okudum ve kabul ediyorum.
                </Text>
              </Pressable>

              {/* TOS Checkbox - Required */}
              <Pressable
                onPress={() => setTosAccepted(!tosAccepted)}
                className="flex-row items-start gap-3"
              >
                <View className={`w-5 h-5 rounded border-2 items-center justify-center mt-0.5 ${tosAccepted ? 'bg-primary border-primary' : 'border-gray-500'
                  }`}>
                  {tosAccepted && <MaterialIcons name="check" size={14} color="black" />}
                </View>
                <Text className="flex-1 text-gray-400 text-xs leading-relaxed">
                  <Text className="text-red-500">*</Text>{" "}
                  <Text className="text-primary" onPress={() => router.push('/(legal)/terms')}>Kullanım Koşulları</Text>'nı okudum ve kabul ediyorum.
                </Text>
              </Pressable>

              {/* Marketing Checkbox - Optional */}
              <Pressable
                onPress={() => setMarketingAllowed(!marketingAllowed)}
                className="flex-row items-start gap-3"
              >
                <View className={`w-5 h-5 rounded border-2 items-center justify-center mt-0.5 ${marketingAllowed ? 'bg-primary border-primary' : 'border-gray-500'
                  }`}>
                  {marketingAllowed && <MaterialIcons name="check" size={14} color="black" />}
                </View>
                <Text className="flex-1 text-gray-400 text-xs leading-relaxed">
                  Kampanya ve fırsatlardan haberdar olmak istiyorum. (İsteğe bağlı)
                </Text>
              </Pressable>
            </View>

            <Button
              label="Hemen Üye Ol"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              disabled={!kvkkAccepted || !tosAccepted}
              icon={<ArrowRight size={20} color="black" />}
              className="mt-2"
            />

            <View className="relative my-8">
              <View className="absolute inset-0 flex items-center justify-center">
                <View className="w-full border-t border-[#333]" />
              </View>
              <View className="relative flex-row justify-center">
                <Text className="bg-[#121212] px-4 text-text-muted text-sm">veya şununla devam et</Text>
              </View>
            </View>

            <View className="flex-row gap-4 justify-center">
              <Pressable className="w-14 h-14 rounded-full bg-[#1E1E1E] border border-[#333] items-center justify-center">
                <MaterialIcons name="language" size={24} color="white" />
              </Pressable>
              <Pressable className="w-14 h-14 rounded-full bg-[#1E1E1E] border border-[#333] items-center justify-center">
                <MaterialIcons name="phone-iphone" size={24} color="white" />
              </Pressable>
            </View>

            <View className="mt-auto mb-8 flex-row justify-center items-center gap-1.5">
              <Text className="text-[#b6b1a0] text-sm">Hesabınız var mı?</Text>
              <Pressable onPress={() => router.replace('/(auth)/login')}>
                <Text className="text-primary font-bold text-sm">Giriş Yap</Text>
              </Pressable>
            </View>

          </View>
        </View>
      </TouchableWithoutFeedback>
    </ScreenWrapper>
  );
}

