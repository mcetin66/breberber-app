import { View, Text, ScrollView, Pressable, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Megaphone, ChevronLeft, Send, Users, Store, Crown, CheckCircle, History } from 'lucide-react-native';
import { useState, useEffect, useCallback } from 'react';
import { useAdminStore } from '@/stores/adminStore';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase';

interface Announcement {
    id: string;
    title: string;
    message: string;
    target_audience: string;
    sent_at: string;
    read_count: number;
}

export default function AnnouncementScreen() {
    const router = useRouter();
    const { aggregateStats } = useAdminStore();
    const { user } = useAuthStore();
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [recentAnnouncements, setRecentAnnouncements] = useState<Announcement[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(true);

    const [form, setForm] = useState({
        title: '',
        message: '',
        targetAudience: 'all' as 'all' | 'silver' | 'gold' | 'platinum',
    });

    const audiences = [
        { id: 'all', label: 'Tüm İşletmeler', icon: Store, count: aggregateStats.totalBusinesses || 0, color: '#d4af35' },
        { id: 'silver', label: 'Silver Plan', icon: Crown, count: aggregateStats.planDistribution?.silver || 0, color: '#94A3B8' },
        { id: 'gold', label: 'Gold Plan', icon: Crown, count: aggregateStats.planDistribution?.gold || 0, color: '#d4af35' },
        { id: 'platinum', label: 'Platinum Plan', icon: Crown, count: aggregateStats.planDistribution?.platinum || 0, color: '#22D3EE' },
    ];

    // Fetch recent announcements
    const fetchRecentAnnouncements = useCallback(async () => {
        setLoadingHistory(true);
        try {
            const { data, error } = await (supabase
                .from('announcements') as any)
                .select('*')
                .order('sent_at', { ascending: false })
                .limit(5);

            if (!error && data) {
                setRecentAnnouncements(data);
            }
        } catch (err) {
            console.error('Error fetching announcements:', err);
        } finally {
            setLoadingHistory(false);
        }
    }, []);

    useEffect(() => {
        fetchRecentAnnouncements();
    }, []);

    const handleSend = async () => {
        if (!form.title.trim() || !form.message.trim()) {
            Alert.alert('Hata', 'Başlık ve mesaj alanlarını doldurun.');
            return;
        }

        setSending(true);
        try {
            const { error } = await (supabase
                .from('announcements') as any)
                .insert({
                    title: form.title,
                    message: form.message,
                    target_audience: form.targetAudience,
                    sent_by: user?.id,
                    is_active: true,
                });

            if (error) {
                console.error('Send error:', error);
                Alert.alert('Hata', 'Duyuru gönderilemedi.');
                setSending(false);
                return;
            }

            // Log to audit
            await (supabase
                .from('audit_logs') as any)
                .insert({
                    action: 'ANNOUNCEMENT_SENT',
                    user_id: user?.id,
                    details: {
                        title: form.title,
                        target: form.targetAudience,
                        recipient_count: selectedAudience?.count || 0,
                    }
                });

            setSending(false);
            setSent(true);

            setTimeout(() => {
                router.back();
            }, 2000);

        } catch (err) {
            console.error('Send error:', err);
            Alert.alert('Hata', 'Bir hata oluştu.');
            setSending(false);
        }
    };

    const selectedAudience = audiences.find(a => a.id === form.targetAudience);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    };

    if (sent) {
        return (
            <SafeAreaView className="flex-1 bg-[#121212] items-center justify-center px-8" edges={['top']}>
                <View className="w-20 h-20 rounded-full bg-emerald-500/20 items-center justify-center mb-6">
                    <CheckCircle size={40} color="#10B981" />
                </View>
                <Text className="text-white text-2xl font-bold text-center">Duyuru Gönderildi!</Text>
                <Text className="text-gray-500 text-center mt-2">
                    {selectedAudience?.count} işletmeye bildirim gönderildi.
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#121212]" edges={['top']}>
            {/* Header */}
            <View className="px-4 py-3 flex-row items-center gap-3 border-b border-white/5">
                <Pressable
                    onPress={() => router.back()}
                    className="w-10 h-10 rounded-full bg-[#1E1E1E] items-center justify-center border border-white/10"
                >
                    <ChevronLeft size={20} color="#fff" />
                </Pressable>
                <View className="flex-row items-center gap-3 flex-1">
                    <View className="w-10 h-10 rounded-full bg-[#8B5CF6] items-center justify-center">
                        <Megaphone size={20} color="#fff" />
                    </View>
                    <View>
                        <Text className="text-white text-lg font-bold">Duyuru Gönder</Text>
                        <Text className="text-gray-500 text-xs">Tüm işletmelere bildirim</Text>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1 px-4 pt-4" keyboardShouldPersistTaps="handled">
                {/* Target Audience */}
                <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-3 ml-1">HEDEF KİTLE</Text>
                <View className="flex-row flex-wrap gap-2 mb-6">
                    {audiences.map((audience) => {
                        const Icon = audience.icon;
                        const isSelected = form.targetAudience === audience.id;
                        return (
                            <Pressable
                                key={audience.id}
                                onPress={() => setForm({ ...form, targetAudience: audience.id as any })}
                                className={`flex-1 min-w-[45%] p-3 rounded-xl border ${isSelected ? 'border-[#d4af35] bg-[#d4af35]/10' : 'border-white/5 bg-[#1E1E1E]'}`}
                            >
                                <View className="flex-row items-center gap-2 mb-1">
                                    <Icon size={14} color={audience.color} />
                                    <Text className={`text-xs font-medium ${isSelected ? 'text-[#d4af35]' : 'text-gray-400'}`}>
                                        {audience.label}
                                    </Text>
                                </View>
                                <Text className="text-white text-lg font-bold">{audience.count}</Text>
                            </Pressable>
                        );
                    })}
                </View>

                {/* Title */}
                <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-3 ml-1">DUYURU BAŞLIĞI</Text>
                <View className="bg-[#1E1E1E] rounded-xl border border-white/5 mb-6">
                    <TextInput
                        value={form.title}
                        onChangeText={(v) => setForm({ ...form, title: v })}
                        placeholder="Örn: Önemli Güncelleme"
                        placeholderTextColor="#6B7280"
                        className="text-white px-4 py-4 text-base"
                        maxLength={100}
                    />
                </View>

                {/* Message */}
                <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-3 ml-1">MESAJ İÇERİĞİ</Text>
                <View className="bg-[#1E1E1E] rounded-xl border border-white/5 mb-6">
                    <TextInput
                        value={form.message}
                        onChangeText={(v) => setForm({ ...form, message: v })}
                        placeholder="Duyuru mesajınızı yazın..."
                        placeholderTextColor="#6B7280"
                        className="text-white px-4 py-4 text-base"
                        multiline
                        numberOfLines={6}
                        textAlignVertical="top"
                        maxLength={500}
                        style={{ minHeight: 150 }}
                    />
                </View>

                {/* Character count */}
                <Text className="text-gray-600 text-xs text-right mb-6">{form.message.length}/500 karakter</Text>

                {/* Preview */}
                {form.title || form.message ? (
                    <View className="mb-6">
                        <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-3 ml-1">ÖNİZLEME</Text>
                        <View className="bg-[#1E1E1E] rounded-xl p-4 border border-white/5">
                            <View className="flex-row items-center gap-2 mb-2">
                                <View className="w-8 h-8 rounded-full bg-[#d4af35] items-center justify-center">
                                    <Megaphone size={14} color="#121212" />
                                </View>
                                <Text className="text-white font-bold flex-1">{form.title || 'Başlık'}</Text>
                                <Text className="text-gray-600 text-xs">Şimdi</Text>
                            </View>
                            <Text className="text-gray-300 text-sm leading-5">{form.message || 'Mesaj içeriği...'}</Text>
                        </View>
                    </View>
                ) : null}

                {/* Send Button */}
                <Pressable
                    onPress={handleSend}
                    disabled={sending || !form.title || !form.message}
                    className={`bg-[#8B5CF6] rounded-xl py-4 flex-row items-center justify-center gap-2 mb-6 ${(sending || !form.title || !form.message) ? 'opacity-50' : ''}`}
                >
                    {sending ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Send size={18} color="#fff" />
                    )}
                    <Text className="text-white font-bold text-base">
                        {sending ? 'Gönderiliyor...' : `${selectedAudience?.count} İşletmeye Gönder`}
                    </Text>
                </Pressable>

                {/* Recent Announcements */}
                <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-3 ml-1">SON DUYURULAR</Text>
                {loadingHistory ? (
                    <View className="items-center py-8">
                        <ActivityIndicator size="small" color="#6B7280" />
                    </View>
                ) : recentAnnouncements.length === 0 ? (
                    <View className="bg-[#1E1E1E] rounded-xl p-4 border border-white/5 items-center">
                        <History size={24} color="#374151" />
                        <Text className="text-gray-500 mt-2">Henüz duyuru gönderilmemiş</Text>
                    </View>
                ) : (
                    <View className="bg-[#1E1E1E] rounded-xl overflow-hidden border border-white/5 mb-8">
                        {recentAnnouncements.map((announcement, idx) => (
                            <View
                                key={announcement.id}
                                className={`p-4 ${idx < recentAnnouncements.length - 1 ? 'border-b border-white/5' : ''}`}
                            >
                                <View className="flex-row items-center justify-between mb-1">
                                    <Text className="text-white font-semibold flex-1" numberOfLines={1}>{announcement.title}</Text>
                                    <Text className="text-gray-600 text-xs">{formatDate(announcement.sent_at)}</Text>
                                </View>
                                <Text className="text-gray-400 text-xs" numberOfLines={2}>{announcement.message}</Text>
                                <View className="flex-row items-center gap-2 mt-2">
                                    <View className="bg-[#8B5CF6]/20 px-2 py-0.5 rounded">
                                        <Text className="text-[#8B5CF6] text-[10px]">{announcement.target_audience}</Text>
                                    </View>
                                    <Text className="text-gray-600 text-[10px]">{announcement.read_count} okundu</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                <View className="h-8" />
            </ScrollView>
        </SafeAreaView>
    );
}
