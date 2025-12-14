
import { useState } from 'react';
import { View, Text, TextInput, Pressable, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { useAuthStore } from '@/stores/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuthStore();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);

  const handleTabChange = (tab: string) => {
    if (tab === 'signup') {
      router.replace('/(auth)/register');
    } else {
      setActiveTab('login');
    }
  };

  const handleLogin = async () => {
    if (loginMethod === 'phone') {
      // Mock phone login for now
      // console.log('Phone login:', phoneNumber);
      // In a real app, this would trigger OTP flow
      Alert.alert('Bilgi', 'Telefon ile giriş şuan simülasyon modundadır. E-posta ile giriş yapmayı deneyiniz.');
    } else {
      if (!email || !password) {
        Alert.alert('Hata', 'Lütfen e-posta ve şifrenizi giriniz.');
        return;
      }
      setLoading(true);
      try {
        const result = await signIn(email, password);
        if (result.success) {
          router.replace('/(customer)/home');
        } else {
          Alert.alert('Hata', result.error || 'Giriş başarısız.');
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
      {/* Top Bar with Back Arrow */}
      <View className="flex-row items-center justify-between p-4 pb-2 mt-8">
        <Pressable
          onPress={() => router.back()}
          className="w-12 h-12 items-center justify-center rounded-full hover:bg-gray-200 dark:active:bg-gray-800"
        >
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text.DEFAULT} />
        </Pressable>
        <Pressable
          className="w-12 h-12 items-center justify-center rounded-full hover:bg-gray-200 dark:active:bg-gray-800"
        >
          <MaterialIcons name="help-outline" size={24} color={COLORS.text.DEFAULT} />
        </Pressable>
      </View>

      {/* Headline */}
      <View className="px-6 pt-4 pb-6">
        <Text className="text-white text-[32px] font-bold leading-tight">Tekrar Hoşgeldiniz</Text>
        <Text className="text-[#9dabb9] text-base font-normal mt-2">Randevularınızı yönetmek için giriş yapın.</Text>
      </View>

      {/* Tab Switcher */}
      <View className="px-6 pb-6">
        <View className="flex-row h-12 w-full items-center justify-center rounded-full bg-[#283039] p-1">
          <Pressable
            onPress={() => handleTabChange('login')}
            className={`flex-1 h-full items-center justify-center rounded-full ${activeTab === 'login' ? 'bg-[#101922] shadow-sm' : ''}`}
          >
            <Text className={`text-sm font-semibold ${activeTab === 'login' ? 'text-white' : 'text-[#9dabb9]'}`}>
              Giriş Yap
            </Text>
          </Pressable>
          <Pressable
            onPress={() => handleTabChange('signup')}
            className={`flex-1 h-full items-center justify-center rounded-full ${activeTab === 'signup' ? 'bg-[#101922] shadow-sm' : ''}`}
          >
            <Text className={`text-sm font-semibold ${activeTab === 'signup' ? 'text-white' : 'text-[#9dabb9]'}`}>
              Kayıt Ol
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Main Form Content */}
      <View className="flex-1 px-6 gap-6">

        {loginMethod === 'phone' ? (
          <>
            {/* Phone Input */}
            <View className="gap-2">
              <Text className="text-white text-base font-medium">Telefon Numarası</Text>
              <View className="relative flex-row items-center">
                <View className="absolute left-4 flex-row items-center gap-2 border-r border-[#3b4754] pr-3 h-6 z-10">
                  <Text className="text-[#9dabb9] text-sm font-medium">TR +90</Text>
                </View>
                <TextInput
                  className="flex-1 h-14 bg-[#283039] rounded-xl text-white pl-[100px] pr-4 text-base font-normal"
                  placeholder="(555) 123 45 67"
                  placeholderTextColor="#9dabb9"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
              </View>
            </View>

            {/* OTP Input Simulation */}
            <View className="gap-2">
              <View className="flex-row justify-between items-center">
                <Text className="text-white text-base font-medium">Doğrulama Kodu</Text>
                <Text className="text-primary text-sm font-medium">Tekrar Gönder</Text>
              </View>
              <View className="flex-row justify-between gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <TextInput
                    key={i}
                    className="flex-1 h-14 text-center rounded-xl bg-[#283039] text-white text-xl font-semibold active:border-primary active:border-2"
                    maxLength={1}
                    keyboardType="number-pad"
                  />
                ))}
              </View>
            </View>
          </>
        ) : (
          <>
            {/* Email Input */}
            <View className="gap-2">
              <Text className="text-white text-base font-medium">E-posta Adresi</Text>
              <TextInput
                className="h-14 bg-[#283039] rounded-xl text-white px-4 text-base font-normal"
                placeholder="ornek@email.com"
                placeholderTextColor="#9dabb9"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Password Input */}
            <View className="gap-2">
              <Text className="text-white text-base font-medium">Şifre</Text>
              <TextInput
                className="h-14 bg-[#283039] rounded-xl text-white px-4 text-base font-normal"
                placeholder="••••••••"
                placeholderTextColor="#9dabb9"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </>
        )}

        {/* Alternative Login Link */}
        <View className="items-end">
          <Pressable onPress={() => setLoginMethod(loginMethod === 'phone' ? 'email' : 'phone')}>
            <Text className="text-primary text-sm font-medium">
              {loginMethod === 'phone' ? 'E-posta ve Şifre ile giriş yap' : 'Telefon Numarası ile giriş yap'}
            </Text>
          </Pressable>
        </View>

        {/* Primary Action Button */}
        <Pressable
          onPress={handleLogin}
          disabled={loading}
          className={`w-full h-12 bg-primary rounded-full items-center justify-center shadow-lg shadow-blue-500/30 active:scale-[0.98] mt-2 ${loading ? 'opacity-70' : ''}`}
        >
          <Text className="text-white font-bold text-base">
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </Text>
        </Pressable>

        {/* Divider */}
        <View className="flex-row items-center py-2">
          <View className="flex-1 border-t border-[#e6e8eb] dark:border-[#283039]" />
          <Text className="mx-4 text-[#9dabb9] text-xs font-medium uppercase">Veya şununla devam et</Text>
          <View className="flex-1 border-t border-[#e6e8eb] dark:border-[#283039]" />
        </View>

        {/* Social Login Buttons (Disabled) */}
        <View className="flex-row gap-4 mb-8">
          <View className="flex-1 h-12 flex-row items-center justify-center gap-3 rounded-full bg-[#283039] opacity-60">
            <Text className="text-[#9dabb9] font-semibold text-sm">Google</Text>
            <View className="absolute -top-2 -right-2 bg-[#111418] border border-[#3b4754] px-2 py-0.5 rounded-full">
              <Text className="text-[#9dabb9] text-[10px] font-bold">Yakında</Text>
            </View>
          </View>
          <View className="flex-1 h-12 flex-row items-center justify-center gap-3 rounded-full bg-[#283039] opacity-60">
            <Text className="text-[#9dabb9] font-semibold text-sm">Apple</Text>
            <View className="absolute -top-2 -right-2 bg-[#111418] border border-[#3b4754] px-2 py-0.5 rounded-full">
              <Text className="text-[#9dabb9] text-[10px] font-bold">Yakında</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
