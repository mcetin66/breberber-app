import { View, Text, ScrollView, Pressable, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Key, ChevronLeft, Save, Lock } from 'lucide-react-native';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ChangePasswordScreen() {
    const router = useRouter();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdatePassword = async () => {
        if (!newPassword || !confirmPassword) {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Hata', 'Yeni şifreler eşleşmiyor.');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır.');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            Alert.alert('Başarılı', 'Şifreniz başarıyla güncellendi.', [
                { text: 'Tamam', onPress: () => router.back() }
            ]);
        } catch (err: any) {
            Alert.alert('Hata', err.message || 'Şifre güncellenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <SafeAreaView className="flex-1 bg-[#121212]" edges={['top']}>
                {/* Header */}
                <View className="px-4 py-3 flex-row items-center gap-3 border-b border-white/5">
                    <Pressable
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full bg-[#1E1E1E] items-center justify-center border border-white/10"
                    >
                        <ChevronLeft size={20} color="#fff" />
                    </Pressable>
                    <View className="flex-row items-center gap-3 flex-1">
                        <View className="w-10 h-10 rounded-full bg-[#94A3B8] items-center justify-center">
                            <Key size={20} color="#121212" />
                        </View>
                        <View>
                            <Text className="text-white text-lg font-bold">Şifre Değiştir</Text>
                            <Text className="text-gray-500 text-xs">Hesap güvenliğini yönetin</Text>
                        </View>
                    </View>
                </View>

                <ScrollView className="flex-1 px-4 pt-6">
                    <View className="mb-6">
                        <View className="bg-[#1E1E1E] rounded-xl overflow-hidden border border-white/5 p-4">
                            {/* Note: Supabase implementation usually requires email re-auth for current password check, 
                                but simplistic strictly update approach only needs new password content logged in user. 
                                We'll keep it simple as per standard Supabase updateUser usage. */}

                            <View className="flex-row items-center gap-2 mb-6">
                                <Lock size={16} color="#d4af35" />
                                <Text className="text-gray-400 text-xs">
                                    Güçlü bir şifre seçtiğinizden emin olun. En az 6 karakter kullanmalısınız.
                                </Text>
                            </View>

                            <View className="mb-4">
                                <Text className="text-white text-sm font-medium mb-2">Yeni Şifre</Text>
                                <TextInput
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    placeholder="Yeni şifrenizi girin"
                                    placeholderTextColor="#6B7280"
                                    secureTextEntry
                                    className="bg-[#2a2a2a] text-white p-3 rounded-lg border border-white/10 focus:border-[#d4af35]"
                                />
                            </View>

                            <View className="mb-2">
                                <Text className="text-white text-sm font-medium mb-2">Yeni Şifre (Tekrar)</Text>
                                <TextInput
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    placeholder="Yeni şifrenizi tekrar girin"
                                    placeholderTextColor="#6B7280"
                                    secureTextEntry
                                    className="bg-[#2a2a2a] text-white p-3 rounded-lg border border-white/10 focus:border-[#d4af35]"
                                />
                            </View>
                        </View>
                    </View>

                    <Pressable
                        onPress={handleUpdatePassword}
                        disabled={loading}
                        className={`bg-[#d4af35] rounded-xl py-4 flex-row items-center justify-center gap-2 ${loading ? 'opacity-50' : ''}`}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#121212" />
                        ) : (
                            <Save size={18} color="#121212" />
                        )}
                        <Text className="text-[#121212] font-bold text-base">Şifreyi Güncelle</Text>
                    </Pressable>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}
