import { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, Pressable, ScrollView, ActivityIndicator, Platform, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView } from 'react-native';
import { X, Store, MapPin, ChevronDown, Award, Minus, Plus, Calendar, ArrowRight, Check } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { useAdminStore } from '@/stores/adminStore';
import Toast from 'react-native-toast-message';
import { SUBSCRIPTION_PLANS } from '@/constants/plans';
import { FormModal } from '@/components/common/FormModal';

interface AddBusinessModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function AddBusinessModal({ visible, onClose }: AddBusinessModalProps) {
    const { addBusiness, loading } = useAdminStore();

    // Helper to format date as DD/MM/YYYY
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const formatPhoneNumber = (text: string) => {
        let cleaned = ('' + text).replace(/\D/g, '');
        // Strip leading zero if present
        if (cleaned.startsWith('0')) cleaned = cleaned.substring(1);
        // Limit to 10 digits
        if (cleaned.length > 10) cleaned = cleaned.substring(0, 10);

        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
        if (match) {
            let formatted = match[1];
            if (match[2]) formatted = `(${match[1]}) ${match[2]}`;
            if (match[3]) formatted += ` ${match[3]}`;
            if (match[4]) formatted += ` ${match[4]}`;
            return formatted;
        }
        return cleaned;
    };

    // State
    const [formData, setFormData] = useState({
        name: '',
        contactName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        instagram: '',
        businessType: 'berber',
        subscriptionTier: 'gold', // Default to Gold
        staffLimit: 10, // Default to Gold limit
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Default 1 year
    });

    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const [showPlanDropdown, setShowPlanDropdown] = useState(false);
    const [activeDuration, setActiveDuration] = useState<number | null>(12); // Default 12 months

    const CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Gaziantep', 'Konya', 'Mersin', 'Kayseri'];


    const DURATIONS = [
        { label: '1 Ay', months: 1 },
        { label: '3 Ay', months: 3 },
        { label: '6 Ay', months: 6 },
        { label: '1 Yıl', months: 12 },
    ];

    const handleDurationSelect = (months: number) => {
        const newEndDate = new Date(formData.startDate);
        newEndDate.setMonth(newEndDate.getMonth() + months);
        setFormData(prev => ({ ...prev, endDate: newEndDate }));
        setActiveDuration(months);
    };

    const handleSubmit = async () => {
        if (!formData.name) {
            Toast.show({
                type: 'error',
                text1: 'Eksik Bilgi',
                text2: 'Lütfen işletme adını girin.',
            });
            return;
        }
        if (!formData.city) {
            Toast.show({
                type: 'error',
                text1: 'Eksik Bilgi',
                text2: 'Lütfen bir şehir seçin.',
            });
            return;
        }



        const result = await addBusiness({
            name: formData.name,
            contactName: formData.contactName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            subscriptionTier: formData.subscriptionTier as any,
            subscriptionEndDate: formData.endDate.toISOString(),
            isOpen: true,
            instagram: formData.instagram,
            businessType: formData.businessType,
            coverImage: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=400&q=80',
        });

        if (result.success) {
            Toast.show({
                type: 'success',
                text1: 'Başarılı',
                text2: 'İşletme başarıyla eklendi.',
            });
            onClose();
        } else {
            Toast.show({
                type: 'error',
                text1: 'Hata',
                text2: result.error || 'Bir sorun oluştu.',
            });
        }
    };

