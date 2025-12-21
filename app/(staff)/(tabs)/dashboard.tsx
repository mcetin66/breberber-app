import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import { StandardScreen } from '@/components/ui/StandardScreen';
import { useRouter } from 'expo-router';
import { Users, Wallet, Bell, ChevronRight, LayoutDashboard } from 'lucide-react-native';
import { useAuthStore } from '@/stores/authStore';
import { useBusinessStore } from '@/stores/businessStore';
import { COLORS } from '@/constants/theme';

import * as Haptics from 'expo-haptics';

export default function StaffDashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { fetchAppointments, getAppointments, loading } = useBusinessStore();

  const [today] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    if (user?.barberId && user?.id) {
      // Use local date string construction manually to avoid UTC shift
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      await fetchAppointments(user.barberId, dateStr);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const onRefresh = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const allAppointments = user?.barberId ? getAppointments(user.barberId) : [];
  const myAppointments = allAppointments.filter(a => a.staffName === user?.fullName);

  const totalCustomers = myAppointments.length;
  const estimatedRevenue = myAppointments.reduce((sum, appt) => sum + (appt.totalPrice || 0), 0);

  const dateOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', weekday: 'long' };
  const dateString = today.toLocaleDateString('tr-TR', dateOptions);

  return (
    <StandardScreen
      title={`Merhaba, ${user?.fullName?.split(' ')[0]}`}
      subtitle={dateString}
      refreshing={refreshing}
      onRefresh={onRefresh}
      headerIcon={<LayoutDashboard size={20} color="#121212" />}
      rightElement={
        <Pressable className="w-10 h-10 rounded-full bg-[#1E1E1E] border border-white/10 items-center justify-center relative">
          <Bell size={20} color={COLORS.primary.DEFAULT} />
          <View className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full" />
        </Pressable>
      }
    >
      {/* Quick Stats */}
      <View className="flex-row gap-4 mb-6">
        <View className="flex-1 bg-[#1E1E1E] p-4 rounded-2xl border border-white/5 relative overflow-hidden">
          <View className="absolute right-0 top-0 p-3 opacity-10">
            <Users size={64} color={COLORS.primary.DEFAULT} />
          </View>
          <View className="p-2 rounded-lg bg-[#d4af35]/10 w-10 h-10 items-center justify-center mb-3">
            <Users size={20} color={COLORS.primary.DEFAULT} />
          </View>
          <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Müşteri</Text>
          <Text className="text-3xl font-extrabold text-white">{totalCustomers}</Text>
        </View>

        <View className="flex-1 bg-[#1E1E1E] p-4 rounded-2xl border border-white/5 relative overflow-hidden">
          <View className="absolute right-0 top-0 p-3 opacity-10">
            <Wallet size={64} color="#d4af35" />
          </View>
          <View className="p-2 rounded-lg bg-[#d4af35]/10 w-10 h-10 items-center justify-center mb-3">
            <Wallet size={20} color="#d4af35" />
          </View>
          <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Tahmini</Text>
          <Text className="text-3xl font-extrabold text-white">₺{estimatedRevenue}</Text>
        </View>
      </View>

      {/* Appointments Header */}
      <View className="mb-3 flex-row justify-between items-end">
        <Text className="text-xl font-bold text-white">Bugünkü Randevularım</Text>
        <Pressable onPress={() => router.push('/(staff)/(tabs)/calendar')} className="flex-row items-center gap-1">
          <Text className="text-[#d4af35] text-xs font-bold">Tümü</Text>
          <ChevronRight size={14} color={COLORS.primary.DEFAULT} />
        </Pressable>
      </View>

      {/* Appointments List */}
      <View className="gap-4 pb-20">
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary.DEFAULT} className="mt-10" />
        ) : myAppointments.length > 0 ? (
          myAppointments.map((appt, index) => (
            <View key={index} className="bg-[#1E1E1E] p-4 rounded-2xl border-l-4 border-l-[#d4af35] border border-white/5">
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-row gap-3 items-center">
                  <View className="w-12 h-12 rounded-full bg-[#2A2A2A] overflow-hidden border border-white/10">
                    <Image
                      source={{ uri: 'https://ui-avatars.com/api/?name=' + appt.customerName }}
                      className="w-full h-full"
                    />
                  </View>
                  <View>
                    <Text className="text-base font-bold text-white">{appt.customerName}</Text>
                    <Text className="text-xs font-medium text-[#d4af35] mt-0.5">{appt.serviceName}</Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-xl font-black text-white tracking-tight">{appt.startTime?.slice(0, 5)}</Text>
                  <Text className="text-xs font-medium text-gray-400">45 dk</Text>
                </View>
              </View>

              <View className="h-[1px] bg-white/5 my-2" />

              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                  <View className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <Text className="text-[10px] font-bold text-green-500 uppercase">Onaylandı</Text>
                </View>
                <Text className="text-sm font-bold text-white">₺{appt.totalPrice}</Text>
              </View>
            </View>
          ))
        ) : (
          <View className="items-center py-10 opacity-50">
            <Text className="text-gray-500 font-medium">Bugün için randevu yok.</Text>
          </View>
        )}
      </View>
    </StandardScreen>
  );
}
