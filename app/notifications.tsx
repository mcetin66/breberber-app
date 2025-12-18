import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check, Calendar, Percent, Bell, Clock, Tag, CheckCircle, Lightbulb, Receipt } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

// Mock Data
const NOTIFICATIONS = [
    {
        id: '1',
        type: 'appointment',
        title: 'Randevu Hatırlatması',
        message: "Bugün 14:00'te Ahmet Bey ile saç kesimi randevunuz var. Lütfen 10 dakika önce geliniz.",
        time: '2 saat önce',
        unread: true,
        icon: Clock,
        date: 'Bugün'
    },
    {
        id: '2',
        type: 'promotion',
        title: '%20 İndirim Fırsatı!',
        message: 'Sadece bu haftasonu geçerli özel "Royal Bakım" paketinde indirim kazandınız.',
        time: '4 saat önce',
        unread: true,
        icon: Tag,
        date: 'Bugün',
        meta: 'Kupon: GOLD20'
    },
    {
        id: '3',
        type: 'system',
        title: 'Randevu Onaylandı',
        message: '12 Temmuz Cuma günü için randevunuz başarıyla oluşturuldu.',
        time: 'Dün 09:41',
        unread: false,
        icon: CheckCircle,
        date: 'Dün'
    },
    {
        id: '4',
        type: 'info',
        title: 'Saç Bakım Önerisi',
        message: 'Yaz aylarında saçlarınızı güneşten korumak için önerdiğimiz yeni seriyi inceleyin.',
        time: 'Dün 18:20',
        unread: false,
        icon: Lightbulb,
        date: 'Dün'
    },
    {
        id: '5',
        type: 'payment',
        title: 'Ödeme Alındı',
        message: '750₺ tutarındaki işleminiz başarıyla gerçekleşti.',
        time: '05 Tem',
        unread: false,
        icon: Receipt,
        date: 'Geçen Hafta'
    }
];

const FILTER_CHIPS = [
    { id: 'all', label: 'Tümü', icon: Check },
    { id: 'appointment', label: 'Randevular', icon: Calendar },
    { id: 'promotion', label: 'Kampanyalar', icon: Percent },
    { id: 'system', label: 'Sistem', icon: Bell },
];

export default function NotificationsScreen() {
    const router = useRouter();
    const [activeFilter, setActiveFilter] = useState('all');

    const filteredNotifications = NOTIFICATIONS.filter(n => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'appointment') return n.type === 'appointment';
        if (activeFilter === 'promotion') return n.type === 'promotion';
        if (activeFilter === 'system') return ['system', 'payment', 'info'].includes(n.type);
        return true;
    });

    // Group by date
    const groupedNotifications = filteredNotifications.reduce((acc, curr) => {
        if (!acc[curr.date]) acc[curr.date] = [];
        acc[curr.date].push(curr);
        return acc;
    }, {} as Record<string, typeof NOTIFICATIONS>);

    return (
        <View className="flex-1 bg-[#121212]">
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <SafeAreaView edges={['top']} className="bg-[#121212]/95 backdrop-blur-md border-b border-white/5 z-50">
                <View className="flex-row items-center justify-between px-4 py-3">
                    <Pressable
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center rounded-full active:bg-white/10"
                    >
                        <ArrowLeft size={24} color="white" />
                    </Pressable>
                    <Text className="text-white text-lg font-bold tracking-tight">Bildirimler</Text>
                    <Pressable>
                        <Text className="text-primary text-sm font-semibold">Tümünü Oku</Text>
                    </Pressable>
                </View>

                {/* Filter Chips */}
                <View className="pb-4 pt-2">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
                        {FILTER_CHIPS.map((chip) => {
                            const isActive = activeFilter === chip.id;
                            return (
                                <Pressable
                                    key={chip.id}
                                    onPress={() => setActiveFilter(chip.id)}
                                    className={`flex-row items-center gap-2 px-5 py-2.5 rounded-full border ${isActive ? 'bg-primary border-primary' : 'bg-[#1E1E1E] border-white/10'}`}
                                >
                                    <chip.icon size={16} color={isActive ? '#000' : '#9ca3af'} />
                                    <Text className={`text-sm font-medium ${isActive ? 'text-black' : 'text-gray-400'}`}>
                                        {chip.label}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </ScrollView>
                </View>
            </SafeAreaView>

            <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
                {Object.entries(groupedNotifications).map(([date, notifications]) => (
                    <View key={date} className="mb-6">
                        <Text className="text-gray-500 text-xs font-bold uppercase tracking-wider pl-1 mb-3">{date}</Text>

                        <View className="gap-3">
                            {notifications.map((item) => (
                                <Pressable
                                    key={item.id}
                                    className={`relative bg-[#1E1E1E] rounded-2xl p-4 border border-white/5 flex-row gap-4 active:scale-[0.99] transition-transform ${!item.unread && 'opacity-80'}`}
                                >
                                    {/* Unread Indicator */}
                                    {item.unread && (
                                        <View className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(212,175,53,0.6)]" />
                                    )}

                                    {/* Icon */}
                                    <View className="shrink-0">
                                        <View className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.type === 'promotion' ? 'bg-primary/20' : 'bg-white/5'}`}>
                                            <item.icon size={24} color={item.type === 'promotion' ? COLORS.primary.DEFAULT : '#9ca3af'} />
                                        </View>
                                    </View>

                                    {/* Content */}
                                    <View className="flex-1 justify-center pr-4">
                                        <Text className="text-white text-base font-semibold leading-tight mb-1">{item.title}</Text>
                                        <Text className="text-gray-400 text-sm leading-snug" numberOfLines={2}>
                                            {item.message}
                                        </Text>
                                        <View className="flex-row items-center gap-2 mt-2">
                                            <Text className="text-primary text-xs font-medium">{item.time}</Text>
                                            {item.meta && (
                                                <>
                                                    <View className="w-1 h-1 rounded-full bg-gray-600" />
                                                    <Text className="text-primary text-xs font-bold">{item.meta}</Text>
                                                </>
                                            )}
                                        </View>
                                    </View>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                ))}

                <View className="h-8" />
            </ScrollView>
        </View>
    );
}
