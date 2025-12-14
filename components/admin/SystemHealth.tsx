import { View, Text, ActivityIndicator } from 'react-native';
import { Database, Server, Users, HardDrive } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function SystemHealth() {
    const [stats, setStats] = useState({
        users: 0,
        businesses: 0,
        staff: 0,
        dbStatus: 'checking', // 'connected' | 'error' | 'checking'
        storageUsed: 'Checking...'
    });

    useEffect(() => {
        checkSystem();
    }, []);

    const checkSystem = async () => {
        try {
            // Check DB Connection & Counts
            const { count: userCount, error: userError } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true });

            const { count: businessCount } = await supabase
                .from('businesses')
                .select('*', { count: 'exact', head: true });

            const { count: staffCount } = await supabase
                .from('business_staff')
                .select('*', { count: 'exact', head: true });

            if (userError) throw new Error('DB Error');

            setStats({
                users: userCount || 0,
                businesses: businessCount || 0,
                staff: staffCount || 0,
                dbStatus: 'connected',
                storageUsed: '45.2 MB' // Mocked: Real size requires Edge Function
            });

        } catch (e) {
            setStats(prev => ({ ...prev, dbStatus: 'error' }));
        }
    };

    return (
        <View className="bg-[#1E293B] rounded-2xl p-4 border border-white/5 mb-6">
            <Text className="text-white font-bold text-lg mb-4">Sistem Durumu</Text>

            <View className="flex-row flex-wrap gap-4">
                {/* DB Status */}
                <View className="w-[47%] bg-slate-800/50 p-3 rounded-xl border border-white/5">
                    <View className="flex-row items-center gap-2 mb-2">
                        <Database size={16} color="#64748B" />
                        <Text className="text-slate-400 text-xs font-medium">Veritabanı</Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                        <View className={`w-2 h-2 rounded-full ${stats.dbStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <Text className="text-white font-bold">
                            {stats.dbStatus === 'connected' ? 'Aktif' : 'Hata'}
                        </Text>
                    </View>
                </View>

                {/* Storage */}
                <View className="w-[47%] bg-slate-800/50 p-3 rounded-xl border border-white/5">
                    <View className="flex-row items-center gap-2 mb-2">
                        <HardDrive size={16} color="#64748B" />
                        <Text className="text-slate-400 text-xs font-medium">Medya</Text>
                    </View>
                    <Text className="text-white font-bold">{stats.storageUsed}</Text>
                </View>

                {/* Users */}
                <View className="w-[30%] bg-slate-800/50 p-3 rounded-xl border border-white/5">
                    <Text className="text-slate-400 text-[10px] font-medium mb-1">Kullanıcı</Text>
                    <Text className="text-white font-bold text-lg">{stats.users}</Text>
                </View>

                {/* Businesses */}
                <View className="w-[30%] bg-slate-800/50 p-3 rounded-xl border border-white/5">
                    <Text className="text-slate-400 text-[10px] font-medium mb-1">İşletme</Text>
                    <Text className="text-white font-bold text-lg">{stats.businesses}</Text>
                </View>

                {/* Staff */}
                <View className="w-[30%] bg-slate-800/50 p-3 rounded-xl border border-white/5">
                    <Text className="text-slate-400 text-[10px] font-medium mb-1">Personel</Text>
                    <Text className="text-white font-bold text-lg">{stats.staff}</Text>
                </View>
            </View>
        </View>
    );
}
