import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Switch, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Clock, Save, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { useAuthStore } from '@/stores/authStore';
import { useBusinessStore } from '@/stores/businessStore';
import DateTimePicker from '@react-native-community/datetimepicker';

const DAYS = [
    { key: 'monday', label: 'Pazartesi' },
    { key: 'tuesday', label: 'Salı' },
    { key: 'wednesday', label: 'Çarşamba' },
    { key: 'thursday', label: 'Perşembe' },
    { key: 'friday', label: 'Cuma' },
    { key: 'saturday', label: 'Cumartesi' },
    { key: 'sunday', label: 'Pazar' },
];

export default function BusinessHoursScreen() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { businesses, fetchBusinesses, updateBusiness } = useBusinessStore();

    // Default hours
    const defaultHours = DAYS.reduce((acc, day) => {
        acc[day.key] = { isOpen: true, start: '09:00', end: '19:00' };
        return acc;
    }, {} as any);

    const [hours, setHours] = useState(defaultHours);
    const [loading, setLoading] = useState(false);

    // Time Picker State
    const [showPicker, setShowPicker] = useState(false);
    const [activeDay, setActiveDay] = useState<string | null>(null);
    const [activeType, setActiveType] = useState<'start' | 'end'>('start');
    const [tempDate, setTempDate] = useState(new Date());

    const myBusiness = businesses.find(b => b.id === user?.barberId);

    useEffect(() => {
        if (businesses.length === 0) {
            fetchBusinesses();
        }
    }, []);

    useEffect(() => {
        if (myBusiness?.workingHours) {
            setHours(myBusiness.workingHours);
        }
    }, [myBusiness]);

    const handleToggleDay = (dayKey: string) => {
        setHours((prev: any) => ({
            ...prev,
            [dayKey]: { ...prev[dayKey], isOpen: !prev[dayKey].isOpen }
        }));
    };

    const openTimePicker = (dayKey: string, type: 'start' | 'end') => {
        setActiveDay(dayKey);
        setActiveType(type);

        const currentStr = hours[dayKey][type];
        const [h, m] = currentStr.split(':');
        const d = new Date();
        d.setHours(parseInt(h), parseInt(m));
        setTempDate(d);

        setShowPicker(true);
    };

    const onTimeChange = (event: any, selectedDate?: Date) => {
        setShowPicker(false);
        if (selectedDate && activeDay) {
            const h = selectedDate.getHours().toString().padStart(2, '0');
            const m = selectedDate.getMinutes().toString().padStart(2, '0');
            const timeStr = `${h}:${m}`;

            setHours((prev: any) => ({
                ...prev,
                [activeDay]: { ...prev[activeDay], [activeType]: timeStr }
            }));
        }
    };

    const handleSave = async () => {
        if (!user?.barberId) return;
        setLoading(true);
        try {
            await updateBusiness(user.barberId, { workingHours: hours });
            Alert.alert('Başarılı', 'Çalışma saatleri güncellendi.');
            router.back();
        } catch (error) {
            Alert.alert('Hata', 'Güncelleme başarısız oldu.');
        } finally {
            setLoading(false);
        }
    };

    const insets = useSafeAreaInsets();

    return (
        <View className="flex-1 bg-[#121212]">
            <View style={{ paddingTop: insets.top }} className="bg-[#121212] z-10 px-4 py-3 border-b border-white/5">
                <View className="flex-row items-center justify-between">
                    <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full active:bg-white/5">
                        <ChevronLeft size={24} color="white" />
                    </Pressable>
                    <Text className="text-white text-lg font-bold">Çalışma Saatleri</Text>
                    <View className="w-10" />
                </View>
            </View>

            <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
                <View className="mb-6">
                    <View className="flex-row items-center gap-3 mb-4">
                        <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center">
                            <Clock size={20} color={COLORS.primary.DEFAULT} />
                        </View>
                        <View>
                            <Text className="text-white font-bold text-lg">Haftalık Program</Text>
                            <Text className="text-gray-500 text-xs">Müşterileriniz bu saatlere göre randevu alabilir.</Text>
                        </View>
                    </View>

                    <View className="gap-3">
                        {DAYS.map((day) => {
                            const dayConfig = hours[day.key] || { isOpen: false, start: '09:00', end: '19:00' };
                            return (
                                <View key={day.key} className={`rounded-xl border p-4 ${dayConfig.isOpen ? 'bg-[#1E1E1E] border-white/10' : 'bg-[#1E1E1E]/50 border-white/5'}`}>
                                    <View className="flex-row items-center justify-between mb-3">
                                        <Text className={`font-bold text-base ${dayConfig.isOpen ? 'text-white' : 'text-gray-500'}`}>
                                            {day.label}
                                        </Text>
                                        <Switch
                                            value={dayConfig.isOpen}
                                            onValueChange={() => handleToggleDay(day.key)}
                                            trackColor={{ false: '#333', true: COLORS.primary.DEFAULT }}
                                            thumbColor="white"
                                        />
                                    </View>

                                    {dayConfig.isOpen && (
                                        <View className="flex-row items-center gap-4">
                                            <Pressable
                                                onPress={() => openTimePicker(day.key, 'start')}
                                                className="flex-1 bg-black/20 border border-white/10 rounded-lg p-3 items-center active:border-primary/50"
                                            >
                                                <Text className="text-gray-400 text-xs mb-1">Açılış</Text>
                                                <Text className="text-white font-bold text-lg">{dayConfig.start}</Text>
                                            </Pressable>

                                            <View className="w-2 h-0.5 bg-gray-600 rounded-full" />

                                            <Pressable
                                                onPress={() => openTimePicker(day.key, 'end')}
                                                className="flex-1 bg-black/20 border border-white/10 rounded-lg p-3 items-center active:border-primary/50"
                                            >
                                                <Text className="text-gray-400 text-xs mb-1">Kapanış</Text>
                                                <Text className="text-white font-bold text-lg">{dayConfig.end}</Text>
                                            </Pressable>
                                        </View>
                                    )}
                                    {!dayConfig.isOpen && (
                                        <Text className="text-red-500/50 text-sm font-medium italic">Kapalı</Text>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Action */}
            <View className="p-4 bg-[#121212] border-t border-white/5">
                <Pressable
                    onPress={handleSave}
                    disabled={loading}
                    className="w-full h-14 bg-primary rounded-xl items-center justify-center shadow-lg shadow-primary/20 active:scale-[0.99] flex-row gap-2"
                >
                    {loading ? (
                        <ActivityIndicator color="#121212" />
                    ) : (
                        <>
                            <Save size={20} color="#121212" />
                            <Text className="text-[#121212] font-bold text-lg">Kaydet</Text>
                        </>
                    )}
                </Pressable>
            </View>

            {showPicker && (
                <DateTimePicker
                    value={tempDate}
                    mode="time"
                    is24Hour={true}
                    display="spinner"
                    onChange={onTimeChange}
                />
            )}
        </View>
    );
}
