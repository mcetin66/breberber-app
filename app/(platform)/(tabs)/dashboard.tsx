import { useEffect, useState } from 'react';
import { View, Text, Pressable, Image, ScrollView } from 'react-native';
import { Store, TrendingUp, Wallet, Clock, ChevronRight, Bell, Users, Calendar, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAdminStore } from '@/stores/adminStore';
import { AppScreen } from '@/components/shared/layouts/AppScreen';
import { BaseHeader } from '@/components/shared/layouts/BaseHeader';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { aggregateStats, fetchDashboardStats, loading } = useAdminStore();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <AppScreen
      header={
        <BaseHeader
          title="Platform Yönetimi"
          subtitle="Hoş geldiniz"
          variant="settings"
          headerIcon={<Sparkles size={20} color="#121212" />}
          showNotifications
        />
      }
    >

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

        {/* Key Metrics */}
        <View className="px-4 py-4 flex-row gap-3">
          {/* Active Businesses */}
          <View className="flex-1 bg-[#1E1E1E] p-4 rounded-xl border border-white/5">
            <View className="flex-row items-center justify-between mb-2">
              <View className="w-9 h-9 rounded-lg bg-[#d4af35]/10 items-center justify-center">
                <Store size={18} color="#d4af35" />
              </View>
              <View className="flex-row items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <TrendingUp size={10} color="#10b981" />
                <Text className="text-emerald-400 text-[10px] font-bold">+12%</Text>
              </View>
            </View>
            <Text className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider">Aktif İşletme</Text>
            <Text className="text-white text-2xl font-bold">{aggregateStats.totalActiveBusinesses}</Text>
          </View>

          {/* Total Revenue */}
          <View className="flex-1 bg-[#1E1E1E] p-4 rounded-xl border border-white/5">
            <View className="flex-row items-center justify-between mb-2">
              <View className="w-9 h-9 rounded-lg bg-[#d4af35]/10 items-center justify-center">
                <Wallet size={18} color="#d4af35" />
              </View>
              <View className="flex-row items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <TrendingUp size={10} color="#10b981" />
                <Text className="text-emerald-400 text-[10px] font-bold">+5%</Text>
              </View>
            </View>
            <Text className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider">Gelir</Text>
            <Text className="text-[#d4af35] text-xl font-bold">₺{(aggregateStats.totalRevenue || 0).toLocaleString('tr-TR')}</Text>
          </View>
        </View>

        {/* Type Breakdown */}
        <View className="px-4 mb-4">
          <View className="flex-row gap-2">
            {[
              { label: 'Berber', key: 'berber', color: '#f97316' },
              { label: 'Kuaför', key: 'kuafor', color: '#8b5cf6' },
              { label: 'Güzellik', key: 'guzellik_merkezi', color: '#ec4899' },
            ].map((type) => (
              <View key={type.key} className="flex-1 bg-[#1E1E1E] rounded-xl p-3 border border-white/5">
                <View className="flex-row items-center gap-2 mb-1">
                  <View className="w-2 h-2 rounded-full" style={{ backgroundColor: type.color }} />
                  <Text className="text-gray-500 text-[10px] font-semibold uppercase">{type.label}</Text>
                </View>
                <Text className="text-white text-lg font-bold">
                  {aggregateStats.typeDistribution?.[type.key] || 0}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-4 mb-4">
          <LinearGradient
            colors={['#d4af35', '#b89528']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="rounded-xl p-4 flex-row items-center justify-between"
          >
            <View>
              <Text className="text-black font-bold text-base">Aylık Rapor Hazır</Text>
              <Text className="text-black/70 text-xs">Platform performans analizi</Text>
            </View>
            <Pressable
              onPress={() => router.push('/(platform)/(tabs)/reports')}
              className="bg-[#121212] px-4 py-2 rounded-lg"
            >
              <Text className="text-[#d4af35] text-xs font-bold">Görüntüle</Text>
            </Pressable>
          </LinearGradient>
        </View>

        {/* Recent Activity */}
        <View className="px-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-white text-base font-bold">Son İşlemler</Text>
            <Pressable onPress={() => router.push('/(platform)/(tabs)/businesses')} className="flex-row items-center gap-1">
              <Text className="text-[#d4af35] text-xs font-semibold">Tümünü Gör</Text>
              <ChevronRight size={14} color="#d4af35" />
            </Pressable>
          </View>

          {(aggregateStats.recentActivity || []).slice(0, 5).map((item, index) => (
            <Pressable
              key={index}
              onPress={() => item.type === 'business' && router.push(`/(platform)/business-detail/${item.id}`)}
              className="flex-row items-center gap-3 bg-[#1E1E1E] p-3 rounded-xl border border-white/5 mb-2 active:border-[#d4af35]/30"
            >
              <View className="w-10 h-10 rounded-lg overflow-hidden bg-white/5">
                <Image
                  source={{ uri: item.cover_url || 'https://via.placeholder.com/100' }}
                  className="w-full h-full"
                />
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold text-sm" numberOfLines={1}>{item.name}</Text>
                <View className="flex-row items-center gap-1 mt-0.5">
                  <Clock size={10} color="#6B7280" />
                  <Text className="text-gray-500 text-[10px]">
                    {new Date(item.created_at).toLocaleDateString('tr-TR')}
                  </Text>
                </View>
              </View>
              <View className="px-2 py-1 rounded-md bg-[#d4af35]/10 border border-[#d4af35]/20">
                <Text className="text-[#d4af35] text-[10px] font-bold">
                  {item.type === 'business' ? 'YENİ' : 'İŞLEM'}
                </Text>
              </View>
            </Pressable>
          ))}

          {(!aggregateStats.recentActivity || aggregateStats.recentActivity.length === 0) && (
            <View className="bg-[#1E1E1E] p-6 rounded-xl border border-white/5 items-center">
              <Clock size={32} color="#6B7280" />
              <Text className="text-gray-500 text-sm mt-2">Henüz işlem yok</Text>
            </View>
          )}
        </View>

        <View className="h-24" />
      </ScrollView>
    </AppScreen>
  );
}
