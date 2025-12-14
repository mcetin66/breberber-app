import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { useAuthStore } from '@/stores/authStore';

export default function AdminLoginScreen() {
  const router = useRouter();
  const signIn = useAuthStore(state => state.signIn);

  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    setLoading(true);
    try {
      // Normal signIn, but we will check role afterwards in the store or here
      await signIn(email, password);

      const user = useAuthStore.getState().user;

      if (user?.role !== 'admin') {
        // If not admin, logout immediately and show error
        await useAuthStore.getState().signOut();
        Alert.alert('Yetkisiz Erişim', 'Bu panel sadece platform yöneticileri içindir.');
      } else {
        router.replace('/(admin)/dashboard');
      }
    } catch (error) {
      Alert.alert('Hata', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="p-4">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center rounded-full bg-background-card mb-8"
            >
              <ArrowLeft size={24} color={COLORS.text.DEFAULT} />
            </Pressable>

            <View className="items-center mb-12">
              <View className="w-24 h-24 bg-primary/10 rounded-full items-center justify-center mb-6 border-2 border-primary/20">
                <Shield size={48} color={COLORS.primary.DEFAULT} />
              </View>
              <Text className="text-white text-3xl font-poppins-bold text-center">
                Admin Girişi
              </Text>
              <Text className="text-text-secondary text-base font-poppins text-center mt-2">
                Platform Yönetim Paneli
              </Text>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-text-secondary font-poppins mb-2 ml-1">E-posta</Text>
                <View className="flex-row items-center bg-background-card rounded-xl px-4 py-3 border border-white/5 focus:border-primary/50">
                  <Mail size={20} color={COLORS.text.muted} />
                  <TextInput
                    className="flex-1 ml-3 text-white font-poppins"
                    placeholder="admin@breberber.com"
                    placeholderTextColor={COLORS.text.muted}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              <View>
                <Text className="text-text-secondary font-poppins mb-2 ml-1">Şifre</Text>
                <View className="flex-row items-center bg-background-card rounded-xl px-4 py-3 border border-white/5 focus:border-primary/50">
                  <Lock size={20} color={COLORS.text.muted} />
                  <TextInput
                    className="flex-1 ml-3 text-white font-poppins"
                    placeholder="••••••••"
                    placeholderTextColor={COLORS.text.muted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <EyeOff size={20} color={COLORS.text.muted} />
                    ) : (
                      <Eye size={20} color={COLORS.text.muted} />
                    )}
                  </Pressable>
                </View>
              </View>

              <Pressable
                onPress={handleLogin}
                disabled={loading}
                className={`bg-primary rounded-xl py-4 mt-8 ${loading ? 'opacity-70' : ''}`}
              >
                <Text className="text-background text-center font-poppins-bold text-lg">
                  {loading ? 'Giriş Yapılıyor...' : 'Panele Git'}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
