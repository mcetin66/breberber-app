import { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, ActivityIndicator, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Camera, Clock } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { useBusinessStore } from '@/stores/businessStore';
import { useAuthStore } from '@/stores/authStore';

export default function StaffDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { user } = useAuthStore();
    const { addStaff, updateStaff, getStaff, loading } = useBusinessStore();

    const isEditing = !!params.id;
    const existingStaff = isEditing ? getStaff(user?.barberId!).find(s => s.id === params.id) : null;

    const [name, setName] = useState(existingStaff?.name || '');
    const [expertise, setExpertise] = useState(existingStaff?.expertise?.join(', ') || '');
    const [isActive, setIsActive] = useState(existingStaff?.isActive ?? true);
    const [workStart, setWorkStart] = useState(existingStaff?.workingHours?.start || '09:00');
    const [workEnd, setWorkEnd] = useState(existingStaff?.workingHours?.end || '19:00');

    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Hata', 'Lütfen personel adını giriniz.');
            return;
        }
        if (!user?.barberId) return;

        setSaving(true);
        try {
            const staffData = {
                name,
                expertise: expertise.split(',').map(s => s.trim()).filter(Boolean),
                isActive,
                workingHours: {
                    start: workStart,
                    end: workEnd
                },
                workingDays: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'], // Default for now
                rating: existingStaff?.rating || 5.0,
                reviewCount: existingStaff?.reviewCount || 0,
                // Avatar upload implementation later
            };

            if (isEditing && params.id) {
                await updateStaff(user.barberId, params.id as string, staffData);
                Alert.alert('Başarılı', 'Personel güncellendi.');
            } else {
                await addStaff(user.barberId, staffData);
                Alert.alert('Başarılı', 'Yeni personel eklendi.');
            }
            router.back();
        } catch (error) {
            Alert.alert('Hata', (error as Error).message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <View className="flex-row items-center justify-between px-4 py-4 border-b border-white/5">
                <Pressable onPress={() => router.back()} className="p-2">
                    <ChevronLeft size={24} color={COLORS.text.DEFAULT} />
                </Pressable>
                <Text className="text-white text-lg font-poppins-bold">
                    {isEditing ? 'Personeli Düzenle' : 'Yeni Personel'}
                </Text>
                <View className="w-10" />
            </View>

            <ScrollView className="flex-1 px-4 py-6">
                <View className="items-center mb-8">
                    <Pressable className="w-24 h-24 rounded-full bg-background-card items-center justify-center border border-white/10 mb-2">
                        <Camera size={32} color={COLORS.text.muted} />
                    </Pressable>
                    <Text className="text-text-secondary font-poppins text-sm">Fotoğraf Ekle</Text>
                </View>

                <View className="space-y-4">
                    <View>
                        <Text className="text-text-secondary font-poppins mb-2">Ad Soyad</Text>
                        <TextInput
                            className="bg-background-card text-white p-4 rounded-xl font-poppins"
                            placeholder="Örn: Ahmet Yılmaz"
                            placeholderTextColor={COLORS.text.muted}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View>
                        <Text className="text-text-secondary font-poppins mb-2">Uzmanlık Alanları (Virgülle ayırın)</Text>
                        <TextInput
                            className="bg-background-card text-white p-4 rounded-xl font-poppins"
                            placeholder="Örn: Saç Kesimi, Sakal Tıraşı, Boya"
                            placeholderTextColor={COLORS.text.muted}
                            value={expertise}
                            onChangeText={setExpertise}
                        />
                    </View>

                    <View className="flex-row justify-between mb-4">
                        <View className="w-[48%]">
                            <Text className="text-text-secondary font-poppins mb-2">Başlangıç Saati</Text>
                            <View className="bg-background-card flex-row items-center p-4 rounded-xl">
                                <Clock size={18} color={COLORS.text.muted} className="mr-2" />
                                <TextInput
                                    className="flex-1 text-white font-poppins p-0"
                                    placeholder="09:00"
                                    placeholderTextColor={COLORS.text.muted}
                                    value={workStart}
                                    onChangeText={setWorkStart}
                                    keyboardType="numbers-and-punctuation"
                                />
                            </View>
                        </View>
                        <View className="w-[48%]">
                            <Text className="text-text-secondary font-poppins mb-2">Bitiş Saati</Text>
                            <View className="bg-background-card flex-row items-center p-4 rounded-xl">
                                <Clock size={18} color={COLORS.text.muted} className="mr-2" />
                                <TextInput
                                    className="flex-1 text-white font-poppins p-0"
                                    placeholder="19:00"
                                    placeholderTextColor={COLORS.text.muted}
                                    value={workEnd}
                                    onChangeText={setWorkEnd}
                                    keyboardType="numbers-and-punctuation"
                                />
                            </View>
                        </View>
                    </View>

                    <View className="flex-row items-center justify-between bg-background-card p-4 rounded-xl">
                        <Text className="text-white font-poppins">Personel Aktif</Text>
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
