import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, DollarSign, Clock, Bell, UserPlus, Scissors } from 'lucide-react-native';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatCard } from '@/components/business/StatCard';

// Helper for Turkish date formatting
const getFormattedDate = () => {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', weekday: 'long' };
  return new Intl.DateTimeFormat('tr-TR', options).format(date);
};

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
  duration: number;
  avatar_url?: string | null;
  service_price?: number;
}

export default function BusinessDashboardScreen() {
  const { user, setBarberId } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<BusinessStats>({
    todayBookings: 0,
    totalRevenue: 0,
    activeStaff: 0,
    completedBookings: 0,
  });
  const [todayAppointments, setTodayAppointments] = useState<TodayAppointment[]>([]);
  const [businessName, setBusinessName] = useState('Kontrol Paneli');

  useEffect(() => {
    console.log('Dashboard Effect Triggered:', {
      userId: user?.id,
      barberId: user?.barberId,
      loading
    });

    if (!user) {
      console.log('User is null, waiting...');
      return; // Don't try to fetch if no user
    }

    if (!user?.barberId) {
      console.log('No barberId, checking business...');
      checkBusiness();
    } else {
      console.log('Has barberId, loading dashboard...');
      loadDashboardData();
    }
  }, [user]);

  const checkBusiness = async () => {
    if (!user?.id) {
      console.log('checkBusiness: No user ID');
      return;
    }

    try {
      console.log('Fetching business for owner:', user.id);
      const { data, error } = await supabase.from('businesses').select('id, name').eq('owner_id', user.id).single() as any;

      if (error) {
        console.error('Business Fetch Error:', error);
        Alert.alert('Hata', 'İşletme verisi çekilemedi: ' + error.message);
        setLoading(false); // Stop loading on error
        return;
      }

      if (data) {
        console.log('Business Found:', data);
        setBarberId(data.id);
        setBusinessName(data.name);
        loadDashboardData(data.id);
      } else {
        console.log('No business found for this owner');
        Alert.alert('Hata', 'İşletme bilgisi bulunamadı');
        setLoading(false);
        // Route guard will handle redirect if needed
      }
    } catch (err) {
      console.error('checkBusiness Unexpected Error:', err);
      setLoading(false);
    }
  }

  const loadDashboardData = async (barberId = user?.barberId) => {
    if (!barberId) return;

    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];

      const [bookingsRes, staffRes, revenueRes, completedRes] = await Promise.all([
        supabase.from('bookings').select('*').eq('business_id', barberId).eq('booking_date', today),
        supabase.from('business_staff').select('id').eq('business_id', barberId).eq('is_active', true),
        supabase.from('bookings').select('total_price').eq('business_id', barberId).eq('status', 'completed').eq('booking_date', today),
        supabase.from('bookings').select('id').eq('business_id', barberId).eq('status', 'completed')
      ]) as any[];

      const dailyRevenue = revenueRes.data?.reduce((sum: number, b: any) => sum + (b.total_price || 0), 0) || 0;

      setStats({
        todayBookings: bookingsRes.data?.length || 0,
        activeStaff: staffRes.data?.length || 0,
        totalRevenue: dailyRevenue,
        completedBookings: completedRes.data?.length || 0,
      });

      if (bookingsRes.data && bookingsRes.data.length > 0) {
        const appointmentsWithDetails = await Promise.all(
          bookingsRes.data.map(async (booking: any) => {
            const [customerRes, staffRes, serviceRes] = await Promise.all([
              supabase.from('profiles').select('full_name, avatar_url').eq('id', booking.customer_id).maybeSingle(),
              supabase.from('business_staff').select('name').eq('id', booking.staff_id).maybeSingle(),
              supabase.from('services').select('name, duration_minutes').eq('id', booking.service_id).maybeSingle(),
            ]) as any[];

            return {
              id: booking.id,
              customer_name: customerRes.data?.full_name || 'Misafir Müşteri',
              avatar_url: customerRes.data?.avatar_url,
              service_names: serviceRes.data?.name || 'Hizmet',
              start_time: booking.start_time.substring(0, 5),
              staff_name: staffRes.data?.name || 'Personel',
              status: booking.status,
              duration: serviceRes.data?.duration_minutes || 30,
              service_price: booking.total_price
            };
          })
        );
        appointmentsWithDetails.sort((a, b) => a.start_time.localeCompare(b.start_time));
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
      <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#137fec" />
        </View>
      </SafeAreaView>
    );
  }

  // --- UI Components ---
  // Replicating HTML template structure 1:1

  return (
    <SafeAreaView className="flex-1 bg-background-dark" edges={['top']}>
      {/* Top App Bar standardized with AdminHeader */}
      <AdminHeader
        title={businessName}
        subtitle={getFormattedDate()}
        rightElement={
          <View className="flex-row items-center gap-3">
            <Pressable onPress={() => router.push('/(business)/settings/profile')}>
              <Image
                source={{ uri: user?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }}
                className="w-10 h-10 rounded-full border-2 border-primary"
              />
            </Pressable>
            <Pressable className="w-10 h-10 rounded-full bg-surface-dark items-center justify-center border border-white/5">
              <Bell size={20} color={user?.barberId ? '#137fec' : '#64748B'} />
              <View className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
            </Pressable>
          </View>
        }
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Admin Impersonation Banner */}
        {useAuthStore.getState().originalUser && (
          <View className="bg-red-500/10 px-4 py-2 flex-row items-center justify-between mb-2">
            <Text className="text-red-500 font-bold text-xs">⚠️ Yönetici Modu</Text>
            <Pressable onPress={() => { useAuthStore.getState().stopImpersonating(); router.replace('/(platform)/dashboard'); }}>
              <Text className="text-red-500 font-bold text-xs underline">Çıkış</Text>
            </Pressable>
          </View>
        )}

        {/* Stats Section with Horizontal Scroll */}
        <View className="py-2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
            {/* Card 1: Appointments */}
            <StatCard
              label="Bugünkü Randevu"
              value={stats.todayBookings}
              icon={Calendar}
              colorClass="bg-blue-50 dark:bg-primary/10"
              highlight={`+${stats.todayBookings}`}
              highlightClass="bg-green-500/10"
            />
            {/* Card 2: Revenue */}
            <StatCard
              label="Günlük Gelir"
              value={`₺${stats.totalRevenue > 1000 ? (stats.totalRevenue / 1000).toFixed(1) + 'K' : stats.totalRevenue}`}
              icon={DollarSign}
              colorClass="bg-yellow-50 dark:bg-yellow-500/10"
              highlight="+%15"
              highlightClass="bg-green-500/10"
            />
            {/* Card 3: Peak Hours */}
            <StatCard
              label="En Yoğun Saat"
              value="17:00"
              icon={Clock}
              colorClass="bg-purple-50 dark:bg-purple-500/10"
            />
            <View className="w-2" />
          </ScrollView>
        </View>

        {/* Quick Actions Grid */}
        <View className="px-4 py-6">
          <Text className="text-lg font-bold text-gray-900 dark:text-white mb-3">Hızlı İşlemler</Text>
          <View className="flex-row gap-3">
            {/* Button 1: Add Staff */}
            <Pressable
              onPress={() => router.push('/(business)/(tabs)/staff')}
              className="flex-1 bg-primary rounded-xl p-4 flex-col items-center justify-center gap-3 active:scale-95 transition-transform shadow-lg shadow-primary/20"
            >
              <View className="p-2 rounded-full bg-white/20">
                <UserPlus size={24} color="white" />
              </View>
              <Text className="text-white font-bold text-sm">Personel Ekle</Text>
            </Pressable>

            {/* Button 2: Manage Services */}
            <Pressable
              onPress={() => router.push('/(business)/(tabs)/services')}
              className="flex-1 bg-white dark:bg-surface-dark border border-gray-200 dark:border-[#293038] rounded-xl p-4 flex-col items-center justify-center gap-3 active:scale-95 transition-transform"
            >
              <View className="p-2 rounded-full bg-gray-100 dark:bg-[#2a3642]">
                <Scissors size={24} color="#111418" className="dark:text-white" />
                {/* Note: Icon color handling in Lucide is explicit prop, class dark:text-white might not work, passing prop conditionally is hard in string. 
                      Let's use a condition for color or consistent text color. 
                      The HTML uses text-gray-700 dark:text-white. 
                  */}
              </View>
              {/* Text color fix: dark:text-white works via classes if View wraps Text */}
              <Text className="text-gray-900 dark:text-white font-bold text-sm">Hizmetleri Yönet</Text>
            </Pressable>
          </View>
        </View>

        {/* Revenue Chart Section */}
        <View className="px-4 pb-6">
          <View className="rounded-2xl bg-white dark:bg-surface-dark p-5 border border-gray-200 dark:border-[#293038]">
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="text-base font-bold text-gray-900 dark:text-white">Haftalık Gelir</Text>
                <Text className="text-xs text-gray-500 dark:text-[#9dabb9]">Son 7 günün özeti</Text>
              </View>
              <Text className="text-xl font-bold text-primary">₺{stats.totalRevenue.toLocaleString()}</Text>
            </View>

            {/* Chart Visualization */}
            <View className="flex-row items-end justify-between h-[160px] gap-2 px-1">
              {[0.4, 0.65, 0.5, 0.8, 0.95, 0.85, 0.3].map((h, i) => (
                <View key={i} className="flex-1 flex-col items-center gap-2 group w-full">
                  <View className="w-full bg-gray-100 dark:bg-[#2a3642] rounded-t-md relative h-[140px] flex items-end justify-end overflow-hidden">
                    <View
                      className={`w-full rounded-t-md ${i === 4 ? 'bg-primary' : i === 6 ? 'bg-primary/30' : 'bg-primary/70'}`}
                      style={{ height: `${h * 100}%` }}
                    />
                  </View>
                  <Text className={`text-[10px] font-medium ${i === 4 ? 'text-primary font-bold' : 'text-gray-400 dark:text-[#9dabb9]'}`}>
                    {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'][i]}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Recent Activity List */}
        <View className="px-4 pb-32">
          <View className="flex-row items-center justify-between mb-3 px-1">
            <Text className="text-lg font-bold text-gray-900 dark:text-white">Son Aktiviteler</Text>
            <Pressable onPress={() => router.push('/(business)/(tabs)/calendar')}>
              <Text className="text-sm font-medium text-primary">Tümü</Text>
            </Pressable>
          </View>

          <View className="flex-col gap-3">
            {todayAppointments.length > 0 ? todayAppointments.map((apt) => (
              <View key={apt.id} className="flex-row items-center gap-3 p-3 rounded-xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-[#293038]">
                <Image
                  source={{ uri: apt.avatar_url || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&q=80' }}
                  className="w-12 h-12 rounded-full bg-gray-200"
                />
                <View className="flex-1 min-w-0">
                  <Text className="text-sm font-bold text-gray-900 dark:text-white truncate" numberOfLines={1}>{apt.customer_name}</Text>
                  <Text className="text-xs text-gray-500 dark:text-[#9dabb9] truncate">{apt.service_names} • {apt.duration}dk</Text>
                </View>
                <View className="flex-col items-end gap-1">
                  <Text className="text-xs font-bold text-gray-900 dark:text-white">{apt.start_time}</Text>
                  <View className={`px-2 py-0.5 rounded-full ${apt.status === 'completed' ? 'bg-green-100 dark:bg-green-500/10' :
                    apt.status === 'confirmed' ? 'bg-blue-100 dark:bg-blue-500/10' :
                      apt.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-500/10' : 'bg-red-100 dark:bg-red-500/10'
                    }`}>
                    <Text className={`text-[10px] font-medium ${apt.status === 'completed' ? 'text-green-600 dark:text-green-400' :
                      apt.status === 'confirmed' ? 'text-blue-600 dark:text-blue-400' :
                        apt.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                      {apt.status === 'completed' ? 'Tamamlandı' :
                        apt.status === 'confirmed' ? 'Onaylı' :
                          apt.status === 'pending' ? 'Sırada' : 'İptal'}
                    </Text>
                  </View>
                </View>
              </View>
            )) : (
              <View className="p-8 items-center bg-white dark:bg-surface-dark rounded-xl border border-dashed border-gray-200 dark:border-[#293038]">
                <Calendar size={40} color="#6a7785" />
                <Text className="text-gray-500 dark:text-[#9dabb9] mt-2 font-medium">Bugün işlem yok</Text>
              </View>
            )}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
