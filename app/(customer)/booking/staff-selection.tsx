
import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { useBusinessStore } from '@/stores/businessStore';
import type { Barber, Service } from '@/types';

// Mock Services Data matching template
const SERVICES_DATA = [
    { id: '1', name: 'Saç Kesimi', duration: '30 - 45 dk', price: 250, icon: 'content-cut' },
    { id: '2', name: 'Sakal Tıraşı', duration: '15 - 20 dk', price: 150, icon: 'face' },
    { id: '3', name: 'Cilt Bakımı', duration: '30 dk', price: 300, icon: 'spa' },
    { id: '4', name: 'Saç Yıkama', duration: '10 dk', price: 50, icon: 'wash' },
];

export default function StaffSelectionScreen() {
    const router = useRouter();
    const { barberId } = useLocalSearchParams();
    const { businesses } = useBusinessStore();
    const [selectedServices, setSelectedServices] = useState<string[]>(['1', '2']); // Default selected matching template

    // Specific staff member data (mocking the one from template)
    const staffMember = {
        name: 'Ahmet Yılmaz',
        title: 'Master Barber',
        rating: 4.9,
        operations: '1.2k',
        experience: '5 yıl',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDU6IKH_YkM-AaMfodbGhu5WDzJ-l_p3IfaNewGey-TBcWHvzIJDVult_XUC9UE4MkNgGCFu5Oyv7AeRQ3TME7dZfOvtFR_WoUt36IImLHRDB5Dn7rVeekf8cnz5dIvLIHNYcaHhvRNpZOu3FMW5p8_wi8j8Hr1R0D-zXZgrfEQNhfpvBQ31z5t88NtbSmtdfVG_PirPnbuAh03omi3jk4pNnVBG4Yzkhbv7JYYNhJB90Q7cxbsIgJjzwa9W9ZbHfRlOBSLi8aoPVA'
    };

    const toggleService = (id: string) => {
        setSelectedServices(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const total = SERVICES_DATA.filter(s => selectedServices.includes(s.id)).reduce((acc, curr) => acc + curr.price, 0);
    const totalDuration = 60; // Mock calculation based on template "~60 dk"

    return (
        <View className="flex-1 bg-background-light dark:bg-background-dark">
            {/* Header / Navigation */}
            <SafeAreaView className="absolute top-0 left-0 right-0 z-20 flex-row items-center justify-between p-4 bg-[#121212]">
                <Pressable
                    onPress={() => router.back()}
                    className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 dark:bg-[#1a1a1a] active:bg-gray-200 dark:active:bg-white/10"
                >
                    <MaterialIcons name="arrow-back" size={24} color={COLORS.text.inverse} />
                </Pressable>
                <View className="flex-row gap-4">
                    <Pressable className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 dark:bg-[#1a1a1a] active:bg-gray-200 dark:active:bg-white/10">
                        <MaterialIcons name="share" size={20} color={COLORS.text.inverse} />
                    </Pressable>
                    <Pressable className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 dark:bg-[#1a1a1a] active:bg-gray-200 dark:active:bg-white/10">
                        <MaterialIcons name="favorite" size={20} color={COLORS.text.inverse} />
                    </Pressable>
                </View>
            </SafeAreaView>

            <ScrollView className="flex-1 pt-24" contentContainerStyle={{ paddingBottom: 180 }} showsVerticalScrollIndicator={false}>
                {/* Profile Header */}
                <View className="items-center px-4 pt-4 pb-8">
                    <View className="relative mb-4">
                        <Image
                            source={{ uri: staffMember.image }}
                            className="w-32 h-32 rounded-full border-4 border-white dark:border-[#1a1a1a] bg-gray-200"
                        />
                        <View className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-black rounded-full" />
                    </View>

                    <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{staffMember.name}</Text>
                    <Text className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">{staffMember.title}</Text>

                    <View className="flex-row gap-6">
                        <View className="items-center">
                            <Text className="text-lg font-bold text-gray-900 dark:text-white">{staffMember.rating}</Text>
                            <Text className="text-xs text-gray-500 dark:text-gray-400">Puan</Text>
                        </View>
                        <View className="w-px h-full bg-gray-200 dark:bg-gray-800" />
                        <View className="items-center">
                            <Text className="text-lg font-bold text-gray-900 dark:text-white">{staffMember.operations}</Text>
                            <Text className="text-xs text-gray-500 dark:text-gray-400">İşlem</Text>
                        </View>
                        <View className="w-px h-full bg-gray-200 dark:bg-gray-800" />
                        <View className="items-center">
                            <Text className="text-lg font-bold text-gray-900 dark:text-white">{staffMember.experience}</Text>
                            <Text className="text-xs text-gray-500 dark:text-gray-400">Deneyim</Text>
                        </View>
                    </View>
                </View>

                {/* Services Title */}
                <View className="px-6 pb-4">
                    <Text className="text-xl font-bold text-gray-900 dark:text-white">Hizmetler</Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">Lütfen istediğiniz işlemleri seçin</Text>
                </View>

                {/* Services List */}
                <View className="px-4 gap-3">
                    {SERVICES_DATA.map((service) => {
                        const isSelected = selectedServices.includes(service.id);
                        return (
                            <Pressable
                                key={service.id}
                                onPress={() => toggleService(service.id)}
                                className={`flex-row items-center justify-between p-4 rounded-xl border-2 transition-all ${isSelected
                                    ? 'bg-white dark:bg-[#1a1a1a] border-primary shadow-lg shadow-primary/10'
                                    : 'bg-white dark:bg-[#1a1a1a] border-transparent hover:border-gray-300 dark:hover:border-gray-700'
                                    }`}
                            >
                                <View className="flex-row items-center gap-4 flex-1">
                                    <View className={`w-12 h-12 rounded-full items-center justify-center ${isSelected ? 'bg-primary/10' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                        <MaterialIcons
                                            name={service.icon as any}
                                            size={24}
                                            color={isSelected ? COLORS.primary.DEFAULT : '#9CA3AF'}
                                        />
                                    </View>
                                    <View>
                                        <Text className="text-base font-bold text-gray-900 dark:text-white">{service.name}</Text>
                                        <Text className="text-sm text-gray-500 dark:text-gray-400">{service.duration}</Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center gap-4">
                                    <Text className={`text-base font-bold ${isSelected ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                                        {service.price}₺
                                    </Text>
                                    <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${isSelected ? 'bg-primary border-primary' : 'border-gray-300 dark:border-gray-600'
                                        }`}>
                                        {isSelected && <MaterialIcons name="check" size={16} color="white" />}
                                    </View>
                                </View>
                            </Pressable>
                        );
                    })}
                </View>
            </ScrollView>

            {/* Sticky Footer */}
            <View className="absolute bottom-24 left-0 right-0 z-30 bg-white/90 dark:bg-[#101922]/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 p-4 pb-4 mx-4 rounded-2xl">
                <View className="flex-row items-center justify-between gap-4">
                    <View>
                        <Text className="text-xs font-medium text-gray-500 dark:text-gray-400">Toplam ({selectedServices.length} İşlem)</Text>
                        <View className="flex-row items-baseline gap-2">
                            <Text className="text-2xl font-bold text-gray-900 dark:text-white">{total}₺</Text>
                            <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">~{totalDuration} dk</Text>
                        </View>
                    </View>

                    <Pressable
                        onPress={() => router.push('/(customer)/booking/time-slot-selection')}
                        className="flex-1 bg-primary h-14 rounded-full shadow-lg shadow-blue-500/30 flex-row items-center justify-center gap-2 active:scale-95"
                    >
                        <Text className="text-white font-bold text-base">Uygun Saat Seç</Text>
                        <MaterialIcons name="arrow-forward" size={20} color="white" />
                    </Pressable>
                </View>
            </View>
        </View>
    );
}
