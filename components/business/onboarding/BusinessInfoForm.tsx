import React from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';

// Schema
const infoSchema = z.object({
    businessName: z.string().min(2, 'İşletme adı en az 2 karakter olmalıdır'),
    category: z.enum(['barber', 'hair_salon', 'beauty_center']),
});

type InfoFormData = z.infer<typeof infoSchema>;

interface BusinessInfoFormProps {
    initialValues: Partial<InfoFormData>;
    onSubmit: (data: InfoFormData) => void;
}

export const BusinessInfoForm: React.FC<BusinessInfoFormProps> = ({ initialValues, onSubmit }) => {
    const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<InfoFormData>({
        resolver: zodResolver(infoSchema),
        defaultValues: {
            businessName: initialValues.businessName || '',
            category: initialValues.category || 'barber',
        }
    });

    const selectedCategory = watch('category');

    const categories = [
        { id: 'barber', label: 'Berber', icon: 'content-cut' },
        { id: 'hair_salon', label: 'Kuaför', icon: 'face' },
        { id: 'beauty_center', label: 'Güzellik Merkezi', icon: 'spa' },
    ];

    return (
        <View className="w-full gap-6">
            {/* Business Name */}
            <View>
                <Text className="text-zinc-400 text-sm mb-2 font-medium">İşletme Adı</Text>
                <Controller
                    control={control}
                    name="businessName"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            className={`bg-[#1E1E1E] text-white p-4 rounded-xl border ${errors.businessName ? 'border-red-500' : 'border-white/10'} focus:border-[#d4af35]`}
                            placeholder="Örn: Gold Makas"
                            placeholderTextColor="#666"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.businessName && <Text className="text-red-500 text-xs mt-1">{errors.businessName.message}</Text>}
            </View>

            {/* Category Selection */}
            <View>
                <Text className="text-zinc-400 text-sm mb-2 font-medium">İşletme Tipi</Text>
                <View className="flex-row gap-3">
                    {categories.map((cat) => (
                        <Pressable
                            key={cat.id}
                            onPress={() => setValue('category', cat.id as any)}
                            className={`flex-1 p-3 rounded-xl border items-center justify-center gap-2 ${selectedCategory === cat.id ? 'bg-[#d4af35]/10 border-[#d4af35]' : 'bg-[#1E1E1E] border-white/10'}`}
                        >
                            <MaterialIcons
                                name={cat.icon as any}
                                size={24}
                                color={selectedCategory === cat.id ? '#d4af35' : '#666'}
                            />
                            <Text className={`text-xs font-medium ${selectedCategory === cat.id ? 'text-[#d4af35]' : 'text-zinc-400'}`}>
                                {cat.label}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>

            {/* Submit Button */}
            <Pressable
                onPress={handleSubmit(onSubmit)}
                className="w-full bg-[#d4af35] py-4 rounded-xl items-center justify-center mt-4 active:opacity-90"
            >
                <Text className="text-black font-bold text-base uppercase tracking-wide">Devam Et</Text>
            </Pressable>
        </View>
    );
};
