import React from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MaterialIcons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { useBusinessStore } from '@/stores/businessStore';
import { useAuthStore } from '@/stores/authStore';
import { RoleIndicator } from '@/components/ui/RoleIndicator';
import { DurationPicker } from '@/components/ui/DurationPicker';
import { COLORS } from '@/constants/theme';

// Schema
const serviceSchema = z.object({
    name: z.string().min(2, 'Hizmet adı en az 2 karakter olmalıdır'),
    price: z.string().min(1, 'Fiyat giriniz').regex(/^\d+$/, 'Sadece rakam giriniz'),
    duration_minutes: z.number().min(10, 'En az 10 dakika olmalıdır').refine(n => n % 10 === 0, 'Süre 10 dakikanın katı olmalıdır'),
    category: z.string().min(1, 'Kategori seçiniz'),
});

type FormData = z.infer<typeof serviceSchema>;

const CATEGORIES = [
    { id: 'hair', label: 'Saç Kesimi' },
    { id: 'beard', label: 'Sakal Kesimi' },
    { id: 'care', label: 'Bakım' },
    { id: 'coloring', label: 'Boyama' },
    { id: 'spa', label: 'Spa & Masaj' },
    { id: 'package', label: 'Paket Servis' },
];

export default function ServiceFormScreen() {
    const router = useRouter();
    const { addService, isLoading } = useBusinessStore();
    const { user } = useAuthStore();

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            name: '',
            price: '',
            duration_minutes: 30, // Default 30 mins
            category: 'hair',
        }
    });

    const onSubmit = async (data: FormData) => {
        if (!user?.barberId) return;
        try {
            await addService(user.barberId, {
                name: data.name,
                price: parseInt(data.price),
                duration_minutes: data.duration_minutes,
                duration: data.duration_minutes, // backward compat
                category: data.category,
            } as any);
            router.back();
        } catch (error) {
            console.error('Failed to add service', error);
        }
    };

    return (
        <ScreenWrapper noPadding>
            <View className="flex-1 bg-[#121212]">
                {/* Header */}
                <View className="px-5 py-4 border-b border-white/10 flex-row justify-between items-center bg-[#1E1E1E]">
                    <View className="flex-row items-center gap-3">
                        <Pressable onPress={() => router.back()} className="p-1">
                            <MaterialIcons name="arrow-back" size={24} color="white" />
                        </Pressable>
                        <Text className="text-white font-bold text-xl">Yeni Hizmet Ekle</Text>
                    </View>
                    <RoleIndicator />
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                >
                    <ScrollView className="flex-1 px-6 pt-6">
                        <View className="gap-5 pb-10">

                            {/* Service Name */}
                            <View>
                                <Text className="text-zinc-400 text-sm mb-1 font-medium">Hizmet Adı</Text>
                                <Controller
                                    control={control}
                                    name="name"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            className={`bg-[#1E1E1E] text-white p-4 rounded-xl border ${errors.name ? 'border-red-500' : 'border-white/10'} focus:border-[#d4af35]`}
                                            placeholder="Örn: Saç Kesimi"
                                            placeholderTextColor="#666"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                    )}
                                />
                                {errors.name && <Text className="text-red-500 text-xs mt-1">{errors.name.message}</Text>}
                            </View>

                            {/* Price */}
                            <View>
                                <Text className="text-zinc-400 text-sm mb-1 font-medium">Fiyat (₺)</Text>
                                <Controller
                                    control={control}
                                    name="price"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            className={`bg-[#1E1E1E] text-white p-4 rounded-xl border ${errors.price ? 'border-red-500' : 'border-white/10'} focus:border-[#d4af35]`}
                                            placeholder="0"
                                            placeholderTextColor="#666"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            keyboardType="numeric"
                                        />
                                    )}
                                />
                                {errors.price && <Text className="text-red-500 text-xs mt-1">{errors.price.message}</Text>}
                            </View>

                            {/* Duration Picker (Custom) */}
                            <Controller
                                control={control}
                                name="duration_minutes"
                                render={({ field: { onChange, value } }) => (
                                    <DurationPicker
                                        value={value}
                                        onChange={onChange}
                                        error={errors.duration_minutes?.message}
                                    />
                                )}
                            />

                            {/* Category Selection */}
                            <View>
                                <Text className="text-zinc-400 text-sm mb-2 font-medium">Kategori</Text>
                                <View className="flex-row flex-wrap gap-2">
                                    <Controller
                                        control={control}
                                        name="category"
                                        render={({ field: { onChange, value } }) => (
                                            <>
                                                {CATEGORIES.map((cat) => (
                                                    <Pressable
                                                        key={cat.id}
                                                        onPress={() => onChange(cat.id)}
                                                        className={`px-4 py-2 rounded-full border ${value === cat.id ? 'bg-[#d4af35] border-[#d4af35]' : 'bg-[#1E1E1E] border-white/10'}`}
                                                    >
                                                        <Text className={`text-sm font-medium ${value === cat.id ? 'text-black' : 'text-zinc-400'}`}>
                                                            {cat.label}
                                                        </Text>
                                                    </Pressable>
                                                ))}
                                            </>
                                        )}
                                    />
                                </View>
                                {errors.category && <Text className="text-red-500 text-xs mt-1">{errors.category.message}</Text>}
                            </View>

                            {/* Submit */}
                            <Pressable
                                onPress={handleSubmit(onSubmit)}
                                disabled={isLoading}
                                className={`w-full py-4 rounded-xl items-center justify-center mt-4 ${isLoading ? 'bg-zinc-700' : 'bg-[#d4af35] active:opacity-90'}`}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-black font-bold text-base uppercase tracking-wide">Kaydet</Text>
                                )}
                            </Pressable>

                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </ScreenWrapper>
    );
}
