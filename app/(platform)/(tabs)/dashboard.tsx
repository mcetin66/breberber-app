import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Store, TrendingUp, Users, Wallet, CreditCard, ChevronRight, CheckCircle2, Briefcase, CalendarCheck2, Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useAdminStore } from '@/stores/adminStore';
import AddBusinessModal from '@/components/admin/AddBusinessModal';

// Improved Bar Component
const SimpleBar = ({ height, label, isToday }: { height: number, label: string, isToday?: boolean }) => (
  <View className="flex-1 items-center gap-2">
    {/* Bar Track */}
    <View
      className="w-3 bg-slate-700/30 rounded-full h-full relative overflow-hidden"
    >
      {/* Fill */}
      <View
        className={`w-full rounded-full absolute bottom-0 ${isToday ? 'bg-primary' : 'bg-blue-500'}`}
        style={{
          height: `${Math.max(height, 5)}%`,
          opacity: height === 0 ? 0.3 : 1
        }}
      />
    </View>
    {/* Label */}
    <Text
      className={`text-[10px] text-center ${isToday ? 'text-white font-bold' : 'text-slate-500 font-medium'}`}
      numberOfLines={1}
    >
      {label}
    </Text>
  </View>
);

import { AdminHeader } from '@/components/admin/AdminHeader';

// ... (keep existing imports)

