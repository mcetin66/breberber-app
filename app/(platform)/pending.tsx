import { View, Text, ScrollView, Pressable, RefreshControl, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Building2, ChevronLeft, Check, X, Clock, MapPin, Phone } from 'lucide-react-native';
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { BaseHeader } from '@/components/shared/layouts/BaseHeader';

interface PendingBusiness {
    id: string;
    name: string;
    city: string;
    phone: string;
    business_type: string;
    created_at: string;
    cover_url?: string;
}

export default function PendingScreen() {
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);
    const [pendingBusinesses, setPendingBusinesses] = useState<PendingBusiness[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPending = async () => {
        try {
            const { data, error } = await supabase
                .from('businesses')
                .select('*')
                .eq('is_active', false)
                .order('created_at', { ascending: false });

            if (!error && data) {
                setPendingBusinesses(data);
            }
        } catch (err) {
            console.error('Error fetching pending:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchPending();
        setRefreshing(false);
    }, []);

    const handleApprove = async (id: string) => {
        const { error } = await (supabase
            .from('businesses') as any)
            .update({ is_active: true })
            .eq('id', id);
        if (!error) fetchPending();
    };

    const handleReject = async (id: string) => {
        await supabase
            .from('businesses')
            .delete()
            .eq('id', id);
        fetchPending();
    };

    const getTypeLabel = (type: string) => {
        if (type === 'kuafor') return 'Kuaför';
        if (type === 'guzellik_merkezi') return 'Güzellik Merkezi';
        return 'Berber';
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <SafeAreaView className="flex-1 bg-[#121212]" edges={['top']}>
            <BaseHeader
                title="Onay Bekleyenler"
                subtitle={`${pendingBusinesses.length} işletme bekliyor`}
                showBack
            />

            <ScrollView
                className="flex-1 px-4 pt-4"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#d4af35" />
                }
            >
                {pendingBusinesses.length === 0 && !loading ? (
                    <View className="items-center py-20">
                        <Building2 size={48} color="#374151" />
                        <Text className="text-gray-500 mt-4">Bekleyen işletme yok</Text>
                    </View>
                ) : (
                    pendingBusinesses.map((business) => (
                        <View
                            key={business.id}
                            className="bg-[#1E1E1E] rounded-xl overflow-hidden mb-4 border border-white/5"
                        >
                            {/* Image */}
                            <View className="h-32 bg-[#2a2a2a]">
                                {business.cover_url ? (
                                    <Image source={{ uri: business.cover_url }} className="w-full h-full" />
                                ) : (
                                    <View className="w-full h-full items-center justify-center">
                                        <Building2 size={32} color="#374151" />
                                    </View>
                                )}
                            </View>

                            {/* Content */}
                            <View className="p-4">
                                <View className="flex-row items-start justify-between mb-3">
                                    <View className="flex-1">
                                        <Text className="text-white font-bold text-base">{business.name}</Text>
                                        <Text className="text-gray-500 text-xs mt-1">{getTypeLabel(business.business_type)}</Text>
                                    </View>
                                    <View className="bg-[#F97316]/20 px-2 py-1 rounded-md flex-row items-center gap-1">
                                        <Clock size={12} color="#F97316" />
                                        <Text className="text-[#F97316] text-[10px] font-bold">BEKLİYOR</Text>
                                    </View>
                                </View>

                                <View className="gap-2 mb-4">
                                    <View className="flex-row items-center gap-2">
                                        <MapPin size={14} color="#6B7280" />
                                        <Text className="text-gray-400 text-xs">{business.city || 'Konum belirtilmedi'}</Text>
                                    </View>
                                    <View className="flex-row items-center gap-2">
                                        <Phone size={14} color="#6B7280" />
                                        <Text className="text-gray-400 text-xs">{business.phone || 'Telefon yok'}</Text>
                                    </View>
                                    <Text className="text-gray-600 text-[10px]">Başvuru: {formatDate(business.created_at)}</Text>
                                </View>

                                {/* Actions */}
                                <View className="flex-row gap-3">
                                    <Pressable
                                        onPress={() => handleReject(business.id)}
                                        className="flex-1 py-3 rounded-xl bg-red-500/10 border border-red-500/20 flex-row items-center justify-center gap-2"
                                    >
                                        <X size={16} color="#EF4444" />
                                        <Text className="text-red-400 font-semibold">Reddet</Text>
                                    </Pressable>
                                    <Pressable
                                        onPress={() => handleApprove(business.id)}
                                        className="flex-1 py-3 rounded-xl bg-emerald-500 flex-row items-center justify-center gap-2"
                                    >
                                        <Check size={16} color="#fff" />
                                        <Text className="text-white font-semibold">Onayla</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    ))
                )}

                <View className="h-12" />
            </ScrollView>
        </SafeAreaView>
    );
}
