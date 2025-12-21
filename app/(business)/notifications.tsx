import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator, Image, Alert } from 'react-native';
import { useNavigation } from 'expo-router';
import { StandardScreen } from '@/components/ui/StandardScreen';
import { COLORS } from '@/constants/theme';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase';
import { Check, X, Bell, Calendar, Clock, User } from 'lucide-react-native';

type Tab = 'pending' | 'confirmed' | 'cancelled';

export default function NotificationsScreen() {
    const [activeTab, setActiveTab] = useState<Tab>('pending');
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuthStore();
    const navigation = useNavigation();

    const businessId = user?.barberId;

    // Fetch Logic
    const fetchAppointments = async () => {
        if (!businessId) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select(`
          id,
          status,
          start_time,
          end_time,
          booking_date,
          total_price,
          profiles:customer_id (full_name, phone_number),
          services (name),
          business_staff (name)
        `)
                .eq('business_id', businessId)
                .eq('status', activeTab)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAppointments(data || []);
        } catch (err: any) {
            console.error(err);
            Alert.alert('Hata', 'Randevular yüklenemedi.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [activeTab, businessId]);

    // Actions
    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('bookings')
                // @ts-ignore
                .update({ status: newStatus } as any)
                .eq('id', id);

            if (error) throw error;

            // Remove from list immediately (optimistic)
            setAppointments(prev => prev.filter(a => a.id !== id));
            Alert.alert('Başarılı', newStatus === 'confirmed' ? 'Randevu onaylandı!' : 'Randevu reddedildi.');
        } catch (err: any) {
            Alert.alert('Hata', 'İşlem başarısız: ' + err.message);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <View className="bg-[#1E1E1E] p-4 rounded-xl mb-3 border border-white/5">
            {/* Header: Date & Time */}
            <View className="flex-row justify-between items-center mb-3 pb-3 border-b border-white/5">
                <View className="flex-row items-center gap-2">
                    <Calendar size={14} color="#9CA3AF" />
                    <Text className="text-zinc-400 text-xs">{new Date(item.booking_date).toLocaleDateString('tr-TR')}</Text>
                    <View className="w-1 h-1 rounded-full bg-zinc-700" />
                    <Clock size={14} color="#9CA3AF" />
                    <Text className="text-zinc-400 text-xs">{item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}</Text>
                </View>
                <Text className="text-[#d4af35] font-bold text-sm">₺{item.total_price}</Text>
            </View>

            {/* Body: Info */}
            <View className="flex-row items-start justify-between">
                <View className="gap-1 flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                        <User size={16} color="#E5E7EB" />
                        <Text className="text-white font-bold text-base">
                            {item.profiles?.full_name || 'Misafir Müşteri'}
                        </Text>
                    </View>
                    <Text className="text-zinc-400 text-sm">{item.services?.name || 'Hizmet'}</Text>
                    <Text className="text-zinc-500 text-xs">Personel: {item.business_staff?.name}</Text>
                </View>
            </View>

            {/* Footer: Actions (Only for pending) */}
            {activeTab === 'pending' && (
                <View className="flex-row gap-3 mt-4 pt-3 border-t border-white/5">
                    <Pressable
                        onPress={() => handleStatusChange(item.id, 'cancelled')}
                        className="flex-1 bg-red-500/10 border border-red-500/30 py-2.5 rounded-lg items-center flex-row justify-center gap-2 active:bg-red-500/20"
                    >
                        <X size={16} color="#EF4444" />
                        <Text className="text-red-500 font-bold text-sm">Reddet</Text>
                    </Pressable>

                    <Pressable
                        onPress={() => handleStatusChange(item.id, 'confirmed')}
                        className="flex-1 bg-green-500/10 border border-green-500/30 py-2.5 rounded-lg items-center flex-row justify-center gap-2 active:bg-green-500/20"
                    >
                        <Check size={16} color="#22C55E" />

                        <Text className="text-green-500 font-bold text-sm">Onayla</Text>
                    </Pressable>
                </View>
            )}
        </View>
    );

    return (
        <StandardScreen
            title="Bildirimler"
            subtitle="Randevu Talepleri & Durumlar"
            headerIcon={<Bell size={20} color="#121212" />}
            isScrollable={false}
            noPadding
        >
            <View className="px-4 pb-2">
                {/* Tabs */}
                <View className="flex-row bg-[#1E1E1E] p-1 rounded-xl mb-4">
                    <Pressable onPress={() => setActiveTab('pending')} className={`flex-1 py-2 rounded-lg items-center ${activeTab === 'pending' ? 'bg-[#d4af35]' : 'bg-transparent'}`}>
                        <Text className={`text-xs font-bold ${activeTab === 'pending' ? 'text-black' : 'text-zinc-500'}`}>Bekleyenler</Text>
                    </Pressable>
                    <Pressable onPress={() => setActiveTab('confirmed')} className={`flex-1 py-2 rounded-lg items-center ${activeTab === 'confirmed' ? 'bg-[#d4af35]' : 'bg-transparent'}`}>
                        <Text className={`text-xs font-bold ${activeTab === 'confirmed' ? 'text-black' : 'text-zinc-500'}`}>Onaylananlar</Text>
                    </Pressable>
                    <Pressable onPress={() => setActiveTab('cancelled')} className={`flex-1 py-2 rounded-lg items-center ${activeTab === 'cancelled' ? 'bg-[#d4af35]' : 'bg-transparent'}`}>
                        <Text className={`text-xs font-bold ${activeTab === 'cancelled' ? 'text-black' : 'text-zinc-500'}`}>Reddedilenler</Text>
                    </Pressable>
                </View>
            </View>

            <View className="flex-1 px-4">
                {loading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator color="#d4af35" />
                    </View>
                ) : (
                    <FlatList
                        data={appointments}
                        keyExtractor={item => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        ListEmptyComponent={
                            <View className="items-center justify-center py-20">
                                <Text className="text-zinc-600 font-medium">Bu kategoride randevu bulunamadı.</Text>
                            </View>
                        }
                    />
                )}
            </View>
        </StandardScreen>
    );
}
