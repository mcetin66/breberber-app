import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Users, Calendar, DollarSign, Clock, CheckCircle } from 'lucide-react-native';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

interface BusinessStats {
  todayBookings: number;
  totalRevenue: number;
  activeStaff: number;
  completedBookings: number;
}

interface TodayAppointment {
  id: string;
  customer_name: string;
  service_names: string;
  start_time: string;
  staff_name: string;
  status: string;
}

export default function BusinessDashboardScreen() {
  const user = useAuthStore(state => state.user);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<BusinessStats>({
    todayBookings: 0,
    totalRevenue: 0,
    activeStaff: 0,
    completedBookings: 0,
  });
  const [todayAppointments, setTodayAppointments] = useState<TodayAppointment[]>([]);

  useEffect(() => {
    if (!user?.barberId) {
      Alert.alert('Hata', 'İşletme bilgisi bulunamadı');
      router.replace('/(auth)/login');
      return;
    }
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user?.barberId) return;

    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];

      const [bookingsRes, staffRes, revenueRes] = await Promise.all([
        supabase
          .from('bookings')
          .select('*')
          .eq('business_id', user.barberId)
          .eq('booking_date', today),

        supabase
          .from('business_staff')
          .select('id')
          .eq('business_id', user.barberId)
          .eq('is_active', true),

        supabase
          .from('bookings')
          .select('total_price')
          .eq('business_id', user.barberId)
          .eq('status', 'completed'),
      ]);

      const completedRes = await supabase
        .from('bookings')
        .select('id')
        .eq('business_id', user.barberId)
        .eq('status', 'completed');

      setStats({
        todayBookings: bookingsRes.data?.length || 0,
        activeStaff: staffRes.data?.length || 0,
        totalRevenue: revenueRes.data?.reduce((sum, b) => sum + (b.total_price || 0), 0) || 0,
        completedBookings: completedRes.data?.length || 0,
      });

      if (bookingsRes.data && bookingsRes.data.length > 0) {
        const appointmentsWithDetails = await Promise.all(
          bookingsRes.data.slice(0, 5).map(async (booking) => {
            const [customerRes, staffRes] = await Promise.all([
              supabase
                .from('profiles')
                .select('full_name')
                .eq('id', booking.customer_id)
                .maybeSingle(),

              supabase
                .from('business_staff')
                .select('name')
                .eq('id', booking.staff_id)
                .maybeSingle(),
            ]);

            return {
              id: booking.id,
              customer_name: customerRes.data?.full_name || 'Müşteri',
              service_names: 'Hizmet',
              start_time: booking.start_time,
              staff_name: staffRes.data?.name || 'Personel',
              status: booking.status,
            };
          })
        );
        setTodayAppointments(appointmentsWithDetails);
      }
    } catch (error) {
      console.error('Dashboard yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={COLORS.primary.DEFAULT} />
          <Text className="text-text-secondary font-poppins mt-4">Dashboard yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const STATS = [
    { label: 'Bugünkü Randevular', value: stats.todayBookings.toString(), icon: Calendar, color: COLORS.primary.DEFAULT },
    { label: 'Toplam Gelir', value: `₺${stats.totalRevenue.toLocaleString('tr-TR')}`, icon: DollarSign, color: COLORS.status.success },
    { label: 'Aktif Personel', value: stats.activeStaff.toString(), icon: Users, color: COLORS.status.info },
    { label: 'Tamamlanan', value: stats.completedBookings.toString(), icon: CheckCircle, color: COLORS.status.success },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          <Text className="text-white text-2xl font-poppins-bold mb-1">Dashboard</Text>
          <Text className="text-text-secondary font-poppins mb-6">
            Hoş geldin, {user?.name}
          </Text>

          <View className="flex-row flex-wrap -mx-2 mb-6">
            {STATS.map((stat, index) => (
              <View key={index} className="w-1/2 px-2 mb-4">
                <View className="bg-background-card rounded-2xl p-4">
                  <View className="flex-row items-center justify-between mb-2">
                    <stat.icon size={24} color={stat.color} />
                    <View className="px-2 py-1 rounded-md" style={{ backgroundColor: `${stat.color}20` }}>
                      <TrendingUp size={12} color={stat.color} />
                    </View>
                  </View>
                  <Text className="text-white text-2xl font-poppins-bold mb-1">
                    {stat.value}
                  </Text>
                  <Text className="text-text-secondary text-xs font-poppins">
                    {stat.label}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View className="bg-background-card rounded-2xl p-4 mb-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white text-lg font-poppins-bold">Bugünkü Randevular</Text>
              <Pressable onPress={() => router.push('/(business)/calendar')}>
                <Text className="text-primary font-poppins-semibold">Tümü</Text>
              </Pressable>
            </View>

            {todayAppointments.length > 0 ? (
              todayAppointments.map((apt, index) => (
                <View
                  key={apt.id}
                  className={`py-3 ${index < todayAppointments.length - 1 ? 'border-b border-background' : ''}`}
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-1">
                      <Text className="text-white font-poppins-semibold mb-1">
                        {apt.customer_name}
                      </Text>
                      <Text className="text-text-secondary text-sm font-poppins">
                        {apt.service_names} • {apt.staff_name}
                      </Text>
                    </View>
                    <View className="items-end">
                      <View className="flex-row items-center mb-1">
                        <Clock size={14} color={COLORS.primary.DEFAULT} />
                        <Text className="text-white font-poppins-semibold ml-1">
                          {apt.start_time}
                        </Text>
                      </View>
                      <View
                        className="px-2 py-1 rounded-md"
                        style={{ backgroundColor: apt.status === 'confirmed' ? COLORS.status.success : COLORS.status.warning }}
                      >
                        <Text className="text-white text-xs font-poppins">
                          {apt.status === 'confirmed' ? 'Onaylı' : apt.status === 'pending' ? 'Bekliyor' : apt.status}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View className="py-8 items-center">
                <Calendar size={48} color={COLORS.text.muted} />
                <Text className="text-text-secondary font-poppins mt-4">
                  Bugün randevu yok
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
