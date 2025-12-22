import React from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { COLORS } from '@/constants/theme';

// Schema
const addressSchema = z.object({
    city: z.string().min(2, 'Şehir seçiniz'),
    district: z.string().min(2, 'İlçe seçiniz'),
    fullAddress: z.string().min(10, 'Açık adres detaylı olmalıdır'),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface BusinessAddressFormProps {
    initialValues: Partial<AddressFormData>;
    onSubmit: (data: AddressFormData) => void;
    isLoading?: boolean;
}

export const BusinessAddressForm: React.FC<BusinessAddressFormProps> = ({ initialValues, onSubmit, isLoading }) => {
    const { control, handleSubmit, formState: { errors } } = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            city: initialValues.city || '',
            district: initialValues.district || '',
            fullAddress: initialValues.fullAddress || '',
        }
    });

    return (
        <View className="w-full gap-6">

            {/* City & District Row (Mocked as text inputs for MVP) */}
            <View className="flex-row gap-4">
                <View className="flex-1">
                    <Text className="text-zinc-400 text-sm mb-2 font-medium">Şehir</Text>
                    <Controller
                        control={control}
                        name="city"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                className={`bg-[#1E1E1E] text-white p-4 rounded-xl border ${errors.city ? 'border-red-500' : 'border-white/10'} focus:border-[#d4af35]`}
                                placeholder="İstanbul"
                                placeholderTextColor="#666"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                    />
                    {errors.city && <Text className="text-red-500 text-xs mt-1">{errors.city.message}</Text>}
                </View>

                <View className="flex-1">
                    <Text className="text-zinc-400 text-sm mb-2 font-medium">İlçe</Text>
                    <Controller
                        control={control}
                        name="district"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                className={`bg-[#1E1E1E] text-white p-4 rounded-xl border ${errors.district ? 'border-red-500' : 'border-white/10'} focus:border-[#d4af35]`}
                                placeholder="Kadıköy"
                                placeholderTextColor="#666"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                    />
                    {errors.district && <Text className="text-red-500 text-xs mt-1">{errors.district.message}</Text>}
                </View>
            </View>

            {/* Full Address */}
            <View>
                <Text className="text-zinc-400 text-sm mb-2 font-medium">Açık Adres</Text>
                <Controller
                    control={control}
                    name="fullAddress"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            className={`bg-[#1E1E1E] text-white p-4 rounded-xl border ${errors.fullAddress ? 'border-red-500' : 'border-white/10'} focus:border-[#d4af35]`}
                            placeholder="Mahalle, Cadde, Sokak, No..."
                            placeholderTextColor="#666"
                            multiline
                            numberOfLines={4}
                            style={{ height: 100, paddingTop: 12 }}
                            textAlignVertical="top"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.fullAddress && <Text className="text-red-500 text-xs mt-1">{errors.fullAddress.message}</Text>}
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
                    <Text className="text-black font-bold text-base uppercase tracking-wide">Kaydı Tamamla</Text>
                )}
            </Pressable>
        </View>
    );
};
