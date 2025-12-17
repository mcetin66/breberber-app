import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Image, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { ChevronDown, User, Trash2, Eye, EyeOff, Building2, UserCog, Shield, Users } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { useAuthStore } from '@/stores/authStore';

// Role-based visual configuration
const ROLE_CONFIG: Record<string, { icon: any; title: string; subtitle: string; color: string; badge?: string }> = {
  customer: {
    icon: User,
    title: 'Tekrar Hoşgeldiniz',
    subtitle: 'Randevularınızı yönetmek için giriş yapın.',
    color: COLORS.primary.DEFAULT,
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
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('@isletme.com');

  // Get role config or default to customer
  const currentRole = (role && ROLE_CONFIG[role]) ? role : 'customer';
  const roleConfig = ROLE_CONFIG[currentRole];
  const RoleIcon = roleConfig.icon;

  const [rememberMe, setRememberMe] = useState(true);
  const [password, setPassword] = useState('password123');
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('email');
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState<any[]>([]);
  const [showAccountsDropdown, setShowAccountsDropdown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    loadSavedAccounts();
  }, []);

  const loadSavedAccounts = async () => {
    try {
      const saved = await AsyncStorage.getItem('saved_accounts');
      if (saved) setSavedAccounts(JSON.parse(saved));
    } catch (e) { }
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'signup') {
      router.replace('/(auth)/register');
    } else {
      setActiveTab('login');
    }
  };

  useEffect(() => {
    loadSavedEmail();
  }, []);

  const loadSavedEmail = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem('saved_email');
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    } catch (error) {
      console.log('Error loading saved email:', error);
    }
  };

  const handleLogin = async () => {
    if (loginMethod === 'phone') {
      Alert.alert('Bilgi', 'Telefon ile giriş şuan simülasyon modundadır. E-posta ile giriş yapmayı deneyiniz.');
    } else {
      if (!email || !password) {
        Alert.alert('Hata', 'Lütfen e-posta ve şifrenizi giriniz.');
        return;
      }
      setLoading(true);
      try {
        if (rememberMe) {
          await AsyncStorage.setItem('saved_email', email);

          const accounts = savedAccounts.filter(a => a.email !== email);
          accounts.unshift({ email, lastUsed: Date.now() });
          if (accounts.length > 10) accounts.pop();

          setSavedAccounts(accounts);
          await AsyncStorage.setItem('saved_accounts', JSON.stringify(accounts));
        } else {
          await AsyncStorage.removeItem('saved_email');
        }

        const result = await signIn(email, password);
        if (result.success) {
          const user = useAuthStore.getState().user;
          console.log('🔐 Login successful - User role:', user?.role, 'Expected role:', currentRole);

          // Role validation - check if user's role matches the expected login screen
          const expectedRoles: Record<string, string[]> = {
            customer: ['customer'],
            business: ['business_owner'],
            staff: ['staff'],
            admin: ['platform_admin'],
          };

          const allowedRoles = expectedRoles[currentRole] || ['customer'];

          if (user?.role && !allowedRoles.includes(user.role)) {
            // Role mismatch - sign out and show error
            console.log('❌ Role mismatch! User role:', user.role, 'Expected:', allowedRoles);
            await useAuthStore.getState().signOut();

            const roleNames: Record<string, string> = {
              customer: 'Müşteri',
              business_owner: 'İşletme Sahibi',
              staff: 'Personel',
              platform_admin: 'Platform Yöneticisi',
            };

            Alert.alert(
              'Yetki Hatası',
              `Bu giriş ekranı ${currentRole === 'admin' ? 'platform yöneticileri' : currentRole === 'business' ? 'işletme sahipleri' : currentRole === 'staff' ? 'personeller' : 'müşteriler'} içindir. Hesabınız "${roleNames[user.role] || user.role}" olarak kayıtlı. Lütfen doğru giriş ekranını kullanın.`
            );
            return;
          }

          // Updated role checking logic to match standard roles
          if (user?.role === 'business_owner') {
            console.log('➡️ Redirecting to business dashboard');
            router.replace('/(business)/(tabs)/dashboard');
          } else if (user?.role === 'staff') {
            console.log('➡️ Redirecting to staff dashboard');
            router.replace('/(staff)/(tabs)/dashboard');
          } else if (user?.role === 'platform_admin') {
            console.log('➡️ Redirecting to platform dashboard');
            router.replace('/(platform)/dashboard');
          } else {
            console.log('➡️ Redirecting to customer home (default)');
            router.replace('/(customer)/home');
          }
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-[#101922]">
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

        <View className="px-6 pt-4 pb-6">
          {/* Role Badge */}
          {roleConfig.badge && (
            <View
              className="self-start px-3 py-1.5 rounded-full mb-3 flex-row items-center gap-2"
              style={{ backgroundColor: roleConfig.color + '20' }}
            >
              <RoleIcon size={14} color={roleConfig.color} />
              <Text
                className="text-xs font-bold tracking-wider"
                style={{ color: roleConfig.color }}
              >
                {roleConfig.badge}
              </Text>
            </View>
          )}

          {/* Role Icon for customers (no badge) */}
          {!roleConfig.badge && (
            <View
              className="w-14 h-14 rounded-2xl items-center justify-center mb-4"
              style={{ backgroundColor: roleConfig.color + '20' }}
            >
              <RoleIcon size={28} color={roleConfig.color} />
            </View>
          )}

          <Text className="text-white text-[32px] font-bold leading-tight">{roleConfig.title}</Text>
          <Text className="text-[#9dabb9] text-base font-normal mt-2">{roleConfig.subtitle}</Text>
        </View>

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

        <View className="flex-1 px-6 gap-6">

          {loginMethod === 'phone' ? (
            <>
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
              <View className="gap-2 z-50">
                <Text className="text-white text-base font-medium">E-posta Adresi</Text>
                <View>
                  <TextInput
                    className="h-14 bg-[#283039] rounded-xl text-white px-4 text-base font-normal pr-12"
                    placeholder="ornek@email.com"
                    placeholderTextColor="#9dabb9"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                  {savedAccounts.length > 0 && (
                    <Pressable
                      onPress={() => setShowAccountsDropdown(!showAccountsDropdown)}
                      className="absolute right-0 top-0 h-14 w-14 items-center justify-center"
                    >
                      <ChevronDown size={20} color="#9dabb9" />
                    </Pressable>
                  )}

                  {showAccountsDropdown && savedAccounts.length > 0 && (
                    <View className="absolute top-16 left-0 right-0 bg-[#1E293B] rounded-xl border border-white/10 p-2 shadow-xl z-50">
                      {savedAccounts.map((acc, index) => (
                        <Pressable
                          key={index}
                          onPress={() => {
                            setEmail(acc.email);
                            setShowAccountsDropdown(false);
                          }}
                          className="flex-row items-center p-3 rounded-lg active:bg-white/5 border-b border-white/5 last:border-0"
                        >
                          <View className="w-8 h-8 rounded-full bg-primary/20 items-center justify-center mr-3">
                            <User size={16} color={COLORS.primary.DEFAULT} />
                          </View>
                          <View className="flex-1">
                            <Text className="text-white font-medium">{acc.email}</Text>
                            <Text className="text-slate-500 text-xs">Son giriş: {new Date(acc.lastUsed).toLocaleDateString()}</Text>
                          </View>
                          <Pressable
                            onPress={(e) => {
                              e.stopPropagation();
                              const newAccounts = savedAccounts.filter(a => a.email !== acc.email);
                              setSavedAccounts(newAccounts);
                              AsyncStorage.setItem('saved_accounts', JSON.stringify(newAccounts));
                            }}
                            className="p-2"
                          >
                            <Trash2 size={16} color="#ef4444" />
                          </Pressable>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              <View className="gap-2">
                <Text className="text-white text-base font-medium">Şifre</Text>
                <View className="relative justify-center">
                  <TextInput
                    className="h-14 bg-[#283039] rounded-xl text-white px-4 text-base font-normal pr-12"
                    placeholder="••••••••"
                    placeholderTextColor="#9dabb9"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    className="absolute right-0 h-14 w-14 items-center justify-center"
                  >
                    {showPassword ? <EyeOff size={20} color="#9dabb9" /> : <Eye size={20} color="#9dabb9" />}
                  </Pressable>
                </View>
              </View>
            </>
          )}

          <View className="flex-row items-center justify-between">
            <Pressable
              className="flex-row items-center gap-2"
              onPress={() => setRememberMe(!rememberMe)}
            >
              <MaterialIcons
                name={rememberMe ? "check-box" : "check-box-outline-blank"}
                size={22}
                color={rememberMe ? COLORS.primary.DEFAULT : "#9dabb9"}
              />
              <Text className={`${rememberMe ? 'text-white' : 'text-[#9dabb9]'} text-sm font-medium`}>
                Beni Hatırla
              </Text>
            </Pressable>

            <Pressable onPress={() => setLoginMethod(loginMethod === 'phone' ? 'email' : 'phone')}>
              <Text className="text-primary text-sm font-medium">
                {loginMethod === 'phone' ? 'E-posta ile giriş' : 'Telefon ile giriş'}
              </Text>
            </Pressable>
          </View>

          <Pressable
            onPress={handleLogin}
            disabled={loading}
            className={`w-full h-12 bg-primary rounded-full items-center justify-center shadow-lg shadow-blue-500/30 active:scale-[0.98] mt-2 ${loading ? 'opacity-70' : ''}`}
          >
            <Text className="text-white font-bold text-base">
              {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </Text>
          </Pressable>

          <View className="flex-row items-center py-2">
            <View className="flex-1 border-t border-[#e6e8eb] dark:border-[#283039]" />
            <Text className="mx-4 text-[#9dabb9] text-xs font-medium uppercase">Veya şununla devam et</Text>
            <View className="flex-1 border-t border-[#e6e8eb] dark:border-[#283039]" />
          </View>

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
    </TouchableWithoutFeedback>
  );
}
