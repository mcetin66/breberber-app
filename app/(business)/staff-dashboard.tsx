import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, CheckCircle, User } from 'lucide-react-native';
import { useAuthStore } from '@/stores/authStore';
import { COLORS } from '@/constants/theme';

const TODAY_STATS = [
  { label: 'Bugünkü Randevular', value: '8', icon: Calendar },
  { label: 'Tamamlanan', value: '5', icon: CheckCircle },
  { label: 'Toplam Süre', value: '240 dk', icon: Clock },
];

const MY_APPOINTMENTS = [
  { id: '1', customer: 'Ahmet Yılmaz', service: 'Saç Kesimi', time: '10:00', status: 'completed' },
  { id: '2', customer: 'Mehmet Kaya', service: 'Sakal Tıraşı', time: '11:30', status: 'completed' },
  { id: '3', customer: 'Emre Demir', service: 'Saç + Sakal', time: '14:00', status: 'upcoming' },
  { id: '4', customer: 'Can Öz', service: 'Saç Kesimi', time: '15:30', status: 'upcoming' },
];

export default function StaffDashboardScreen() {
  const user = useAuthStore(state => state.user);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          <Text className="text-white text-2xl font-poppins-bold mb-1">Personel Paneli</Text>
          <Text className="text-text-secondary font-poppins mb-6">
            Hoş geldin, {user?.name}
          </Text>

          <View className="flex-row flex-wrap -mx-2 mb-6">
            {TODAY_STATS.map((stat, index) => (
              <View key={index} className="w-1/3 px-2 mb-4">
                <View className="bg-background-card rounded-2xl p-3 items-center">
                  <stat.icon size={24} color={COLORS.primary.DEFAULT} className="mb-2" />
                  <Text className="text-white text-xl font-poppins-bold mb-1">
                    {stat.value}
                  </Text>
                  <Text className="text-text-secondary text-xs font-poppins text-center">
                    {stat.label}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View className="bg-background-card rounded-2xl p-4 mb-4">
            <Text className="text-white text-lg font-poppins-bold mb-4">
              Bugünkü Randevularım
            </Text>

            {MY_APPOINTMENTS.map((apt, idx) => (
              <View
                key={apt.id}
                className={`py-3 ${idx < MY_APPOINTMENTS.length - 1 ? 'border-b border-background' : ''}`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-white font-poppins-bold mb-1">{apt.customer}</Text>
                    <Text className="text-text-secondary text-sm font-poppins">
                      {apt.service}
                    </Text>
                  </View>
                  <View className="items-end">
                    <View className="flex-row items-center mb-1">
                      <Clock size={14} color={COLORS.primary.DEFAULT} />
                      <Text className="text-white font-poppins-semibold ml-1">
                        {apt.time}
                      </Text>
                    </View>
                    <View
                      className="px-2 py-1 rounded-md"
                      style={{
                        backgroundColor: apt.status === 'completed'
                          ? COLORS.status.success
                          : COLORS.status.warning
                      }}
                    >
                      <Text className="text-white text-xs font-poppins">
                        {apt.status === 'completed' ? 'Tamamlandı' : 'Yaklaşıyor'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View className="bg-background-card rounded-2xl p-4">
            <Text className="text-white text-lg font-poppins-bold mb-3">
              Performans Özeti
            </Text>
            <View className="flex-row items-center justify-between py-2">
              <Text className="text-text-secondary font-poppins">Bu Hafta Tamamlanan</Text>
              <Text className="text-white font-poppins-bold">28</Text>
            </View>
            <View className="flex-row items-center justify-between py-2">
              <Text className="text-text-secondary font-poppins">Ortalama Değerlendirme</Text>
              <Text className="text-primary font-poppins-bold">4.8 ⭐</Text>
            </View>
            <View className="flex-row items-center justify-between py-2">
              <Text className="text-text-secondary font-poppins">Toplam Gelir Katkısı</Text>
              <Text className="text-primary font-poppins-bold">₺12,450</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
