import { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, ActivityIndicator, Alert, Switch, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Clock, DollarSign, AlignLeft } from 'lucide-react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { useBusinessStore } from '@/stores/businessStore';
import { useAuthStore } from '@/stores/authStore';

export default function ServiceDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { user } = useAuthStore();
    const { addService, updateService, getServices } = useBusinessStore();

    const isEditing = !!params.id;
    const existingService = isEditing ? getServices(user?.barberId!).find(s => s.id === params.id) : null;

    const [name, setName] = useState(existingService?.name || '');
    const [description, setDescription] = useState(existingService?.description || '');
    const [price, setPrice] = useState(existingService?.price?.toString() || '');
    const [duration, setDuration] = useState(existingService?.duration?.toString() || '30');
    const [category, setCategory] = useState(existingService?.category || 'Saç Kesimi');
    const [isActive, setIsActive] = useState(existingService?.isActive ?? true);

    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Hata', 'Lütfen hizmet adını giriniz.');
            return;
        }
        if (!price.trim()) {
            Alert.alert('Hata', 'Lütfen fiyat giriniz.');
            return;
        }
        if (!user?.barberId) return;

        setSaving(true);
        try {
            const serviceData = {
                name,
                description,
                price: parseFloat(price),
                duration: parseInt(duration),
                category,
                isActive,
                staffIds: existingService?.staffIds || [],
            };

            if (isEditing && params.id) {
                await updateService(user.barberId, params.id as string, serviceData);
                Alert.alert('Başarılı', 'Hizmet güncellendi.');
            } else {
                await addService(user.barberId, serviceData);
                Alert.alert('Başarılı', 'Yeni hizmet eklendi.');
            }
            router.back();
        } catch (error) {
            Alert.alert('Hata', (error as Error).message);
        } finally {
            setSaving(false);
        }
    };

    const categories = ['Saç Kesimi', 'Sakal Tıraşı', 'Saç Bakımı', 'Cilt Bakımı', 'Diğer'];

    return (
        <SafeAreaView className="flex-1 bg-[#0F172A]" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Custom Header */}
            <View className="flex-row items-center justify-between px-4 py-4 border-b border-white/5 bg-[#0F172A] z-10">
                <Pressable onPress={() => router.back()} className="p-2 -ml-2 rounded-full active:bg-white/5">
                    <ChevronLeft size={24} color="white" />
                </Pressable>
                <Text className="text-white text-lg font-bold">
                    {isEditing ? 'Hizmeti Düzenle' : 'Yeni Hizmet'}
                </Text>
                <View className="w-10" />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                    <View className="flex-col gap-6">

                        {/* Name Input */}
                        <View className="gap-2">
                            <Text className="text-[#94A3B8] text-sm font-medium ml-1">Hizmet Adı</Text>
                            <TextInput
                                className="bg-[#1E293B] text-white p-4 rounded-xl font-medium border border-white/5 focus:border-primary/50 h-[56px]"
                                placeholder="Örn: Saç Kesimi"
                                placeholderTextColor="#64748B"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        {/* Category Selection */}
                        <View className="gap-2">
                            <Text className="text-[#94A3B8] text-sm font-medium ml-1">Kategori</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                                {categories.map(cat => (
                                    <Pressable
                                        key={cat}
                                        onPress={() => setCategory(cat)}
                                        className={`mr-2 px-4 py-3 rounded-xl border ${category === cat ? 'bg-primary border-primary' : 'bg-[#1E293B] border-white/5'}`}
                                    >
                                        <Text className={`font-bold ${category === cat ? 'text-white' : 'text-[#64748B]'}`}>
                                            {cat}
                                        </Text>
                                    </Pressable>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Price and Duration */}
                        <View className="flex-row gap-4">
                            <View className="flex-1 gap-2">
                                <Text className="text-[#94A3B8] text-sm font-medium ml-1">Fiyat (₺)</Text>
                                <View className="bg-[#1E293B] flex-row items-center px-4 h-[56px] rounded-xl border border-white/5 focus:border-primary/50">
                                    <DollarSign size={18} color="#94A3B8" style={{ marginRight: 8 }} />
                                    <TextInput
                                        className="flex-1 text-white font-medium text-base p-0"
                                        placeholder="0.00"
                                        placeholderTextColor="#64748B"
                                        value={price}
                                        onChangeText={setPrice}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>

                            <View className="flex-1 gap-2">
                                <Text className="text-[#94A3B8] text-sm font-medium ml-1">Süre (dk)</Text>
                                <View className="bg-[#1E293B] flex-row items-center px-4 h-[56px] rounded-xl border border-white/5 focus:border-primary/50">
                                    <Clock size={18} color="#94A3B8" style={{ marginRight: 8 }} />
                                    <TextInput
                                        className="flex-1 text-white font-medium text-base p-0"
                                        placeholder="30"
                                        placeholderTextColor="#64748B"
                                        value={duration}
                                        onChangeText={setDuration}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Description */}
                        <View className="gap-2">
                            <Text className="text-[#94A3B8] text-sm font-medium ml-1">Açıklama (İsteğe bağlı)</Text>
                            <View className="bg-[#1E293B] rounded-xl border border-white/5 focus:border-primary/50 p-4 min-h-[120px]">
                                <TextInput
                                    className="text-white font-medium text-base flex-1"
                                    placeholder="Hizmet detayları..."
                                    placeholderTextColor="#64748B"
                                    value={description}
                                    onChangeText={setDescription}
                                    multiline
                                    textAlignVertical="top"
                                />
                            </View>
                        </View>

                        {/* Active Switch */}
                        <View className="flex-row items-center justify-between bg-[#1E293B] p-4 rounded-xl border border-white/5 min-h-[72px]">
                            <View>
                                <Text className="text-white font-bold text-base">Hizmet Aktif</Text>
                                <Text className="text-[#94A3B8] text-xs mt-0.5">Müşteriler tarafından görüntülenebilir</Text>
                            </View>
                            <Switch
                                value={isActive}
                                onValueChange={setIsActive}
                                trackColor={{ false: '#334155', true: COLORS.primary.DEFAULT }}
                                thumbColor="white"
                            />
                        </View>

                        {/* Save Button */}
                        <Pressable
                            onPress={handleSave}
                            disabled={saving}
                            className="mt-6 bg-primary w-full py-4 rounded-xl items-center shadow-lg shadow-primary/25 active:scale-[0.99] transition-transform mb-10"
                        >
                            {saving ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white font-bold text-lg">
                                    {isEditing ? 'Güncelle' : 'Kaydet'}
                                </Text>
                            )}
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
