import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { User, ChevronLeft, Mail, Phone, Shield, Calendar } from 'lucide-react-native';
import { useAuthStore } from '@/stores/authStore';

export default function PlatformProfileScreen() {
    const router = useRouter();
    const { user } = useAuthStore();

    const profileItems = [
        { label: 'Ad Soyad', value: user?.fullName || 'Platform Admin', icon: User },
        { label: 'E-posta', value: user?.email || 'admin@breberber.com', icon: Mail },
        { label: 'Telefon', value: user?.phone || '+90 555 XXX XX XX', icon: Phone },
        { label: 'Rol', value: 'Platform Yöneticisi', icon: Shield },
        { label: 'Kayıt Tarihi', value: '01.01.2025', icon: Calendar },
    ];

    return (
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
                    <View className="w-10 h-10 rounded-full bg-[#3B82F6] items-center justify-center">
                        <User size={20} color="#fff" />
                    </View>
                    <View>
                        <Text className="text-white text-lg font-bold">Profil Bilgileri</Text>
                        <Text className="text-gray-500 text-xs">Hesap detayları</Text>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1 px-4 pt-6">
                {/* Avatar */}
                <View className="items-center mb-8">
                    <View className="w-24 h-24 rounded-full bg-[#d4af35] items-center justify-center mb-3">
                        <Text className="text-[#121212] text-3xl font-bold">
                            {(user?.fullName || 'A').charAt(0).toUpperCase()}
                        </Text>
                    </View>
                    <Text className="text-white text-xl font-bold">{user?.fullName || 'Platform Admin'}</Text>
                    <Text className="text-[#d4af35] text-sm">Platform Yöneticisi</Text>
                </View>

                {/* Profile Info */}
                <View className="bg-[#1E1E1E] rounded-xl overflow-hidden">
                    {profileItems.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <View
                                key={idx}
                                className={`flex-row items-center p-4 ${idx < profileItems.length - 1 ? 'border-b border-white/5' : ''}`}
                            >
                                <View className="w-10 h-10 rounded-xl bg-white/5 items-center justify-center mr-3">
                                    <Icon size={18} color="#6B7280" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-500 text-xs">{item.label}</Text>
                                    <Text className="text-white font-medium mt-0.5">{item.value}</Text>
                                </View>
                            </View>
                        );
                    })}
                </View>

                <View className="h-12" />
            </ScrollView>
        </SafeAreaView>
    );
}
