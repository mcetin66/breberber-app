import { View, Text, Pressable, ScrollView, Dimensions } from 'react-native';
import { StandardScreen } from '@/components/ui/StandardScreen';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import {
  Bell,
  Wallet,
  TrendingUp,
  CalendarRange,
  Users,
  Scissors,
  Calendar,
  UserSearch,
  ChevronRight,
  MoreHorizontal,
  LayoutDashboard
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/theme';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Path, Circle, Line } from 'react-native-svg';

export default function BusinessDashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  return (
    <StandardScreen
      title={user?.fullName || 'İşletme Sahibi'}
      subtitle="Hoş Geldiniz"
      headerIcon={<LayoutDashboard size={20} color="#121212" />}
      rightElement={
        <Pressable className="w-10 h-10 rounded-full bg-[#1E1E1E] border border-white/10 items-center justify-center relative">
          <Bell size={20} color={COLORS.primary.DEFAULT} />
          <View className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full" />
        </Pressable>
      }
    >
      {/* 1. Stats Carousel */}
      <View className="mb-6">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingRight: 16 }}>

          {/* Daily Card */}
          <View className="w-64 bg-[#1E1E1E] rounded-2xl p-5 border border-white/5 relative overflow-hidden h-40 justify-between">
            <View className="absolute top-0 right-0 p-4 opacity-10">
              <Wallet size={48} color={COLORS.primary.DEFAULT} />
            </View>
            <LinearGradient colors={['rgba(212, 175, 53, 0.05)', 'transparent']} className="absolute inset-0" />

            <View className="flex-row justify-between items-center z-10">
              <Text className="text-gray-400 text-sm font-medium">Günlük Ciro</Text>
              <View className="flex-row items-center bg-[#0bda1d]/10 px-2 py-1 rounded-full gap-1">
                <TrendingUp size={12} color="#0bda1d" />
                <Text className="text-[#0bda1d] text-xs font-bold">+15%</Text>
              </View>
            </View>

            <View className="z-10">
              <Text className="text-white text-3xl font-bold tracking-tight mb-1">₺12.450</Text>
              <Text className="text-xs text-gray-500">Düne göre +₺1.850 artış</Text>
            </View>
          </View>

          {/* Weekly Card */}
          <View className="w-64 bg-[#1E1E1E] rounded-2xl p-5 border border-white/5 relative overflow-hidden h-40 justify-between">
            <View className="absolute top-0 right-0 p-4 opacity-10">
              <CalendarRange size={48} color="white" />
            </View>

            <View className="flex-row justify-between items-center z-10">
              <Text className="text-gray-400 text-sm font-medium">Haftalık Ciro</Text>
              <View className="flex-row items-center bg-[#0bda1d]/10 px-2 py-1 rounded-full gap-1">
                <TrendingUp size={12} color="#0bda1d" />
                <Text className="text-[#0bda1d] text-xs font-bold">+8%</Text>
              </View>
            </View>

            <View className="z-10">
              <Text className="text-white text-3xl font-bold tracking-tight mb-1">₺84.200</Text>
              <Text className="text-xs text-gray-500">Geçen haftaya göre</Text>
            </View>
          </View>

        </ScrollView>
      </View>

      {/* 2. Quick Access Grid */}
      <View className="mb-6">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-white text-base font-bold">Hızlı Erişim</Text>
          <Text className="text-xs text-[#d4af35] font-medium">Düzenle</Text>
        </View>

        <View className="flex-row flex-wrap gap-3">
          {[
            { icon: Users, label: 'Personel', route: '/(business)/(tabs)/staff' },
            { icon: Scissors, label: 'Hizmetler', route: '/(business)/(tabs)/services' },
            { icon: Calendar, label: 'Takvim', route: '/(business)/(tabs)/calendar' },
            { icon: UserSearch, label: 'Müşteriler', route: '/(business)/customers' },
          ].map((item, index) => (
            <Pressable
              key={index}
              className="w-[48%] bg-[#1E1E1E] border border-white/5 p-4 rounded-xl items-start gap-3 active:bg-[#d4af35]/5 active:border-[#d4af35]/40"
              onPress={() => item.route && router.push(item.route as any)}
            >
              <View className="w-10 h-10 rounded-lg bg-[#2A2A2A] items-center justify-center">
                <item.icon size={24} color="white" />
              </View>
              <Text className="text-white text-sm font-semibold">{item.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* 3. Performance Chart */}
      <View className="bg-[#1E1E1E] rounded-2xl border border-white/5 p-5 mb-6">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-white text-base font-bold">Gelir Analizi</Text>
            <Text className="text-xs text-gray-400">Son 7 gün performansı</Text>
          </View>
          <View className="flex-row gap-2">
            <View className="bg-[#d4af35]/10 border border-[#d4af35]/20 px-3 py-1 rounded-md">
              <Text className="text-[#d4af35] text-xs font-semibold">Hafta</Text>
            </View>
            <View className="px-3 py-1 rounded-md">
              <Text className="text-gray-400 text-xs font-semibold">Ay</Text>
            </View>
          </View>
        </View>

        {/* SVG Chart */}
        <View className="h-[150px] w-full overflow-hidden">
          <Svg height="100%" width="100%" viewBox="0 0 300 100">
            <Defs>
              <SvgLinearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#d4af35" stopOpacity="0.3" />
                <Stop offset="1" stopColor="#d4af35" stopOpacity="0" />
              </SvgLinearGradient>
            </Defs>
            <Line x1="0" y1="0" x2="300" y2="0" stroke="#333" strokeDasharray="4 4" strokeWidth="1" />
            <Line x1="0" y1="50" x2="300" y2="50" stroke="#333" strokeDasharray="4 4" strokeWidth="1" />
            <Line x1="0" y1="100" x2="300" y2="100" stroke="#333" strokeDasharray="4 4" strokeWidth="1" />

            <Path
              d="M0,70 C50,70 50,30 100,30 C150,30 150,80 200,60 C250,40 250,10 300,20 V100 H0 Z"
              fill="url(#goldGradient)"
            />
            <Path
              d="M0,70 C50,70 50,30 100,30 C150,30 150,80 200,60 C250,40 250,10 300,20"
              fill="none"
              stroke="#d4af35"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <Circle cx="100" cy="30" r="4" fill="#121212" stroke="#d4af35" strokeWidth="2" />
            <Circle cx="200" cy="60" r="4" fill="#121212" stroke="#d4af35" strokeWidth="2" />
            <Circle cx="300" cy="20" r="4" fill="#121212" stroke="#d4af35" strokeWidth="2" />
          </Svg>
        </View>
        <View className="flex-row justify-between mt-2 px-1">
          {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((d, i) => (
            <Text key={i} className="text-xs text-gray-500 font-medium">{d}</Text>
          ))}
        </View>
      </View>

      {/* 4. Upcoming Appointments */}
      <View className="mb-6">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-white text-base font-bold">Yaklaşan Randevular</Text>
          <Text className="text-xs text-[#d4af35] font-medium">Tümünü Gör</Text>
        </View>

        {/* Items */}
        <View className="gap-2">
          {[
            { name: 'Mehmet Yılmaz', service: 'Saç & Sakal Kesimi • Volkan Bey', time: '14:30', day: 'Bugün', status: 'ONAYLI' },
            { name: 'Caner Erkin', service: 'VIP Cilt Bakımı • Selim Bey', time: '15:15', day: 'Bugün', status: 'BEKLİYOR' },
            { name: 'Burak Özçivit', service: 'Saç Boyama • Ahmet Bey', time: '09:00', day: 'Yarın', status: 'ONAYLI' },
          ].map((apt, i) => (
            <View key={i} className="flex-row items-center gap-3 p-3 rounded-xl bg-[#1E1E1E] border border-white/5">
              <View className="bg-[#2A2A2A] rounded-lg h-12 w-12 items-center justify-center border border-white/5">
                <Text className="text-xs text-gray-400 font-bold uppercase">{apt.day}</Text>
                <Text className="text-sm text-white font-bold">{apt.time}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-white text-sm font-semibold truncate">{apt.name}</Text>
                <Text className="text-gray-400 text-xs truncate">{apt.service}</Text>
              </View>
              <View>
                {apt.status === 'ONAYLI' ? (
                  <View className="bg-[#d4af35]/10 border border-[#d4af35]/20 px-2 py-1 rounded">
                    <Text className="text-[#d4af35] text-[10px] font-bold">ONAYLI</Text>
                  </View>
                ) : (
                  <View className="bg-orange-500/10 border border-orange-500/20 px-2 py-1 rounded">
                    <Text className="text-orange-400 text-[10px] font-bold">BEKLİYOR</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>

    </StandardScreen>
  );
}
