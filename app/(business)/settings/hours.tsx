import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Switch, Alert, Modal, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, ChevronLeft, Save, Coffee, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useAuthStore } from '@/stores/authStore';
import { useBusinessStore } from '@/stores/businessStore';

// Types
type DayId = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
type DayConfig = {
    id: DayId;
    label: string;
    isOpen: boolean;
    start: string;
    end: string;
    hasBreak: boolean;
    breakStart?: string;
    breakEnd?: string;
}

const WEEK_DAYS: { id: DayId, label: string }[] = [
    { id: 'monday', label: 'Pazartesi' },
    { id: 'tuesday', label: 'Salı' },
    { id: 'wednesday', label: 'Çarşamba' },
    { id: 'thursday', label: 'Perşembe' },
    { id: 'friday', label: 'Cuma' },
    { id: 'saturday', label: 'Cumartesi' },
    { id: 'sunday', label: 'Pazar' },
];

export default function WorkingHoursScreen() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { getBusinessById, updateBusiness } = useBusinessStore();
    const [saving, setSaving] = useState(false);

    // Initial State (Mock)
    const [schedule, setSchedule] = useState<Record<DayId, DayConfig>>(() => {
        const initial: any = {};
        WEEK_DAYS.forEach(day => {
            initial[day.id] = {
                id: day.id,
                label: day.label,
                isOpen: day.id !== 'sunday', // Sunday closed by default
                start: '09:00',
                end: '19:00',
                hasBreak: true,
                breakStart: '12:00',
                breakEnd: '13:00'
            };
        });
        return initial;
    });

    useEffect(() => {
        if (user?.barberId) {
            getBusinessById(user.barberId).then(business => {
                const wh = business?.workingHours || (business as any)?.working_hours;
                if (wh) {
                    // Deep merge or overwrite? Safe merge
                    setSchedule(prev => ({
                        ...prev,
                        ...wh
                    }));
                }
            });
        }
    }, [user]);

    const handleSave = async () => {
        console.log('[WorkingHours] handleSave called');

        if (!user) {
            Alert.alert('Hata', 'Kullanıcı oturumu bulunamadı.');
            return;
        }

        if (!user.barberId) {
            Alert.alert('Hata', 'İşletme kimliği (barberId) bulunamadı. Lütfen tekrar giriş yapın.');
            return;
        }

        setSaving(true);
        try {
            console.log('[WorkingHours] Saving schedule...', JSON.stringify(schedule));
            await updateBusiness(user.barberId, { workingHours: schedule });
            Alert.alert('Başarılı', 'Çalışma saatleri güncellendi.');
        } catch (error: any) {
            console.error('[WorkingHours] Save error:', error);
            Alert.alert('Hata', 'Kaydedilemedi: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    // Helper: "09:00" -> Date object
    const stringToDate = (timeStr: string) => {
        const [h, m] = timeStr.split(':').map(Number);
        const d = new Date();
        d.setHours(h || 0, m || 0, 0, 0);
        return d;
    };

    // Helper: Date -> "09:00"
    const dateToString = (date: Date) => {
        return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    // Picker State
    const [picker, setPicker] = useState<{
        visible: boolean;
        dayId: DayId | null;
        type: 'start' | 'end' | 'breakStart' | 'breakEnd' | null;
        tempDate: Date;
    }>({
        visible: false,
        dayId: null,
        type: null,
        tempDate: new Date(),
    });

    const toggleOpen = (dayId: DayId) => {
        setSchedule(prev => ({
            ...prev,
            [dayId]: { ...prev[dayId], isOpen: !prev[dayId].isOpen }
        }));
    };

    const toggleBreak = (dayId: DayId) => {
        setSchedule(prev => ({
            ...prev,
            [dayId]: { ...prev[dayId], hasBreak: !prev[dayId].hasBreak }
        }));
    };

    const openPicker = (dayId: DayId, type: 'start' | 'end' | 'breakStart' | 'breakEnd') => {
        const currentVal = schedule[dayId][type] || '09:00';
        setPicker({
            visible: true,
            dayId,
            type,
            tempDate: stringToDate(currentVal)
        });
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            if (event.type === 'set' && selectedDate) {
                confirmDate(selectedDate);
            } else {
                setPicker(prev => ({ ...prev, visible: false }));
            }
        } else {
            // iOS: Update temp
            if (selectedDate) {
                setPicker(prev => ({ ...prev, tempDate: selectedDate }));
            }
        }
    };

    const confirmDate = (date?: Date) => {
        const finalDate = date || picker.tempDate;
        if (picker.dayId && picker.type) {
            const timeStr = dateToString(finalDate);
            setSchedule(prev => ({
                ...prev,
                [picker.dayId!]: { ...prev[picker.dayId!], [picker.type!]: timeStr }
            }));
        }
        setPicker({ visible: false, dayId: null, type: null, tempDate: new Date() });
    };

    return (
        <SafeAreaView className="flex-1 bg-[#0F172A]" edges={['top']}>
            <AdminHeader
                title="Çalışma Saatleri"
                subtitle="Haftalık Program"
                showBack
            />

            <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                <View className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl mb-6 flex-row items-start">
                    <Clock size={20} color={COLORS.primary.DEFAULT} style={{ marginTop: 2 }} />
                    <View className="ml-3 flex-1">
                        <Text className="text-blue-400 font-bold text-sm mb-1">Çalışma Düzeni</Text>
                        <Text className="text-slate-400 text-xs leading-5">
                            Her gün için çalışma saatlerini ve öğle molasını buradan ayarlayabilirsiniz.
                        </Text>
                    </View>
                </View>

                <View className="gap-4 pb-32">
                    {WEEK_DAYS.map((day) => {
                        const config = schedule[day.id];
                        return (
                            <View key={day.id} className={`bg-[#1E293B] rounded-2xl border ${config.isOpen ? 'border-primary/20' : 'border-white/5'} overflow-hidden`}>
                                {/* Header: Day Name & Toggle */}
                                <Pressable
                                    onPress={() => toggleOpen(day.id)}
                                    className={`p-4 flex-row items-center justify-between ${config.isOpen ? 'bg-primary/5' : ''}`}
                                >
                                    <View className="flex-row items-center">
                                        <View className={`w-2 h-2 rounded-full mr-3 ${config.isOpen ? 'bg-green-500' : 'bg-slate-600'}`} />
                                        <Text className={`font-bold text-base ${config.isOpen ? 'text-white' : 'text-slate-500'}`}>
                                            {day.label}
                                        </Text>
                                    </View>
                                    <Switch
                                        value={config.isOpen}
                                        onValueChange={() => toggleOpen(day.id)}
                                        trackColor={{ false: '#334155', true: COLORS.primary.DEFAULT }}
                                        thumbColor={'#fff'}
                                        ios_backgroundColor="#334155"
                                        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                                    />
                                </Pressable>

                                {/* Hours Config (Shown if Open) */}
                                {config.isOpen && (
                                    <View className="px-4 pb-4 pt-2 border-t border-white/5">
                                        {/* Working Hours */}
                                        <View className="flex-row items-center justify-between mb-4">
                                            <View className="flex-1">
                                                <Text className="text-slate-500 text-[10px] uppercase font-bold mb-1">AÇILIŞ</Text>
                                                <Pressable onPress={() => openPicker(day.id, 'start')} className="bg-[#0F172A] border border-white/10 rounded-xl py-3 items-center active:bg-white/5">
                                                    <Text className="text-white font-mono font-bold">{config.start}</Text>
                                                </Pressable>
                                            </View>
                                            <View className="px-4 pt-4"><Text className="text-slate-600 font-bold">-</Text></View>
                                            <View className="flex-1">
                                                <Text className="text-slate-500 text-[10px] uppercase font-bold mb-1">KAPANIŞ</Text>
                                                <Pressable onPress={() => openPicker(day.id, 'end')} className="bg-[#0F172A] border border-white/10 rounded-xl py-3 items-center active:bg-white/5">
                                                    <Text className="text-white font-mono font-bold">{config.end}</Text>
                                                </Pressable>
                                            </View>
                                        </View>

                                        {/* Break Time Section */}
                                        <View className="bg-[#0F172A] rounded-xl p-3 border border-white/5">
                                            <View className="flex-row items-center justify-between mb-3">
                                                <View className="flex-row items-center">
                                                    <Coffee size={16} color={config.hasBreak ? COLORS.primary.DEFAULT : "#64748B"} />
                                                    <Text className={`text-xs ml-2 font-bold ${config.hasBreak ? 'text-white' : 'text-slate-500'}`}>Öğle Molası</Text>
                                                </View>
                                                <Switch
                                                    value={config.hasBreak}
                                                    onValueChange={() => toggleBreak(day.id)}
                                                    trackColor={{ false: '#334155', true: COLORS.primary.DEFAULT }}
                                                    thumbColor={'#fff'}
                                                    ios_backgroundColor="#334155"
                                                    style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
                                                />
                                            </View>

                                            {config.hasBreak && (
                                                <View className="flex-row items-center gap-2">
                                                    <Pressable onPress={() => openPicker(day.id, 'breakStart')} className="flex-1 bg-[#1E293B] rounded-lg py-2 items-center">
                                                        <Text className="text-white font-mono text-xs">{config.breakStart || '12:00'}</Text>
                                                    </Pressable>
                                                    <Text className="text-slate-600">-</Text>
                                                    <Pressable onPress={() => openPicker(day.id, 'breakEnd')} className="flex-1 bg-[#1E293B] rounded-lg py-2 items-center">
                                                        <Text className="text-white font-mono text-xs">{config.breakEnd || '13:00'}</Text>
                                                    </Pressable>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </View>
            </ScrollView>

            {/* Save Button Fixed at Bottom */}
            <View className="absolute bottom-0 left-0 right-0 bg-[#0F172A]/90 p-4 pb-8 border-t border-white/10 backdrop-blur-md">
                <Pressable
                    onPress={handleSave}
                    disabled={saving}
                    className={`bg-primary h-14 rounded-xl flex-row items-center justify-center gap-2 shadow-lg shadow-primary/30 active:scale-95 transition-transform ${saving ? 'opacity-70' : ''}`}
                >
                    <Save size={20} color="white" />
                    <Text className="text-white font-bold text-base">{saving ? 'Kaydediliyor...' : 'Programı Kaydet'}</Text>
                </Pressable>
            </View>

            {/* Date Time Picker Modal */}
            {picker.visible && (
                Platform.OS === 'ios' ? (
                    <Modal
                        transparent={true}
                        animationType="slide"
                        visible={picker.visible}
                        onRequestClose={() => setPicker(prev => ({ ...prev, visible: false }))}
                    >
                        <View className="flex-1 justify-end bg-black/50">
                            <View className="bg-[#1E293B] pb-8 pt-4 rounded-t-3xl">
                                <View className="flex-row justify-between px-4 mb-4 border-b border-white/10 pb-2">
                                    <Pressable onPress={() => setPicker(prev => ({ ...prev, visible: false }))}>
                                        <Text className="text-white">İptal</Text>
                                    </Pressable>
                                    <Pressable onPress={() => confirmDate()}>
                                        <Text className="text-primary font-bold">Kaydet</Text>
                                    </Pressable>
                                </View>
                                <DateTimePicker
                                    value={picker.tempDate}
                                    mode="time"
                                    display="spinner"
                                    onChange={handleDateChange}
                                    textColor="white"
                                    themeVariant="dark"
                                    locale="tr-TR"
                                    is24Hour={true}
                                />
                            </View>
                        </View>
                    </Modal>
                ) : (
                    <DateTimePicker
                        value={picker.tempDate}
                        mode="time"
                        display="default"
                        onChange={handleDateChange}
                        is24Hour={true}
                        locale="tr-TR"
                    />
                )
            )}
        </SafeAreaView>
    );
}
