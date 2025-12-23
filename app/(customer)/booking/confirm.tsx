import { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, Clock, User, MapPin, Check } from 'lucide-react-native';
import { useBookingStore } from '@/stores/bookingStore';
import { useAuthStore } from '@/stores/authStore';
import { COLORS } from '@/constants/theme';
import { BaseHeader } from '@/components/shared/layouts/BaseHeader';

export default function ConfirmBookingScreen() {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const { barber, staff, selectedServices, selectedDate, selectedSlot, totalDuration, totalPrice, notes, setNotes, resetBooking, createBooking, error } = useBookingStore();

  const [localNotes, setLocalNotes] = useState(notes || '');
  const [loading, setLoading] = useState(false);

  if (!barber || !staff || !selectedDate || !selectedSlot) {
    router.replace('/(customer)/home');
    return null;
  }

  if (!user) {
    // Route guard in _layout.tsx will redirect
    return null;
  }

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setNotes(localNotes);

      const appointment = await createBooking(user.id);

      if (appointment) {
        Alert.alert(
          'Randevu Oluşturuldu',
          'Randevunuz başarıyla oluşturuldu. Randevularım sayfasından takip edebilirsiniz.',
          [
            {
              text: 'Tamam',
              onPress: () => {
                router.replace('/(customer)/appointments');
              },
            },
          ]
        );
      } else {
        Alert.alert('Hata', error || 'Randevu oluşturulurken bir hata oluştu.');
      }
    } catch (error) {
      Alert.alert('Hata', 'Randevu oluşturulurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <BaseHeader
        title="Randevu Özeti"
        subtitle="Son adım"
        showBack
      />

      <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
        <View className="bg-background-card rounded-2xl p-4 mb-4">
          <View className="flex-row items-center mb-4">
            {barber.logo && (
              <Image
                source={{ uri: barber.logo }}
                className="w-16 h-16 rounded-2xl mr-3"
              />
            )}
            <View className="flex-1">
              <Text className="text-white text-lg font-poppins-bold mb-1">
                {barber.name}
              </Text>
              <View className="flex-row items-center">
                <MapPin size={14} color={COLORS.text.secondary} />
                <Text className="text-text-secondary text-sm font-poppins ml-1">
                  {barber.address}
                </Text>
              </View>
            </View>
          </View>

          <View className="border-t border-background pt-4">
            <View className="flex-row items-start mb-3">
              <User size={20} color={COLORS.primary.DEFAULT} />
              <View className="flex-1 ml-3">
                <Text className="text-text-secondary text-sm font-poppins mb-1">
                  Berber
                </Text>
                <Text className="text-white font-poppins-semibold">
                  {staff.name}
                </Text>
              </View>
            </View>

            <View className="flex-row items-start mb-3">
              <Calendar size={20} color={COLORS.primary.DEFAULT} />
              <View className="flex-1 ml-3">
                <Text className="text-text-secondary text-sm font-poppins mb-1">
                  Tarih & Saat
                </Text>
                <Text className="text-white font-poppins-semibold">
                  {selectedDate} • {selectedSlot}
                </Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <Clock size={20} color={COLORS.primary.DEFAULT} />
              <View className="flex-1 ml-3">
                <Text className="text-text-secondary text-sm font-poppins mb-1">
                  Süre
                </Text>
                <Text className="text-white font-poppins-semibold">
                  {totalDuration} dakika
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="bg-background-card rounded-2xl p-4 mb-4">
          <Text className="text-white text-lg font-poppins-bold mb-3">
            Seçilen Hizmetler
          </Text>
          {selectedServices.map((service, index) => (
            <View
              key={service.id}
              className={`py-3 ${index < selectedServices.length - 1 ? 'border-b border-background' : ''}`}
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="text-white font-poppins-semibold mb-1">
                    {service.name}
                  </Text>
                  <Text className="text-text-secondary text-sm font-poppins">
                    {service.duration} dakika
                  </Text>
                </View>
                <Text className="text-primary text-lg font-poppins-bold ml-4">
                  ₺{service.price}
                </Text>
              </View>
            </View>
          ))}

          <View className="border-t border-background pt-4 mt-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-white text-lg font-poppins-bold">Toplam</Text>
              <Text className="text-primary text-2xl font-poppins-bold">
                ₺{totalPrice}
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-background-card rounded-2xl p-4 mb-6">
          <Text className="text-white text-lg font-poppins-bold mb-3">
            Not Ekle (Opsiyonel)
          </Text>
          <TextInput
            className="bg-background rounded-xl px-4 py-3 text-white font-poppins"
            placeholder="Randevunuz hakkında not ekleyin..."
            placeholderTextColor={COLORS.text.muted}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={localNotes}
            onChangeText={setLocalNotes}
          />
        </View>
      </ScrollView>

      <View className="px-4 py-4 bg-background-card border-t border-background">
        <Pressable
          onPress={handleConfirm}
          disabled={loading}
          className="rounded-xl py-4"
          style={{ backgroundColor: loading ? COLORS.text.muted : COLORS.primary.DEFAULT }}
        >
          <Text className="text-background text-center text-lg font-poppins-bold">
            {loading ? 'Oluşturuluyor...' : 'Randevuyu Onayla'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