    return (
        <FormModal
            visible={visible}
            onClose={onClose}
            title="Yeni İşletme Ekle"
            footer={
                <Pressable
                    onPress={handleSubmit}
                    disabled={loading}
                    className={`${loading ? 'opacity-50' : 'active:opacity-90'} bg-[#3B82F6] rounded-xl py-4 flex-row items-center justify-center gap-3`}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <Check size={20} color="white" strokeWidth={2.5} />
                            <Text className="text-white font-bold text-base">İşletmeyi Oluştur</Text>
                        </>
                    )}
                </Pressable>
            }
        >
            {/* Section 1: Business Info */}
            <Text className="text-[#3B82F6] text-xs font-bold mb-5 tracking-wider uppercase">İŞLETME BİLGİLERİ</Text>

            <View className="gap-4 mb-8">
                {/* Name */}
                <View>
                    <Text className="text-gray-400 text-xs mb-1.5 ml-1">İşletme Adı <Text className="text-red-500">*</Text></Text>
                    <View className="bg-[#1E293B] text-white rounded-2xl border border-white/5 flex-row items-center px-4 h-14">
                        <TextInput
                            className="flex-1 text-white text-base font-medium h-full"
                            placeholder="Örn: Gold Berber & Kuaför"
                            placeholderTextColor="#475569"
                            value={formData.name}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                        />
                        <Store size={18} color="#64748B" />
                    </View>
                </View>

                {/* Business Type */}
                <View>
                    <Text className="text-gray-400 text-xs mb-1.5 ml-1">İşletme Türü</Text>
                    <View className="flex-row gap-3">
                        {['berber', 'kuafor', 'guzellik_merkezi'].map((type) => (
                            <Pressable
                                key={type}
                                onPress={() => setFormData(prev => ({ ...prev, businessType: type }))}
                                className={`flex-1 py-3 px-2 rounded-xl border items-center ${formData.businessType === type ? 'bg-blue-600 border-blue-600' : 'bg-[#1E293B] border-white/5'}`}
                            >
                                <Text className={`text-xs font-bold ${formData.businessType === type ? 'text-white' : 'text-gray-400'}`}>
                                    {type === 'berber' ? 'Berber' : type === 'kuafor' ? 'Kuaför' : 'Güzellik'}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Contact Name */}
                <View>
                    <Text className="text-gray-400 text-xs mb-1.5 ml-1">Yetkili Kişi <Text className="text-red-500">*</Text></Text>
                    <View className="bg-[#1E293B] text-white rounded-2xl border border-white/5 flex-row items-center px-4 h-14">
                        <TextInput
                            className="flex-1 text-white text-base font-medium h-full"
                            placeholder="Ad Soyad"
                            placeholderTextColor="#475569"
                            value={formData.contactName}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, contactName: text }))}
                        />
                    </View>
                </View>

                {/* Phone */}
                <View>
                    <Text className="text-gray-400 text-xs mb-1.5 ml-1">Telefon <Text className="text-red-500">*</Text></Text>
                    <View className="bg-[#1E293B] text-white rounded-2xl border border-white/5 flex-row items-center px-4 h-14">
                        <TextInput
                            className="flex-1 text-white text-base font-medium h-full"
                            placeholder="0555 123 45 67"
                            placeholderTextColor="#475569"
                            keyboardType="phone-pad"
                            value={formData.phone}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, phone: formatPhoneNumber(text) }))}
                        />
                    </View>
                </View>



                {/* City */}
                <View>
                    <Text className="text-gray-400 text-xs mb-1.5 ml-1">Şehir <Text className="text-red-500">*</Text></Text>
                    <Pressable
                        onPress={() => {
                            setShowCityDropdown(!showCityDropdown);
                            setShowPlanDropdown(false);
                        }}
                        className="bg-[#1E293B] border border-white/5 rounded-2xl h-14 flex-row items-center px-4 justify-between active:bg-[#334155]"
                    >
                        <Text className={formData.city ? "text-white text-base font-medium" : "text-slate-500 text-base"}>
                            {formData.city || 'Şehir Seçiniz'}
                        </Text>
                        <ChevronDown size={18} color="#64748B" />
                    </Pressable>

                    {showCityDropdown && (
                        <View className="absolute top-[80px] left-0 right-0 bg-[#1E293B] border border-white/10 rounded-xl z-50 shadow-lg shadow-black/50 overflow-hidden max-h-48">
                            <ScrollView nestedScrollEnabled>
                                {CITIES.map((city) => (
                                    <Pressable
                                        key={city}
                                        onPress={() => {
                                            setFormData(prev => ({ ...prev, city }));
                                            setShowCityDropdown(false);
                                        }}
                                        className="p-3 border-b border-white/5 active:bg-[#334155]"
                                    >
                                        <Text className="text-white text-sm ml-2">{city}</Text>
                                    </Pressable>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>

                {/* Email */}
                <View>
                    <Text className="text-gray-400 text-xs mb-1.5 ml-1">E-posta <Text className="text-red-500">*</Text></Text>
                    <View className="bg-[#1E293B] text-white rounded-2xl border border-white/5 flex-row items-center px-4 h-14">
                        <TextInput
                            className="flex-1 text-white text-base font-medium h-full"
                            placeholder="ornek@isletme.com"
                            placeholderTextColor="#475569"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={formData.email}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                        />
                    </View>
                </View>
            </View>

            {/* Section 2: Account & Plan */}
            <Text className="text-[#3B82F6] text-xs font-bold mb-5 tracking-wider uppercase border-t border-white/5 pt-8">HESAP & PLAN</Text>

            <View className="gap-4">
                {/* Plan Selection */}
                <View className="z-20">
                    <Text className="text-gray-400 text-xs mb-1.5 ml-1">Başlangıç Planı</Text>
                    <Pressable
                        onPress={() => {
                            setShowPlanDropdown(!showPlanDropdown);
                            setShowCityDropdown(false);
                        }}
                        className="bg-[#1E293B] border border-white/5 rounded-2xl h-14 flex-row items-center px-4 justify-between active:bg-[#334155]"
                    >
                        <Text className="text-white text-base font-medium">
                            {SUBSCRIPTION_PLANS.find(p => p.id === formData.subscriptionTier)?.label}
                        </Text>
                        <Award size={18} color="#64748B" />
                    </Pressable>

                    {showPlanDropdown && (
                        <View className="absolute top-[80px] left-0 right-0 bg-[#1E293B] border border-white/10 rounded-xl z-50 shadow-lg shadow-black/50 overflow-hidden">
                            {SUBSCRIPTION_PLANS.map((plan) => (
                                <Pressable
                                    key={plan.id}
                                    onPress={() => {
                                        setFormData(prev => ({
                                            ...prev,
                                            subscriptionTier: plan.id,
                                            staffLimit: plan.staffLimit
                                        }));
                                        setShowPlanDropdown(false);
                                    }}
                                    className="p-4 border-b border-white/5 active:bg-[#334155]"
                                >
                                    <View>
                                        <Text className="text-white font-bold">{plan.label}</Text>
                                        <Text className="text-gray-400 text-xs">{plan.staffLimit === 999 ? 'Sınırsız' : plan.staffLimit} Personel</Text>
                                    </View>
                                </Pressable>
                            ))}
                        </View>
                    )}
                </View>

                {/* Duration */}
                <View>
                    <Text className="text-gray-400 text-xs mb-1.5 ml-1">Abonelik Süresi</Text>
                    <View className="flex-row gap-3">
                        {DURATIONS.map((dur) => (
                            <Pressable
                                key={dur.months}
                                onPress={() => handleDurationSelect(dur.months)}
                                className={`flex-1 py-3 rounded-xl border items-center justify-center ${activeDuration === dur.months
                                    ? 'bg-[#3B82F6] border-[#3B82F6]'
                                    : 'bg-[#1E293B] border-white/5'
                                    }`}
                            >
                                <Text className={`text-xs font-bold ${activeDuration === dur.months ? 'text-white' : 'text-slate-400'}`}>
                                    {dur.label}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Info Text */}
                <Text className="text-slate-500 text-[10px] bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 leading-5">
                    Başlangıç şifresi otomatik oluşturulacak ve "123456" olarak ayarlanacaktır.
                    Berber eklendikten sonra yönetici paneli giriş bilgileri e-posta ile gönderilecektir.
                </Text>
            </View>
        </FormModal>
    );
}
