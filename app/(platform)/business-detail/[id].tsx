
import { View, Text, ScrollView, Pressable, Image, Modal, TextInput, Platform, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { FormModal } from '@/components/common/FormModal';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, TrendingUp, Users, Calendar, DollarSign, Trash2, X, Check, MoreVertical, PenSquare, MapPin, Crown, Instagram, Upload, UserCog } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import type { Barber } from '@/types';
import { SUBSCRIPTION_PLANS, getPlanDetails } from '@/constants/plans';
import { useAdminStore } from '@/stores/adminStore';
import { useAuthStore } from '@/stores/authStore';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function AdminBarberDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { barbers, updateBusinessSubscription, deleteBusiness, updateBusinessInfo, fetchBarberDetail } = useAdminStore();

    const [barber, setBarber] = useState<Barber | undefined>(undefined);
    const [stats, setStats] = useState({ revenue: 0, bookings: 0, staffCount: 0 });

    // Animation
    const scrollY = useRef(new Animated.Value(0)).current;
    const headerBg = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: ['rgba(18, 18, 18, 0)', '#121212'], // Transparent to Dark
        extrapolate: 'clamp'
    });
    const headerTitleOpacity = scrollY.interpolate({
        inputRange: [50, 100],
        outputRange: [0, 1],
        extrapolate: 'clamp'
    });

    // Modals
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [showEditInfoModal, setShowEditInfoModal] = useState(false);
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [showLimitsModal, setShowLimitsModal] = useState(false);

    // Form States
    const [selectedTier, setSelectedTier] = useState<string>('basic');
    const [extensionMonths, setExtensionMonths] = useState(1);
    const [editForm, setEditForm] = useState({
        name: '',
        city: '',
        email: '',
        phone: '',
        address: '',
        contactName: '',
        instagram: '',
        businessType: 'berber',
        description: '',
        logo_url: '',
        cover_url: ''
    });

    useEffect(() => {
        if (id) {
            const found = barbers.find(b => b.id === id);
            setBarber(found);
            if (found) {
                setSelectedTier(found.subscriptionTier || 'basic');
                // FETCH REAL DATA
                fetchBarberDetail(found.id).then(data => {
                    if (data) setStats(data);
                });
            }
        }
    }, [id, barbers]);

    if (!barber) return <View className="flex-1 bg-[#0f0f0f]" />;

    // --- HELPER LOGIC ---
    const tierLimit = getPlanDetails(barber.subscriptionTier || 'basic').staffLimit;

    // Phone Formatter
    const formatPhoneNumber = (text: string) => {
        let cleaned = ('' + text).replace(/\D/g, '');
        // Strip leading zero if present to normalize (e.g. 0555 -> 555)
        if (cleaned.startsWith('0')) cleaned = cleaned.substring(1);
        // Limit to 10 digits (5XX ...)
        if (cleaned.length > 10) cleaned = cleaned.substring(0, 10);

        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
        if (match) {
            let formatted = match[1];
            if (match[2]) formatted = `(${match[1]}) ${match[2]} `;
            if (match[3]) formatted += ` ${match[3]} `;
            if (match[4]) formatted += ` ${match[4]} `;
            return formatted;
        }
        return cleaned;
    };

    // Date Calculations
    const getDates = () => {
        const today = new Date();
        const created = new Date(barber.createdAt || Date.now());
        let start = barber.subscription_start_date ? new Date(barber.subscription_start_date) : null;
        let end = barber.subscriptionEndDate ? new Date(barber.subscriptionEndDate) : null;

        if (!end) {
            end = new Date(created);
            end.setDate(created.getDate() + 30);
        }
        if (!start) {
            start = new Date(end);
            start.setDate(end.getDate() - 30);
        }
        return { start, end, today };
    };

    const { start, end, today } = getDates();
    const totalDuration = end.getTime() - start.getTime();
    const elapsed = today.getTime() - start.getTime();
    const daysLeft = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    let progressPercent = 0;
    if (totalDuration > 0) {
        progressPercent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
    }

    const formatDate = (date: Date) => date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'short', day: 'numeric' });
    const currentTierColor = getPlanDetails(barber.subscriptionTier || 'basic').color;

    // --- HANDLERS ---
    const handleUpdatePlan = async () => {
        if (!barber) return;
        try {
            const currentEnd = barber.subscriptionEndDate ? new Date(barber.subscriptionEndDate) : new Date();
            const baseDate = currentEnd < new Date() ? new Date() : currentEnd;
            const newEnd = new Date(baseDate);
            newEnd.setMonth(newEnd.getMonth() + extensionMonths);

            const res = await updateBusinessSubscription(barber.id, selectedTier, newEnd.toISOString());
            if (res.success) {
                Toast.show({ type: 'success', text1: 'Plan Güncellendi' });
                setShowPlanModal(false);
                setBarber({ ...barber, subscriptionTier: selectedTier, subscriptionEndDate: newEnd.toISOString() });
            } else Toast.show({ type: 'error', text1: 'Hata', text2: res.error });
        } catch (e: any) { Toast.show({ type: 'error', text1: 'Hata', text2: e.message }); }
    };

    const handleDelete = async () => {
        if (!barber) return;
        const res = await deleteBusiness(barber.id);
        if (res.success) {
            Toast.show({ type: 'success', text1: 'Berber Silindi' });
            router.back();
        } else Toast.show({ type: 'error', text1: 'Hata', text2: res.error });
    };

    const handleSaveInfo = async () => {
        if (!barber) return;
        const res = await updateBusinessInfo(barber.id, { ...editForm });
        if (res.success) {
            setBarber({ ...barber, ...editForm } as Barber);
            setShowEditInfoModal(false);
            Toast.show({ type: 'success', text1: 'Bilgiler Güncellendi' });
        } else Toast.show({ type: 'error', text1: 'Hata', text2: res.error });
    };

    const uploadImage = async (type: 'logo' | 'cover') => {
        if (!barber) return;
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: type === 'logo' ? [1, 1] : [16, 9],
                quality: 0.8,
            });

            if (!result.canceled) {
                const img = result.assets[0];
                const fileExt = img.uri.split('.').pop()?.toLowerCase() || 'jpg';
                const fileName = `${type}.${fileExt} `;
                const path = `businesses / ${barber.id} /profile/${fileName} `;

                const formData = new FormData();
                formData.append('file', {
                    uri: img.uri,
                    name: fileName,
                    type: img.mimeType || `image / ${fileExt} `,
                } as any);

                const { error } = await supabase.storage
                    .from('app-media')
                    .upload(path, formData, { upsert: true });

                if (error) throw error;

                const { data: { publicUrl } } = supabase.storage
                    .from('app-media')
                    .getPublicUrl(path);

                const urlWithTimestamp = `${publicUrl}?t = ${Date.now()} `;
                setEditForm(prev => ({ ...prev, [type === 'logo' ? 'logo_url' : 'cover_url']: urlWithTimestamp }));
                Toast.show({ type: 'success', text1: 'Resim Yüklendi' });
            }
        } catch (error: any) {
            console.error('Upload Error:', error);
            Toast.show({ type: 'error', text1: 'Yükleme Hatası', text2: error.message });
        }
    };

    // Open Edit Modal with Data
    const openEditModal = () => {
        setEditForm({
            name: barber.name || '',
            city: barber.city || '',
            email: barber.email || '',
            phone: barber.phone || '',
            address: barber.address || '',
            contactName: (barber as any).contactName || '',
            instagram: (barber as any).instagram || '',
            businessType: (barber as any).businessType || 'berber',
            description: (barber as any).description || '',
            logo_url: (barber as any).logo_url || '',
            cover_url: (barber as any).cover_url || ''
        });
        setShowEditInfoModal(true);
        setShowOptionsModal(false);
    };

    return (
        <View className="flex-1 bg-[#121212]">
            <Stack.Screen options={{ headerShown: false }} />

            {/* STICKY HEADER */}
            <Animated.View
                style={{
                    backgroundColor: headerBg,
                    paddingTop: insets.top,
                    height: 60 + insets.top
                }}
                className="absolute top-0 left-0 right-0 z-50 flex-row justify-between items-center px-4 pb-2"
            >
                <Pressable onPress={() => router.back()} className="p-2 bg-black/30 rounded-full">
                    <ChevronLeft color="white" size={24} />
                </Pressable>

                <Animated.Text style={{ opacity: headerTitleOpacity }} className="text-white font-bold text-lg shadow-black/50 shadow-lg">
                    Berber Detayı
                </Animated.Text>

                <Pressable onPress={() => setShowOptionsModal(true)} className="p-2 bg-black/30 rounded-full">
                    <MoreVertical color="white" size={24} />
                </Pressable>
            </Animated.View>

            <Animated.ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 120 }}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false } // logical property animation (backgroundColor) needs false
                )}
                scrollEventThrottle={16}
            >
                {/* 1. Header with Background Image */}
                <View className="relative h-40 mb-12">
                    <Image
                        source={{ uri: barber.coverImage || 'https://via.placeholder.com/400' }}
                        className="w-full h-full opacity-40"
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={['rgba(18, 18, 18, 0.3)', '#121212']}
                        className="absolute inset-0"
                    />



                    {/* Centered Profile Image */}
                    <View className="absolute -bottom-12 left-0 right-0 items-center z-10">
                        <View className="relative">
                            <Image
                                source={{ uri: barber.coverImage || 'https://via.placeholder.com/150' }}
                                className="w-28 h-28 rounded-full border-[6px] border-[#121212]"
                            />
                            <View className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-[#121212] ${barber.isOpen ? 'bg-green-500' : 'bg-gray-500'}`} />
                        </View>
                    </View>
                </View>

                {/* 2. Profile Info */}
                <View className="items-center px-4 mb-8">
                    <Text className="text-white text-2xl font-bold mb-1">{barber.name}</Text>
                    {(barber as any).contactName && (
                        <Text className="text-gray-400 text-sm font-medium mb-2">{(barber as any).contactName}</Text>
                    )}

                    {(barber as any).instagram && (
                        <View className="flex-row items-center gap-1.5 mb-3 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                            <Instagram size={14} color="#F472B6" />
                            <Text className="text-gray-300 text-xs font-semibold">@{(barber as any).instagram.replace('@', '')}</Text>
                        </View>
                    )}

                    <View className="flex-row items-center gap-3 mb-2">
                        <View className="bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                            <Text className="text-green-500 text-xs font-bold uppercase">{barber.isActive ? 'Aktif' : 'Pasif'}</Text>
                        </View>
                        <View className="bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                            <Text className="text-blue-500 text-xs font-bold uppercase">
                                {(barber as any).businessType === 'kuafor' ? 'Kuaför' : (barber as any).businessType === 'guzellik_merkezi' ? 'Güzellik' : 'Berber'}
                            </Text>
                        </View>
                        <Text className="text-gray-500 text-sm font-medium">ID: #{barber.id.substring(0, 6)}</Text>
                    </View>

                    <Text className="text-gray-500 text-xs">Katılım Tarihi: {formatDate(new Date(barber.createdAt || Date.now()))}</Text>
                </View>

                {/* 3. Stats Grid */}
                <View className="flex-row px-4 gap-4 mb-8">
                    <View className="flex-1 bg-[#1E1E1E] p-5 rounded-2xl border border-white/5">
                        <View className="w-10 h-10 rounded-xl bg-[#d4af35]/10 items-center justify-center mb-3">
                            <DollarSign size={20} color="#d4af35" />
                        </View>
                        <Text className="text-gray-400 text-xs font-medium mb-1">Toplam Gelir</Text>
                        <Text className="text-white text-xl font-bold">₺{stats.revenue.toLocaleString('tr-TR')}</Text>
                    </View>

                    <View className="flex-1 bg-[#1E1E1E] p-5 rounded-2xl border border-white/5">
                        <View className="w-10 h-10 rounded-xl bg-[#d4af35]/10 items-center justify-center mb-3">
                            <Calendar size={20} color="#d4af35" />
                        </View>
                        <Text className="text-gray-400 text-xs font-medium mb-1">Randevular</Text>
                        <Text className="text-white text-xl font-bold">{stats.bookings}</Text>
                    </View>
                </View>

                {/* 4. Subscription & Limits Card */}
                <View className="px-4 mb-4">
                    <View className="flex-row items-center gap-2 mb-4">
                        <Check size={18} color="#d4af35" strokeWidth={4} />
                        <Text className="text-white text-base font-bold">Abonelik & Limitler</Text>
                    </View>

                    <View className="bg-[#1E1E1E] rounded-2xl p-5 border border-white/5">
                        <View className="flex-row justify-between items-start mb-6">
                            <View>
                                <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">MEVCUT PLAN</Text>
                                <View className="flex-row items-center gap-2">
                                    <View style={{ backgroundColor: currentTierColor + '20' }} className="p-1 rounded-full">
                                        <Crown size={14} color={currentTierColor} fill={currentTierColor} />
                                    </View>
                                    <Text className="text-lg font-bold" style={{ color: currentTierColor }}>
                                        {getPlanDetails(barber.subscriptionTier || 'basic').label}
                                    </Text>
                                </View>
                            </View>
                            <View className="items-end">
                                <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">KALAN GÜN</Text>
                                <Text className={`text - xl font - bold ${daysLeft < 7 ? 'text-red-400' : 'text-white'} `}>
                                    {Math.max(0, daysLeft)}
                                </Text>
                            </View>
                        </View>

                        {/* Progress */}
                        <View className="h-2.5 bg-white/10 rounded-full mb-2 overflow-hidden border border-white/5">
                            <View
                                className="h-full rounded-full"
                                style={{ width: `${Math.max(5, progressPercent)}%` as any, backgroundColor: currentTierColor }}
                            />
                        </View>
                        <Text className="text-gray-500 text-[10px] text-right mb-6">Yenilenme: {formatDate(end)}</Text>

                        {/* 4-Grid Stats */}
                        <View className="flex-row flex-wrap gap-y-6">
                            <View className="w-1/2 pr-2">
                                <Text className="text-gray-500 text-[10px] uppercase font-bold mb-1">PERSONEL LİMİTİ</Text>
                                <Text className="text-slate-300 text-sm font-semibold">{stats.staffCount} / {tierLimit} Aktif</Text>
                            </View>
                            <View className="w-1/2 pl-2">
                                <Text className="text-gray-500 text-[10px] uppercase font-bold mb-1">SONRAKİ FATURA</Text>
                                <Text className="text-slate-300 text-sm font-semibold">{formatDate(end)}</Text>
                            </View>
                            <View className="w-1/2 pr-2">
                                <Text className="text-gray-500 text-[10px] uppercase font-bold mb-1">LOKASYONLAR</Text>
                                <Text className="text-slate-300 text-sm font-semibold">1 Şube</Text>
                            </View>
                            <View className="w-1/2 pl-2">
                                <Text className="text-gray-500 text-[10px] uppercase font-bold mb-1">KATILIM TARİHİ</Text>
                                <Text className="text-slate-300 text-sm font-semibold">{formatDate(new Date(barber.createdAt || Date.now()))}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* 5. Actions */}
                <View className="p-4 mb-8">
                    <Text className="text-white text-base font-bold mb-4">İşlemler</Text>

                    {/* Impersonate Button */}
                    <Pressable
                        onPress={() => {
                            if (!barber) return;
                            const { impersonateBusiness } = useAuthStore.getState();
                            impersonateBusiness(barber.id, barber.name);
                            router.replace('/(business)/(tabs)/dashboard');
                        }}
                        className="bg-[#d4af35] rounded-xl py-4 flex-row items-center justify-center gap-3 mb-3 shadow-lg shadow-[#d4af35]/20 active:opacity-90"
                    >
                        <UserCog size={18} color="white" />
                        <Text className="text-black font-bold text-sm uppercase tracking-wide">Bu İşletmeyi Yönet</Text>
                    </Pressable>

                    {/* Full Width Blue Button */}
                    <Pressable
                        onPress={() => setShowPlanModal(true)}
                        className="bg-blue-600 rounded-xl py-4 flex-row items-center justify-center gap-3 mb-3 shadow-lg shadow-blue-500/20 active:opacity-90"
                    >
                        <TrendingUp size={18} color="white" />
                        <Text className="text-white font-bold text-sm uppercase tracking-wide">Planı Yükselt</Text>
                    </Pressable>

                    <View className="flex-row gap-3">
                        <Pressable
                            onPress={() => setShowLimitsModal(true)}
                            className="flex-1 bg-[#1E293B] border border-white/10 rounded-xl py-4 flex-row items-center justify-center gap-3 active:bg-[#2a3850]"
                        >
                            <Users size={18} color="white" />
                            <Text className="text-white font-bold text-sm">Limitler</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => handleDelete()}
                            className="flex-1 bg-red-500/10 border border-red-500/20 rounded-xl py-4 flex-row items-center justify-center gap-3 active:bg-red-500/20"
                        >
                            <Trash2 size={18} color="#EF4444" />
                            <Text className="text-red-400 font-bold text-sm">Askıya Al</Text>
                        </Pressable>
                    </View>
                </View>
            </Animated.ScrollView>

            {/* --- MODALS --- */}

            {/* Options Modal (Top-Right Dropdown Position) */}
            <Modal
                transparent={true}
                visible={showOptionsModal}
                animationType="fade"
                onRequestClose={() => setShowOptionsModal(false)}
            >
                <Pressable className="flex-1" onPress={() => setShowOptionsModal(false)}>
                    {/* Positioned at Top Right */}
                    <View className="absolute top-16 right-4 w-60 bg-[#1E293B] rounded-2xl border border-white/10 shadow-2xl p-2 z-50">
                        <Pressable onPress={openEditModal} className="flex-row items-center py-3 px-3 active:bg-white/5 rounded-xl border-b border-white/5">
                            <PenSquare size={18} color="white" className="mr-3" />
                            <Text className="text-white text-sm font-medium">Bilgileri Düzenle</Text>
                        </Pressable>



                        <Pressable onPress={() => { setShowOptionsModal(false); handleDelete(); }} className="flex-row items-center py-3 px-3 active:bg-red-500/10 rounded-xl">
                            <Trash2 size={18} color="#EF4444" className="mr-3" />
                            <Text className="text-red-400 text-sm font-medium">İşletmeyi Sil</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>

            {/* Limits Modal (New) */}
            <Modal
                transparent={true}
                visible={showLimitsModal}
                animationType="fade"
                onRequestClose={() => setShowLimitsModal(false)}
            >
                <Pressable className="flex-1 bg-black/80 items-center justify-center p-4" onPress={() => setShowLimitsModal(false)}>
                    <Pressable className="bg-[#1E293B] w-full max-w-sm rounded-3xl p-6 border border-white/10" onPress={(e) => e.stopPropagation()}>
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-white text-xl font-bold">Limit Yönetimi</Text>
                            <Pressable onPress={() => setShowLimitsModal(false)}>
                                <X size={24} color="#666" />
                            </Pressable>
                        </View>

                        <View className="gap-4">
                            <View className="flex-row justify-between items-center bg-[#0F172A] p-4 rounded-xl border border-white/5">
                                <View>
                                    <Text className="text-white font-bold text-base">Personel Limiti</Text>
                                    <Text className="text-gray-400 text-xs">Mevcut plan limiti</Text>
                                </View>
                                <View className="flex-row items-center gap-3">
                                    <Text className="text-white font-bold text-xl">{tierLimit}</Text>
                                    <Pressable onPress={() => { setShowLimitsModal(false); setShowPlanModal(true); }} className="bg-blue-600 px-3 py-1.5 rounded-lg">
                                        <Text className="text-white text-xs font-bold">Yükselt</Text>
                                    </Pressable>
                                </View>
                            </View>

                            <View className="flex-row justify-between items-center bg-[#0F172A] p-4 rounded-xl border border-white/5">
                                <View>
                                    <Text className="text-white font-bold text-base">Şube Hakkı</Text>
                                    <Text className="text-gray-400 text-xs">Toplam Lokasyon</Text>
                                </View>
                                <View className="flex-row items-center gap-3">
                                    <Text className="text-white font-bold text-xl">1</Text>
                                    <Pressable className="bg-gray-700 px-3 py-1.5 rounded-lg opacity-50">
                                        <Text className="text-white text-xs font-bold">Sabit</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                        <Text className="text-center text-gray-500 text-xs mt-6">
                            Limitleri kalıcı olarak değiştirmek için lütfen işletmenin abonelik planını yükseltin.
                        </Text>
                    </Pressable>
                </Pressable>
            </Modal>

            {/* Plan Modal */}
            <Modal
                transparent={true}
                visible={showPlanModal}
                animationType="fade"
                onRequestClose={() => setShowPlanModal(false)}
            >
                <View className="flex-1 bg-black/80 items-center justify-center p-4">
                    <View className="bg-[#1a1a1a] w-full max-w-sm rounded-3xl p-6 border border-white/10">
                        {/* ... (Same Plan Modal Content) ... */}
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-white text-xl font-bold">Planı Yükselt</Text>
                            <Pressable onPress={() => setShowPlanModal(false)}>
                                <X size={24} color="#666" />
                            </Pressable>
                        </View>
                        <Text className="text-gray-400 text-xs font-bold mb-3 uppercase tracking-wider">Plan Seç</Text>
                        <View className="flex-row gap-3 mb-6">
                            {SUBSCRIPTION_PLANS.map((tier) => {
                                const isSelected = selectedTier === tier.id;
                                return (
                                    <Pressable
                                        key={tier.id}
                                        onPress={() => setSelectedTier(tier.id)}
                                        className={`flex-1 p-3 rounded-xl border ${isSelected ? 'bg-[#d4af35] border-[#d4af35]' : 'bg-[#2a2a2a] border-transparent'}`}
                                    >
                                        <Text className={`text-center font-bold text-xs ${isSelected ? 'text-[#121212]' : 'text-gray-400'}`}>{tier.label}</Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                        <Text className="text-gray-400 text-xs font-bold mb-3 uppercase tracking-wider">Süre Ekle</Text>
                        <View className="flex-row gap-2 mb-8">
                            {[1, 3, 6, 12].map((months) => (
                                <Pressable
                                    key={months}
                                    onPress={() => setExtensionMonths(months)}
                                    className={`flex-1 py-3 rounded-xl border ${extensionMonths === months ? 'bg-[#d4af35] border-[#d4af35]' : 'bg-[#2a2a2a] border-transparent'}`}
                                >
                                    <Text className={`text-center font-bold text-xs ${extensionMonths === months ? 'text-[#121212]' : 'text-white'}`}>+{months} Ay</Text>
                                </Pressable>
                            ))}
                        </View>
                        <Pressable
                            onPress={handleUpdatePlan}
                            className="bg-[#d4af35] py-4 rounded-xl items-center active:opacity-90"
                        >
                            <Text className="text-[#121212] font-bold text-base">Kaydet ve Onayla</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* Edit Info Modal - REFACTORED */}
            <FormModal
                visible={showEditInfoModal}
                onClose={() => setShowEditInfoModal(false)}
                title="Bilgileri Düzenle"
                footer={
                    <Pressable
                        onPress={handleSaveInfo}
                        className="bg-[#d4af35] rounded-xl py-4 flex-row items-center justify-center gap-3 active:opacity-90"
                    >
                        <Check size={20} color="#121212" strokeWidth={2.5} />
                        <Text className="text-[#121212] font-bold text-base">Değişiklikleri Kaydet</Text>
                    </Pressable>
                }
            >
                <View className="gap-4 mb-4">
                    <View>
                        <Text className="text-gray-400 text-xs mb-1.5 ml-1">İşletme Adı</Text>
                        <TextInput
                            className="bg-[#1E293B] text-white px-4 h-14 rounded-2xl border border-white/5 font-medium"
                            value={editForm.name}
                            onChangeText={t => setEditForm(prev => ({ ...prev, name: t }))}
                        />
                    </View>
                    <View>
                        <Text className="text-gray-400 text-xs mb-1.5 ml-1">İşletme Türü</Text>
                        <View className="flex-row gap-3">
                            {['berber', 'kuafor', 'guzellik_merkezi'].map((type) => (
                                <Pressable
                                    key={type}
                                    onPress={() => setEditForm(prev => ({ ...prev, businessType: type }))}
                                    className={`flex - 1 py - 3 px - 2 rounded - xl border items - center ${editForm.businessType === type ? 'bg-blue-600 border-blue-600' : 'bg-[#1E293B] border-white/5'} `}
                                >
                                    <Text className={`text - xs font - bold ${editForm.businessType === type ? 'text-white' : 'text-gray-400'} `}>
                                        {type === 'berber' ? 'Berber' : type === 'kuafor' ? 'Kuaför' : 'Güzellik'}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                    <View>
                        <Text className="text-gray-400 text-xs mb-1.5 ml-1">Yetkili Adı</Text>
                        <TextInput
                            className="bg-[#1E293B] text-white px-4 h-14 rounded-2xl border border-white/5 font-medium"
                            value={editForm.contactName}
                            onChangeText={t => setEditForm(prev => ({ ...prev, contactName: t }))}
                        />
                    </View>
                    <View>
                        <Text className="text-gray-400 text-xs mb-1.5 ml-1">Telefon Numarası</Text>
                        <TextInput
                            className="bg-[#1E293B] text-white px-4 h-14 rounded-2xl border border-white/5 font-medium"
                            value={editForm.phone}
                            keyboardType="phone-pad"
                            onChangeText={t => setEditForm(prev => ({ ...prev, phone: formatPhoneNumber(t) }))}
                            maxLength={15}
                        />
                    </View>

                    <View>
                        <Text className="text-gray-400 text-xs mb-1.5 ml-1">E-posta Adresi (Değiştirilemez)</Text>
                        <View className="bg-[#1E293B]/50 text-white rounded-2xl border border-white/5 flex-row items-center px-4 h-14">
                            <TextInput
                                className="flex-1 text-gray-400 text-base font-medium h-full"
                                value={editForm.email}
                                editable={false}
                            />
                        </View>
                    </View>
                    <View>
                        <Text className="text-gray-400 text-xs mb-1.5 ml-1">Instagram</Text>
                        <View className="bg-[#1E293B] text-white rounded-2xl border border-white/5 flex-row items-center px-4 h-14">
                            <TextInput
                                className="flex-1 text-white text-base font-medium h-full"
                                value={(editForm as any).instagram}
                                placeholder="ornekberber"
                                placeholderTextColor="#475569"
                                onChangeText={t => setEditForm(prev => ({ ...prev, instagram: t }))}
                            />
                            <Instagram size={18} color="#64748B" />
                        </View>
                    </View>
                    <View>
                        <Text className="text-gray-400 text-xs mb-1.5 ml-1">Şehir</Text>
                        <TextInput
                            className="bg-[#1E293B] text-white px-4 h-14 rounded-2xl border border-white/5 font-medium"
                            value={editForm.city}
                            onChangeText={t => setEditForm(prev => ({ ...prev, city: t }))}
                        />
                    </View>
                    <View>
                        <Text className="text-gray-400 text-xs mb-1.5 ml-1">Adres Bilgisi (Sokak/Mahalle)</Text>
                        <TextInput
                            className="bg-[#1E293B] text-white p-4 rounded-2xl border border-white/5 font-medium min-h-[100px]"
                            value={editForm.address}
                            multiline
                            textAlignVertical="top"
                            onChangeText={t => setEditForm(prev => ({ ...prev, address: t }))}
                        />
                    </View>

                    <View>
                        <Text className="text-gray-400 text-xs mb-1.5 ml-1">Açıklama (Hizmetler, Özellikler)</Text>
                        <TextInput
                            className="bg-[#1E293B] text-white p-4 rounded-2xl border border-white/5 font-medium min-h-[120px]"
                            value={(editForm as any).description || ''}
                            placeholder="İşletmeniz hakkında detaylı bilgi..."
                            placeholderTextColor="#475569"
                            multiline
                            textAlignVertical="top"
                            onChangeText={t => setEditForm(prev => ({ ...prev, description: t }))}
                        />
                    </View>

                    <View>
                        <Text className="text-gray-400 text-xs mb-1.5 ml-1">Logo URL</Text>
                        <View className="flex-row items-center gap-2">
                            <TextInput
                                className="flex-1 bg-[#1E293B] text-white px-4 h-14 rounded-2xl border border-white/5 font-medium"
                                value={(editForm as any).logo_url || ''}
                                placeholder="https://example.com/logo.jpg"
                                placeholderTextColor="#475569"
                                onChangeText={t => setEditForm(prev => ({ ...prev, logo_url: t }))}
                            />
                            <Pressable
                                onPress={() => uploadImage('logo')}
                                className="bg-[#3B82F6] w-14 h-14 rounded-2xl items-center justify-center active:bg-blue-600"
                            >
                                <Upload size={20} color="white" />
                            </Pressable>
                        </View>
                    </View>

                    <View>
                        <Text className="text-gray-400 text-xs mb-1.5 ml-1">Kapak Resmi URL</Text>
                        <View className="flex-row items-center gap-2">
                            <TextInput
                                className="flex-1 bg-[#1E293B] text-white px-4 h-14 rounded-2xl border border-white/5 font-medium"
                                value={(editForm as any).cover_url || ''}
                                placeholder="https://example.com/cover.jpg"
                                placeholderTextColor="#475569"
                                onChangeText={t => setEditForm(prev => ({ ...prev, cover_url: t }))}
                            />
                            <Pressable
                                onPress={() => uploadImage('cover')}
                                className="bg-[#3B82F6] w-14 h-14 rounded-2xl items-center justify-center active:bg-blue-600"
                            >
                                <Upload size={20} color="white" />
                            </Pressable>
                        </View>
                    </View>
                </View>
            </FormModal>
        </View>
    );
}