export default function AdminDashboardScreen() {
  const router = useRouter();
  const screenWidth = Dimensions.get('window').width;
  const { aggregateStats, fetchDashboardStats, loading } = useAdminStore();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#0F172A]" edges={['top']}>
      {/* Header */}
      <AdminHeader
        title="Hoşgeldin, Admin"
        subtitle="İşte platformunun güncel durumu."
        rightElement={
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
            className="w-10 h-10 rounded-full border border-white/20"
          />
        }
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

        {/* Big Stats Card - Active Businesses */}
        <View className="px-5 mb-4">
          <View className="bg-[#1E293B] rounded-3xl p-5 relative overflow-hidden">
            <View className="flex-row justify-between items-start mb-6">
              <View className="w-10 h-10 rounded-xl bg-blue-500/20 items-center justify-center">
                <Store size={20} color="#3B82F6" />
              </View>
              <View className="bg-green-500/10 px-2 py-1 rounded-full">
                <Text className="text-green-400 text-xs font-bold">Aktif</Text>
              </View>
            </View>
            <Text className="text-slate-400 text-sm font-medium mb-1">Aktif İşletmeler</Text>
            <Text className="text-white text-4xl font-bold">{aggregateStats.totalActiveBusinesses}</Text>
          </View>
        </View>

        {/* Breakdown by Type */}
        <View className="px-5 flex-row gap-3 mb-4">
          {/* Berber */}
          <View className="flex-1 bg-[#1E293B] rounded-2xl p-4 border border-white/5">
            <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">BERBER</Text>
            <Text className="text-white text-xl font-bold">{aggregateStats.typeDistribution?.berber || 0}</Text>
          </View>
          {/* Kuaför */}
          <View className="flex-1 bg-[#1E293B] rounded-2xl p-4 border border-white/5">
            <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">KUAFÖR</Text>
            <Text className="text-white text-xl font-bold">{aggregateStats.typeDistribution?.kuafor || 0}</Text>
          </View>
          {/* Güzellik */}
          <View className="flex-1 bg-[#1E293B] rounded-2xl p-4 border border-white/5">
            <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">GÜZELLİK</Text>
            <Text className="text-white text-xl font-bold">{aggregateStats.typeDistribution?.guzellik_merkezi || 0}</Text>
          </View>
        </View>

        {/* Secondary Stats Grid */}
        <View className="px-5 flex-row gap-4 mb-8">
          {/* Total Businesses */}
          <View className="flex-1 bg-[#1E293B] rounded-3xl p-5">
            <View className="w-10 h-10 rounded-xl bg-purple-500/20 items-center justify-center mb-4">
              <Briefcase size={20} color="#A855F7" />
            </View>
            <Text className="text-slate-400 text-xs font-medium mb-1">Toplam İşletme</Text>
            <Text className="text-white text-2xl font-bold mb-1">{aggregateStats.totalBusinesses}</Text>
            <Text className="text-green-400 text-[10px]">Tüm kayıtlı işletmeler</Text>
          </View>

          {/* Appointments */}
          <View className="flex-1 bg-[#1E293B] rounded-3xl p-5">
            <View className="w-10 h-10 rounded-xl bg-orange-500/20 items-center justify-center mb-4">
              <CalendarCheck2 size={20} color="#F97316" />
            </View>
            <Text className="text-slate-400 text-xs font-medium mb-1">Toplam Randevu</Text>
            <Text className="text-white text-2xl font-bold mb-1">{aggregateStats.totalAppointments}</Text>
            <Text className="text-green-400 text-[10px]">Bugüne kadar</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-5 mb-8">
          <Text className="text-white text-lg font-bold mb-4">Hızlı İşlemler</Text>
          <View className="flex-row gap-4">
            <Pressable
              onPress={() => router.push('/(platform)/tenants')}
              className="flex-1 bg-primary rounded-2xl h-24 items-center justify-center active:scale-95 ease-in-out duration-300"
            >
              <View className="items-center gap-2">
                <Store size={24} color="white" />
                <Text className="text-white font-bold text-sm">İşletmeleri Yönet</Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => setIsAddModalVisible(true)}
              className="flex-1 bg-[#1E293B] border border-white/5 rounded-2xl h-24 items-center justify-center active:scale-95 ease-in-out duration-300"
            >
              <View className="items-center gap-2">
                <Plus size={24} color="#10B981" />
                <Text className="text-white font-bold text-sm">Yeni İşletme Ekle</Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* Revenue Chart Section */}
        <View className="px-5 mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-lg font-bold">Gelir Özeti</Text>
            <Text className="text-primary text-xs font-bold">Raporu Gör</Text>
          </View>

          <View className="bg-[#1E293B] rounded-3xl p-5">
            <View className="h-32 flex-row justify-between items-end mb-6 px-2">

            </View>

            <View className="flex-row justify-between items-end">
              <View>
                <Text className="text-slate-400 text-xs mb-1">Toplam Gelir</Text>
                <Text className="text-white text-xl font-bold">₺{aggregateStats.totalRevenue.toLocaleString('tr-TR')}</Text>
              </View>
              <View className="bg-green-500/10 px-2 py-1 rounded-md">
                <Text className="text-green-400 text-xs font-bold">+12.5%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View className="px-5 mb-24">
          <Text className="text-white text-lg font-bold mb-4">Son Aktiviteler</Text>


          {aggregateStats.recentActivity?.map((item, index) => (
            <Pressable key={index} className="bg-[#1E293B] rounded-2xl p-4 mb-3 flex-row items-center border border-white/5">
              {item.type === 'business' ? (
                <Image
                  source={{ uri: item.cover_url || 'https://via.placeholder.com/100' }}
                  className="w-10 h-10 rounded-full bg-gray-700"
                />
              ) : (
                <View className="w-10 h-10 rounded-full bg-orange-500/20 items-center justify-center">
                  <CheckCircle2 size={18} color="#F97316" />
                </View>
              )}

              <View className="flex-1 ml-3">
                <Text className="text-white font-bold text-sm">
                  {item.type === 'business' ? 'Yeni Berber' : 'Yeni Randevu'}
                </Text>
                <Text className="text-slate-400 text-xs" numberOfLines={1}>
                  {item.type === 'business'
                    ? `${item.name} sisteme katıldı.`
                    : `${item.business?.name} - ${item.service?.name}`}
                </Text>
              </View>
              <Text className="text-slate-500 text-xs">
                {new Date(item.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
              </Text>
            </Pressable>
          ))}

          {(!aggregateStats.recentActivity || aggregateStats.recentActivity.length === 0) && (
            <Text className="text-slate-500 text-center py-4">Henüz aktivite yok.</Text>
          )}
        </View>

      </ScrollView>

      <AddBusinessModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
      />
    </SafeAreaView>
  );
}
