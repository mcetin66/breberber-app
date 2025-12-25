import { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, ActivityIndicator, Alert, Switch, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Check, Trash2, Edit2, DollarSign, Clock, ChevronDown, Wand2, X } from 'lucide-react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { useBusinessStore } from '@/stores/businessStore';
import { useAuthStore } from '@/stores/authStore';

const DURATION_OPTIONS = [10, 20, 30, 40, 45, 50, 60, 75, 90, 120];

export default function ServiceEditorScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { user } = useAuthStore();
    const { addService, updateService, getServices, removeService } = useBusinessStore();

    const isEditing = !!params.id;
    const existingService = isEditing ? getServices(user?.barberId!).find(s => s.id === params.id) : null;

    const [form, setForm] = useState({
        name: '',
        price: '',
        duration: 30,
        category: 'Saç Kesimi',
        description: '',
        isActive: true,
    });

    const [saving, setSaving] = useState(false);
    const [durationModalVisible, setDurationModalVisible] = useState(false);

    useEffect(() => {
        if (existingService) {
            setForm({
                name: existingService.name,
                price: existingService.price.toString(),
                duration: existingService.duration_minutes || existingService.duration || 30,
                category: existingService.category || 'Saç Kesimi',
                description: existingService.description || '',
                isActive: existingService.is_active ?? true,
            });
        }
    }, [existingService]);

    const handleSave = async () => {
        if (!form.name.trim() || !form.price.trim()) {
            Alert.alert('Hata', 'Lütfen hizmet adı ve fiyatını giriniz.');
            return;
        }

        if (!user?.barberId) return;

        setSaving(true);
        try {
            const serviceData = {
                name: form.name,
                price: parseFloat(form.price),
                duration: form.duration,
                category: form.category,
                description: form.description,
                isActive: form.isActive,
            } as any; // Cast to bypass strict Omit type check, store handles mapping

            if (isEditing && params.id) {
                await updateService(user.barberId, params.id as string, serviceData);
            } else {
                await addService(user.barberId, serviceData);
            }
            router.back();
        } catch (error) {
            Alert.alert('Hata', 'İşlem başarısız oldu.');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = () => {
        if (!user?.barberId || !params.id) return;

        Alert.alert('Sil', 'Hizmeti silmek istediğinize emin misiniz?', [
            { text: 'İptal', style: 'cancel' },
            {
                text: 'Sil',
                style: 'destructive',
                onPress: async () => {
                    await removeService(user.barberId!, params.id as string);
                    router.back();
                }
            }
        ]);
    }

    return (
        <View className="flex-1 bg-[#0F172A]">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <SafeAreaView edges={['top']} className="bg-[#0F172A] border-b border-white/5 z-10 px-4 py-3 pb-4">
                <View className="flex-row items-center justify-between">
                    <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full active:bg-white/5">
                        <ChevronLeft size={24} color="white" />
                    </Pressable>
                    <Text className="text-white text-lg font-bold">{isEditing ? 'Hizmeti Düzenle' : 'Yeni Hizmet'}</Text>
                    <View className="w-10" />
                </View>
            </SafeAreaView>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                <ScrollView className="flex-1 px-5 pt-6" contentContainerStyle={{ paddingBottom: 50 }}>

                    {/* Icon Card */}
                    <View className="items-center mb-8">
                        <View className="w-20 h-20 rounded-2xl bg-[#1E293B] items-center justify-center border border-white/5 shadow-lg shadow-black/50 mb-3">
                            <Wand2 size={32} color={COLORS.primary.DEFAULT} />
                        </View>
                        <Text className="text-gray-400 text-sm">Hizmet Detayları</Text>
                    </View>

                    <View className="gap-6">
                        {/* Name */}
                        <View className="gap-2">
                            <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider ml-1">Hizmet Adı</Text>
                            <View className="relative">
                                <TextInput
                                    className="w-full bg-[#1E293B] text-white rounded-xl border border-white/10 px-4 py-4 pr-10 text-base focus:border-primary/50"
                                    placeholder="Örn: Lüks Saç Kesimi"
                                    placeholderTextColor="#475569"
                                    value={form.name}
                                    onChangeText={(t) => setForm(prev => ({ ...prev, name: t }))}
                                />
                                <View className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <Edit2 size={16} color={COLORS.primary.DEFAULT} />
                                </View>
                            </View>
                        </View>

                        {/* Price & Duration Grid */}
                        <View className="flex-row gap-4">
                            {/* Price */}
                            <View className="flex-1 gap-2">
                                <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider ml-1">Fiyat (TL)</Text>
                                <View className="relative">
                                    <View className="absolute left-4 top-4 z-10">
                                        <DollarSign size={16} color={COLORS.primary.DEFAULT} />
                                    </View>
                                    <TextInput
                                        className="w-full bg-[#1E293B] text-white rounded-xl border border-white/10 pl-10 pr-4 py-4 text-base font-bold focus:border-primary/50"
                                        placeholder="0"
                                        placeholderTextColor="#475569"
                                        keyboardType="numeric"
                                        value={form.price}
                                        onChangeText={(t) => setForm(prev => ({ ...prev, price: t }))}
                                    />
                                </View>
                            </View>

                            {/* Duration */}
                            <View className="flex-1 gap-2">
                                <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider ml-1">Süre</Text>
                                <Pressable
                                    onPress={() => setDurationModalVisible(true)}
                                    className="w-full bg-[#1E293B] rounded-xl border border-white/10 px-4 py-4 flex-row items-center justify-between active:bg-[#334155]"
                                >
                                    <Text className="text-white font-medium text-base">{form.duration} dk</Text>
                                    <ChevronDown size={16} color="#94A3B8" />
                                </Pressable>
                            </View>
                        </View>

                        {/* Category */}
                        <View className="gap-2">
                            <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider ml-1">Kategori</Text>
                            <TextInput
                                className="w-full bg-[#1E293B] text-white rounded-xl border border-white/10 px-4 py-4 text-base focus:border-primary/50"
                                placeholder="Örn: Saç Kesimi"
                                placeholderTextColor="#475569"
                                value={form.category}
                                onChangeText={(t) => setForm(prev => ({ ...prev, category: t }))}
                            />
                        </View>

                        {/* Description */}
                        <View className="gap-2">
                            <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider ml-1">Açıklama (Opsiyonel)</Text>
                            <TextInput
                                className="w-full bg-[#1E293B] text-white rounded-xl border border-white/10 px-4 py-4 text-sm leading-relaxed focus:border-primary/50 min-h-[100px]"
                                placeholder="Hizmet hakkında kısa bilgi..."
                                placeholderTextColor="#475569"
                                multiline
                                textAlignVertical="top"
                                value={form.description}
                                onChangeText={(t) => setForm(prev => ({ ...prev, description: t }))}
                            />
                        </View>

                        {/* Active Switch */}
                        <View className="flex-row items-center justify-between bg-[#1E293B] p-4 rounded-xl border border-white/10">
                            <View>
                                <Text className="text-white font-bold text-base">Randevuya Açık</Text>
                                <Text className="text-gray-500 text-xs mt-0.5">Müşteriler bu hizmeti görebilir</Text>
                            </View>
                            <Switch
                                value={form.isActive}
                                onValueChange={(v) => setForm(prev => ({ ...prev, isActive: v }))}
                                trackColor={{ false: '#334155', true: COLORS.primary.DEFAULT }}
                                thumbColor="white"
                            />
                        </View>

                        {/* Delete Button */}
                        {isEditing && (
                            <Pressable
                                onPress={handleDelete}
                                className="w-full py-4 rounded-xl flex-row items-center justify-center border border-red-500/30 bg-red-500/10 active:bg-red-500/20"
                            >
                                <Trash2 size={18} color="#EF4444" className="mr-2" />
                                <Text className="text-red-500 font-medium">Bu Hizmeti Sil</Text>
                            </Pressable>
                        )}

                    </View>
                </ScrollView>

                {/* Fixed Save Button */}
                <View className="p-4 bg-[#0F172A] border-t border-white/5">
                    <Pressable
                        onPress={handleSave}
                        disabled={saving}
                        className="w-full bg-primary py-4 rounded-xl items-center shadow-lg shadow-primary/20 active:scale-[0.99]"
                    >
                        {saving ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <View className="flex-row items-center gap-2">
                                <Text className="text-[#121212] font-bold text-lg">Kaydet</Text>
                                <Check size={20} color="#121212" />
                            </View>
                        )}
                    </Pressable>
                </View>
            </KeyboardAvoidingView>

            {/* Duration Picker Modal */}
            <Modal
                transparent
                visible={durationModalVisible}
                animationType="fade"
                onRequestClose={() => setDurationModalVisible(false)}
            >
                <Pressable
                    onPress={() => setDurationModalVisible(false)}
                    className="flex-1 bg-black/60 items-center justify-center p-4"
                >
                    <View className="w-full max-w-sm bg-[#1E293B] rounded-2xl overflow-hidden pb-4">
                        <View className="flex-row items-center justify-between p-4 border-b border-white/5">
                            <Text className="text-white font-bold text-lg">Süre Seçiniz</Text>
                            <Pressable onPress={() => setDurationModalVisible(false)} className="p-1">
                                <X size={20} color="#94A3B8" />
                            </Pressable>
                        </View>
                        <ScrollView className="max-h-[300px]">
                            {DURATION_OPTIONS.map(duration => (
                                <Pressable
                                    key={duration}
                                    onPress={() => {
                                        setForm(prev => ({ ...prev, duration }));
                                        setDurationModalVisible(false);
                                    }}
                                    className={`p-4 border-b border-white/5 flex-row justify-between items-center active:bg-white/5 ${form.duration === duration ? 'bg-primary/10' : ''}`}
                                >
                                    <Text className={`font-medium ${form.duration === duration ? 'text-primary' : 'text-gray-300'}`}>
                                        {duration} dakika
                                    </Text>
                                    {form.duration === duration && <Check size={16} color={COLORS.primary.DEFAULT} />}
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>
                </Pressable>
            </Modal>

        </View>
    );
}
