import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, Pressable, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, MapPin, User } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { useAuthStore } from '@/stores/authStore';
import { useBookingStore } from '@/stores/bookingStore';
import { useRouter } from 'expo-router';

const STATUS_CONFIG = {
  confirmed: { label: 'Onaylandı', color: COLORS.status.success },
  pending: { label: 'Beklemede', color: COLORS.status.warning },
  completed: { label: 'Tamamlandı', color: COLORS.text.secondary },
  cancelled: { label: 'İptal Edildi', color: COLORS.status.error },
};

export default function AppointmentsScreen() {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const { appointments, loading, fetchUserAppointments, cancelAppointment } = useBookingStore();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserAppointments(user.id);
    }
    // If no user, route guard in _layout.tsx will redirect
  }, [user]);

  const handleCancelAppointment = (appointmentId: string) => {
    Alert.alert(
      'Randevuyu İptal Et',
      'Bu randevuyu iptal etmek istediğinizden emin misiniz?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'İptal Et',
          style: 'destructive',
          onPress: async () => {
            setCancellingId(appointmentId);
            await cancelAppointment(appointmentId);
            setCancellingId(null);
          },
        },
      ]
    );
  };

  if (loading && appointments.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={COLORS.primary.DEFAULT} />
          <Text className="text-text-secondary font-poppins mt-4">Randevular yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']} style={{ flex: 1 }}>
      <View className="px-4 py-4 border-b border-background-card">
        <Text className="text-white text-2xl font-poppins-bold">Randevularım</Text>
        <Text className="text-text-secondary text-sm font-poppins mt-1">
          {appointments.length} randevu
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
        {appointments.map((appointment) => {
          const statusConfig = STATUS_CONFIG[appointment.status as keyof typeof STATUS_CONFIG];
          const isCancelling = cancellingId === appointment.id;

          return (
            <Pressable
              key={appointment.id}
              className="bg-background-card rounded-2xl p-4 mb-4"
            >
              <View className="flex-row items-start justify-between mb-3">
                <View className="flex-1">
                  <Text className="text-white text-lg font-poppins-bold mb-1">
                    Randevu #{appointment.id.slice(0, 8)}
                  </Text>
                  <View
                    className="self-start px-2 py-1 rounded-md"
                    style={{ backgroundColor: statusConfig.color }}
                  >
                    <Text className="text-white text-xs font-poppins-semibold">
                      {statusConfig.label}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="space-y-2">
                <View className="flex-row items-center">
                  <Calendar size={16} color={COLORS.text.secondary} />
                  <Text className="text-text-secondary font-poppins ml-2">
                    {appointment.date}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <Clock size={16} color={COLORS.text.secondary} />
                  <Text className="text-text-secondary font-poppins ml-2">
                    {appointment.startTime} - {appointment.endTime}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <User size={16} color={COLORS.text.secondary} />
                  <Text className="text-text-secondary font-poppins ml-2">
                    {appointment.totalDuration} dakika
                  </Text>
                </View>
              </View>

              {appointment.notes && (
                <View className="border-t border-background mt-3 pt-3">
                  <Text className="text-text-secondary text-sm font-poppins mb-1">
                    Not
                  </Text>
                  <Text className="text-white font-poppins">
                    {appointment.notes}
                  </Text>
                </View>
              )}

              <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-background">
                <Text className="text-text-secondary font-poppins">Toplam</Text>
                <Text className="text-primary text-xl font-poppins-bold">
                  ₺{appointment.totalPrice}
                </Text>
              </View>

              {(appointment.status === 'confirmed' || appointment.status === 'pending') && (
                <View className="mt-4">
                  <Pressable
                    onPress={() => handleCancelAppointment(appointment.id)}
                    disabled={isCancelling}
                    className="rounded-xl py-3 border"
                    style={{ borderColor: COLORS.status.error, opacity: isCancelling ? 0.5 : 1 }}
                  >
                    <Text
                      className="text-center font-poppins-semibold"
                      style={{ color: COLORS.status.error }}
                    >
                      {isCancelling ? 'İptal Ediliyor...' : 'Randevuyu İptal Et'}
                    </Text>
                  </Pressable>
                </View>
              )}
            </Pressable>
          );
        })}

        {appointments.length === 0 && (
          <View className="flex-1 items-center justify-center py-12">
            <Calendar size={64} color={COLORS.text.muted} />
            <Text className="text-text-secondary text-lg font-poppins-semibold mt-4 mb-2">
              Henüz randevunuz yok
            </Text>
            <Text className="text-text-muted text-sm font-poppins text-center px-8">
              Randevu oluşturmak için berber aramaya başlayın
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
