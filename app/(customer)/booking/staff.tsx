import { useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Star, Check } from 'lucide-react-native';
import { useBookingStore } from '@/stores/bookingStore';
import { useBusinessStore } from '@/stores/businessStore';
import type { Staff } from '@/types';
import { COLORS } from '@/constants/theme';

export default function StaffSelectionScreen() {
  const router = useRouter();
  const { barber, staff: selectedStaff, setStaff } = useBookingStore();
  const { barberData, loading, fetchStaff } = useBusinessStore();

  const staff = barber ? barberData[barber.id]?.staff.filter(s => s.isActive) || [] : [];

  useEffect(() => {
    if (!barber) {
      router.replace('/(customer)/home');
      return;
    }
    loadStaff();
  }, [barber]);

  const loadStaff = async () => {
    if (!barber) return;
    await fetchStaff(barber.id);
  };

  const handleSelectStaff = (staff: Staff) => {
    setStaff(staff);
    router.push('/(customer)/booking/datetime');
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={COLORS.primary.DEFAULT} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-4 py-4 border-b border-background-card">
        <Pressable onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color={COLORS.text.DEFAULT} />
        </Pressable>
        <View className="flex-1">
          <Text className="text-white text-xl font-poppins-bold">Berber Seçin</Text>
          <Text className="text-text-secondary text-sm font-poppins">{barber?.name}</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
        <Text className="text-text-secondary font-poppins mb-4">
          İşleminizi yapacak berberi seçin
        </Text>

        {staff.map((member) => {
          const isSelected = selectedStaff?.id === member.id;
          return (
            <Pressable
              key={member.id}
              onPress={() => handleSelectStaff(member)}
              className="bg-background-card rounded-2xl p-4 mb-3 flex-row items-center"
              style={isSelected ? { borderWidth: 2, borderColor: COLORS.primary.DEFAULT } : {}}
            >
              <Image
                source={{ uri: member.avatar }}
                className="w-20 h-20 rounded-2xl"
              />

              <View className="flex-1 ml-4">
                <Text className="text-white text-lg font-poppins-bold mb-1">
                  {member.name}
                </Text>

                <View className="flex-row items-center mb-2">
                  <Star size={14} color={COLORS.primary.DEFAULT} fill={COLORS.primary.DEFAULT} />
                  <Text className="text-white font-poppins-semibold ml-1">
                    {member.rating.toFixed(1)}
                  </Text>
                  <Text className="text-text-secondary text-sm font-poppins ml-1">
                    ({member.reviewCount})
                  </Text>
                </View>

                <View className="flex-row flex-wrap">
                  {member.expertise.slice(0, 2).map((skill, index) => (
                    <View
                      key={index}
                      className="px-2 py-1 rounded-md mr-2 mb-1"
                      style={{ backgroundColor: COLORS.background.DEFAULT }}
                    >
                      <Text className="text-primary text-xs font-poppins">
                        {skill}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {isSelected && (
                <View
                  className="w-8 h-8 rounded-full items-center justify-center ml-2"
                  style={{ backgroundColor: COLORS.primary.DEFAULT }}
                >
                  <Check size={20} color={COLORS.background.DEFAULT} />
                </View>
              )}
            </Pressable>
          );
        })}

        {staff.length === 0 && (
          <View className="flex-1 items-center justify-center py-12">
            <Text className="text-text-secondary font-poppins">
              Şu anda müsait berber bulunmuyor
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
