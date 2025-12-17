import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Wallet, TrendingUp, CreditCard, DollarSign, Calendar } from 'lucide-react-native';

export default function PlatformFinanceScreen() {
    return (
        <SafeAreaView className="flex-1 bg-[#0F172A]" edges={['top']}>
            <AdminHeader title="Finans Yönetimi" subtitle="Gelir ve Ödeme Takibi" showBack={false} />

            <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                {/* Summary Cards */}
                <View className="flex-row gap-4 mb-6">
                    <View className="flex-1 bg-[#1E293B] p-4 rounded-2xl border border-white/5">
                        <View className="w-10 h-10 rounded-full bg-green-500/20 items-center justify-center mb-3">
                            <DollarSign size={20} color="#22C55E" />
                        </View>
                        <Text className="text-slate-400 text-xs font-bold uppercase">Toplam Gelir</Text>
                        <Text className="text-white text-xl font-bold mt-1">₺124,500</Text>
                    </View>
                    <View className="flex-1 bg-[#1E293B] p-4 rounded-2xl border border-white/5">
                        <View className="w-10 h-10 rounded-full bg-blue-500/20 items-center justify-center mb-3">
                            <TrendingUp size={20} color="#3B82F6" />
                        </View>
                        <Text className="text-slate-400 text-xs font-bold uppercase">Bu Ay</Text>
                        <Text className="text-white text-xl font-bold mt-1">₺28,450</Text>
                    </View>
                </View>

                {/* Recent Transactions Placeholder */}
                <Text className="text-white text-lg font-bold mb-4">Son İşlemler</Text>

                {[1, 2, 3, 4, 5].map((item) => (
                    <View key={item} className="bg-[#1E293B] p-4 rounded-2xl border border-white/5 mb-3 flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3">
                            <View className="w-10 h-10 rounded-full bg-slate-700 items-center justify-center">
                                <CreditCard size={20} color="#94A3B8" />
                            </View>
                            <View>
                                <Text className="text-white font-bold">Abonelik Yenileme</Text>
                                <Text className="text-slate-400 text-xs">İşletme #{100 + item}</Text>
                            </View>
                        </View>
                        <View className="items-end">
                            <Text className="text-green-400 font-bold">+₺499.00</Text>
                            <Text className="text-slate-500 text-[10px]">Bugün, 14:30</Text>
                        </View>
                    </View>
                ))}

                <View className="h-24" />
            </ScrollView>
        </SafeAreaView>
    );
}
