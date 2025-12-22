import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock } from 'lucide-react-native';
import { AppHeader } from '@/components/shared/layouts/AppHeader';

export default function StaffAppointmentsScreen() {
    return (
        <SafeAreaView className="flex-1 bg-[#121212]" edges={['top']}>
            <AppHeader title="Randevularım" subtitle="PERSONEL" />

            <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                {/* Placeholder content */}
                <View className="items-center justify-center py-20">
                    <View className="w-20 h-20 rounded-full bg-[#1E1E1E] items-center justify-center mb-4">
                        <Calendar size={40} color="#d4af35" />
                    </View>
                    <Text className="text-white text-lg font-bold mb-2">Randevularınız</Text>
                    <Text className="text-gray-500 text-sm text-center px-8">
                        Bugünkü ve gelecek randevularınız burada görünecek.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
