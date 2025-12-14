import { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, ActivityIndicator, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Clock, DollarSign } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
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
                staffIds: existingService?.staffIds || [], // Manage staff link later or separately
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
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <View className="flex-row items-center justify-between px-4 py-4 border-b border-white/5">
                <Pressable onPress={() => router.back()} className="p-2">
                    <ChevronLeft size={24} color={COLORS.text.DEFAULT} />
                </Pressable>
                <Text className="text-white text-lg font-poppins-bold">
                    {isEditing ? 'Hizmeti Düzenle' : 'Yeni Hizmet'}
                </Text>
                <View className="w-10" />
            </View>

            <ScrollView className="flex-1 px-4 py-6">
                <View className="space-y-4">
                    <View>
                        <Text className="text-text-secondary font-poppins mb-2">Hizmet Adı</Text>
                        <TextInput
                            className="bg-background-card text-white p-4 rounded-xl font-poppins"
                            placeholder="Örn: Saç Kesimi"
                            placeholderTextColor={COLORS.text.muted}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View>
                        <Text className="text-text-secondary font-poppins mb-2">Kategori</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mb-2">
                            {categories.map(cat => (
                                <Pressable
                                    key={cat}
                                    onPress={() => setCategory(cat)}
                                    className={`mr-2 px-4 py-2 rounded-xl border ${category === cat ? 'bg-primary border-primary' : 'bg-background-card border-white/10'}`}
                                >
                                    <Text className={`font-poppins-semibold ${category === cat ? 'text-background' : 'text-text-secondary'}`}>
                                        {cat}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>

                    <View className="flex-row justify-between mb-4">
                        <View className="w-[48%]">
                            <Text className="text-text-secondary font-poppins mb-2">Fiyat (₺)</Text>
                            <View className="bg-background-card flex-row items-center p-4 rounded-xl">
                                <DollarSign size={18} color={COLORS.text.muted} className="mr-2" />
                                <TextInput
                                    className="flex-1 text-white font-poppins p-0"
                                    placeholder="0.00"
                                    placeholderTextColor={COLORS.text.muted}
                                    value={price}
                                    onChangeText={setPrice}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        <View className="w-[48%]">
                            <Text className="text-text-secondary font-poppins mb-2">Süre (dk)</Text>
                            <View className="bg-background-card flex-row items-center p-4 rounded-xl">
                                <Clock size={18} color={COLORS.text.muted} className="mr-2" />
                                <TextInput
                                    className="flex-1 text-white font-poppins p-0"
                                    placeholder="30"
                                    placeholderTextColor={COLORS.text.muted}
                                    value={duration}
                                    onChangeText={setDuration}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                    </View>

                    <View>
                        <Text className="text-text-secondary font-poppins mb-2">Açıklama (İsteğe bağlı)</Text>
                        <TextInput
                            className="bg-background-card text-white p-4 rounded-xl font-poppins min-h-[100px]"
                            placeholder="Hizmet detayları..."
                            placeholderTextColor={COLORS.text.muted}
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            textAlignVertical="top"
                        />
                    </View>

                    <View className="flex-row items-center justify-between bg-background-card p-4 rounded-xl">
                        <Text className="text-white font-poppins">Hizmet Aktif</Text>
                        <Switch
                            value={isActive}
                            onValueChange={setIsActive}
                            trackColor={{ false: COLORS.background.DEFAULT, true: COLORS.primary.DEFAULT }}
                            thumbColor={COLORS.white}
                        />
                    </View>
                </View>

                <Pressable
                    onPress={handleSave}
                    disabled={saving}
                    className="mt-8 bg-primary w-full py-4 rounded-xl items-center active:opacity-90"
                    style={{ opacity: saving ? 0.7 : 1, backgroundColor: COLORS.primary.DEFAULT }}
                >
                    {saving ? (
                        <ActivityIndicator color={COLORS.background.DEFAULT} />
                    ) : (
                        <Text className="text-background font-poppins-bold text-lg">
                            {isEditing ? 'Güncelle' : 'Kaydet'}
                        </Text>
                    )}
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}
