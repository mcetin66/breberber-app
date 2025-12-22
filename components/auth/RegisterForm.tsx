import React from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { LegalCheckbox } from './LegalCheckbox';

// Validation Schema
const registerSchema = z.object({
    fullName: z.string().min(3, 'Ad Soyad en az 3 karakter olmalıdır'),
    email: z.string().email('Geçerli bir e-posta adresi giriniz'),
    phone: z.string().min(10, 'Geçerli bir telefon numarası giriniz (Min 10 hane)').regex(/^\d+$/, 'Sadece rakam giriniz'),
    password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
    kvkkAccepted: z.boolean().refine((val) => val === true, { message: "KVKK metnini onaylamanız gerekmektedir" }),
    marketingAllowed: z.boolean().optional(),
});

type FormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
    onSubmit: (data: FormData) => void;
    isLoading?: boolean;
    error?: string | null;
    onLegalLinkPress?: (type: 'kvkk' | 'terms') => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading, error, onLegalLinkPress }) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            password: '',
            kvkkAccepted: false,
            marketingAllowed: false,
        }
    });

    return (
        <View className="w-full gap-4">
            {/* Full Name */}
            <View>
                <Text className="text-zinc-400 text-sm mb-1 font-medium">Ad Soyad</Text>
                <Controller
                    control={control}
                    name="fullName"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            className={`bg-[#1E1E1E] text-white p-4 rounded-xl border ${errors.fullName ? 'border-red-500' : 'border-white/10'} focus:border-[#d4af35]`}
                            placeholder="Adınız Soyadınız"
                            placeholderTextColor="#666"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            autoCapitalize="words"
                        />
                    )}
                />
                {errors.fullName && <Text className="text-red-500 text-xs mt-1">{errors.fullName.message}</Text>}
            </View>

            {/* Email */}
            <View>
                <Text className="text-zinc-400 text-sm mb-1 font-medium">E-Posta</Text>
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            className={`bg-[#1E1E1E] text-white p-4 rounded-xl border ${errors.email ? 'border-red-500' : 'border-white/10'} focus:border-[#d4af35]`}
                            placeholder="ornek@email.com"
                            placeholderTextColor="#666"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    )}
                />
                {errors.email && <Text className="text-red-500 text-xs mt-1">{errors.email.message}</Text>}
            </View>

            {/* Phone */}
            <View>
                <Text className="text-zinc-400 text-sm mb-1 font-medium">Telefon</Text>
                <Controller
                    control={control}
                    name="phone"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            className={`bg-[#1E1E1E] text-white p-4 rounded-xl border ${errors.phone ? 'border-red-500' : 'border-white/10'} focus:border-[#d4af35]`}
                            placeholder="5XX XXX XX XX"
                            placeholderTextColor="#666"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            keyboardType="phone-pad"
                        />
                    )}
                />
                {errors.phone && <Text className="text-red-500 text-xs mt-1">{errors.phone.message}</Text>}
            </View>

            {/* Password */}
            <View>
                <Text className="text-zinc-400 text-sm mb-1 font-medium">Şifre</Text>
                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View className="relative justify-center">
                            <TextInput
                                className={`bg-[#1E1E1E] text-white p-4 pr-12 rounded-xl border ${errors.password ? 'border-red-500' : 'border-white/10'} focus:border-[#d4af35]`}
                                placeholder="******"
                                placeholderTextColor="#666"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                secureTextEntry={!showPassword}
                            />
                            <Pressable
                                onPress={() => setShowPassword(!showPassword)}
                                className="absolute right-4 p-1"
                            >
                                {showPassword ? (
                                    <EyeOff size={20} color="#666" />
                                ) : (
                                    <Eye size={20} color="#666" />
                                )}
                            </Pressable>
                        </View>
                    )}
                />
                {errors.password && <Text className="text-red-500 text-xs mt-1">{errors.password.message}</Text>}
            </View>

            {/* Legal Checkboxes */}
            <View className="mt-2">
                <Controller
                    control={control}
                    name="kvkkAccepted"
                    render={({ field: { onChange, value } }) => (
                        <LegalCheckbox
                            label="Aydınlatma metnini okudum ve kabul ediyorum."
                            linkText="KVKK Metnini Oku"
                            onLinkPress={() => onLegalLinkPress?.('kvkk')}
                            checked={value}
                            onChange={onChange}
                            error={errors.kvkkAccepted?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="marketingAllowed"
                    render={({ field: { onChange, value } }) => (
                        <LegalCheckbox
                            label="Kampanyalardan haberdar olmak için elektronik ileti gönderilmesine izin veriyorum."
                            checked={value || false}
                            onChange={onChange}
                        />
                    )}
                />
            </View>

            {/* Error Message */}
            {error && (
                <View className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                    <Text className="text-red-500 text-sm text-center font-medium">{error}</Text>
                </View>
            )}

            {/* Submit Button */}
            <Pressable
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
                className={`w-full py-4 rounded-xl items-center justify-center mt-2 ${isLoading ? 'bg-zinc-700' : 'bg-[#d4af35] active:opacity-90'}`}
            >
                {isLoading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-black font-bold text-base uppercase tracking-wide">Hesap Oluştur</Text>
                )}
            </Pressable>
        </View>
    );
};
