import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FileText, ChevronLeft, ChevronRight, Book, Code, Server, Shield, HelpCircle } from 'lucide-react-native';
import { BaseHeader } from '@/components/shared/layouts/BaseHeader';

const DOCS = [
    {
        title: 'Başlangıç Kılavuzu',
        description: 'Platform kullanımına hızlı başlangıç',
        icon: Book,
        color: '#10B981',
    },
    {
        title: 'API Dokümantasyonu',
        description: 'Geliştirici API referansı',
        icon: Code,
        color: '#3B82F6',
    },
    {
        title: 'Sunucu Yönetimi',
        description: 'Backend ve veritabanı yönetimi',
        icon: Server,
        color: '#8B5CF6',
    },
    {
        title: 'Güvenlik Protokolleri',
        description: 'Veri güvenliği ve gizlilik',
        icon: Shield,
        color: '#F97316',
    },
    {
        title: 'Sık Sorulan Sorular',
        description: 'Yaygın sorular ve yanıtları',
        icon: HelpCircle,
        color: '#EAB308',
    },
];

export default function DocsScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-[#121212]" edges={['top']}>
            <BaseHeader
                title="Dökümantasyon"
                subtitle="Yardım ve kılavuzlar"
                showBack
            />

            <ScrollView className="flex-1 px-4 pt-4">
                {/* Info Banner */}
                <View className="bg-[#d4af35]/10 border border-[#d4af35]/20 rounded-xl p-4 mb-6">
                    <Text className="text-[#d4af35] font-bold mb-1">Platform Yönetim Paneli</Text>
                    <Text className="text-gray-400 text-xs leading-5">
                        Bu panel ile işletmeleri yönetebilir, abonelik planlarını düzenleyebilir ve sistem kayıtlarını görüntüleyebilirsiniz.
                    </Text>
                </View>

                {/* Docs List */}
                <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-3 ml-1">DÖKÜMANLAR</Text>
                <View className="bg-[#1E1E1E] rounded-xl overflow-hidden">
                    {DOCS.map((doc, index) => {
                        const Icon = doc.icon;
                        return (
                            <Pressable
                                key={index}
                                className={`flex-row items-center p-4 ${index < DOCS.length - 1 ? 'border-b border-white/5' : ''} active:bg-white/5`}
                            >
                                <View
                                    className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                                    style={{ backgroundColor: doc.color + '20' }}
                                >
                                    <Icon size={20} color={doc.color} />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-semibold">{doc.title}</Text>
                                    <Text className="text-gray-500 text-xs mt-0.5">{doc.description}</Text>
                                </View>
                                <ChevronRight size={18} color="#4B5563" />
                            </Pressable>
                        );
                    })}
                </View>

                {/* Version Info */}
                <View className="items-center py-8">
                    <Text className="text-gray-600 text-xs">Breberber Platform v1.0.0</Text>
                    <Text className="text-gray-700 text-[10px] mt-1">Son güncelleme: 18 Aralık 2024</Text>
                </View>

                <View className="h-12" />
            </ScrollView>
        </SafeAreaView>
    );
}
