import { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, User, Phone, Save } from 'lucide-react-native';
import { useAuthStore } from '@/stores/authStore';
import { COLORS } from '@/constants/theme';

export default function ProfileEditScreen() {
    const router = useRouter();
    const { user, updateProfile, isLoading } = useAuthStore();

    const [fullName, setFullName] = useState(user?.fullName || '');
    const [phone, setPhone] = useState(user?.phone || '');

    const handleSave = async () => {
        if (!fullName.trim()) {
            Alert.alert('Hata', 'İsim soyisim boş bırakılamaz.');
            return;
        }

        const result = await updateProfile({
            fullName,
            phone,
        });

        if (result.success) {
            Alert.alert('Başarılı', 'Profiliniz güncellendi.', [
                { text: 'Tamam', onPress: () => router.back() }
            ]);
        } else {
            Alert.alert('Hata', result.error || 'Güncelleme başarısız oldu.');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <View className="px-4 py-4 flex-row items-center border-b border-background-card justify-between">
                <View className="flex-row items-center">
                    <Pressable
                        onPress={() => router.back()}
                        className="mr-4 p-2 -ml-2 rounded-full active:bg-background-card"
                    >
                        <ChevronLeft size={24} color={COLORS.text.DEFAULT} />
                    </Pressable>
                    <Text className="text-white text-xl font-poppins-bold">Profili Düzenle</Text>
                </View>
            </View>

            <ScrollView className="flex-1 px-4 py-6">
                <View className="bg-background-card rounded-2xl p-4 mb-6">

                    <View className="mb-4">
                        <Text className="text-text-secondary text-sm font-poppins mb-2 ml-1">İsim Soyisim</Text>
                        <View className="flex-row items-center bg-background rounded-xl px-4 py-3">
                            <User size={20} color={COLORS.text.secondary} />
                            <TextInput
                                value={fullName}
                                onChangeText={setFullName}
                                className="flex-1 ml-3 text-white font-poppins-medium"
                                placeholder="İsim Soyisim"
                                placeholderTextColor={COLORS.text.muted}
                            />
                        </View>
                    </View>

                    <View className="mb-4">
                        <Text className="text-text-secondary text-sm font-poppins mb-2 ml-1">Telefon Numarası</Text>
                        <View className="flex-row items-center bg-background rounded-xl px-4 py-3">
                            <Phone size={20} color={COLORS.text.secondary} />
                            <TextInput
                                value={phone}
                                onChangeText={setPhone}
                                className="flex-1 ml-3 text-white font-poppins-medium"
                                placeholder="5XX XXX XX XX"
                                placeholderTextColor={COLORS.text.muted}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                </View>

                <Pressable
                    onPress={handleSave}
                    disabled={isLoading}
                    className={`flex-row items-center justify-center py-4 rounded-xl ${isLoading ? 'bg-primary-light' : 'bg-primary-DEFAULT'
                        }`}
                >
                    {isLoading ? (
                        <ActivityIndicator color={COLORS.background.DEFAULT} />
                    ) : (
                        <>
                            <Save size={20} color={COLORS.background.DEFAULT} />
                            <Text className="text-background font-poppins-bold text-lg ml-2">Kaydet</Text>
                        </>
                    )}
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}
