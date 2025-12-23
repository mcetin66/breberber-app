import { useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Check, Clock, DollarSign } from 'lucide-react-native';
import { useBookingStore } from '@/stores/bookingStore';
import { useBusinessStore } from '@/stores/businessStore';
import type { Service } from '@/types';
import { COLORS } from '@/constants/theme';
import { BaseHeader } from '@/components/shared/layouts/BaseHeader';

export default function ServiceSelectionScreen() {
  const router = useRouter();
  const { barber, selectedServices, addService, removeService, totalDuration, totalPrice } = useBookingStore();
  const { barberData, loading, fetchServices } = useBusinessStore();

  const services = barber ? barberData[barber.id]?.services || [] : [];

  useEffect(() => {
    if (!barber) {
      router.replace('/(customer)/home');
      return;
    }
    loadServices();
  }, [barber]);

  const loadServices = async () => {
    if (!barber) return;
    await fetchServices(barber.id);
  };

  const isSelected = (serviceId: string) => {
    return selectedServices.some(s => s.id === serviceId);
  };

  const handleToggleService = (service: Service) => {
    if (isSelected(service.id)) {
      removeService(service.id);
    } else {
      addService(service);
    }
  };

  const handleContinue = () => {
    if (selectedServices.length > 0) {
      router.push('/(customer)/booking/staff');
    }
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
      <BaseHeader
        title="Hizmet Seçin"
        subtitle={barber?.name}
        showBack
      />

      <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
        <Text className="text-text-secondary font-poppins mb-4">
          Almak istediğiniz hizmetleri seçin
        </Text>

        {services.map((service) => {
          const selected = isSelected(service.id);
          return (
            <Pressable
              key={service.id}
              onPress={() => handleToggleService(service)}
              className="bg-background-card rounded-2xl p-4 mb-3"
              style={selected ? { borderWidth: 2, borderColor: COLORS.primary.DEFAULT } : {}}
            >
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1">
                  <Text className="text-white text-lg font-poppins-bold mb-1">
                    {service.name}
                  </Text>
                  {service.description && (
                    <Text className="text-text-secondary text-sm font-poppins">
                      {service.description}
                    </Text>
                  )}
                </View>
                {selected && (
                  <View
                    className="w-6 h-6 rounded-full items-center justify-center ml-2"
                    style={{ backgroundColor: COLORS.primary.DEFAULT }}
                  >
                    <Check size={16} color={COLORS.background.DEFAULT} />
                  </View>
                )}
              </View>

              <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-background">
                <View className="flex-row items-center">
                  <Clock size={16} color={COLORS.text.secondary} />
                  <Text className="text-text-secondary font-poppins ml-2">
                    {service.duration} dakika
                  </Text>
                </View>
                <Text className="text-primary text-xl font-poppins-bold">
                  ₺{service.price}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {selectedServices.length > 0 && (
        <View className="px-4 py-4 bg-background-card border-t border-background">
          <View className="flex-row justify-between items-center mb-3">
            <View>
              <Text className="text-text-secondary text-sm font-poppins">
                {selectedServices.length} hizmet seçildi
              </Text>
              <View className="flex-row items-center mt-1">
                <Clock size={14} color={COLORS.primary.DEFAULT} />
                <Text className="text-white font-poppins-semibold ml-1">
                  {totalDuration} dk
                </Text>
                <Text className="text-text-secondary mx-2">•</Text>
                <Text className="text-primary text-lg font-poppins-bold">
                  ₺{totalPrice}
                </Text>
              </View>
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
