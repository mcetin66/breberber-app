
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Users, Wallet, Calendar, User, Bell, Clock, CheckCircle2, ChevronRight, LayoutDashboard } from 'lucide-react-native';
import { useAuthStore } from '@/stores/authStore';
import { useBusinessStore } from '@/stores/businessStore';
import { COLORS } from '@/constants/theme';

export default function StaffDashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { fetchAppointments, getAppointments, loading } = useBusinessStore();

  const [today] = useState(new Date());

  useEffect(() => {
    if (user?.barberId && user?.id) {
      // Fetch appointments for the business for today
      // We will filter for this staff in the view or store
      const dateStr = today.toISOString().split('T')[0];
      fetchAppointments(user.barberId, dateStr);
    }
  }, [user]);

  // Filter appointments for THIS staff
  // Note: getAppointments returns ALL appointments for the business for that day
  // We need to filter by staffId = user.id (or matches user email in staff list?)
  // AuthStore user has 'id'. BusinessStore appointments have 'staffId'.
  // We need to ensure these IDs match.
  // In `createAuthUsersForStaff`, we created Auth User with ID, and Profile with ID.
  // But `business_staff` table has its own ID.
  // We need to map Auth User -> Profile -> Business Staff ID.
  // But wait, `createAuthUsersForStaff` did NOT update `business_staff` ID to match Auth ID.
  // `business_staff` table usually has a UUID PK.
  // When we log in, we get `user.id` (Auth ID).
  // We need to know which `staffId` in `appointments` corresponds to this user.
  // 
  // In `authStore.ts`, we set `user.barberId` but we didn't explicitly set `user.staffId` (the business_staff PK).
  // We might need to look it up.
  // 
  // Let's assume for now we filter by NAME or check if we stored staff ID in metadata.
  // Actually, let's update `authStore` to also fetch `id` from `business_staff` and store it in `user.staffId` if possible.
  // 
  // Alternatively, we can filter by matching `staffName` to `user.fullName` if IDs are different.
  // Let's rely on `user.email` matching `business_staff.email` if IDs don't match.

  const allAppointments = user?.barberId ? getAppointments(user.barberId) : [];

  // Filter logic:
  // We need to find the appointment where staffId matches the current user's "staff ID".
  // Since we don't have `staffId` freely available in `user` object yet (only barberId), 
  // we might filter by Name as a fallback or Email if available in appointment (it's not).
  // Best bet: appointments have `staffName`. User has `fullName`.
  // 
  // Let's try to match by Name for now.
  const myAppointments = allAppointments.filter(a => a.staffName === user?.fullName);

  // Stats
  const totalCustomers = myAppointments.length;
  // Calculate revenue (sum of prices)
  const estimatedRevenue = myAppointments.reduce((sum, appt) => sum + (appt.totalPrice || 0), 0);

  // Date Formatting
  const dateOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', weekday: 'long' };
  const dateString = today.toLocaleDateString('tr-TR', dateOptions);

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC] dark:bg-[#0F172A]" edges={['top']}>
      {/* Header */}
      <View className="px-5 py-4 flex-row justify-between items-center bg-white dark:bg-[#1E293B] border-b border-gray-100 dark:border-white/5">
        <View className="flex-row items-center gap-3">
          <View className="relative">
            <Image
              source={{ uri: user?.avatar || 'https://ui-avatars.com/api/?name=' + user?.fullName }}
              className="w-11 h-11 rounded-full border-2 border-primary/20"
            />
            <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-[#1E293B]" />
          </View>
          <View>
            <Text className="text-base font-bold text-slate-900 dark:text-white">Merhaba, {user?.fullName?.split(' ')[0]}</Text>
            <Text className="text-xs text-slate-500 font-medium">{dateString}</Text>
          </View>
        </View>
        <Pressable className="w-10 h-10 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 relative">
          <Bell size={20} color={COLORS.text.secondary} />
          <View className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
        </Pressable>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Quick Stats */}
        <View className="flex-row gap-4 p-5">
          {/* Customers Card */}
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

          {/* Revenue Card */}
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
          <Pressable onPress={() => router.push('/(business)/(tabs)/calendar')} className="flex-row items-center gap-1">
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
                      {/* Placeholder Avatar */}
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

      {/* Bottom Nav */}
      <View className="absolute bottom-0 w-full bg-white dark:bg-[#1E293B] border-t border-slate-200 dark:border-white/5 pb-8 pt-3 px-6 flex-row justify-between items-center z-50">
        <Pressable className="items-center gap-1 w-16">
          <LayoutDashboard size={24} color={COLORS.primary.DEFAULT} />
          <Text className="text-[10px] font-bold text-primary">Panel</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/(business)/(tabs)/calendar')} className="items-center gap-1 w-16 opacity-50">
          <Calendar size={24} color="#94A3B8" />
          <Text className="text-[10px] font-medium text-slate-400">Takvim</Text>
        </Pressable>
        <Pressable onPress={() => {
          // Maybe settings or profile?
          router.push('/(business)/settings/profile');
        }} className="items-center gap-1 w-16 opacity-50">
          <User size={24} color="#94A3B8" />
          <Text className="text-[10px] font-medium text-slate-400">Profil</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
