import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Clock, Edit, Trash2, Users } from 'lucide-react-native';
import { useAuthStore } from '@/stores/authStore';
import { useBusinessStore } from '@/stores/businessStore';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/theme';

export default function ServicesScreen() {
  const user = useAuthStore(state => state.user);
  const router = useRouter();
  const { barberData, loading, fetchServices, removeService } = useBusinessStore();
  const [selectedCategory, setSelectedCategory] = useState('Tümü');

  const services = user?.barberId ? barberData[user.barberId]?.services || [] : [];

  const categories = ['Tümü', ...Array.from(new Set(services.map(s => s.category).filter(Boolean)))];

  const filteredServices = selectedCategory === 'Tümü'
    ? services
    : services.filter(s => s.category === selectedCategory);

  useEffect(() => {
    if (!user?.barberId) {
      Alert.alert('Hata', 'İşletme bilgisi bulunamadı');
      router.replace('/(auth)/login');
      return;
    }
    fetchServices(user.barberId);
  }, [user]);

  const handleDelete = (serviceId: string, serviceName: string) => {
    if (!user?.barberId) return;

    Alert.alert(
      'Hizmet Sil',
      `${serviceName} hizmetini silmek istediğinizden emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            await removeService(user.barberId!, serviceId);
          },
        },
      ]
    );
  };

  if (loading && services.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={COLORS.primary.DEFAULT} />
          <Text className="text-text-secondary font-poppins mt-4">Hizmetler yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-4 py-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-white text-2xl font-poppins-bold">Hizmetler</Text>
          <Pressable
            onPress={() => router.push('/(business)/service-detail')}
            className="rounded-xl px-4 py-2 flex-row items-center"
            style={{ backgroundColor: COLORS.primary.DEFAULT }}
          >
            <Plus size={20} color={COLORS.background.DEFAULT} />
            <Text className="text-background font-poppins-bold ml-1">Ekle</Text>
          </Pressable>
        </View>

        {categories.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            {categories.map((cat) => (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                className="rounded-xl px-4 py-2 mr-2"
                style={{ backgroundColor: selectedCategory === cat ? COLORS.primary.DEFAULT : COLORS.background.card }}
              >
                <Text
                  className="font-poppins-semibold"
                  style={{ color: selectedCategory === cat ? COLORS.background.DEFAULT : COLORS.text.secondary }}
                >
                  {cat}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <View key={service.id} className="bg-background-card rounded-2xl p-4 mb-3">
              <View className="flex-row items-start justify-between mb-3">
                <View className="flex-1">
                  <View className="flex-row items-center mb-2">
                    <Text className="text-white text-lg font-poppins-bold flex-1">
                      {service.name}
                    </Text>
                  </View>

                  {service.category && (
                    <View className="flex-row items-center mb-2">
                      <View className="px-2 py-1 rounded-md" style={{ backgroundColor: COLORS.primary.DEFAULT + '20' }}>
                        <Text className="text-primary text-xs font-poppins">{service.category}</Text>
                      </View>
                    </View>
                  )}

                  {service.description && (
                    <Text className="text-text-secondary text-sm font-poppins mb-2">
                      {service.description}
                    </Text>
                  )}

                  <View className="flex-row items-center">
                    <Clock size={14} color={COLORS.text.secondary} />
                    <Text className="text-text-secondary text-sm font-poppins ml-1">
                      {service.duration} dk
                    </Text>
                    {service.staffIds && service.staffIds.length > 0 && (
                      <>
                        <Users size={14} color={COLORS.text.secondary} className="ml-3" />
                        <Text className="text-text-secondary text-sm font-poppins ml-1">
                          {service.staffIds.length} personel
                        </Text>
                      </>
                    )}
                  </View>
                </View>

                <Text className="text-primary text-2xl font-poppins-bold ml-4">
                  ₺{service.price}
                </Text>
              </View>

              <View className="flex-row mt-3 pt-3 border-t border-background">
                <Pressable
                  onPress={() => router.push({ pathname: '/(business)/service-detail', params: { id: service.id } })}
                  className="flex-1 flex-row items-center justify-center py-2 mr-2 rounded-xl border border-primary"
                >
                  <Edit size={16} color={COLORS.primary.DEFAULT} />
                  <Text className="text-primary font-poppins-semibold ml-2">Düzenle</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleDelete(service.id, service.name)}
                  className="flex-1 flex-row items-center justify-center py-2 rounded-xl"
                  style={{ backgroundColor: COLORS.status.error + '20' }}
                >
                  <Trash2 size={16} color={COLORS.status.error} />
                  <Text className="font-poppins-semibold ml-2" style={{ color: COLORS.status.error }}>Sil</Text>
                </Pressable>
              </View>
            </View>
          ))
        ) : (
          <View className="flex-1 items-center justify-center py-12">
            <Text className="text-text-secondary text-lg font-poppins-semibold mb-2">
              {selectedCategory !== 'Tümü' ? 'Bu kategoride hizmet bulunamadı' : 'Henüz hizmet eklenmemiş'}
            </Text>
            {selectedCategory === 'Tümü' && (
              <Text className="text-text-muted text-sm font-poppins text-center px-8">
                Yeni hizmet eklemek için + Ekle butonuna tıklayın
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
