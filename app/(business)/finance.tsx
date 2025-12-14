import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, DollarSign, Users, Calendar } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { useAuthStore } from '@/stores/authStore';
import { useBusinessStore } from '@/stores/businessStore';



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

  const statsDisplay = [
    { label: 'Ciro', value: `₺${financeStats.revenue}`, change: '%0', icon: DollarSign },
    // { label: 'Bu Hafta', value: '₺0', change: '%0', icon: Calendar }, // Removed redundant stat cards for now or adapt logic
    // { label: 'Bu Ay', value: '₺0', change: '%0', icon: TrendingUp },
    { label: 'Müşteri', value: `${financeStats.customers}`, change: '%0', icon: Users },
  ];

  if (loading && !financeStats.revenue) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color={COLORS.primary.DEFAULT} />
        <Text className="text-text-secondary font-poppins mt-4">Veriler yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          <Text className="text-white text-2xl font-poppins-bold mb-1">Gelir & Kasa</Text>
          <Text className="text-text-secondary font-poppins mb-6">
            Mali durum özeti
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
            {(['day', 'week', 'month'] as const).map((period) => (
              <Pressable
                key={period}
                onPress={() => setSelectedPeriod(period)}
                className="rounded-xl px-4 py-2 mr-2"
                style={{ backgroundColor: selectedPeriod === period ? COLORS.primary.DEFAULT : COLORS.background.card }}
              >
                <Text
                  className="font-poppins-semibold"
                  style={{ color: selectedPeriod === period ? COLORS.background.DEFAULT : COLORS.text.secondary }}
                >
                  {periodLabels[period]}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <View className="flex-row flex-wrap -mx-2 mb-6">
            {statsDisplay.map((stat, index) => (
              <View key={index} className="w-1/2 px-2 mb-4">
                <View className="bg-background-card rounded-2xl p-4">
                  <View className="flex-row items-center justify-between mb-2">
                    <stat.icon size={24} color={COLORS.primary.DEFAULT} />
                    {/* Placeholder change indicator */}
                    {/* <View className="px-2 py-1 rounded-md" style={{ backgroundColor: COLORS.status.success + '20' }}>
                      <Text className="text-status-success text-xs font-poppins-bold">{stat.change}</Text>
                    </View> */}
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
              <Text className="text-white text-lg font-poppins-bold">Son İşlemler</Text>
              <Pressable>
                <Text className="text-primary font-poppins-semibold">Tümü</Text>
              </Pressable>
            </View>

            {financeStats.transactions.length > 0 ? (
              financeStats.transactions.map((trans, idx) => (
                <View
                  key={trans.id}
                  className={`py-3 ${idx < financeStats.transactions.length - 1 ? 'border-b border-background' : ''}`}
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-1">
                      <Text className="text-white font-poppins-semibold mb-1">
                        {trans.customerName || 'Müşteri'}
                      </Text>
                      <Text className="text-text-secondary text-sm font-poppins">
                        {trans.serviceName}
                      </Text>
                      <Text className="text-text-muted text-xs font-poppins mt-1">
                        {trans.date} {trans.startTime}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-primary text-xl font-poppins-bold mb-1">
                        ₺{trans.totalPrice}
                      </Text>
                      <View className="px-2 py-1 rounded-md" style={{ backgroundColor: COLORS.background.DEFAULT }}>
                        <Text className="text-text-secondary text-xs font-poppins">
                          {trans.status === 'completed' ? 'Nakit' : 'Kredi Kartı'} {/* Mock payment method */}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <Text className="text-text-secondary text-center py-4">Bu dönemde işlem bulunamadı.</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
