import { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert, Keyboard, TouchableWithoutFeedback, Image, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { ChevronDown, User, Trash2, Eye, EyeOff, Building2, UserCog, Shield, ArrowRight } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { useAuthStore } from '@/stores/authStore';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

// Validation Dependencies
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// 1. Define Validation Schema
const loginSchema = z.object({
  email: z.string().min(1, 'E-posta gerekli').email('Geçerli bir e-posta adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Role-based visual configuration
const ROLE_CONFIG: Record<string, { icon: any; title: string; subtitle: string; color: string; badge?: string }> = {
  customer: {
    icon: User,
    title: 'Lüks Deneyime\nHoş Geldiniz',
    subtitle: 'Randevularınızı yönetmek ve ayrıcalıklı dünyaya adım atmak için giriş yapın.',
    color: '#d4af35',
  },
  business: {
    icon: Building2,
    title: 'İşletme Girişi',
    subtitle: 'İşletmenizi yönetmek için giriş yapın.',
    color: '#10B981', // Green
    badge: 'İŞLETME',
  },
  staff: {
    icon: UserCog,
    title: 'Personel Girişi',
    subtitle: 'Randevularınızı görüntülemek için giriş yapın.',
    color: '#8B5CF6', // Purple
    badge: 'PERSONEL',
  },
  admin: {
    icon: Shield,
    title: 'Platform Yönetimi',
    subtitle: 'Yönetim paneline erişmek için giriş yapın.',
    color: '#EF4444', // Red
    badge: 'YÖNETİCİ',
  },
};

export default function LoginScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role?: string }>();
  const { signIn } = useAuthStore();

  // Get role config or default to customer
  const currentRole = (role && ROLE_CONFIG[role]) ? role : 'customer';
  const roleConfig = ROLE_CONFIG[currentRole];
  const RoleIcon = roleConfig.icon;

  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState<any[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 2. Setup React Hook Form
  const { control, handleSubmit, setValue, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'demo@example.com',
      password: 'password123',
    }
  });

  useEffect(() => {
    loadSavedAccounts();
  }, []);

  const loadSavedAccounts = async () => {
    try {
      const saved = await AsyncStorage.getItem('saved_accounts');
      if (saved) {
        const parsed = JSON.parse(saved);

        // Filter accounts by role matching the current login screen
        const roleMapping: Record<string, string[]> = {
          customer: ['customer'],
          business: ['business_owner'],
          staff: ['staff'],
          admin: ['platform_admin'],
        };
        const allowedRoles = roleMapping[currentRole] || ['customer'];
        const filtered = parsed.filter((acc: any) => allowedRoles.includes(acc.role));

        setSavedAccounts(filtered);
        if (filtered.length > 0) {
          setValue('email', filtered[0].email);
        }
      }
    } catch (e) { }
  };

  const removeAccount = async (emailToRemove: string) => {
    const updated = savedAccounts.filter(a => a.email !== emailToRemove);
    setSavedAccounts(updated);
    await AsyncStorage.setItem('saved_accounts', JSON.stringify(updated));
    // Optional: Clear field if current
    // setValue('email', '');
  };

  const getRoleBadge = (role: string) => {
    if (role === 'platform_admin') return 'A';
    if (role === 'business_owner') return 'B';
    if (role === 'staff') return 'C';
    return 'D';
  };

  const getRoleLabel = (role: string) => {
    if (role === 'platform_admin') return 'Platform';
    if (role === 'business_owner') return 'İşletme';
    if (role === 'staff') return 'Personel';
    return 'Müşteri';
  };

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const result = await signIn(data.email, data.password);

      if (result.success) {
        const user = useAuthStore.getState().user;

        // Role validation logic...
        const expectedRoles: Record<string, string[]> = {
          customer: ['customer'],
          business: ['business_owner'],
          staff: ['staff'],
          admin: ['platform_admin'],
        };
        const allowedRoles = expectedRoles[currentRole] || ['customer'];

        if (user?.role && !allowedRoles.includes(user.role)) {
          await useAuthStore.getState().signOut();
          Alert.alert('Yetki Hatası', 'Bu giriş kapısı rolünüz için uygun değil.');
          return;
        }

        // Save Account Logic - Read FULL list, not filtered
        if (rememberMe && user) {
          const newAccount = { email: data.email, role: user.role, lastUsed: Date.now() };
          // Get ALL saved accounts, not just filtered ones
          const allSaved = await AsyncStorage.getItem('saved_accounts');
          let allAccounts = allSaved ? JSON.parse(allSaved) : [];
          allAccounts = allAccounts.filter((a: any) => a.email !== data.email);
          allAccounts.unshift(newAccount);
          if (allAccounts.length > 10) allAccounts.pop();
          await AsyncStorage.setItem('saved_accounts', JSON.stringify(allAccounts));
        }

        // Routing Logic
        if (user?.role === 'business_owner') {
          router.replace('/(business)/(tabs)/dashboard');
        } else if (user?.role === 'staff') {
          router.replace('/(staff)/(tabs)/dashboard');
        } else if (user?.role === 'platform_admin') {
          router.replace('/(platform)/(tabs)/dashboard');
        } else {
          router.replace('/(customer)/(tabs)/home');
        }
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
    <ScreenWrapper noPadding>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          className="flex-1"
        >
          {/* Hero Section */}
          <View className="h-[35vh] w-full bg-[#121212] relative overflow-hidden">
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5lEdXnk9GeBqiulCH5gRImC_H_JKt0va6P0Wj9mnBInP5KPFPCoPbC0g6O4dGMru0z5DZ8y1ee92aIUOoSi8dxR4omQ9O5x3L59aBfVHR1mH1x_yEC-rYnRXkpyT1B5J7N22W2Qfivk0f67exSZdA_2IaDVyiih7e3rRzkyhsePbr3zmPp241CPq8wvdaDdGwTJYNO4GQBBVdQ8w4E6PVGnCUekLvGj_AJfFOGHc4TaPTl-_pxRdc9ybU1AJX6mhOtCYufc0eg3_o" }}
              className="w-full h-full opacity-60"
              resizeMode="cover"
            />
            <View className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/60 to-transparent" />

            <Pressable
              onPress={() => router.back()}
              className="absolute top-12 left-6 w-10 h-10 rounded-full bg-white/10 items-center justify-center backdrop-blur-md"
            >
              <MaterialIcons name="arrow-back" size={20} color="white" />
            </Pressable>

            <View className="absolute top-12 right-6 w-12 h-12 rounded-full border border-primary/30 items-center justify-center bg-black/20 backdrop-blur-md">
              <RoleIcon size={24} color={roleConfig.color} />
            </View>
          </View>

          <View className="flex-1 px-6 -mt-10 bg-[#121212] rounded-t-[32px] pt-8 pb-10">
            {/* Title & Subtitle */}
            <Text className="text-white text-[32px] font-serif font-medium leading-[40px]">
              {currentRole === 'customer' ? (
                <>
                  Lüks Deneyime{'\n'}
                  <Text className="text-primary italic font-serif">Hoş Geldiniz</Text>
                </>
              ) : (
                roleConfig.title
              )}
            </Text>

            <Text className="text-text-muted text-sm mt-3 leading-6 mb-8">
              {roleConfig.subtitle}
            </Text>

            {/* Saved Accounts Dropdown */}
            {savedAccounts.length > 0 && (
              <View className="mb-4 z-50">
                <Text className="text-text-muted text-xs font-semibold mb-2 ml-1">KAYITLI HESAPLAR</Text>

                <View className="relative">
                  <Pressable
                    onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`flex-row items-center justify-between bg-[#1E1E1E] border border-white/10 rounded-xl px-4 h-12 ${isDropdownOpen ? 'border-primary' : ''}`}
                  >
                    <View className="flex-row items-center gap-3">
                      {/* We need to get current email value from form to display correct badge */}
                      <Controller
                        control={control}
                        name="email"
                        render={({ field: { value } }) => (
                          <View className="flex-row items-center gap-3">
                            <View className="w-6 h-6 rounded-full bg-primary/20 items-center justify-center border border-primary/50">
                              <Text className="text-primary text-xs font-bold">
                                {savedAccounts.find(a => a.email === value) ? getRoleBadge(savedAccounts.find(a => a.email === value).role) : '?'}
                              </Text>
                            </View>
                            <Text className="text-white font-medium text-sm">
                              {value || "Kayıtlı bir hesap seçin"}
                            </Text>
                          </View>
                        )}
                      />
                    </View>
                    <ChevronDown size={20} color={isDropdownOpen ? COLORS.primary.DEFAULT : "#6a7785"} />
                  </Pressable>

                  {isDropdownOpen && (
                    <View className="absolute top-14 left-0 right-0 bg-[#1E1E1E] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black z-50">
                      {savedAccounts.map((account, index) => (
                        // Using Controller to read email value for styling is tricky inside map
                        // Instead we trust the form state is handled by setValue
                        <View
                          key={index}
                          className={`flex-row items-center justify-between border-b border-white/5 bg-[#1E1E1E]`}
                        >
                          <Pressable
                            onPress={() => {
                              setValue('email', account.email);
                              setIsDropdownOpen(false);
                            }}
                            className="flex-1 flex-row items-center gap-3 p-3 active:bg-white/5"
                          >
                            <View className="w-8 h-8 rounded-full bg-[#121212] items-center justify-center border border-white/10">
                              <Text className="text-primary font-bold text-sm">
                                {getRoleBadge(account.role)}
                              </Text>
                            </View>
                            <View className="flex-1">
                              <Text className={`text-sm font-medium text-white`}>
                                {account.email}
                              </Text>
                              <Text className="text-text-muted text-[10px]">
                                {getRoleLabel(account.role)}
                              </Text>
                            </View>
                          </Pressable>
                          <Pressable
                            onPress={() => {
                              Alert.alert(
                                'Hesabı Sil',
                                `${account.email} hesabını listeden kaldırmak istiyor musunuz?`,
                                [
                                  { text: 'İptal', style: 'cancel' },
                                  { text: 'Sil', style: 'destructive', onPress: () => removeAccount(account.email) }
                                ]
                              );
                            }}
                            className="p-3 active:bg-red-500/10"
                          >
                            <Trash2 size={18} color="#EF4444" />
                          </Pressable>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            )}

            <View className="gap-2">
              {/* Email Input */}
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="E-POSTA ADRESİ"
                    placeholder="ornek@email.com"
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    icon={<MaterialIcons name="mail-outline" size={20} color="#6a7785" />}
                    error={errors.email?.message}
                  />
                )}
              />

              {/* Password Input */}
              <View className="relative">
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      label="ŞİFRE"
                      placeholder="••••••••"
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry={!showPassword}
                      icon={<MaterialIcons name="lock-outline" size={20} color="#6a7785" />}
                      error={errors.password?.message}
                    />
                  )}
                />
                <Pressable
                  className="absolute right-4 top-[38px]"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} color="#6a7785" /> : <Eye size={20} color="#6a7785" />}
                </Pressable>
              </View>

              <View className="flex-row items-center justify-between mt-1 mb-6">
                <Pressable
                  className="flex-row items-center gap-2"
                  onPress={() => setRememberMe(!rememberMe)}
                >
                  <MaterialIcons
                    name={rememberMe ? "check-box" : "check-box-outline-blank"}
                    size={20}
                    color={rememberMe ? COLORS.primary.DEFAULT : "#6a7785"}
                  />
                  <Text className="text-text-muted text-xs">Beni Hatırla</Text>
                </Pressable>

                <Pressable>
                  <Text className="text-primary text-xs font-semibold">Şifremi Unuttum?</Text>
                </Pressable>
              </View>

              <Button
                label="Giriş Yap"
                onPress={handleSubmit(onSubmit)}
                loading={loading}
                icon={<ArrowRight size={20} color="black" />}
              />
            </View>

            {currentRole !== 'admin' && (
              <View className="mt-auto mb-8 flex-row justify-center items-center gap-1">
                <Text className="text-text-muted text-sm">Hesabınız yok mu?</Text>
                <Pressable onPress={() => router.push('/(auth)/customer-register')}>
                  <Text className="text-primary text-sm font-bold">Kayıt Ol</Text>
                </Pressable>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

