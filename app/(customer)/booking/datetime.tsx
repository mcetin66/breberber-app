import { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, Clock } from 'lucide-react-native';
import { useBookingStore } from '@/stores/bookingStore';
import { COLORS } from '@/constants/theme';
import { BaseHeader } from '@/components/shared/layouts/BaseHeader';

const MOCK_DATES = [
  { date: '2024-12-13', dayName: 'Cuma', day: '13', month: 'Ara' },
  { date: '2024-12-14', dayName: 'Cumartesi', day: '14', month: 'Ara' },
  { date: '2024-12-15', dayName: 'Pazar', day: '15', month: 'Ara' },
  { date: '2024-12-16', dayName: 'Pazartesi', day: '16', month: 'Ara' },
  { date: '2024-12-17', dayName: 'Salı', day: '17', month: 'Ara' },
];

const MOCK_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
];

export default function DateTimeSelectionScreen() {
  const router = useRouter();
  const { barber, staff, selectedDate, selectedSlot, setDateTime, totalDuration, totalPrice } = useBookingStore();

  const [localDate, setLocalDate] = useState(selectedDate || '');
  const [localSlot, setLocalSlot] = useState(selectedSlot || '');

  if (!barber || !staff) {
    router.replace('/(customer)/(tabs)/home');
    return null;
  }

  const handleContinue = () => {
    if (localDate && localSlot) {
      setDateTime(localDate, localSlot);
      router.push('/(customer)/booking/confirm');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <BaseHeader
        title="Tarih & Saat"
        subtitle={barber?.name}
        showBack
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-4">
          <View className="flex-row items-center mb-3">
            <Calendar size={20} color={COLORS.primary.DEFAULT} />
            <Text className="text-white text-lg font-poppins-bold ml-2">Tarih Seçin</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
            {MOCK_DATES.map((item) => {
              const isSelected = localDate === item.date;
              return (
                <Pressable
                  key={item.date}
                  onPress={() => setLocalDate(item.date)}
                  className="mr-3 rounded-2xl p-4 w-24 items-center"
                  style={{
                    backgroundColor: isSelected ? COLORS.primary.DEFAULT : COLORS.background.card,
                  }}
                >
                  <Text
                    className="text-sm font-poppins mb-1"
                    style={{ color: isSelected ? COLORS.background.DEFAULT : COLORS.text.secondary }}
                  >
                    {item.dayName}
                  </Text>
                  <Text
                    className="text-2xl font-poppins-bold mb-1"
                    style={{ color: isSelected ? COLORS.background.DEFAULT : COLORS.text.DEFAULT }}
                  >
                    {item.day}
                  </Text>
                  <Text
                    className="text-xs font-poppins"
                    style={{ color: isSelected ? COLORS.background.DEFAULT : COLORS.text.secondary }}
                  >
                    {item.month}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {localDate && (
            <>
              <View className="flex-row items-center mb-3">
                <Clock size={20} color={COLORS.primary.DEFAULT} />
                <Text className="text-white text-lg font-poppins-bold ml-2">Saat Seçin</Text>
              </View>

              <View className="flex-row flex-wrap">
                {MOCK_SLOTS.map((slot) => {
                  const isSelected = localSlot === slot;
                  return (
                    <Pressable
                      key={slot}
                      onPress={() => setLocalSlot(slot)}
                      className="rounded-xl px-4 py-3 mb-3 mr-3"
                      style={{
                        backgroundColor: isSelected ? COLORS.primary.DEFAULT : COLORS.background.card,
                      }}
                    >
                      <Text
                        className="font-poppins-semibold"
                        style={{ color: isSelected ? COLORS.background.DEFAULT : COLORS.text.DEFAULT }}
                      >
                        {slot}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {localDate && localSlot && (
        <View className="px-4 py-4 bg-background-card border-t border-background">
          <View className="flex-row justify-between items-center mb-3">
            <View>
              <Text className="text-text-secondary text-sm font-poppins">
                Seçilen randevu
              </Text>
              <Text className="text-white font-poppins-semibold mt-1">
                {MOCK_DATES.find(d => d.date === localDate)?.dayName}, {localSlot}
              </Text>
              <Text className="text-primary text-lg font-poppins-bold mt-1">
                ₺{totalPrice} • {totalDuration} dk
              </Text>
            </View>
          </View>

          <Pressable
            onPress={handleContinue}
            className="rounded-xl py-4"
            style={{ backgroundColor: COLORS.primary.DEFAULT }}
          >
            <Text className="text-background text-center text-lg font-poppins-bold">
              Devam Et
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
