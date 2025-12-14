import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Image, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Search, Star, Edit, Trash2 } from 'lucide-react-native';
import { useAuthStore } from '@/stores/authStore';
import { useBusinessStore } from '@/stores/businessStore';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/theme';

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
      router.replace('/(auth)/login');
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
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-4 py-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-white text-2xl font-poppins-bold">Personel</Text>
          <Pressable
            onPress={() => router.push('/(business)/staff-detail')}
            className="rounded-xl px-4 py-2 flex-row items-center"
            style={{ backgroundColor: COLORS.primary.DEFAULT }}
          >
            <Plus size={20} color={COLORS.background.DEFAULT} />
            <Text className="text-background font-poppins-bold ml-1">Ekle</Text>
          </Pressable>
        </View>

        <View className="flex-row items-center bg-background-card rounded-xl px-4 py-3 mb-4">
          <Search size={20} color={COLORS.text.secondary} />
          <TextInput
            className="flex-1 ml-3 text-white font-poppins"
            placeholder="Personel ara..."
            placeholderTextColor={COLORS.text.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {filteredStaff.length > 0 ? (
          filteredStaff.map((member) => (
            <View key={member.id} className="bg-background-card rounded-2xl p-4 mb-3">
              <View className="flex-row items-center">
                {member.avatar && (
                  <Image source={{ uri: member.avatar }} className="w-16 h-16 rounded-xl" />
                )}

                <View className="flex-1 ml-3">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-white text-lg font-poppins-bold">{member.name}</Text>
                    <View
                      className="px-2 py-1 rounded-md"
                      style={{ backgroundColor: member.isActive ? COLORS.status.success : COLORS.text.muted }}
                    >
                      <Text className="text-white text-xs font-poppins">
                        {member.isActive ? 'Aktif' : 'Pasif'}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center mb-2">
                    <Star size={14} color={COLORS.primary.DEFAULT} fill={COLORS.primary.DEFAULT} />
                    <Text className="text-white font-poppins-semibold ml-1">
                      {member.rating.toFixed(1)}
                    </Text>
                    <Text className="text-text-secondary text-sm font-poppins ml-1">
                      ({member.reviewCount} değerlendirme)
                    </Text>
                  </View>

                  <View className="flex-row flex-wrap">
                    {member.expertise.slice(0, 3).map((exp, idx) => (
                      <View key={idx} className="px-2 py-1 rounded-md mr-2 mb-1" style={{ backgroundColor: COLORS.background.DEFAULT }}>
                        <Text className="text-primary text-xs font-poppins">{exp}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              <View className="flex-row mt-3 pt-3 border-t border-background">
                <Pressable
                  onPress={() => router.push({ pathname: '/(business)/staff-detail', params: { id: member.id } })}
                  className="flex-1 flex-row items-center justify-center py-2 mr-2 rounded-xl border border-primary"
                >
                  <Edit size={16} color={COLORS.primary.DEFAULT} />
                  <Text className="text-primary font-poppins-semibold ml-2">Düzenle</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleDelete(member.id, member.name)}
                  className="flex-1 flex-row items-center justify-center py-2 rounded-xl"
                  style={{ backgroundColor: COLORS.status.error + '20' }}
                >
                  <Trash2 size={16} color={COLORS.status.error} />
                  <Text className="text-red-500 font-poppins-semibold ml-2">Sil</Text>
                </Pressable>
              </View>
            </View>
          ))
        ) : (
          <View className="flex-1 items-center justify-center py-12">
            <Text className="text-text-secondary text-lg font-poppins-semibold mb-2">
              {searchQuery ? 'Personel bulunamadı' : 'Henüz personel eklenmemiş'}
            </Text>
            {!searchQuery && (
              <Text className="text-text-muted text-sm font-poppins text-center px-8">
                Yeni personel eklemek için + Ekle butonuna tıklayın
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
