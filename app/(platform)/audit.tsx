import { View, Text, FlatList, ActivityIndicator, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Shield, Clock, Search, Filter, AlertCircle, X, ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { BaseHeader } from '@/components/shared/layouts/BaseHeader';

// ... (keep interface ActionFilters etc)

interface AuditLog {
    id: string;
    action: string;
    details: any;
    created_at: string;
    user_id: string;
    user?: {
        full_name: string;
        email: string;
        role: string;
    };
}

const ACTION_FILTERS = [
    { id: 'ALL', label: 'Tümü' },
    { id: 'AUTH', label: 'Giriş/Çıkış' },
    { id: 'BUSINESS', label: 'İşletme' },
    { id: 'PROFILE', label: 'Profil' },
    { id: 'SYSTEM', label: 'Sistem' }
];

export default function AuditLogScreen() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('ALL');

    useEffect(() => {
        fetchLogs();
    }, [activeFilter]);
    // ...

    const fetchLogs = async () => {
        setLoading(true);

        let query = supabase
            .from('audit_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);

        // Apply Filters
        if (activeFilter === 'AUTH') {
            query = query.in('action', ['AUTH_LOGIN', 'AUTH_LOGOUT', 'PASSWORD_UPDATE']);
        } else if (activeFilter === 'BUSINESS') {
            query = query.like('action', 'BUSINESS%');
        } else if (activeFilter === 'PROFILE') {
            query = query.eq('action', 'PROFILE_UPDATE');
        }

        const { data: logsData, error } = await query;

        if (logsData) {
            // Cast to any to avoid TS errors
            const rawLogs = logsData as any[];
            const userIds = [...new Set(rawLogs.map(l => l.user_id).filter(Boolean))];

            let profilesMap: { [key: string]: any } = {};

            if (userIds.length > 0) {
                const { data: profilesData } = await supabase
                    .from('profiles')
                    .select('id, full_name, email, role')
                    .in('id', userIds);

                (profilesData as any[])?.forEach(p => {
                    profilesMap[p.id] = p;
                });
            }

            const mergedLogs: AuditLog[] = rawLogs.map(log => ({
                id: log.id,
                action: log.action,
                details: log.details,
                created_at: log.created_at,
                user_id: log.user_id,
                user: profilesMap[log.user_id]
            }));

            setLogs(mergedLogs);
        }
        setLoading(false);
    };

    const formatActionName = (action: string) => {
        const map: { [key: string]: string } = {
            'AUTH_LOGIN': 'Giriş Yapıldı',
            'AUTH_LOGOUT': 'Çıkış Yapıldı',
            'PROFILE_UPDATE': 'Profil Güncellendi',
            'PASSWORD_UPDATE': 'Şifre Değiştirildi',
            'BUSINESS_CREATE': 'Yeni İşletme',
            'BUSINESS_UPDATE': 'İşletme Güncellendi',
            'BUSINESS_DELETE': 'İşletme Silindi',
            'SYSTEM_ERROR': 'Sistem Hatası'
        };
        return map[action] || action;
    };

    const formatKey = (key: string) => {
        const map: { [key: string]: string } = {
            'email': 'E-posta',
            'role': 'Rol',
            'name': 'İşletme Adı',
            'type': 'Tür',
            'owner_email': 'Sahip E-posta',
            'owner_name': 'Sahip Adı',
            'changes': 'Değişiklikler',
            'method': 'Yöntem'
        };
        return map[key] || key.replace(/_/g, ' ');
    };

    const renderLogItem = ({ item }: { item: AuditLog }) => {
        const subjectName = item.details?.owner_name || item.details?.name || item.details?.email || '-';
        const subjectEmail = item.details?.owner_email || (item.details?.email !== subjectName ? item.details?.email : null);

        return (
            <View className="bg-[#1E1E1E] rounded-xl mb-3 border border-white/5 overflow-hidden">
                <View className="flex-row items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                    <View className="flex-row items-center gap-2">
                        <View className={`w-2 h-2 rounded-full ${item.action.includes('DELETE') ? 'bg-red-500' : item.action.includes('UPDATE') ? 'bg-orange-500' : 'bg-green-500'}`} />
                        <Text className="text-white font-bold text-sm">{formatActionName(item.action)}</Text>
                    </View>
                    <Text className="text-gray-400 text-[10px] font-medium">
                        {format(new Date(item.created_at), 'dd.MM.yyyy HH:mm', { locale: tr })}
                    </Text>
                </View>

                <View className="p-4 flex-row">
                    <View className="flex-1 pr-4 border-r border-white/5">
                        <Text className="text-gray-500 text-[10px] uppercase font-bold mb-1">İŞLEMİ YAPAN</Text>
                        <View className="flex-row items-center gap-2 mb-1">
                            <Text className="text-white text-xs font-medium" numberOfLines={1}>
                                {item.user?.full_name || 'Sistem'}
                            </Text>
                            {item.user?.role && (
                                <View className="bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                                    <Text className="text-blue-400 text-[8px] font-bold uppercase">{item.user.role}</Text>
                                </View>
                            )}
                        </View>
                        <Text className="text-gray-500 text-[10px]" numberOfLines={1}>
                            {item.user?.email || '-'}
                        </Text>
                    </View>

                    <View className="flex-1 pl-4">
                        <Text className="text-gray-500 text-[10px] uppercase font-bold mb-1">İLGİLİ HESAP / İŞLETME</Text>
                        <Text className="text-white text-xs font-medium mb-0.5" numberOfLines={1}>
                            {subjectName}
                        </Text>
                        {subjectEmail && (
                            <Text className="text-gray-500 text-[10px]" numberOfLines={1}>
                                {subjectEmail}
                            </Text>
                        )}
                    </View>
                </View>

                <View className="px-4 pb-3 pt-0 flex-row flex-wrap gap-x-4 gap-y-1">
                    {Object.entries(item.details || {}).map(([key, value]) => {
                        if (['owner_name', 'owner_email', 'name', 'email', 'owner', 'owner_id', 'user_id', 'business_id', 'role'].includes(key)) return null;

                        const displayValue = typeof value === 'object'
                            ? JSON.stringify(value).substring(0, 30) + '...'
                            : String(value);

                        return (
                            <Text key={key} className="text-gray-500 text-[10px]">
                                <Text className="font-medium text-gray-400">{formatKey(key)}:</Text> {displayValue}
                            </Text>
                        );
                    })}
                </View>
            </View>
        );
    };



    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-[#121212]" edges={['top']}>
            <BaseHeader
                title="Sistem Kayıtları"
                subtitle="Log ve aktivite takibi"
                showBack
            />

            {/* Filters */}
            <View className="py-4 border-b border-white/5">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                    {ACTION_FILTERS.map(filter => (
                        <Pressable
                            key={filter.id}
                            onPress={() => setActiveFilter(filter.id)}
                            className={`mr-3 px-5 py-2.5 rounded-full ${activeFilter === filter.id
                                ? 'bg-[#d4af35]'
                                : 'bg-[#1E1E1E] border border-white/10'
                                }`}
                        >
                            <Text className={`text-sm font-medium ${activeFilter === filter.id ? 'text-[#121212]' : 'text-gray-400'
                                }`}>
                                {filter.label}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#d4af35" />
                </View>
            ) : logs.length === 0 ? (
                <View className="flex-1 items-center justify-center opacity-50">
                    <AlertCircle size={48} color="#64748B" />
                    <Text className="text-gray-400 mt-4 text-center">Kayıt bulunamadı.</Text>
                </View>
            ) : (
                <FlatList
                    data={logs}
                    renderItem={renderLogItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}
