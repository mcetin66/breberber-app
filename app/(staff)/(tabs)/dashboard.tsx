import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Users, Wallet, Bell, ChevronRight, LayoutDashboard } from 'lucide-react-native';
import { useAuthStore } from '@/stores/authStore';
import { useBusinessStore } from '@/stores/businessStore';
import { COLORS } from '@/constants/theme';
import { AppHeader } from '@/components/shared/layouts/AppHeader';

export default function StaffDashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { fetchAppointments, getAppointments, loading } = useBusinessStore();

  const [today] = useState(new Date());

  useEffect(() => {
    if (user?.barberId && user?.id) {
      const dateStr = today.toISOString().split('T')[0];
      fetchAppointments(user.barberId, dateStr);
    }
  }, [user]);

  const allAppointments = user?.barberId ? getAppointments(user.barberId) : [];
  // Filter for THIS staff
  const myAppointments = allAppointments.filter(a => a.staffName === user?.fullName);

  // Stats
  const totalCustomers = myAppointments.length;
  const estimatedRevenue = myAppointments.reduce((sum, appt) => sum + (appt.totalPrice || 0), 0);

  // Date Formatting
  const dateOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', weekday: 'long' };
  const dateString = today.toLocaleDateString('tr-TR', dateOptions);

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC] dark:bg-[#0F172A]" edges={['top']}>
      <AppHeader
        title={`Merhaba, ${user?.fullName?.split(' ')[0]}`}
        subtitle={dateString}
        rightElement={
          <Pressable className="w-10 h-10 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 relative">
            <Bell size={20} color={COLORS.text.secondary} />
            <View className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </Pressable>
        }
      />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Quick Stats */}
        <View className="flex-row gap-4 p-5 pt-0">
          <View className="flex-1 bg-white dark:bg-[#1E293B] p-4 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm relative overflow-hidden">
            <View className="absolute right-0 top-0 p-3 opacity-5">
              <Users size={64} color={COLORS.primary.DEFAULT} />
            </View>
            <View className="p-2 rounded-lg bg-primary/10 w-10 h-10 items-center justify-center mb-3">
              <Users size={20} color={COLORS.primary.DEFAULT} />
            </View>
            <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Müşteri</Text>
            <Text className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalCustomers}</Text>
          </View>

          <View className="flex-1 bg-white dark:bg-[#1E293B] p-4 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm relative overflow-hidden">
            <View className="absolute right-0 top-0 p-3 opacity-5">
              <Wallet size={64} color="#22c55e" />
            </View>
            <View className="p-2 rounded-lg bg-green-500/10 w-10 h-10 items-center justify-center mb-3">
              <Wallet size={20} color="#22c55e" />
            </View>
            <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Tahmini</Text>
            <Text className="text-3xl font-extrabold text-slate-900 dark:text-white">₺{estimatedRevenue}</Text>
          </View>
        </View>

        {/* Appointments Header */}
        <View className="px-5 mb-3 flex-row justify-between items-end">
          <Text className="text-xl font-bold text-slate-900 dark:text-white">Bugünkü Randevularım</Text>
          <Pressable onPress={() => router.push('/(staff)/(tabs)/calendar')} className="flex-row items-center gap-1">
            <Text className="text-primary text-xs font-bold">Tümü</Text>
            <ChevronRight size={14} color={COLORS.primary.DEFAULT} />
          </Pressable>
        </View>

        {/* Appointments List */}
        <View className="px-5 gap-4">
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary.DEFAULT} className="mt-10" />
          ) : myAppointments.length > 0 ? (
            myAppointments.map((appt, index) => (
              <View key={index} className="bg-white dark:bg-[#1E293B] p-4 rounded-2xl border-l-4 border-l-primary shadow-sm">
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-row gap-3 items-center">
                    <View className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden">
                      <Image
                        source={{ uri: 'https://ui-avatars.com/api/?name=' + appt.customerName }}
                        className="w-full h-full"
                      />
                    </View>
                    <View>
                      <Text className="text-base font-bold text-slate-900 dark:text-white">{appt.customerName}</Text>
                      <Text className="text-xs font-medium text-primary mt-0.5">{appt.serviceName}</Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{appt.startTime?.slice(0, 5)}</Text>
                    <Text className="text-xs font-medium text-slate-400">45 dk</Text>
                  </View>
                </View>

                <View className="h-[1px] bg-slate-100 dark:bg-white/5 my-2" />

                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                    <View className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <Text className="text-[10px] font-bold text-green-500 uppercase">Onaylandı</Text>
                  </View>
                  <Text className="text-sm font-bold text-slate-900 dark:text-white">₺{appt.totalPrice}</Text>
                </View>
              </View>
            ))
          ) : (
            <View className="items-center py-10 opacity-50">
              <Text className="text-slate-500 font-medium">Bugün için randevu yok.</Text>
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
