
import { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/theme';

// Mock Date Data
const DATES = [
    { id: 1, day: 'Pzt', date: '23', selected: true },
    { id: 2, day: 'Sal', date: '24', selected: false },
    { id: 3, day: 'Çar', date: '25', selected: false },
    { id: 4, day: 'Per', date: '26', selected: false },
    { id: 5, day: 'Cum', date: '27', selected: false },
    { id: 6, day: 'Cmt', date: '28', selected: false },
];

// Mock Time Slots Data
const TIME_SLOTS = {
    morning: [
        { time: '09:00', disabled: true },
        { time: '09:45', disabled: false },
        { time: '10:30', disabled: true },
        { time: '11:15', disabled: false },
    ],
    afternoon: [
        { time: '13:00', disabled: false },
        { time: '13:45', disabled: false, selected: true }, // Default selected
        { time: '14:30', disabled: false },
        { time: '15:15', disabled: true },
        { time: '16:00', disabled: false },
        { time: '16:45', disabled: false },
    ],
    evening: [
        { time: '18:00', disabled: false },
        { time: '18:45', disabled: false },
        { time: '19:30', disabled: true },
        { time: '20:15', disabled: true },
    ]
};

export default function TimeSlotSelectionScreen() {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState('23');
    const [selectedTime, setSelectedTime] = useState('13:45');

    const handleTimeSelect = (time: string, disabled: boolean) => {
        if (disabled) return;
        setSelectedTime(time);
    };

    return (
        <View className="flex-1 bg-background-light dark:bg-background-dark">
            {/* Header */}
            <SafeAreaView className="sticky top-0 z-50 flex-row items-center justify-between p-4 pb-2 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md">
                <Pressable
                    onPress={() => router.back()}
                    className="w-10 h-10 items-center justify-center rounded-full active:bg-black/5 dark:active:bg-white/10"
                >
                    <MaterialIcons name="arrow-back" size={24} color={COLORS.text.inverse} />
                </Pressable>
                <Text className="flex-1 text-center text-lg font-bold pr-10 text-gray-900 dark:text-white">Zaman Seçin</Text>
            </SafeAreaView>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 150 }} showsVerticalScrollIndicator={false}>
                {/* Month Title */}
                <Text className="px-5 pb-4 pt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Ekim 2023</Text>

                {/* Date Slider */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }} className="mb-2">
                    {DATES.map((item) => (
                        <Pressable
                            key={item.id}
                            onPress={() => setSelectedDate(item.date)}
                            className={`flex-col items-center justify-center gap-1 rounded-[1.25rem] min-w-[4.5rem] h-20 transition-all active:scale-95 ${selectedDate === item.date
                                    ? 'bg-primary shadow-lg shadow-primary/40'
                                    : 'bg-white dark:bg-[#283039] active:bg-gray-100 dark:active:bg-[#323b46]'
                                }`}
                        >
                            <Text className={`text-xs font-medium ${selectedDate === item.date ? 'text-white/90' : 'text-gray-500 dark:text-gray-300'}`}>{item.day}</Text>
                            <Text className={`text-2xl font-bold ${selectedDate === item.date ? 'text-white' : 'text-[#111418] dark:text-white'}`}>{item.date}</Text>
                            {selectedDate === item.date && <View className="absolute bottom-1.5 w-1 h-1 rounded-full bg-white" />}
                        </Pressable>
                    ))}
                </ScrollView>

                <View className="h-px w-full bg-black/5 dark:bg-white/5 my-2" />

                {/* Service Info Pill */}
                <View className="flex items-center justify-center py-2">
                    <View className="flex-row items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5">
                        <MaterialIcons name="schedule" size={18} color={COLORS.primary.DEFAULT} />
                        <Text className="text-sm font-medium text-primary">Hizmet Süresi: 45 dk</Text>
                    </View>
                </View>

                {/* Time Slots */}
                <View className="flex-col gap-6 px-5 pt-4">

                    {/* Morning */}
                    <View className="gap-3">
                        <View className="flex-row items-center gap-2">
                            <MaterialIcons name="wb-sunny" size={20} color="#FB923C" />
                            <Text className="text-lg font-bold text-gray-900 dark:text-white">Sabah</Text>
                        </View>
                        <View className="flex-row flex-wrap gap-3">
                            {TIME_SLOTS.morning.map((slot, index) => (
                                <TimeSlotButton
                                    key={index}
                                    time={slot.time}
                                    disabled={slot.disabled}
                                    selected={selectedTime === slot.time}
                                    onPress={() => handleTimeSelect(slot.time, slot.disabled)}
                                />
                            ))}
                        </View>
                    </View>

                    {/* Afternoon */}
                    <View className="gap-3">
                        <View className="flex-row items-center gap-2">
                            <MaterialIcons name="wb-twilight" size={20} color="#F97316" />
                            <Text className="text-lg font-bold text-gray-900 dark:text-white">Öğle</Text>
                        </View>
                        <View className="flex-row flex-wrap gap-3">
                            {TIME_SLOTS.afternoon.map((slot, index) => (
                                <TimeSlotButton
                                    key={index}
                                    time={slot.time}
                                    disabled={slot.disabled}
                                    selected={selectedTime === slot.time}
                                    onPress={() => handleTimeSelect(slot.time, slot.disabled)}
                                />
                            ))}
                        </View>
                    </View>

                    {/* Evening */}
                    <View className="gap-3">
                        <View className="flex-row items-center gap-2">
                            <MaterialIcons name="dark-mode" size={20} color="#818CF8" />
                            <Text className="text-lg font-bold text-gray-900 dark:text-white">Akşam</Text>
                        </View>
                        <View className="flex-row flex-wrap gap-3">
                            {TIME_SLOTS.evening.map((slot, index) => (
                                <TimeSlotButton
                                    key={index}
                                    time={slot.time}
                                    disabled={slot.disabled}
                                    selected={selectedTime === slot.time}
                                    onPress={() => handleTimeSelect(slot.time, slot.disabled)}
                                />
                            ))}
                        </View>
                    </View>

                </View>
            </ScrollView>

            {/* Sticky Footer */}
            <View className="absolute bottom-0 left-0 right-0 z-40 bg-background-light dark:bg-background-dark p-4 pb-8 border-t border-black/5 dark:border-white/5">
                <View className="gap-3">
                    <View className="flex-row justify-between items-center px-1">
                        <Text className="text-sm text-gray-500 dark:text-gray-400">Seçilen:</Text>
                        <Text className="text-sm font-bold text-[#111418] dark:text-white">23 Ekim, {selectedTime}</Text>
                    </View>
                    <Pressable
                        onPress={() => router.push('/(customer)/booking/booking-summary')}
                        className="flex-row items-center justify-center gap-2 rounded-full bg-primary py-4 shadow-xl shadow-primary/20 active:scale-[0.98]"
                    >
                        <Text className="text-base font-bold text-white">Onayla</Text>
                        <MaterialIcons name="arrow-forward" size={20} color="white" />
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const TimeSlotButton = ({ time, disabled, selected, onPress }: any) => {
    if (selected) {
        return (
            <Pressable onPress={onPress} className="relative w-[22%] items-center justify-center rounded-xl bg-primary py-3 shadow-lg shadow-primary/30 active:scale-95">
                <Text className="text-sm font-bold text-white">{time}</Text>
                <View className="absolute -top-1 -right-1 flex w-4 h-4 items-center justify-center rounded-full bg-white">
                    <MaterialIcons name="check" size={10} color={COLORS.primary.DEFAULT} />
                </View>
            </Pressable>
        );
    }

    if (disabled) {
        return (
            <View className="w-[22%] items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 py-3 ml-[3%] mr-[0%] mb-0 scale-100 opacity-50">
                <Text className="text-sm font-medium text-gray-400 dark:text-gray-600 line-through decoration-gray-400/50">{time}</Text>
            </View>
        );
    }

    return (
        <Pressable onPress={onPress} className="w-[22%] items-center justify-center rounded-xl bg-white dark:bg-[#283039] py-3 active:scale-95 border border-black/5 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-[#323b46]">
            <Text className="text-sm font-semibold text-[#111418] dark:text-white">{time}</Text>
        </Pressable>
    );
};
