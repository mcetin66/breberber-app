
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { PremiumBackground } from '@/components/ui/PremiumBackground';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

export default function RoleSelectionScreen() {
  const router = useRouter();

  return (
    <PremiumBackground className="justify-center items-center">
      <View className="w-full max-w-md mx-auto px-6 py-8 flex-1 items-center justify-between min-h-[600px]">
        {/* Top Section */}
        <Animated.View entering={FadeInDown.delay(100).springify()} className="items-center w-full mt-20">
          {/* Logo or Icon */}
          <View className="w-24 h-24 bg-background-card border border-primary/20 rounded-3xl items-center justify-center shadow-lg mb-8">
            <MaterialIcons name="content-cut" size={48} color={COLORS.primary.DEFAULT} />
          </View>

          <Text className="text-white tracking-tight text-[32px] font-bold leading-tight text-center">Hoş Geldiniz</Text>
          <Text className="text-gray-400 text-base font-normal leading-normal pt-3 text-center max-w-[280px]">
            Premium kuaför deneyimine başlamak için rolünüzü seçin.
          </Text>
        </Animated.View>

        {/* Middle Section: Role Selection Cards */}
        <View className="w-full gap-5 my-auto py-8">
          {/* Customer Button */}
          <Animated.View entering={FadeInUp.delay(200).springify()}>
            <Pressable
              onPress={() => router.push({ pathname: '/(auth)/login', params: { role: 'customer' } })}
              className="w-full bg-background-card active:bg-gray-800 border border-white/5 active:border-primary/50 rounded-2xl p-1 overflow-hidden"
            >
              <View className="flex-row items-center p-5">
                <View className="w-14 h-14 items-center justify-center rounded-full bg-white/5 border border-white/5">
                  <MaterialIcons name="person" size={28} color={COLORS.primary.DEFAULT} />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-white text-lg font-bold leading-tight">Müşteri</Text>
                  <Text className="text-gray-400 text-sm mt-0.5">Randevu al ve keşfet</Text>
                </View>
                <MaterialIcons name="arrow-forward" size={20} color={COLORS.text.muted} />
              </View>
            </Pressable>
          </Animated.View>

          {/* Business Button */}
          <Animated.View entering={FadeInUp.delay(300).springify()}>
            <Pressable
              onPress={() => router.push('/business-role')}
              className="w-full bg-background-card active:bg-gray-800 border border-white/5 active:border-primary/50 rounded-2xl p-1 overflow-hidden"
            >
              <View className="flex-row items-center p-5">
                <View className="w-14 h-14 items-center justify-center rounded-full bg-white/5 border border-white/5">
                  <MaterialIcons name="storefront" size={28} color={COLORS.primary.DEFAULT} />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-white text-lg font-bold leading-tight">İşletme</Text>
                  <Text className="text-gray-400 text-sm mt-0.5">Salonunu yönet ve büyüt</Text>
                </View>
                <MaterialIcons name="arrow-forward" size={20} color={COLORS.text.muted} />
              </View>
            </Pressable>
          </Animated.View>
        </View>

        {/* Footer */}
        <Animated.View entering={FadeInUp.delay(400)} className="w-full items-center pb-8 gap-6">
          <Pressable onPress={() => router.push({ pathname: '/(auth)/login', params: { role: 'admin' } })} hitSlop={20}>
            <Text className="text-xs text-gray-700 font-medium tracking-wide uppercase">Admin Girişi</Text>
          </Pressable>

          <Text className="text-xs text-gray-500 font-medium text-center opacity-60">
            Devam ederek <Text className="text-primary">Kullanım Koşulları</Text>'nı kabul edersiniz.
          </Text>
        </Animated.View>
      </View>
    </PremiumBackground>
  );
}
