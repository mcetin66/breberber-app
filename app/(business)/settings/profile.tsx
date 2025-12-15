import { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Store, Phone, MapPin, Mail, Save, Clock, ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useAuthStore } from '@/stores/authStore';
import { useBusinessStore } from '@/stores/businessStore';
import MaskInput from 'react-native-mask-input';

const InputGroup = ({ label, icon: Icon, children }: { label: string, icon: any, children: React.ReactNode }) => (
    <View className="mb-4">
        <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">{label}</Text>
        <View className="bg-[#1E293B] border border-white/5 rounded-2xl flex-row items-center px-4 h-14">
            <Icon size={18} color="#64748B" />
            <View className="ml-3 flex-1 h-full justify-center">
                {children}
            </View>
        </View>
    </View>
);

export default function BusinessProfileScreen() {
    const router = useRouter();
    const user = useAuthStore(state => state.user);
    const { currentBusiness, getBusinessById, updateBusiness, loading } = useBusinessStore();

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        description: '',
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user?.barberId) {
            getBusinessById(user.barberId).then(business => {
                if (business) {
                    setFormData({
                        name: business.name || '',
                        phone: business.phone || '',
                        address: business.address || '',
                        description: business.description || '',
                    });
                }
            });
        }
    }, [user]);

    const handleSave = async () => {
        if (!user?.barberId) return;

        setIsSaving(true);
        try {
            await updateBusiness(user.barberId, {
                ...formData,
                phone: formData.phone.replace(/[^0-9]/g, ''), // Strip mask chars if needed, but keeping mask format is usually better for display. Use unmask if DB requires clean phone. User probably wants raw for now or clean. existing uses mask. I'll save as is or clean.
                // Actually, DB phone is usually string.
            });
            Alert.alert('Başarılı', 'İşletme bilgileri güncellendi.');
        } catch (error: any) {
            console.error(error);
            Alert.alert('Hata', 'Güncelleme başarısız: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#0F172A]" edges={['top']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <AdminHeader
                    title="İşletme Profili"
                    subtitle="Bilgilerini Düzenle"
                    showBack
                />

                <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>

                    {/* Banner Preview (Static for now) */}
                    <View className="h-40 bg-slate-800 rounded-2xl mb-6 items-center justify-center border border-white/5 border-dashed">
                        <Store size={40} color="#475569" />
                        <Text className="text-slate-500 text-xs mt-2">Kapak Fotoğrafı (Galeri'den Yönet)</Text>
                    </View>

                    {/* Form */}
                    <InputGroup label="İşletme Adı" icon={Store}>
                        <TextInput
                            className="text-white font-medium text-base h-full"
                            placeholder="İşletme Adınız"
                            placeholderTextColor="#475569"
                            value={formData.name}
                            onChangeText={t => setFormData({ ...formData, name: t })}
                        />
                    </InputGroup>

                    <InputGroup label="Telefon" icon={Phone}>
                        <MaskInput
                            className="text-white font-medium text-base h-full"
                            placeholder="(555) 123 45 67"
                            placeholderTextColor="#475569"
                            value={formData.phone}
                            onChangeText={(masked) => setFormData({ ...formData, phone: masked })}
                            mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/]}
                            keyboardType="phone-pad"
                        />
                    </InputGroup>

                    <InputGroup label="Adres" icon={MapPin}>
                        <TextInput
                            className="text-white font-medium text-base h-full"
                            placeholder="Açık Adres"
                            placeholderTextColor="#475569"
                            value={formData.address}
                            onChangeText={t => setFormData({ ...formData, address: t })}
                        />
                    </InputGroup>

                    <InputGroup label="Hakkında" icon={Store}>
                        <TextInput
                            className="text-white font-medium text-sm h-full py-3"
                            placeholder="İşletmeniz hakkında kısa bilgi..."
                            placeholderTextColor="#475569"
                            multiline
                            numberOfLines={3}
                            style={{ textAlignVertical: 'top' }}
                            value={formData.description}
                            onChangeText={t => setFormData({ ...formData, description: t })}
                        />
                    </InputGroup>

                    {/* Save Button */}
                    <Pressable
                        onPress={handleSave}
                        disabled={isSaving}
                        className={`mt-4 bg-primary rounded-2xl h-14 flex-row items-center justify-center gap-3 active:opacity-90 ${isSaving ? 'opacity-70' : ''}`}
                    >
                        {isSaving ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Save size={20} color="white" />
                                <Text className="text-white font-bold text-base">Kaydet</Text>
                            </>
                        )}
                    </Pressable>

                    <View className="h-24" />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
