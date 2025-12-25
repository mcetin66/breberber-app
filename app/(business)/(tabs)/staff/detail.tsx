import { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, ActivityIndicator, Alert, Switch, Modal, FlatList, Platform, KeyboardAvoidingView } from 'react-native';
import { ChevronLeft, Camera, Clock, Check, ChevronDown, X, Coffee, Users } from 'lucide-react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '@/constants/theme';
import { useBusinessStore } from '@/stores/businessStore';
import { useAuthStore } from '@/stores/authStore';
import { AppScreen } from '@/components/shared/layouts/AppScreen';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function StaffDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { user } = useAuthStore();
    const { addStaff, updateStaff, getStaff, fetchServices, getServices, currentBusiness, loading } = useBusinessStore();

    const isEditing = !!params.id;
    const existingStaff = isEditing ? getStaff(user?.barberId!).find(s => s.id === params.id) : null;
    const allServices = user?.barberId ? getServices(user.barberId) : [];

    const [name, setName] = useState(existingStaff?.name || '');
    const [selectedServices, setSelectedServices] = useState<string[]>(existingStaff?.expertise || []);
    const [isActive, setIsActive] = useState(existingStaff?.is_active ?? true);

    // Time state - workingHours comes from store mapping
    const staffWorkingHours = (existingStaff as any)?.workingHours;
    const [workStart, setWorkStart] = useState(staffWorkingHours?.start || '09:00');
    const [workEnd, setWorkEnd] = useState(staffWorkingHours?.end || '19:00');

    // Lunch Break state
    const [hasLunch, setHasLunch] = useState(!!staffWorkingHours?.lunchStart);
    const [lunchStart, setLunchStart] = useState(staffWorkingHours?.lunchStart || '12:00');
    const [lunchEnd, setLunchEnd] = useState(staffWorkingHours?.lunchEnd || '13:00');

    const [tempDate, setTempDate] = useState(new Date()); // For iOS picker
    const [activeOriginalTime, setActiveOriginalTime] = useState(''); // Keep track of what we are editing

    // Modals
    const [serviceModalVisible, setServiceModalVisible] = useState(false);
    const [timePickerType, setTimePickerType] = useState<'start' | 'end' | 'lunchStart' | 'lunchEnd' | null>(null);

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user?.barberId && allServices.length === 0) {
            fetchServices(user.barberId);
        }
    }, [user?.barberId]);

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Hata', 'Lütfen personel adını giriniz.');
            return;
        }
        if (!user?.barberId) return;

        // Validation: Check against Shop Hours (using Monday as reference/outer bounds)
        if (currentBusiness?.workingHours) {
            const shopDay = (currentBusiness.workingHours as any)['monday'];
            if (shopDay && shopDay.isOpen) {
                // Determine shop bounds
                const shopStart = shopDay.start;
                const shopEnd = shopDay.end;

                // Compare (String comparison works for HH:MM 24h)
                if (workStart < shopStart || workEnd > shopEnd) {
                    Alert.alert(
                        'Geçersiz Saat',
                        `Personel saatleri (${workStart}-${workEnd}), dükkanın çalışma saatleri (${shopStart}-${shopEnd}) sınırları içinde olmalıdır.`
                    );
                    return;
                }
            }
        }

        setSaving(true);
        try {
            const staffData = {
                name,
                expertise: selectedServices,
                isActive,
                workingHours: {
                    start: workStart,
                    end: workEnd,
                    lunchStart: hasLunch ? lunchStart : undefined,
                    lunchEnd: hasLunch ? lunchEnd : undefined
                },
                workingDays: (existingStaff as any)?.workingDays || ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
                rating: existingStaff?.rating || 5.0,
                reviewCount: existingStaff?.review_count || 0,
                avatar: existingStaff?.avatar_url || 'https://via.placeholder.com/150'
            } as any; // Cast for strict type bypass

            if (isEditing && params.id) {
                await updateStaff(user.barberId, params.id as string, staffData);
                Alert.alert('Başarılı', 'Personel güncellendi.');
            } else {
                await addStaff(user.barberId, staffData);
                Alert.alert('Başarılı', 'Yeni personel eklendi.');
            }
            router.back();
        } catch (error) {
            Alert.alert('Hata', (error as Error).message);
        } finally {
            setSaving(false);
        }
    };

    const toggleService = (serviceName: string) => {
        if (selectedServices.includes(serviceName)) {
            setSelectedServices(prev => prev.filter(s => s !== serviceName));
        } else {
            setSelectedServices(prev => [...prev, serviceName]);
        }
    };

    // Time Helper
    const parseTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const d = new Date();
        d.setHours(hours, minutes, 0, 0);
        return d;
    };

    // Fix spacing in time format
    const formatTime = (date: Date) => {
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    const onTimeChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setTimePickerType(null);
            if (event.type === 'set' && selectedDate) {
                const fTime = formatTime(selectedDate);
                if (activeOriginalTime === 'start') setWorkStart(fTime);
                else if (activeOriginalTime === 'end') setWorkEnd(fTime);
                else if (activeOriginalTime === 'lunchStart') setLunchStart(fTime);
                else if (activeOriginalTime === 'lunchEnd') setLunchEnd(fTime);
            }
        } else {
            // iOS
            if (selectedDate) setTempDate(selectedDate);
        }
    };

    const openTimePicker = (type: 'start' | 'end' | 'lunchStart' | 'lunchEnd') => {
        let timeStr = '09:00';
        if (type === 'start') timeStr = workStart;
        else if (type === 'end') timeStr = workEnd;
        else if (type === 'lunchStart') timeStr = lunchStart;
        else if (type === 'lunchEnd') timeStr = lunchEnd;

        setTempDate(parseTime(timeStr));
        setActiveOriginalTime(type);
        setTimePickerType(type);
    };

    const confirmIosTime = () => {
        const fTime = formatTime(tempDate);
        if (activeOriginalTime === 'start') setWorkStart(fTime);
        else if (activeOriginalTime === 'end') setWorkEnd(fTime);
        else if (activeOriginalTime === 'lunchStart') setLunchStart(fTime);
        else if (activeOriginalTime === 'lunchEnd') setLunchEnd(fTime);
        setTimePickerType(null);
    };

    return (
        <AppScreen
            header={
                <AdminHeader
                    title={isEditing ? 'Personeli Düzenle' : 'Yeni Personel'}
                    headerIcon={<Users size={20} color="#121212" />}
                    showBack
                    rightElement={<View className="w-10" />}
                />
            }
            backgroundColor="#0F172A"
        >
            {/* Hide Native Header */}
            <Stack.Screen options={{ headerShown: false }} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>

                    {/* Avatar Section */}
                    <View className="items-center mb-8">
                        <Pressable className="w-24 h-24 rounded-full bg-[#1E293B] items-center justify-center border-2 border-dashed border-white/20 mb-3 active:bg-[#334155]">
                            <Camera size={32} color="#94A3B8" />
                        </Pressable>
                        <Text className="text-[#94A3B8] text-sm font-medium">Fotoğraf Ekle</Text>
                    </View>

                    <View className="flex-col gap-6">
                        {/* Name Input */}
                        <View className="gap-2">
                            <Text className="text-[#94A3B8] text-sm font-medium ml-1">Ad Soyad</Text>
                            <TextInput
                                className="bg-[#1E293B] text-white p-4 rounded-xl font-medium border border-white/5 focus:border-primary/50 h-[56px]"
                                placeholder="Örn: Ahmet Yılmaz"
                                placeholderTextColor="#64748B"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        {/* Expertise Selection */}
                        <View className="gap-2">
                            <Text className="text-[#94A3B8] text-sm font-medium ml-1">Uzmanlık Alanları</Text>
                            <Pressable
                                onPress={() => setServiceModalVisible(true)}
                                className="bg-[#1E293B] p-4 rounded-xl border border-white/5 flex-row items-center justify-between active:bg-[#334155] min-h-[56px]"
                            >
                                <Text className={selectedServices.length > 0 ? "text-white font-medium" : "text-[#64748B]"}>
                                    {selectedServices.length > 0 ? `${selectedServices.length} Hizmet Seçildi` : 'Hizmet Seçiniz'}
                                </Text>
                                <ChevronDown size={20} color="#94A3B8" />
                            </Pressable>

                            {/* Selected Chips */}
                            {selectedServices.length > 0 && (
                                <View className="flex-row flex-wrap gap-2 mt-1">
                                    {selectedServices.map(s => (
                                        <View key={s} className="bg-primary/20 border border-primary/30 px-3 py-1.5 rounded-full flex-row items-center">
                                            <Text className="text-primary text-xs font-bold mr-2">{s}</Text>
                                            <Pressable onPress={() => toggleService(s)}>
                                                <X size={12} color={COLORS.primary.DEFAULT} />
                                            </Pressable>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>

                        {/* Working Hours - Clickable Pickers */}
                        <View className="flex-row gap-4">
                            <View className="flex-1 gap-2">
                                <Text className="text-[#94A3B8] text-sm font-medium ml-1">Başlangıç</Text>
                                <Pressable
                                    onPress={() => openTimePicker('start')}
                                    className="bg-[#1E293B] flex-row items-center px-4 h-[56px] rounded-xl border border-white/5 active:bg-[#334155]"
                                >
                                    <Clock size={18} color="#94A3B8" style={{ marginRight: 12 }} />
                                    <Text className="text-white font-medium text-base">{workStart}</Text>
                                </Pressable>
                            </View>
                            <View className="flex-1 gap-2">
                                <Text className="text-[#94A3B8] text-sm font-medium ml-1">Bitiş</Text>
                                <Pressable
                                    onPress={() => openTimePicker('end')}
                                    className="bg-[#1E293B] flex-row items-center px-4 h-[56px] rounded-xl border border-white/5 active:bg-[#334155]"
                                >
                                    <Clock size={18} color="#94A3B8" style={{ marginRight: 12 }} />
                                    <Text className="text-white font-medium text-base">{workEnd}</Text>
                                </Pressable>
                            </View>
                        </View>

                        {/* Lunch Break Section */}
                        <View className="bg-[#1E293B] p-4 rounded-xl border border-white/5 space-y-3">
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center">
                                    <Coffee size={18} color="#94A3B8" />
                                    <Text className="text-white font-medium text-base ml-3">Öğle Molası (Personel)</Text>
                                </View>
                                <Switch
                                    value={hasLunch}
                                    onValueChange={setHasLunch}
                                    trackColor={{ false: '#334155', true: COLORS.primary.DEFAULT }}
                                    thumbColor="white"
                                />
                            </View>

                            {hasLunch && (
                                <View className="flex-row gap-4 pt-4 border-t border-white/5 mt-2">
                                    <View className="flex-1">
                                        <Text className="text-[#94A3B8] text-[10px] font-bold mb-1 ml-1">BAŞLANGIÇ</Text>
                                        <Pressable
                                            onPress={() => openTimePicker('lunchStart')}
                                            className="bg-[#0F172A] flex-row items-center px-3 py-3 rounded-lg border border-white/5 active:bg-white/5"
                                        >
                                            <Clock size={14} color="#64748B" style={{ marginRight: 8 }} />
                                            <Text className="text-white font-medium">{lunchStart}</Text>
                                        </Pressable>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-[#94A3B8] text-[10px] font-bold mb-1 ml-1">BİTİŞ</Text>
                                        <Pressable
                                            onPress={() => openTimePicker('lunchEnd')}
                                            className="bg-[#0F172A] flex-row items-center px-3 py-3 rounded-lg border border-white/5 active:bg-white/5"
                                        >
                                            <Clock size={14} color="#64748B" style={{ marginRight: 8 }} />
                                            <Text className="text-white font-medium">{lunchEnd}</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            )}
                        </View>

                        {/* Active Switch */}
                        <View className="flex-row items-center justify-between bg-[#1E293B] p-4 rounded-xl border border-white/5 min-h-[72px]">
                            <View>
                                <Text className="text-white font-bold text-base">Personel Aktif</Text>
                                <Text className="text-[#94A3B8] text-xs mt-0.5">Randevu alımına açık</Text>
                            </View>
                            <Switch
                                value={isActive}
                                onValueChange={setIsActive}
                                trackColor={{ false: '#334155', true: COLORS.primary.DEFAULT }}
                                thumbColor="white"
                            />
                        </View>
                    </View>

                    {/* Save Button */}
                    <Pressable
                        onPress={handleSave}
                        disabled={saving}
                        className="mt-10 bg-primary w-full py-4 rounded-xl items-center shadow-lg shadow-primary/25 active:scale-[0.99] transition-transform mb-20"
                    >
                        {saving ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-bold text-lg">
                                {isEditing ? 'Güncelle' : 'Kaydet'}
                            </Text>
                        )}
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Service Selection Modal */}
            <Modal
                visible={serviceModalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setServiceModalVisible(false)}
            >
                <View className="flex-1 bg-[#0F172A]">
                    <View className="flex-row items-center justify-between px-4 py-4 border-b border-white/10">
                        <Text className="text-white text-lg font-bold">Hizmet Seçimi</Text>
                        <Pressable onPress={() => setServiceModalVisible(false)} className="p-2 bg-[#1E293B] rounded-full">
                            <X size={20} color="white" />
                        </Pressable>
                    </View>

                    {allServices.length === 0 ? (
                        <View className="flex-1 items-center justify-center p-8">
                            <Text className="text-white text-center font-bold mb-2">Hizmet Bulunamadı</Text>
                            <Text className="text-[#94A3B8] text-center">Önce "Hizmetler" menüsünden hizmet eklemelisiniz.</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={allServices}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{ padding: 16 }}
                            renderItem={({ item }) => {
                                const isSelected = selectedServices.includes(item.name);
                                return (
                                    <Pressable
                                        onPress={() => toggleService(item.name)}
                                        className={`flex-row items-center justify-between p-4 mb-3 rounded-xl border ${isSelected ? 'bg-primary/10 border-primary' : 'bg-[#1E293B] border-white/5'}`}
                                    >
                                        <Text className={`font-bold ${isSelected ? 'text-primary' : 'text-white'}`}>{item.name}</Text>
                                        {isSelected && <Check size={20} color={COLORS.primary.DEFAULT} />}
                                    </Pressable>
                                );
                            }}
                        />
                    )}

                    <View className="p-4 border-t border-white/10 bg-[#1E293B]">
                        <Pressable
                            onPress={() => setServiceModalVisible(false)}
                            className="bg-primary py-4 rounded-xl items-center"
                        >
                            <Text className="text-white font-bold text-lg">Tamamla ({selectedServices.length})</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* Date Picker Modal for iOS / Android Logic */}
            {timePickerType && (
                Platform.OS === 'ios' ? (
                    <Modal
                        transparent
                        animationType="fade"
                        visible={!!timePickerType}
                        onRequestClose={() => setTimePickerType(null)}
                    >
                        <View className="flex-1 justify-end bg-black/60">
                            <View className="bg-[#1E293B] pb-8 pt-4 rounded-t-3xl">
                                <View className="flex-row justify-between px-6 mb-4">
                                    <Pressable onPress={() => setTimePickerType(null)}>
                                        <Text className="text-[#94A3B8] text-base font-medium">İptal</Text>
                                    </Pressable>
                                    <Text className="text-white font-bold text-lg">
                                        {activeOriginalTime === 'start' ? 'Başlangıç Saati' : 'Bitiş Saati'}
                                    </Text>
                                    <Pressable onPress={confirmIosTime}>
                                        <Text className="text-primary text-base font-bold">Bitti</Text>
                                    </Pressable>
                                </View>
                                <DateTimePicker
                                    value={tempDate}
                                    mode="time"
                                    display="spinner"
                                    onChange={onTimeChange}
                                    minuteInterval={10}
                                    textColor="white"
                                    locale="tr-TR"
                                />
                            </View>
                        </View>
                    </Modal>
                ) : (
                    <DateTimePicker
                        value={tempDate}
                        mode="time"
                        display="default"
                        is24Hour={true}
                        onChange={onTimeChange}
                        minuteInterval={10}
                    />
                )
            )}
        </AppScreen>
    );
}
