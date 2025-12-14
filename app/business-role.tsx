import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { UserCog, Users } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuthStore } from '@/stores/authStore';
import { COLORS } from '@/constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function BusinessRoleScreen() {
  const router = useRouter();
  const setSelectedRole = useAuthStore(state => state.setSelectedRole);

  const handleSubRoleSelect = (subRole: 'owner' | 'staff') => {
    setSelectedRole('business');
    router.push('/(auth)/login');
  };

  return (
    <LinearGradient
      colors={[COLORS.background.DEFAULT, COLORS.background.card]}
      className="flex-1"
      style={{ flex: 1 }}
    >
      <View className="flex-1 justify-center items-center px-6">
        <Animated.View
          entering={FadeInDown.delay(200).duration(600)}
          className="items-center mb-16"
        >
          <Text className="text-white text-3xl font-poppins-bold text-center mb-2">
            İşletme Rolü
          </Text>
          <Text className="text-text-secondary text-base font-poppins text-center">
            Lütfen işletmedeki rolünüzü seçin
          </Text>
        </Animated.View>

        <View className="w-full gap-4">
          <AnimatedPressable
            entering={FadeInDown.delay(400).duration(600)}
            onPress={() => handleSubRoleSelect('owner')}
            className="bg-background-card border border-white/5 rounded-2xl p-6 active:scale-95 transition-transform"
          >
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center">
                <UserCog size={24} color={COLORS.primary.DEFAULT} />
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-white text-lg font-poppins-bold">
                  İşletme Sahibi
                </Text>
                <Text className="text-text-secondary text-sm font-poppins mt-1">
                  Tam yönetim yetkisi
                </Text>
              </View>
              <Text className="text-text-muted">→</Text>
            </View>
          </AnimatedPressable>

          <AnimatedPressable
            entering={FadeInDown.delay(500).duration(600)}
            onPress={() => handleSubRoleSelect('staff')}
            className="bg-background-card border border-white/5 rounded-2xl p-6 active:scale-95 transition-transform"
          >
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center">
                <Users size={24} color={COLORS.primary.DEFAULT} />
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-white text-lg font-poppins-bold">
                  Çalışan / Personel
                </Text>
                <Text className="text-text-secondary text-sm font-poppins mt-1">
                  Kısıtlı yetki
                </Text>
              </View>
              <Text className="text-text-muted">→</Text>
            </View>
          </AnimatedPressable>
        </View>
      </View>
    </LinearGradient>
  );
}
