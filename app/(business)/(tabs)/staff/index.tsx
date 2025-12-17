import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Image, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Search, Star, Edit, Trash2 } from 'lucide-react-native';
import { useAuthStore } from '@/stores/authStore';
import { useBusinessStore } from '@/stores/businessStore';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function StaffScreen() {
  const user = useAuthStore(state => state.user);
  const router = useRouter();
  const { barberData, loading, fetchStaff, removeStaff } = useBusinessStore();
  const [searchQuery, setSearchQuery] = useState('');

  const staff = user?.barberId ? barberData[user.barberId]?.staff || [] : [];
  const filteredStaff = staff.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (!user?.barberId) {
      Alert.alert('Hata', 'İşletme bilgisi bulunamadı');
      // Route guard will handle redirect if user is not authenticated
      return;
    }
    fetchStaff(user.barberId);
  }, [user]);

  const handleDelete = (staffId: string, staffName: string) => {
    if (!user?.barberId) return;

    Alert.alert(
      'Personel Sil',
      `${staffName} adlı personeli silmek istediğinizden emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            await removeStaff(user.barberId!, staffId);
          },
        },
      ]
    );
  };

  if (loading && staff.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={COLORS.primary.DEFAULT} />
          <Text className="text-text-secondary font-poppins mt-4">Personel yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0F172A]" edges={['top']}>
      {/* Header with Admin Standard */}
      <AdminHeader
        title="Personel Yönetimi"
        subtitle="Ekibini ve yetkileri düzenle"
        rightElement={
          <Pressable
            onPress={() => router.push('/(business)/(tabs)/staff/detail')}
            className="w-10 h-10 rounded-full bg-primary items-center justify-center shadow-lg shadow-primary/30 active:scale-95"
          >
            <Plus size={24} color="white" />
          </Pressable>
        }
      >
        {/* Search Bar - Moved to Header for alignment */}
        <View className="bg-[#1E293B] border border-white/5 rounded-xl h-12 flex-row items-center px-4 mt-2">
          <Search size={20} color="#64748B" />
          <TextInput
            className="flex-1 ml-3 text-white text-sm font-medium h-full"
            placeholder="Personel ara..."
            placeholderTextColor="#64748B"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </AdminHeader>

      <View className="flex-1 px-4">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          {filteredStaff.length > 0 ? (
            filteredStaff.map((member) => (
              <View key={member.id} className="bg-[#1E293B] rounded-2xl p-4 mb-3 border border-white/5 shadow-sm">
                <View className="flex-row items-start">
                  <View className="relative">
                    <Image
                      source={{ uri: member.avatar || 'https://via.placeholder.com/150' }}
                      className="w-16 h-16 rounded-xl bg-gray-800"
                    />
                    <View className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#1E293B] ${member.isActive ? 'bg-green-500' : 'bg-gray-500'}`} />
                  </View>

                  <View className="flex-1 ml-3">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="text-white text-lg font-bold leading-tight">{member.name}</Text>
                      {/* Status Badge is now integrated into Avatar dot, but can keep text if needed. Opting for clean Admin card style. */}
                    </View>

                    <View className="flex-row items-center mb-2">
                      <Star size={14} color="#F59E0B" fill="#F59E0B" />
                      <Text className="text-white font-bold text-xs ml-1">{member.rating.toFixed(1)}</Text>
                      <Text className="text-slate-400 text-xs ml-1">({member.reviewCount} değerlendirme)</Text>
                    </View>

                    <View className="flex-row flex-wrap gap-1">
                      {(member.expertise || []).map((exp, idx) => (
                        <View key={idx} className="px-2 py-0.5 rounded border border-white/10 bg-white/5">
                          <Text className="text-slate-300 text-[10px] font-medium">{exp}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>

                {/* Actions Divider */}
                <View className="h-[1px] bg-white/5 w-full my-3" />

                <View className="flex-row gap-3">
                  <Pressable
                    onPress={() => router.push({ pathname: '/(business)/(tabs)/staff/detail', params: { id: member.id } })}
                    className="flex-1 flex-row items-center justify-center py-2.5 rounded-xl bg-primary/10 border border-primary/20 active:bg-primary/20"
                  >
                    <Edit size={14} color={COLORS.primary.DEFAULT} />
                    <Text className="text-primary text-xs font-bold ml-2">Düzenle</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleDelete(member.id, member.name)}
                    className="flex-1 flex-row items-center justify-center py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 active:bg-red-500/20"
                  >
                    <Trash2 size={14} color="#EF4444" />
                    <Text className="text-red-500 text-xs font-bold ml-2">Sil</Text>
                  </Pressable>
                </View>
              </View>
            ))
          ) : (
            <View className="flex-1 items-center justify-center py-12">
              <View className="w-16 h-16 rounded-full bg-slate-800 items-center justify-center mb-4">
                <Search size={24} color="#64748B" />
              </View>
              <Text className="text-white text-lg font-bold mb-2">
                {searchQuery ? 'Sonuç Bulunamadı' : 'Personel Listeniz Boş'}
              </Text>
              <Text className="text-slate-400 text-sm text-center px-8">
                {searchQuery ? 'Farklı bir arama yapmayı deneyin.' : 'Yeni personel ekleyerek ekibinizi kurmaya başlayın.'}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
