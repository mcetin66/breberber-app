import React from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { useBusinessStore } from '@/store/useBusinessStore';
import { ChevronLeft } from 'lucide-react-native';

const staffSchema = z.object({
    full_name: z.string().min(3, 'Ad Soyad en az 3 karakter olmalıdır'),
    phone: z.string().min(10, 'Geçerli bir numara giriniz'),
    role: z.enum(['business_owner', 'staff']),
});

type StaffFormData = z.infer<typeof staffSchema>;

export default function StaffFormScreen() {
    const router = useRouter();
    const { addStaff, isLoading } = useBusinessStore();

    const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<StaffFormData>({
        resolver: zodResolver(staffSchema),
        defaultValues: {
            full_name: '',
            phone: '',
            role: 'staff',
        }
    });

    const selectedRole = watch('role');

    const onSubmit = async (data: StaffFormData) => {
        const success = await addStaff(data);
        if (success) {
            Alert.alert("Başarılı", "Personel eklendi.", [
                { text: "Tamam", onPress: () => router.back() }
            ]);
        } else {
            Alert.alert("Hata", "Personel eklenemedi.");
        }
    };

    return (
        <ScreenWrapper noPadding>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1 bg-[#121212] px-6">
                    {/* Header */}
                    <View className="mt-8 mb-6 flex-row items-center">
                        <Pressable onPress={() => router.back()} className="p-2 -ml-2 rounded-full active:bg-white/10">
                            <ChevronLeft size={24} color="white" />
                        </Pressable>
                        <Text className="text-white text-xl font-bold ml-2">Personel Ekle</Text>
                    </View>

                    <View className="gap-6">
                        {/* Full Name */}
                        <View>
                            <Text className="text-zinc-400 text-sm mb-2 font-medium">Ad Soyad</Text>
                            <Controller
                                control={control}
                                name="full_name"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        className={`bg-[#1E1E1E] text-white p-4 rounded-xl border ${errors.full_name ? 'border-red-500' : 'border-white/10'} focus:border-[#d4af35]`}
                                        placeholder="Personel Adı"
                                        placeholderTextColor="#666"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                )}
                            />
                            {errors.full_name && <Text className="text-red-500 text-xs mt-1">{errors.full_name.message}</Text>}
                        </View>

                        {/* Phone */}
                        <View>
                            <Text className="text-zinc-400 text-sm mb-2 font-medium">Telefon</Text>
                            <Controller
                                control={control}
                                name="phone"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        className={`bg-[#1E1E1E] text-white p-4 rounded-xl border ${errors.phone ? 'border-red-500' : 'border-white/10'} focus:border-[#d4af35]`}
                                        placeholder="5XX XXX XX XX"
                                        placeholderTextColor="#666"
                                        keyboardType="phone-pad"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                )}
                            />
                            {errors.phone && <Text className="text-red-500 text-xs mt-1">{errors.phone.message}</Text>}
                        </View>

                        {/* Role Selection */}
                        <View>
                            <Text className="text-zinc-400 text-sm mb-2 font-medium">Rol</Text>
                            <View className="flex-row gap-3">
                                <Pressable
                                    onPress={() => setValue('role', 'staff')}
                                    className={`flex-1 p-4 rounded-xl border items-center ${selectedRole === 'staff' ? 'bg-[#d4af35]/10 border-[#d4af35]' : 'bg-[#1E1E1E] border-white/10'}`}
                                >
                                    <Text className={`font-medium ${selectedRole === 'staff' ? 'text-[#d4af35]' : 'text-zinc-400'}`}>Personel</Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => setValue('role', 'business_owner')}
                                    className={`flex-1 p-4 rounded-xl border items-center ${selectedRole === 'business_owner' ? 'bg-[#d4af35]/10 border-[#d4af35]' : 'bg-[#1E1E1E] border-white/10'}`}
                                >
                                    <Text className={`font-medium ${selectedRole === 'business_owner' ? 'text-[#d4af35]' : 'text-zinc-400'}`}>Yönetici</Text>
                                </Pressable>
                            </View>
                        </View>

                        {/* Submit Button */}
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
                </View>
            </TouchableWithoutFeedback>
        </ScreenWrapper>
    );
}
