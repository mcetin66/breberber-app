import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DollarSign, Users, Calendar, TrendingUp, CreditCard, ArrowUpRight, ArrowDownLeft, Filter } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { useAuthStore } from '@/stores/authStore';
import { useBusinessStore } from '@/stores/businessStore';
import { LinearGradient } from 'expo-linear-gradient';

export default function FinanceScreen() {
  const { user } = useAuthStore();
  const { financeStats, fetchFinanceStats, loading } = useBusinessStore();
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('day');

  const periodLabels: Record<string, string> = {
    'day': 'Günlük',
    'week': 'Haftalık',
    'month': 'Aylık'
  };

  useEffect(() => {
    if (user?.barberId) {
      fetchFinanceStats(user.barberId, selectedPeriod);
    }
  }, [user?.barberId, selectedPeriod]);

  if (loading && !financeStats.revenue) {
    return (
      <View className="flex-1 bg-[#121212] justify-center items-center">
        <ActivityIndicator size="large" color={COLORS.primary.DEFAULT} />
        <Text className="text-gray-400 mt-4">Veriler yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#121212]">
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="px-5 py-4 flex-row items-center justify-between border-b border-white/5">
          <View>
            <Text className="text-white text-2xl font-bold">Ödeme ve Finans</Text>
            <Text className="text-primary text-xs font-medium uppercase tracking-wider mt-1">Mali Durum Özeti</Text>
          </View>
          {/* Mock Profile or Menu Icon */}
          <View className="w-10 h-10 rounded-full bg-[#1E1E1E] border border-white/10 items-center justify-center">
            <CreditCard size={20} color={COLORS.primary.DEFAULT} />
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

          {/* Filters */}
          <View className="px-5 py-6">
            <View className="flex-row items-center bg-[#1E1E1E] p-1 rounded-xl border border-white/5 mb-6">
              {(['day', 'week', 'month'] as const).map((period) => (
                <Pressable
                  key={period}
                  onPress={() => setSelectedPeriod(period)}
                  className={`flex-1 py-2.5 items-center rounded-lg ${selectedPeriod === period ? 'bg-[#333]' : 'bg-transparent'}`}
                >
                  <Text className={`font-bold text-sm ${selectedPeriod === period ? 'text-white' : 'text-gray-500'}`}>
                    {periodLabels[period]}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Main Stats Card */}
            <LinearGradient
              colors={[COLORS.primary.DEFAULT, '#b08d2b']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-2xl p-6 shadow-lg shadow-primary/20 mb-6"
            >
              <View className="flex-row justify-between items-start mb-2">
                <View>
                  <Text className="text-[#121212]/70 font-bold text-xs uppercase tracking-wider mb-1">Toplam Ciro</Text>
                  <Text className="text-[#121212] font-black text-4xl">₺{financeStats.revenue}</Text>
                </View>
                <View className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <TrendingUp size={24} color="#121212" />
                </View>
              </View>
              <View className="flex-row items-center gap-1 mt-2">
                <View className="flex-row items-center bg-[#121212]/10 px-2 py-1 rounded">
                  <ArrowUpRight size={14} color="#121212" />
                  <Text className="text-[#121212] text-xs font-bold ml-1">%12 Artış</Text>
                </View>
                <Text className="text-[#121212]/60 text-xs ml-1">geçen {periodLabels[selectedPeriod].toLowerCase()}e göre</Text>
              </View>
            </LinearGradient>

            {/* Secondary Stats */}
            <View className="flex-row gap-4 mb-6">
              <View className="flex-1 bg-[#1E1E1E] rounded-2xl p-4 border border-white/5">
                <View className="w-10 h-10 rounded-full bg-blue-500/10 items-center justify-center mb-3">
                  <Users size={20} color="#3B82F6" />
                </View>
                <Text className="text-gray-400 text-xs font-medium">Toplam Müşteri</Text>
                <Text className="text-white text-2xl font-bold mt-1">{financeStats.customers}</Text>
              </View>
              <View className="flex-1 bg-[#1E1E1E] rounded-2xl p-4 border border-white/5">
                <View className="w-10 h-10 rounded-full bg-green-500/10 items-center justify-center mb-3">
                  <Calendar size={20} color="#10B981" />
                </View>
                <Text className="text-gray-400 text-xs font-medium">Randevular</Text>
                <Text className="text-white text-2xl font-bold mt-1">{financeStats.transactions.length}</Text>
              </View>
            </View>

            {/* Transactions List */}
            <View>
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-white text-lg font-bold">Son İşlemler</Text>
                <Pressable className="flex-row items-center">
                  <Text className="text-primary text-xs font-bold mr-1">Tümünü Gör</Text>
                  <ArrowUpRight size={12} color={COLORS.primary.DEFAULT} />
                </Pressable>
              </View>

              {financeStats.transactions.length > 0 ? (
                <View className="bg-[#1E1E1E] rounded-2xl border border-white/5 overflow-hidden">
                  {financeStats.transactions.map((trans, idx) => (
                    <View
                      key={trans.id}
                      className={`p-4 flex-row items-center justify-between ${idx !== financeStats.transactions.length - 1 ? 'border-b border-white/5' : ''}`}
                    >
                      <View className="flex-row items-center gap-3">
                        <View className="w-10 h-10 rounded-full bg-white/5 items-center justify-center">
                          <Text className="text-gray-300 font-bold">{trans.customerName?.charAt(0)}</Text>
                        </View>
                        <View>
                          <Text className="text-white font-bold text-sm">{trans.customerName || 'Müşteri'}</Text>
                          <Text className="text-gray-500 text-xs">{trans.serviceName} • {trans.startTime}</Text>
                        </View>
                      </View>
                      <View className="items-end">
                        <Text className="text-white font-bold text-base">₺{trans.totalPrice}</Text>
                        <Text className="text-xs text-green-500 font-medium">Başarılı</Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View className="items-center justify-center py-10 bg-[#1E1E1E] rounded-2xl border border-white/5 border-dashed">
                  <Text className="text-gray-500">Henüz işlem bulunmuyor.</Text>
                </View>
              )}
            </View>

          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
