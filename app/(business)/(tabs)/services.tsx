import { View, Text, TextInput, Pressable, ScrollView, Modal, Platform } from 'react-native';
import { StandardScreen } from '@/components/ui/StandardScreen';
import { COLORS } from '@/constants/theme';
import { Scissors, Edit2, Clock, Check, ChevronDown, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { BlurView } from 'expo-blur';

const SERVICES_DATA = [
    {
        id: '1',
        name: 'Lüks Saç Kesimi',
        desc: 'Yıkama ve şekillendirme dahil',
        duration: '40 dk',
        price: '450',
        isActive: true,
        icon: Scissors
    },
    {
        id: '2',
        name: 'Sakal Tıraşı & Bakım',
        desc: 'Sıcak havlu ve buhar ile',
        duration: '20 dk',
        price: '200',
        isActive: true,
        icon: Scissors // Should be Face in real app but using Scissors as generic
    },
    {
        id: '3',
        name: 'Saç Boyama',
        desc: 'Organik boya seçenekleri',
        duration: '60 dk',
        price: '750',
        isActive: false, // Inactive/Editing state
        icon: Scissors // Brush icon
    }
];

export default function BusinessServicesScreen() {
    const [selectedService, setSelectedService] = useState<any>(null); // For edit modal

    return (
        <StandardScreen
            title="Hizmet Yönetimi"
            rightElement={
                <Pressable
                    className="w-10 h-10 rounded-full text-[#d4af35] bg-[#d4af35]/10 items-center justify-center active:bg-[#d4af35]/20"
                    onPress={() => setSelectedService({})} // Empty obj for new
                >
                    <PlusIcon size={24} color={COLORS.primary.DEFAULT} />
                </Pressable>
            }
        >
            {/* Section Title */}
            <View className="flex-row items-center justify-between py-4">
                <Text className="text-xl font-bold text-white">Hizmet Listesi</Text>
                <View className="bg-[#d4af35]/10 border border-[#d4af35]/20 px-2 py-1 rounded">
                    <Text className="text-xs font-medium text-[#d4af35]">3 Hizmet Aktif</Text>
                </View>
            </View>

            {/* List */}
            <View className="gap-4 pb-32">
                {SERVICES_DATA.map((service) => (
                    <Pressable
                        key={service.id}
                        onPress={() => setSelectedService(service)}
                        className={`p-4 rounded-xl bg-[#1E1E1E] border border-white/5 active:border-[#d4af35]/30 ${!service.isActive ? 'opacity-50 grayscale' : ''}`}
                    >
                        <View className="flex-row justify-between items-start mb-3">
                            <View className="flex-row gap-4">
                                <View className="w-12 h-12 rounded-lg bg-white/5 items-center justify-center">
                                    <service.icon size={24} color={COLORS.primary.DEFAULT} />
                                </View>
                                <View>
                                    <Text className="font-bold text-white text-base">{service.name}</Text>
                                    <Text className="text-sm text-gray-500 mt-0.5">{service.desc}</Text>
                                </View>
                            </View>
                            <Pressable
                                onPress={() => setSelectedService(service)}
                                className="p-1"
                            >
                                <Edit2 size={18} color="#9CA3AF" />
                            </Pressable>
                        </View>

                        <View className="flex-row items-center gap-4 border-t border-white/5 pt-3">
                            <View className="flex-row items-center gap-1.5">
                                <Clock size={16} color={COLORS.primary.DEFAULT} />
                                <Text className="text-sm font-medium text-gray-300">{service.duration}</Text>
                            </View>
                            <View className="flex-row items-center gap-1.5">
                                <Text className="text-[#d4af35] font-bold text-lg">₺</Text>
                                <Text className="text-sm font-bold text-white">{service.price} ₺</Text>
                            </View>
                            <View className="ml-auto flex-row items-center gap-2">
                                <View className={`w-2 h-2 rounded-full ${service.isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-500'}`} />
                                <Text className="text-xs text-gray-500">{service.isActive ? 'Aktif' : 'Pasif'}</Text>
                            </View>
                        </View>
                    </Pressable>
                ))}
            </View>

            {/* Edit Modal (Simulated Bottom Sheet) */}
            {selectedService && (
                <View className="absolute inset-x-0 bottom-0 z-50">
                    {/* Backdrop */}
                    <Pressable
                        className="absolute inset-0 bg-black/60 h-screen -top-[800px]" // Hacky full screen cover
                        onPress={() => setSelectedService(null)}
                    />

                    {/* Sheet */}
                    <View className="bg-[#1E1E1E] rounded-t-[32px] border-t border-white/10 shadow-2xl pb-10">
                        <View className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-gray-600 mb-2" />

                        <View className="flex-row items-center justify-between px-6 py-4 border-b border-white/5 mb-4">
                            <Text className="text-xl font-bold text-white">{selectedService?.id ? 'Hizmeti Düzenle' : 'Yeni Hizmet'}</Text>
                            {selectedService?.id && (
                                <Pressable className="flex-row items-center gap-1">
                                    <Trash2 size={16} color="#f87171" />
                                    <Text className="text-sm font-medium text-red-400">Sil</Text>
                                </Pressable>
                            )}
                        </View>

                        <View className="px-6 gap-5">
                            {/* Name */}
                            <View className="gap-1.5">
                                <Text className="text-xs font-medium uppercase tracking-wide text-gray-400">Hizmet Adı</Text>
                                <View className="relative">
                                    <TextInput
                                        className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white focus:border-[#d4af35]"
                                        value={selectedService?.name || 'Yeni Hizmet'}
                                    />
                                    <View className="absolute right-3 top-3.5">
                                        <Edit2 size={16} color={COLORS.primary.DEFAULT} />
                                    </View>
                                </View>
                            </View>

                            <View className="flex-row gap-4">
                                {/* Price */}
                                <View className="flex-1 gap-1.5">
                                    <Text className="text-xs font-medium uppercase tracking-wide text-gray-400">Fiyat (TL)</Text>
                                    <View className="relative">
                                        <Text className="absolute left-4 top-3.5 text-[#d4af35] font-bold">₺</Text>
                                        <TextInput
                                            className="w-full rounded-xl bg-black/40 border border-white/10 pl-8 pr-4 py-3 text-white font-bold focus:border-[#d4af35]"
                                            value={selectedService?.price || '0'}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </View>

                                {/* Duration */}
                                <View className="flex-1 gap-1.5">
                                    <Text className="text-xs font-medium uppercase tracking-wide text-gray-400">Süre</Text>
                                    <View className="relative">
                                        <View className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 flex-row justify-between items-center">
                                            <Text className="text-white">{selectedService?.duration || '30 dk'}</Text>
                                            <ChevronDown size={16} color="gray" />
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Save Button */}
                            <Pressable
                                className="w-full rounded-xl bg-[#d4af35] p-4 flex-row items-center justify-center gap-2 mt-4 active:scale-[0.98]"
                                onPress={() => setSelectedService(null)}
                            >
                                <Text className="font-bold text-black text-base">Değişiklikleri Kaydet</Text>
                                <Check size={20} color="black" />
                            </Pressable>
                        </View>
                    </View>
                </View>
            )}

        </StandardScreen>
    );
}

// Simple Plus Icon component if not imported
const PlusIcon = ({ size, color }: { size: number, color: string }) => (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ position: 'absolute', width: size, height: 2, backgroundColor: color }} />
        <View style={{ position: 'absolute', width: 2, height: size, backgroundColor: color }} />
    </View>
);
