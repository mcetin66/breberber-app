
import { View, Text, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function RoleSelectionScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark justify-center">

      {/* Abstract Background Pattern */}
      <View className="absolute inset-0 z-0 opacity-40">
        <Image
          source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUbt2vZPWm4ZJWqr74byYYO1h3sPKxiPNAEcnp_-IdWYBP-yh7jB3pJiqJ4nD5ZeZFhJPPTMMegB7cS48LP_FUGv2Qst-AAh-Uc0GJvQ3aDFzDTTF6tBnJpTLHxdW48to615FtJjGeBea19Mjp6YodpjBTC3XdhLx9kx2RbEAviEt1surcXiSaqP2W679wYOeGnjNDgmHZ6VeYQVMRY3zBVhQGLatExpVhwkm9WoksmoBgmzmOC_qRGZz11HXjP6WsOlJi6h5Mfn8' }}
          className="w-full h-full"
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(19, 127, 236, 0.15)', 'transparent']}
          className="absolute inset-0"
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.5 }}
        />
      </View>

      <View className="relative z-10 w-full max-w-md mx-auto px-6 py-8 flex-1 items-center justify-between min-h-[600px]">
        {/* Top Section */}
        <View className="items-center w-full mt-10">
          <Pressable
            onPress={() => router.push('/(auth)/admin-login')}
            className="items-center justify-center mb-6 active:scale-95 transition-transform"
          >
            <View className="w-16 h-16 bg-[#1a232d] border border-white/10 rounded-2xl items-center justify-center shadow-lg mb-2">
              <MaterialIcons name="admin-panel-settings" size={32} color={COLORS.primary.DEFAULT} />
            </View>
            <Text className="text-gray-500 text-xs font-medium">Admin Girişi</Text>
          </Pressable>
          <Text className="text-white tracking-tight text-[32px] font-bold leading-tight text-center">Hoş Geldiniz</Text>
          <Text className="text-gray-400 text-base font-normal leading-normal pt-2 text-center max-w-[280px]">
            Lütfen devam etmek için rolünüzü seçin.
          </Text>
        </View>

        {/* Middle Section: Role Selection Cards */}
        <View className="w-full gap-4 my-auto py-8">
          {/* Customer Button */}
          <Pressable
            onPress={() => router.push('/(auth)/login')}
            className="w-full bg-[#1a232d] active:bg-[#1e2a36] border border-white/5 active:border-primary/50 rounded-xl p-1 overflow-hidden"
          >
            <View className="flex-row items-center p-4">
              <View className="w-12 h-12 items-center justify-center rounded-full bg-[#253341] active:bg-primary">
                <MaterialIcons name="person" size={24} color={COLORS.primary.DEFAULT} />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-white text-lg font-bold leading-tight">Müşteri</Text>
                <Text className="text-gray-400 text-sm mt-0.5">Müşteri Olarak Devam Et</Text>
              </View>
              <MaterialIcons name="arrow-forward" size={24} color="#4B5563" />
            </View>
          </Pressable>

          {/* Business Button */}
          <Pressable
            onPress={() => router.push('/business-role')}
            className="w-full bg-[#1a232d] active:bg-[#1e2a36] border border-white/5 active:border-primary/50 rounded-xl p-1 overflow-hidden"
          >
            <View className="flex-row items-center p-4">
              <View className="w-12 h-12 items-center justify-center rounded-full bg-[#253341] active:bg-primary">
                <MaterialIcons name="storefront" size={24} color={COLORS.primary.DEFAULT} />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-white text-lg font-bold leading-tight">Berber / İşletme</Text>
                <Text className="text-gray-400 text-sm mt-0.5">İşletme Olarak Devam Et</Text>
              </View>
              <MaterialIcons name="arrow-forward" size={24} color="#4B5563" />
            </View>
          </Pressable>
        </View>

        {/* Footer */}
        <View className="w-full items-center pb-6">
          <Text className="text-xs text-gray-500 font-medium text-center">
            Devam ederek <Text className="text-gray-300">Kullanım Koşulları</Text> ve <Text className="text-gray-300">Gizlilik Politikası</Text>'nı kabul etmiş olursunuz.
          </Text>
        </View>
      </View>
    </View>
  );
}
