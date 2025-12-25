import { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, ActivityIndicator, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Camera, Edit2, Store, Type, Check, Briefcase } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { useAuthStore } from '@/stores/authStore';
import { useBusinessStore } from '@/stores/businessStore';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

export default function BusinessProfileScreen() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { businesses, fetchBusinesses, updateBusiness } = useBusinessStore();

    // Safety check
    const businessId = user?.barberId;
    const myBusiness = businesses.find(b => b.id === businessId);

    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        businessName: '',
        slogan: '',
        category: 'Erkek Berberi' as 'Erkek Berberi' | 'Kadın Kuaförü' | 'Güzellik Merkezi' | 'Manikür & Pedikür',
        logo: null as string | null,
    });

    useEffect(() => {
        if (businesses.length === 0) {
            fetchBusinesses();
        }
    }, []);

    useEffect(() => {
        if (myBusiness) {
            setForm({
                businessName: myBusiness.name || '',
                slogan: myBusiness.description || '',
                // @ts-ignore
                category: myBusiness.subscriptionTier === 'basic' ? 'Erkek Berberi' : 'Erkek Berberi', // Placeholder mapping
                logo: myBusiness.cover_url || null,
            });
        }
    }, [myBusiness]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setForm(prev => ({ ...prev, logo: result.assets[0].uri }));
        }
    };

    const handleSave = async () => {
        if (!businessId) return;
        if (!form.businessName.trim()) {
            Alert.alert('Hata', 'İşletme adı zorunludur.');
            return;
        }

        setLoading(true);
        try {
            await updateBusiness(businessId, {
                name: form.businessName,
                description: form.slogan,
                // businessType mapping if needed, omitting for now as DB might not support it directly or it's 'category'
                cover_url: form.logo || undefined
            });
            Alert.alert('Başarılı', 'Profil güncellendi.');
            router.back();
        } catch (error) {
            Alert.alert('Hata', 'Güncelleme başarısız oldu.');
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        { id: 'Erkek Berberi', icon: 'content-cut', label: 'Erkek Berberi' }, // Using text or different icon lib if needed, sticking to lucide
        { id: 'Kadın Kuaförü', icon: 'face-3', label: 'Kadın Kuaförü' },
        { id: 'Güzellik Merkezi', icon: 'spa', label: 'Güzellik Merkezi' },
        { id: 'Manikür & Pedikür', icon: 'pan-tool-alt', label: 'Manikür & Pedikür' },
    ];

    return (
        <View className="flex-1 bg-[#121212]">
            <SafeAreaView edges={['top']} className="bg-[#121212] z-10 px-4 py-3 border-b border-white/5">
                <View className="flex-row items-center justify-between">
                    <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full active:bg-white/5">
                        <ChevronLeft size={24} color="white" />
                    </Pressable>
                    <Text className="text-white text-lg font-bold">İşletme Bilgileri</Text>
                    <View className="w-10" />
                </View>
            </SafeAreaView>

            {/* Steps Indicator (Mock) */}
            <View className="flex-row justify-center gap-2 py-4">
                <View className="h-1.5 w-6 rounded-full bg-primary shadow-[0_0_10px_rgba(212,175,53,0.3)]" />
                <View className="h-1.5 w-1.5 rounded-full bg-[#333]" />
                <View className="h-1.5 w-1.5 rounded-full bg-[#333]" />
            </View>

            <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
                <View className="items-center mb-8">
                    <Text className="text-2xl font-bold text-white mb-2 text-center">
                        <Text className="text-primary">Markanızı</Text> Oluşturun
                    </Text>
                    <Text className="text-gray-500 text-sm text-center">
                        Müşterilerinizin sizi tanıması için temel bilgileri girin.
                    </Text>
                </View>

                {/* Logo Upload */}
                <View className="items-center mb-8">
                    <Pressable onPress={pickImage} className="relative group mb-3">
                        <View className="w-32 h-32 rounded-full border-2 border-dashed border-primary/50 bg-[#1E1E1E] items-center justify-center overflow-hidden">
                            {form.logo ? (
                                <Image source={{ uri: form.logo }} className="w-full h-full" resizeMode="cover" />
                            ) : (
                                <View className="items-center justify-center gap-1 opacity-50">
                                    <Camera size={24} color={COLORS.primary.DEFAULT} />
                                </View>
                            )}
                        </View>
                        <View className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-primary items-center justify-center shadow-lg">
                            <Edit2 size={14} color="#121212" />
                        </View>
                    </Pressable>
                    <Text className="text-white font-medium text-sm">Logo Yükle</Text>
                    <Text className="text-gray-500 text-xs mt-1">PNG veya JPG, max 5MB</Text>
                </View>

                {/* Form */}
                <View className="gap-6 mb-20">
                    {/* Name */}
                    <View className="gap-2">
                        <Text className="text-gray-400 text-sm font-medium">İşletme Adı</Text>
                        <View className="relative">
                            <TextInput
                                className="w-full bg-[#1E1E1E] text-white rounded-xl border border-white/10 px-4 py-3.5 pr-10 text-base focus:border-primary/50"
                                placeholder="Örn: Gold Makas VIP"
                                placeholderTextColor="#666"
                                value={form.businessName}
                                onChangeText={(t) => setForm(prev => ({ ...prev, businessName: t }))}
                            />
                            <View className="absolute right-4 top-1/2 -translate-y-1/2">
                                <Store size={20} color="#666" />
                            </View>
                        </View>
                    </View>

                    {/* Slogan */}
                    <View className="gap-2">
                        <View className="flex-row justify-between">
                            <Text className="text-gray-400 text-sm font-medium">Slogan / Alt Başlık</Text>
                            <Text className="text-gray-600 text-xs">İsteğe bağlı</Text>
                        </View>
                        <View className="relative">
                            <TextInput
                                className="w-full bg-[#1E1E1E] text-white rounded-xl border border-white/10 px-4 py-3.5 pr-10 text-base focus:border-primary/50"
                                placeholder="Örn: Tarzınızı Yansıtın"
                                placeholderTextColor="#666"
                                value={form.slogan}
                                onChangeText={(t) => setForm(prev => ({ ...prev, slogan: t }))}
                            />
                            <View className="absolute right-4 top-1/2 -translate-y-1/2">
                                <Type size={20} color="#666" />
                            </View>
                        </View>
                    </View>

                    {/* Category */}
                    <View className="gap-3">
                        <Text className="text-gray-400 text-sm font-medium">Kategori Seçimi</Text>
                        <View className="flex-row flex-wrap gap-3">
                            {categories.map((cat) => (
                                <Pressable
                                    key={cat.id}
                                    onPress={() => setForm(prev => ({ ...prev, category: cat.id as any }))}
                                    className={`w-[48%] p-4 rounded-xl border items-center justify-center gap-2 ${form.category === cat.id ? 'bg-primary/10 border-primary' : 'bg-[#1E1E1E] border-transparent'}`}
                                >
                                    {/* Using Briefcase as generic icon since we don't have all specific ones in lucide import readily available matching exactly material symbols */}
                                    <Briefcase size={24} color={form.category === cat.id ? COLORS.primary.DEFAULT : '#666'} />
                                    <Text className={`text-sm font-medium text-center ${form.category === cat.id ? 'text-primary' : 'text-gray-400'}`}>
                                        {cat.label}
                                    </Text>
                                    {form.category === cat.id && (
                                        <View className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary items-center justify-center">
                                            <Check size={12} color="#121212" />
                                        </View>
                                    )}
                                </Pressable>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Action */}
            <View className="absolute bottom-0 left-0 right-0 p-5 bg-[#121212]/90 border-t border-white/5 blur-md">
                <Pressable
                    onPress={handleSave}
                    disabled={loading}
                    className="w-full rounded-xl overflow-hidden"
                >
                    <LinearGradient
                        colors={[COLORS.primary.DEFAULT, '#b08d2b']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className="py-3.5 items-center justify-center flex-row gap-2"
                    >
                        {loading ? (
                            <ActivityIndicator color="#121212" />
                        ) : (
                            <>
                                <Text className="text-[#121212] font-bold text-base">Kaydet ve Devam Et</Text>
                            </>
                        )}
                    </LinearGradient>
                </Pressable>
            </View>
        </View>
    );
}
