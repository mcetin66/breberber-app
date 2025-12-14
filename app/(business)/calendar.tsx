import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { useBusinessStore } from '@/stores/businessStore';
import { useAuthStore } from '@/stores/authStore';

const DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
// Generate hours dynamically or keep simple
const HOURS = Array.from({ length: 11 }, (_, i) => 9 + i); // 9 to 19

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());

  const { user } = useAuthStore();
  const { fetchAppointments, getAppointments, loading } = useBusinessStore();

  // Assuming user.barberId exists for business users.
  // We need to fetch appointments for the selected date (or whole month).
  // For simplicity, let's fetch for the specific date when changed, or fetch all active.
  const barberId = user?.barberId || user?.id; // Fallback if schema differs

  useEffect(() => {
    if (barberId) {
      // Fetch for current month/date. 
      // API supports 'date' filter. Let's construct YYYY-MM-DD
      const dateStr = `2024-12-${selectedDate.toString().padStart(2, '0')}`; // Hardcoded Year/Month for demo or use real
      fetchAppointments(barberId, dateStr);
    }
  }, [selectedDate, barberId]);

  const appointments = barberId ? getAppointments(barberId) : [];

  // Filter for display (if store has all, filtering here is safe. If store has only valid date, also safe)
  // Our fetch implementation above replaced the array, so it should be just these appointments.

  const getDaysArray = () => {
    // Just returning a static range around today for demo
    return [13, 14, 15, 16, 17, 18, 19];
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-4 py-4">
        <Text className="text-white text-2xl font-poppins-bold mb-4">Takvim</Text>

        <View className="flex-row items-center justify-between mb-4">
          <Pressable className="p-2">
            <ChevronLeft size={24} color={COLORS.text.DEFAULT} />
          </Pressable>
          <Text className="text-white text-lg font-poppins-bold">Aralık 2024</Text>
          <Pressable className="p-2">
            <ChevronRight size={24} color={COLORS.text.DEFAULT} />
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          {getDaysArray().map((day, idx) => (
            <Pressable
              key={day}
              onPress={() => setSelectedDate(day)}
              className="mr-3 rounded-2xl p-4 w-20 items-center"
              style={{ backgroundColor: selectedDate === day ? COLORS.primary.DEFAULT : COLORS.background.card }}
            >
              <Text
                className="text-sm font-poppins mb-1"
                style={{ color: selectedDate === day ? COLORS.background.DEFAULT : COLORS.text.secondary }}
              >
                {DAYS[idx % 7]}
              </Text>
              <Text
                className="text-2xl font-poppins-bold"
                style={{ color: selectedDate === day ? COLORS.background.DEFAULT : COLORS.text.DEFAULT }}
              >
                {day}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="bg-background-card rounded-2xl p-4 mb-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-white text-lg font-poppins-bold">
              Randevular ({appointments.length})
            </Text>
            {loading && <ActivityIndicator size="small" color={COLORS.primary.DEFAULT} />}
          </View>

          {appointments.length === 0 && !loading ? (
            <Text className="text-text-muted font-poppins py-4 text-center">Bu tarihte randevu yok.</Text>
          ) : (
            appointments.map((apt: any, idx) => (
              <View
                key={apt.id || idx}
                className={`py-3 ${idx < appointments.length - 1 ? 'border-b border-background' : ''}`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-white font-poppins-bold mb-1">{apt.customerName || 'Müşteri'}</Text>
                    <Text className="text-text-secondary text-sm font-poppins">
                      {apt.serviceName || 'Hizmet'} • {apt.staffName || 'Personel'}
                    </Text>
                  </View>
                  <View
                    className="px-3 py-2 rounded-xl"
                    style={{ backgroundColor: COLORS.primary.DEFAULT }}
                  >
                    <Text className="text-background font-poppins-bold">{apt.startTime ? apt.startTime.slice(0, 5) : ''}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        <View className="bg-background-card rounded-2xl p-4 mb-4">
          <Text className="text-white text-lg font-poppins-bold mb-3">Zaman Çizelgesi</Text>
          {HOURS.map((hour) => {
            const timeStr = `${hour}:00`;
            // Simple match for hour start
            const apt = appointments.find((a: any) => a.startTime?.startsWith(`${hour}:`));

            return (
              <View key={hour} className="flex-row items-center py-2 border-b border-background">
                <Text className="text-text-secondary font-poppins w-16">{timeStr}</Text>
                {apt ? (
                  <View className="flex-1 ml-3 rounded-xl p-3" style={{ backgroundColor: COLORS.primary.DEFAULT + '20' }}>
                    <Text className="text-primary font-poppins-semibold">{apt.customerName || 'Dolu'}</Text>
                  </View>
                ) : (
                  <View className="flex-1 ml-3">
                    <Text className="text-text-muted font-poppins">Müsait</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
