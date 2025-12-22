import React from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, CheckCircle } from 'lucide-react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';

// Validation Schema including method
// Validation Schema including method
const loginSchema = z.object({
    email: z.string().optional(),
    phone: z.string().optional(),
    password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
    method: z.enum(['email', 'phone']),
    rememberMe: z.boolean().optional()
}).superRefine((data, ctx) => {
    // ... same logic
    if (data.method === 'email') {
        if (!data.email || !z.string().email().safeParse(data.email).success) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Geçerli bir e-posta adresi giriniz.",
                path: ["email"]
            });
        }
    } else {
        if (!data.phone || !/^\d{10,}$/.test(data.phone)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Geçerli bir telefon numarası giriniz (En az 10 hane).",
                path: ["phone"]
            });
        }
    }
});

type FormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
    onSubmit: (data: FormData) => void;
    isLoading?: boolean;
    error?: string | null;
    initialValues?: {
        email?: string;
        phone?: string;
        method?: 'email' | 'phone';
        rememberMe?: boolean;
    };
    savedAccounts?: any[];
    onRemoveAccount?: (id: string) => void;
    filterRole?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading, error, initialValues, savedAccounts = [], onRemoveAccount, filterRole }) => {
    // We keep 'method' in local state to control UI toggle, but we also sync it to form state
    const [method, setMethod] = React.useState<'email' | 'phone'>(initialValues?.method || 'email');
    const [showPassword, setShowPassword] = React.useState(false);
    const [rememberMe, setRememberMe] = React.useState(initialValues?.rememberMe || false);
    const [showSavedAccounts, setShowSavedAccounts] = React.useState(false);

    const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: initialValues?.email || '',
            phone: initialValues?.phone || '',
            password: '',
            method: initialValues?.method || 'email',
            rememberMe: initialValues?.rememberMe || false
        }
    });

    // Update form when initialValues change
    React.useEffect(() => {
        if (initialValues) {
            reset({
                email: initialValues.email || '',
                phone: initialValues.phone || '',
                password: 'password123', // Auto-fill default password as requested
                method: initialValues.method || 'email',
                rememberMe: initialValues.rememberMe
            });
            setMethod(initialValues.method || 'email');
            setRememberMe(initialValues.rememberMe || false);
        }
    }, [initialValues, reset]);

    // Update form value when toggle changes
    React.useEffect(() => {
        setValue('method', method);
    }, [method, setValue]);

    const handleSelectAccount = (account: any) => {
        const accountMethod = account.phone ? 'phone' : 'email';
        setMethod(accountMethod);
        setValue('method', accountMethod);

        if (accountMethod === 'phone') {
            setValue('phone', account.phone);
            setValue('email', '');
        } else {
            setValue('email', account.email);
            setValue('phone', '');
        }

        setValue('password', 'password123'); // Hardcoded default password
        setValue('rememberMe', true);
        setRememberMe(true);
        setShowSavedAccounts(false);
    };

    const filteredSavedAccounts = savedAccounts.filter(acc => {
        // Filter by method
        if (method === 'email' && !acc.email) return false;
        if (method === 'phone' && !acc.phone) return false;

        // Filter by role if provided
        if (filterRole) {
            if (filterRole === 'admin' && acc.role !== 'platform_admin') return false;
            if (filterRole === 'business' && acc.role !== 'business_owner') return false;
            if (filterRole === 'staff' && acc.role !== 'staff') return false;
            if (filterRole === 'customer' && acc.role !== 'customer') return false;
        }

        return true;
    });

    const renderSavedAccountsDropdown = () => {
        if (!showSavedAccounts || filteredSavedAccounts.length === 0) return null;

        return (
            <View className="absolute top-full left-0 right-0 z-50 mt-1 bg-[#252525] rounded-lg border border-white/10 shadow-xl overflow-hidden">
                {filteredSavedAccounts.map((acc, index) => (
                    <View
                        key={acc.id}
                        className={`flex-row items-center justify-between p-3 active:bg-white/5 ${index !== filteredSavedAccounts.length - 1 ? 'border-b border-white/5' : ''}`}
                    >
                        <Pressable
                            className="flex-1 flex-row items-center gap-3"
                            onPress={() => handleSelectAccount(acc)}
                        >
                            <View className="w-8 h-8 rounded-full bg-zinc-800 items-center justify-center">
                                <Text className="text-primary font-bold text-xs">
                                    {acc.role === 'platform_admin' ? 'A' :
                                        (acc.role === 'business_owner' ? 'B' :
                                            (acc.role === 'staff' ? 'C' : 'D'))}
                                </Text>
                            </View>
                            <View>
                                <Text className="text-white font-medium text-sm">{acc.fullName}</Text>
                                <Text className="text-zinc-500 text-[10px]">
                                    {acc.role === 'business_owner' ? 'İşletme' :
                                        (acc.role === 'staff' ? 'Personel' :
                                            (acc.role === 'platform_admin' ? 'Platform Yöneticisi' : 'Müşteri'))}
                                </Text>
                            </View>
                        </Pressable>
                        {onRemoveAccount && (
                            <Pressable
                                onPress={() => onRemoveAccount(acc.id)}
                                className="p-2"
                            >
                                <MaterialIcons name="close" size={16} color="#666" />
                            </Pressable>
                        )}
                    </View>
                ))}
            </View>
        );
    };

    return (
        <View className="w-full gap-4">
            {/* Method Toggle */}
            <View className="flex-row gap-4 mb-2">
                <Pressable
                    onPress={() => setMethod('email')}
                    className={`flex-1 pb-2 border-b-2 items-center ${method === 'email' ? 'border-[#d4af35]' : 'border-transparent'}`}
                >
                    <Text className={`${method === 'email' ? 'text-[#d4af35] font-bold' : 'text-zinc-500'}`}>E-Posta</Text>
                </Pressable>
                <Pressable
                    onPress={() => setMethod('phone')}
                    className={`flex-1 pb-2 border-b-2 items-center ${method === 'phone' ? 'border-[#d4af35]' : 'border-transparent'}`}
                >
                    <Text className={`${method === 'phone' ? 'text-[#d4af35] font-bold' : 'text-zinc-500'}`}>Telefon</Text>
                </Pressable>
            </View>

            {/* Inputs with Integrated Dropdown */}
            <View className="z-50">
                {method === 'phone' ? (
                    <View className="relative z-50">
                        <Text className="text-zinc-400 text-sm mb-1 font-medium">Telefon Numarası</Text>
                        <Controller
                            control={control}
                            name="phone"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className="relative">
                                    <TextInput
                                        className={`bg-[#1E1E1E] text-white p-4 pr-12 rounded-xl border ${errors.phone ? 'border-red-500' : 'border-white/10'} focus:border-[#d4af35]`}
                                        placeholder="5XX XXX XX XX"
                                        placeholderTextColor="#666"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value || ''}
                                        keyboardType="phone-pad"
                                        autoCapitalize="none"
                                    />
                                    {savedAccounts.length > 0 && (
                                        <Pressable
                                            onPress={() => setShowSavedAccounts(!showSavedAccounts)}
                                            className="absolute right-0 top-0 bottom-0 w-12 items-center justify-center"
                                        >
                                            <MaterialIcons name={showSavedAccounts ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={24} color="#666" />
                                        </Pressable>
                                    )}
                                </View>
                            )}
                        />
                        {renderSavedAccountsDropdown()}
                        {errors.phone && <Text className="text-red-500 text-xs mt-1">{errors.phone.message}</Text>}
                    </View>
                ) : (
                    <View className="relative z-50">
                        <Text className="text-zinc-400 text-sm mb-1 font-medium">E-Posta</Text>
                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className="relative">
                                    <TextInput
                                        className={`bg-[#1E1E1E] text-white p-4 pr-12 rounded-xl border ${errors.email ? 'border-red-500' : 'border-white/10'} focus:border-[#d4af35]`}
                                        placeholder="ornek@email.com"
                                        placeholderTextColor="#666"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value || ''}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                    {savedAccounts.length > 0 && (
                                        <Pressable
                                            onPress={() => setShowSavedAccounts(!showSavedAccounts)}
                                            className="absolute right-0 top-0 bottom-0 w-12 items-center justify-center"
                                        >
                                            <MaterialIcons name={showSavedAccounts ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={24} color="#666" />
                                        </Pressable>
                                    )}
                                </View>
                            )}
                        />
                        {renderSavedAccountsDropdown()}
                        {errors.email && <Text className="text-red-500 text-xs mt-1">{errors.email.message}</Text>}
                    </View>
                )}
            </View>

            {/* Password Input */}
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
                                autoCapitalize="none"
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

            {/* Remember Me Checkbox */}
            <Pressable
                onPress={() => {
                    const newValue = !rememberMe;
                    setRememberMe(newValue);
                    setValue('rememberMe', newValue);
                }}
                className="flex-row items-center gap-2 mb-2"
            >
                {rememberMe ? (
                    <CheckCircle size={20} color="#d4af35" fill="currentColor" />
                ) : (
                    <View className="w-5 h-5 rounded-full border border-zinc-500" />
                )}
                <Text className="text-zinc-400 text-sm">Beni Hatırla</Text>
            </Pressable>

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
                    <Text className="text-black font-bold text-base uppercase tracking-wide">Giriş Yap</Text>
                )}
            </Pressable>
        </View>
    );
};
