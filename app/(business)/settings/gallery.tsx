import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { ChevronLeft, Image as ImageIcon } from 'lucide-react-native';

export default function GallerySettings() {
    const router = useRouter();
    return (
        <SafeAreaView className="flex-1 bg-[#0F172A]" edges={['top']}>
            <AdminHeader
                title="Galeri Yönetimi"
                subtitle="Fotoğraflarını Düzenle"
                showBack
                rightElement={
                    <Pressable
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full bg-[#1E293B] items-center justify-center border border-white/5"
                    >
                        <ChevronLeft size={24} color="white" />
                    </Pressable>
                }
            />
            <View className="flex-1 items-center justify-center px-8">
                <ImageIcon size={64} color="#334155" />
                <Text className="text-white font-bold text-xl mt-6 text-center">Çok Yakında</Text>
                <Text className="text-slate-400 text-center mt-2 leading-6">
                    Müşterilerinize işletmenizi göstermek için yakında fotoğraf yükleyebileceksiniz.
                </Text>
            </View>
        </SafeAreaView>
    );
}
