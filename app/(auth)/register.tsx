import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { useAuthStore } from '@/stores/authStore';

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuthStore();

  const [registerMethod, setRegisterMethod] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTabChange = (tab: string) => {
    if (tab === 'login') {
      router.replace('/(auth)/login');
    }
  };

  const handleRegister = async () => {
    if (registerMethod === 'phone') {
      Alert.alert('Bilgi', 'Telefon ile kayıt şuan simülasyon modundadır. E-posta ile kayıt olmayı deneyiniz.');
    } else {
      if (!email || !password || !fullName) {
        Alert.alert('Hata', 'Lütfen tüm alanları doldurunuz.');
        return;
      }
      setLoading(true);
      try {
        // Pass phone as optional if needed, or empty
        const result = await signUp(email, password, fullName, phoneNumber);
        if (result.success) {
          Alert.alert('Başarılı', 'Kayıt işleminiz başarıyla tamamlandı.', [
            { text: 'Tamam', onPress: () => router.replace('/(customer)/home') }
          ]);
        } else {
          Alert.alert('Hata', result.error || 'Kayıt başarısız.');
        }
      } catch (error) {
        Alert.alert('Hata', 'Beklenmedik bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View className="flex-1 bg-[#101922]">
      <View className="flex-1 max-w-[480px] w-full mx-auto px-4 py-6 justify-between mt-8">

        {/* Top Section */}
        <View className="w-full">
          {/* Logo */}
          <View className="items-center mb-6 pt-4">
            <View className="w-16 h-16 bg-primary rounded-full items-center justify-center shadow-lg shadow-primary/20">
              <MaterialIcons name="content-cut" size={32} color="white" />
            </View>
          </View>

          {/* Headline */}
          <View className="mb-8 items-center">
            <Text className="text-3xl font-bold tracking-tight text-white mb-2">Hoşgeldiniz</Text>
            <Text className="text-slate-400 text-sm font-medium">SaaS Barber'a üye olarak randevularınızı yönetin.</Text>
          </View>

          {/* Segmented Control */}
          <View className="mb-8 flex-row h-14 items-center justify-center rounded-full bg-[#1e2936] p-1.5 border border-white/5">
            <Pressable
              onPress={() => handleTabChange('login')}
              className="flex-1 h-full items-center justify-center rounded-full"
            >
              <Text className="text-slate-400 text-sm font-bold">Giriş Yap</Text>
            </Pressable>
            <Pressable
              className="flex-1 h-full items-center justify-center rounded-full bg-primary shadow-md shadow-black/20"
            >
              <Text className="text-sm font-bold text-white">Üye Ol</Text>
            </Pressable>
          </View>

          {/* Form */}
          <View className="gap-6">

            {registerMethod === 'phone' ? (
              <>
                {/* Phone Input */}
                <View className="gap-2">
                  <Text className="text-white text-sm font-semibold ml-1">Telefon Numarası</Text>
                  <View className="relative justify-center">
                    <View className="absolute left-4 z-10">
                      <MaterialIcons name="smartphone" size={24} color="#94a3b8" />
                    </View>
                    <TextInput
                      className="w-full h-14 pl-12 pr-4 bg-[#2a2a2a] rounded-full text-white placeholder:text-slate-500 font-medium text-base"
                      placeholder="+90 (5XX) XXX XX XX"
                      placeholderTextColor="#64748b"
                      keyboardType="phone-pad"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                    />
                  </View>
                </View>

                {/* OTP Input */}
                <View className="gap-2">
                  <View className="flex-row justify-between items-end ml-1 mr-1">
                    <Text className="text-white text-sm font-semibold">Onay Kodu</Text>
                    <Text className="text-primary text-xs font-bold">Kodu Gönder</Text>
                  </View>
                  <View className="flex-row justify-between gap-3">
                    {[1, 2, 3, 4].map(i => (
                      <TextInput
                        key={i}
                        className="flex-1 h-14 text-center bg-[#2a2a2a] rounded-2xl text-white text-xl font-bold placeholder:text-slate-600"
                        maxLength={1}
                        keyboardType="number-pad"
                        placeholder="-"
                        placeholderTextColor="#475569"
                      />
                    ))}
                  </View>
                  <Text className="text-xs text-slate-500 mt-1 ml-1">Telefonunuza gelen 4 haneli kodu giriniz.</Text>
                </View>
              </>
            ) : (
              <>
                {/* Full Name Input */}
                <View className="gap-2">
                  <Text className="text-white text-sm font-semibold ml-1">Ad Soyad</Text>
                  <View className="relative justify-center">
                    <View className="absolute left-4 z-10">
                      <MaterialIcons name="person" size={24} color="#94a3b8" />
                    </View>
                    <TextInput
                      className="w-full h-14 pl-12 pr-4 bg-[#2a2a2a] rounded-full text-white placeholder:text-slate-500 font-medium text-base"
                      placeholder="Ad Soyad"
                      placeholderTextColor="#64748b"
                      keyboardType="default"
                      autoCorrect={false}
                      value={fullName}
                      onChangeText={setFullName}
                    />
                  </View>
                </View>

                {/* Email Input */}
                <View className="gap-2">
                  <Text className="text-white text-sm font-semibold ml-1">E-posta Adresi</Text>
                  <View className="relative justify-center">
                    <View className="absolute left-4 z-10">
                      <MaterialIcons name="email" size={24} color="#94a3b8" />
                    </View>
                    <TextInput
                      className="w-full h-14 pl-12 pr-4 bg-[#2a2a2a] rounded-full text-white placeholder:text-slate-500 font-medium text-base"
                      placeholder="ornek@email.com"
                      placeholderTextColor="#64748b"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={email}
                      onChangeText={setEmail}
                    />
                  </View>
                </View>

                {/* Password Input */}
                <View className="gap-2">
                  <Text className="text-white text-sm font-semibold ml-1">Şifre</Text>
                  <View className="relative justify-center">
                    <View className="absolute left-4 z-10">
                      <MaterialIcons name="lock" size={24} color="#94a3b8" />
                    </View>
                    <TextInput
                      className="w-full h-14 pl-12 pr-4 bg-[#2a2a2a] rounded-full text-white placeholder:text-slate-500 font-medium text-base"
                      placeholder="••••••••"
                      placeholderTextColor="#64748b"
                      secureTextEntry
                      autoCorrect={false}
                      value={password}
                      onChangeText={setPassword}
                    />
                  </View>
                </View>
              </>
            )}

            {/* Switch Method Link */}
            <View className="items-end">
              <Pressable onPress={() => setRegisterMethod(registerMethod === 'phone' ? 'email' : 'phone')}>
                <Text className="text-primary text-sm font-medium">
                  {registerMethod === 'phone' ? 'E-posta ile kayıt ol' : 'Telefon Numarası ile kayıt ol'}
                </Text>
              </Pressable>
            </View>

            {/* Submit Button */}
            <Pressable
              onPress={handleRegister}
              disabled={loading}
              className={`w-full h-14 bg-primary rounded-full items-center justify-center flex-row gap-2 shadow-lg shadow-primary/25 mt-2 active:scale-[0.98] ${loading ? 'opacity-70' : ''}`}
            >
              <Text className="text-white text-base font-bold tracking-wide">
                {loading ? 'Kayıt Yapılıyor...' : 'Üye Ol'}
              </Text>
              {!loading && <MaterialIcons name="arrow-forward" size={20} color="white" />}
            </Pressable>
          </View>

          {/* Divider */}
          <View className="relative py-8 h-12 justify-center">
            <View className="absolute inset-0 flex items-center justify-center">
              <View className="w-full border-t border-white/10" />
            </View>
            <View className="relative items-center">
              <Text className="px-4 bg-[#101922] text-xs text-slate-500 uppercase tracking-wider font-semibold">Ya da şununla</Text>
            </View>
          </View>

          {/* Social Buttons */}
          <View className="flex-row gap-4">
            <View className="flex-1 h-14 flex-row items-center justify-center bg-[#2a2a2a] rounded-2xl border border-white/5 opacity-50 relative">
              <MaterialIcons name="language" size={24} color="white" className="mr-2" />
              <Text className="text-white text-sm font-semibold ml-2">Google</Text>
              <View className="absolute -top-2.5 -right-2 bg-[#1e2936] px-2 py-0.5 rounded-full border border-white/10">
                <Text className="text-[9px] font-bold text-primary">YAKINDA</Text>
              </View>
            </View>
            <View className="flex-1 h-14 flex-row items-center justify-center bg-[#2a2a2a] rounded-2xl border border-white/5 opacity-50 relative">
              <MaterialIcons name="phone-iphone" size={24} color="white" className="mr-2" />
              <Text className="text-white text-sm font-semibold ml-2">Apple</Text>
              <View className="absolute -top-2.5 -right-2 bg-[#1e2936] px-2 py-0.5 rounded-full border border-white/10">
                <Text className="text-[9px] font-bold text-primary">YAKINDA</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View className="mt-8 mb-2 items-center">
          <Text className="text-slate-500 text-sm font-medium">
            Zaten bir hesabın var mı? <Text onPress={() => router.replace('/(auth)/login')} className="text-primary font-bold">Giriş Yap</Text>
          </Text>
        </View>

      </View>
    </View>
  );
}
