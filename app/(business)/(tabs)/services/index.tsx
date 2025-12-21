import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Clock, Edit, Trash2, Users, Scissors } from 'lucide-react-native';
import { useAuthStore } from '@/stores/authStore';
import { useBusinessStore } from '@/stores/businessStore';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { formatCurrency } from '@/utils/format';

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
      // Route guard will handle redirect if user is not authenticated
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
    <SafeAreaView className="flex-1 bg-[#121212]" edges={['top']}>
      <AdminHeader
        title="Hizmetler"
        subtitle="Servislerinizi yönetin"
        headerIcon={<Scissors size={20} color="#121212" />}
        rightElement={
          <Pressable
            onPress={() => router.push('/(business)/(tabs)/services/detail')}
            className="w-10 h-10 rounded-full bg-[#d4af35] items-center justify-center shadow-lg shadow-[#d4af35]/30 active:scale-95"
          >
            <Plus size={24} color="#121212" />
          </Pressable>
        }
      >
        {categories.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2">
            {categories.map((cat) => (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                className={`rounded-xl px-4 py-2 mr-2 border ${selectedCategory === cat ? 'bg-[#d4af35] border-[#d4af35]' : 'bg-[#1E1E1E] border-white/5'}`}
              >
                <Text
                  className={`font-poppins-semibold text-xs ${selectedCategory === cat ? 'text-black' : 'text-zinc-400'}`}
                >
                  {cat}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </AdminHeader>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <View key={service.id} className="bg-[#1E1E1E] rounded-2xl border border-white/5 p-4 mb-3 shadow-sm">

              {/* Header: Name and Price */}
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-white text-lg font-poppins-bold flex-1 mr-3 leading-tight">
                  {service.name}
                </Text>
                <View className="px-3 py-1.5 rounded-xl bg-[#d4af35]/10 border border-[#d4af35]/20 shadow-sm shadow-[#d4af35]/5">
                  <Text className="text-[#d4af35] font-poppins-bold text-base">{formatCurrency(service.price)}</Text>
                </View>
              </View>

              {/* Description */}
              {service.description && (
                <Text className="text-zinc-400 text-sm font-poppins mb-3 leading-relaxed" numberOfLines={2}>
                  {service.description}
                </Text>
              )}

              {/* Meta Info Pills */}
              <View className="flex-row flex-wrap gap-2 mb-4">
                {/* Category */}
                {service.category && (
                  <View className="bg-[#121212] px-2.5 py-1.5 rounded-lg border border-white/5">
                    <Text className="text-zinc-400 text-xs font-poppins-medium">{service.category}</Text>
                  </View>
                )}

                {/* Duration */}
                <View className="flex-row items-center bg-[#121212] px-2.5 py-1.5 rounded-lg border border-white/5">
                  <Clock size={12} color="#94a3b8" />
                  <Text className="text-zinc-400 text-xs font-poppins-medium ml-1.5">{service.duration} dk</Text>
                </View>

                {/* Staff Count */}
                {service.staffIds && service.staffIds.length > 0 && (
                  <View className="flex-row items-center bg-[#121212] px-2.5 py-1.5 rounded-lg border border-white/5">
                    <Users size={12} color="#94a3b8" />
                    <Text className="text-zinc-400 text-xs font-poppins-medium ml-1.5">{service.staffIds.length} Per.</Text>
                  </View>
                )}
              </View>

              {/* Action Buttons */}
              <View className="flex-row gap-3 border-t border-white/5 pt-3">
                <Pressable
                  onPress={() => router.push({ pathname: '/(business)/(tabs)/services/detail', params: { id: service.id } })}
                  className="flex-1 bg-white/5 py-2.5 rounded-xl flex-row items-center justify-center active:bg-white/10 transition-colors"
                >
                  <Edit size={14} color="#e2e8f0" />
                  <Text className="text-slate-200 font-poppins-medium ml-2 text-sm">Düzenle</Text>
                </Pressable>

                <Pressable
                  onPress={() => handleDelete(service.id, service.name)}
                  className="flex-1 bg-red-500/10 py-2.5 rounded-xl flex-row items-center justify-center active:bg-red-500/20 transition-colors"
                >
                  <Trash2 size={14} color="#ef4444" />
                  <Text className="text-red-500 font-poppins-medium ml-2 text-sm">Sil</Text>
                </Pressable>
              </View>
            </View>
          ))
        ) : (
          <View className="flex-1 items-center justify-center py-20">
            <View className="w-20 h-20 rounded-3xl bg-[#1E293B] items-center justify-center mb-6 shadow-xl shadow-black border border-white/5 rotate-3">
              <View className="w-20 h-20 rounded-3xl bg-[#1E293B] absolute top-0 left-0 -rotate-6 opacity-30 border border-white/5" />
              <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
                <Plus size={24} color={COLORS.primary.DEFAULT} />
              </View>
            </View>
            <Text className="text-white text-xl font-poppins-bold mb-2">
              {selectedCategory !== 'Tümü' ? 'Kategori Boş' : 'Hizmet Listeniz Boş'}
            </Text>
            <Text className="text-slate-400 text-sm font-poppins-medium text-center px-10 mb-8 leading-relaxed">
              {selectedCategory !== 'Tümü'
                ? 'Bu kategoride henüz bir hizmet bulunmuyor.'
                : 'Müşterilerinize sunacağınız hizmetleri ekleyerek başlayın.'}
            </Text>

            {selectedCategory === 'Tümü' && (
              <Pressable
                onPress={() => router.push('/(business)/(tabs)/services/detail')}
                className="bg-primary px-8 py-3.5 rounded-xl flex-row items-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-transform"
              >
                <Plus size={20} color="black" />
                <Text className="text-black font-poppins-bold text-base">Hizmet Ekle</Text>
              </Pressable>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
