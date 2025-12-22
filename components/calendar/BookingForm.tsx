import React, { useEffect, useMemo } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MaterialIcons } from '@expo/vector-icons';
import { useBusinessStore } from '@/store/useBusinessStore';
import { COLORS } from '@/constants/theme';
import { Service, StaffProfile } from '@/types';

// Validation Schema
const bookingSchema = z.object({
    customerName: z.string().min(2, 'Müşteri adı en az 2 karakter olmalıdır'),
    customerPhone: z.string().optional(), // MVP: Optional for now
    serviceId: z.string().min(1, 'Hizmet seçiniz'),
    staffId: z.string().min(1, 'Personel seçiniz'),
    startTime: z.string(), // "HH:MM"
    notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
    initialDate: Date;
    initialStaffId?: string;
    initialTime: string;
    businessId: string;
    onCancel: () => void;
    onSuccess: (data: any) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
    initialDate,
    initialStaffId,
    initialTime,
    businessId,
    onCancel,
    onSuccess
}) => {
    // Store Data
    const { serviceList, staffList: allStaff } = useBusinessStore();
    // In this app architecture, the store holds the current tenant's data.
    const services = serviceList;
    const staffList = allStaff;

    const { control, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<BookingFormData>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            customerName: '',
            customerPhone: '',
            serviceId: '', // User must select
            staffId: initialStaffId || '',
            startTime: initialTime,
            notes: '',
        }
    });

    // Watch fields for logic
    const selectedServiceId = watch('serviceId');
    const selectedStaffId = watch('staffId');

    // Derived Data
    const selectedService = useMemo(() =>
        services.find((s: Service) => s.id === selectedServiceId),
        [services, selectedServiceId]);

    const selectedStaff = useMemo(() =>
        staffList.find((s: StaffProfile) => s.id === selectedStaffId),
        [staffList, selectedStaffId]);

    // Calculate End Time & Price
    const calculation = useMemo(() => {
        if (!selectedService) return { endTime: initialTime, price: 0, duration: 0 };

        const duration = selectedService.duration_minutes || selectedService.duration || 30;
        const [h, m] = initialTime.split(':').map(Number);
        const startMin = h * 60 + m;
        const endMin = startMin + duration;

        const endH = Math.floor(endMin / 60);
        const endM = endMin % 60;
        const endTime = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;

        return { endTime, price: selectedService.price, duration };
    }, [selectedService, initialTime]);

    const onSubmit = (data: BookingFormData) => {
        // Construct full payload
        const payload = {
            ...data,
            date: initialDate,
            duration: calculation.duration,
            endTime: calculation.endTime,
            totalPrice: calculation.price,
            status: 'confirmed', // Default status
        };
        onSuccess(payload);
    };

    return (
        <View className="flex-1 bg-[#18181b] rounded-t-3xl overflow-hidden">
            {/* Header */}
            <View className="flex-row items-center justify-between p-5 border-b border-white/10 bg-[#18181b]">
                <View>
                    <Text className="text-white text-lg font-bold">Yeni Randevu</Text>
                    <Text className="text-zinc-400 text-xs mt-1">
                        {initialDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })} • {initialTime}
                    </Text>
                </View>
                <Pressable onPress={onCancel} className="p-2 bg-white/5 rounded-full">
                    <MaterialIcons name="close" size={20} color="white" />
                </Pressable>
            </View>

            <ScrollView className="flex-1 p-5" contentContainerStyle={{ paddingBottom: 40 }}>
                {/* 1. Customer Info */}
                <View className="mb-6">
                    <Text className="text-zinc-500 text-xs font-bold uppercase mb-2 tracking-wider">Müşteri Bilgileri</Text>
                    <View className="gap-3">
                        <Controller
                            control={control}
                            name="customerName"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View>
                                    <TextInput
                                        className={`bg-[#27272a] text-white p-4 rounded-xl border ${errors.customerName ? 'border-red-500' : 'border-white/5'} font-medium`}
                                        placeholder="Ad Soyad"
                                        placeholderTextColor="#525252"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                    {errors.customerName && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.customerName.message}</Text>}
                                </View>
                            )}
                        />
                        <Controller
                            control={control}
                            name="customerPhone"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    className="bg-[#27272a] text-white p-4 rounded-xl border border-white/5 font-medium"
                                    placeholder="Telefon (İsteğe bağlı)"
                                    placeholderTextColor="#525252"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    keyboardType="phone-pad"
                                />
                            )}
                        />
                    </View>
                </View>

                {/* 2. Staff Selection */}
                <View className="mb-6">
                    <Text className="text-zinc-500 text-xs font-bold uppercase mb-2 tracking-wider">Personel</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                        {staffList.map((staff: StaffProfile) => {
                            const isSelected = selectedStaffId === staff.id;
                            return (
                                <Pressable
                                    key={staff.id}
                                    onPress={() => setValue('staffId', staff.id)}
                                    className={`px-4 py-3 rounded-xl border flex-row items-center gap-2 ${isSelected ? 'bg-[#d4af35]/20 border-[#d4af35]' : 'bg-[#27272a] border-white/5'}`}
                                >
                                    <View className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#d4af35]' : 'bg-zinc-600'}`} />
                                    <Text className={`font-medium ${isSelected ? 'text-[#d4af35]' : 'text-zinc-400'}`}>{staff.name}</Text>
                                </Pressable>
                            )
                        })}
                    </ScrollView>
                    {errors.staffId && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.staffId.message}</Text>}
                </View>

                {/* 3. Service Selection */}
                <View className="mb-6">
                    <Text className="text-zinc-500 text-xs font-bold uppercase mb-2 tracking-wider">Hizmet</Text>
                    <View className="gap-2">
                        {services.length === 0 && (
                            <Text className="text-zinc-500 italic text-sm">Hizmet bulunamadı. Lütfen ayarlardan hizmet ekleyin.</Text>
                        )}
                        {services.map((service: Service) => {
                            const isSelected = selectedServiceId === service.id;
                            return (
                                <Pressable
                                    key={service.id}
                                    onPress={() => setValue('serviceId', service.id)}
                                    className={`p-4 rounded-xl border flex-row justify-between items-center ${isSelected ? 'bg-[#d4af35]/10 border-[#d4af35]' : 'bg-[#27272a] border-white/5'}`}
                                >
                                    <View>
                                        <Text className={`font-bold text-base ${isSelected ? 'text-[#d4af35]' : 'text-zinc-300'}`}>{service.name}</Text>
                                        <Text className="text-zinc-500 text-xs">{service.duration_minutes || service.duration || '?'} dk</Text>
                                    </View>
                                    <Text className={`font-bold text-lg ${isSelected ? 'text-[#d4af35]' : 'text-white'}`}>{service.price} ₺</Text>
                                </Pressable>
                            );
                        })}
                    </View>
                    {errors.serviceId && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.serviceId.message}</Text>}
                </View>

                {/* 4. Notes */}
                <View className="mb-6">
                    <Text className="text-zinc-500 text-xs font-bold uppercase mb-2 tracking-wider">Notlar</Text>
                    <Controller
                        control={control}
                        name="notes"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                className="bg-[#27272a] text-white p-4 rounded-xl border border-white/5 font-medium h-24"
                                placeholder="Randevu notu..."
                                placeholderTextColor="#525252"
                                multiline
                                textAlignVertical="top"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                    />
                </View>

            </ScrollView>

            {/* Footer Summary */}
            <View className="p-5 border-t border-white/10 bg-[#18181b] safe-bottom">
                <View className="flex-row justify-between items-end mb-4">
                    <View>
                        <Text className="text-zinc-400 text-xs">Toplam Tutar</Text>
                        <Text className="text-white text-2xl font-bold">{calculation.price} ₺</Text>
                    </View>
                    <View className="items-end">
                        <Text className="text-zinc-400 text-xs">Saat Aralığı</Text>
                        <Text className="text-[#d4af35] text-lg font-bold">{initialTime} - {calculation.endTime}</Text>
                    </View>
                </View>

                <Pressable
                    onPress={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-xl items-center justify-center ${isSubmitting ? 'bg-zinc-700' : 'bg-[#d4af35] active:opacity-90'}`}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-black font-bold text-base uppercase tracking-wider">Randevuyu Oluştur</Text>
                    )}
                </Pressable>
            </View>
        </View>
    );
};
