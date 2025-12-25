import { View, Text, Pressable, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';

// Status config for different appointment states
const STATUS_CONFIG = {
    pending: {
        icon: 'schedule',
        title: 'Randevu Talebiniz Alındı!',
        description: 'Randevunuz işletme onayı bekliyor. Onaylandığında bildirim alacaksınız.',
        color: '#F59E0B', // amber
    },
    confirmed: {
        icon: 'check-circle',
        title: 'Randevunuz Onaylandı!',
        description: 'Berberiniz sizi bekliyor. Randevu detaylarına profilinizden ulaşabilirsiniz.',
        color: '#10B981', // green
    },
    cancelled: {
        icon: 'cancel',
        title: 'Randevunuz İptal Edildi',
        description: 'Randevunuz iptal edilmiştir. Yeni bir randevu oluşturabilirsiniz.',
        color: '#EF4444', // red
    }
};

export default function BookingSuccessScreen() {
    const router = useRouter();
    const {
        status = 'pending',
        businessName = 'İşletme',
        date = 'Bugün',
        time = '00:00',
        serviceName = 'Hizmet',
        price = '0'
    } = useLocalSearchParams<{
        status?: string;
        businessName?: string;
        date?: string;
        time?: string;
        serviceName?: string;
        price?: string;
    }>();

    const statusConfig = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;

    return (
        <View className="flex-1 bg-background-light dark:bg-background-dark">
            {/* Top App Bar */}
            <View className="flex-row items-center justify-between p-4 pb-2 mt-8">
                <View className="w-10 h-10" />
                <Text className="text-lg font-bold leading-tight flex-1 text-center text-gray-900 dark:text-white">
                    Randevu Durumu
                </Text>
                <Pressable
                    onPress={() => router.push('/(customer)/(tabs)/home' as any)}
                    className="w-10 h-10 items-center justify-center rounded-full hover:bg-black/5 dark:active:bg-white/10"
                >
                    <MaterialIcons name="close" size={24} color={COLORS.text.DEFAULT} />
                </Pressable>
            </View>

            {/* Main Content */}
            <View className="flex-1 items-center justify-center px-6 py-8 w-full max-w-md mx-auto">

                {/* Success Visual */}
                <View className="relative w-48 h-48 mb-8 items-center justify-center">
                    {/* Glow Effect */}
                    <View
                        className="absolute inset-0 rounded-full blur-3xl opacity-60"
                        style={{ backgroundColor: statusConfig.color + '40' }}
                    />

                    {/* Icon Container */}
                    <View
                        className="relative z-10 w-full h-full rounded-full items-center justify-center shadow-2xl"
                        style={{ backgroundColor: statusConfig.color + '20', borderColor: statusConfig.color + '30', borderWidth: 4 }}
                    >
                        <View
                            className="rounded-full p-4 shadow-lg"
                            style={{ backgroundColor: statusConfig.color }}
                        >
                            <MaterialIcons name={statusConfig.icon as any} size={48} color="white" />
                        </View>
                    </View>
                </View>

                {/* Headline */}
                <Text className="text-[28px] font-bold leading-tight text-center mb-3 text-gray-900 dark:text-white">
                    {statusConfig.title}
                </Text>

                {/* Body Text */}
                <Text className="text-base font-normal leading-relaxed text-center text-gray-500 dark:text-gray-400 mb-8 max-w-[320px]">
                    {statusConfig.description}
                </Text>

                {/* Status Badge */}
                <View
                    className="px-4 py-2 rounded-full mb-6"
                    style={{ backgroundColor: statusConfig.color + '20' }}
                >
                    <Text style={{ color: statusConfig.color }} className="text-sm font-bold uppercase">
                        {status === 'pending' ? 'Onay Bekliyor' : status === 'confirmed' ? 'Onaylandı' : 'İptal'}
                    </Text>
                </View>

                {/* Appointment Summary Card */}
                <View className="w-full bg-white dark:bg-[#1C252E] rounded-2xl p-4 mb-8 flex-row items-center gap-4 shadow-sm border border-gray-100 dark:border-gray-800/50">
                    <View className="h-14 w-14 rounded-full overflow-hidden items-center justify-center" style={{ backgroundColor: statusConfig.color + '20' }}>
                        <MaterialIcons name="content-cut" size={28} color={statusConfig.color} />
                    </View>
                    <View className="flex-1">
                        <Text className="text-base font-bold text-gray-900 dark:text-white" numberOfLines={1}>{businessName}</Text>
                        <View className="flex-row items-center gap-1 mt-0.5">
                            <MaterialIcons name="schedule" size={16} color="#9CA3AF" />
                            <Text className="text-sm text-gray-500 dark:text-gray-400" numberOfLines={1}>{date}, {time} • {serviceName}</Text>
                        </View>
                    </View>
                    <View className="border-l border-gray-100 dark:border-gray-700/50 pl-2">
                        <Text className="text-sm font-bold text-primary">₺{price}</Text>
                    </View>
                </View>

                {/* Actions */}
                <View className="w-full gap-3">
                    <Pressable
                        onPress={() => router.push('/(customer)/(tabs)/home' as any)}
                        className="w-full h-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/25 active:scale-[0.98]"
                    >
                        <Text className="text-white text-base font-bold">Ana sayfaya dön</Text>
                    </Pressable>

                    <Pressable
                        onPress={() => router.push('/(customer)/(tabs)/appointments' as any)}
                        className="w-full h-14 flex-row items-center justify-center rounded-full bg-transparent border border-primary/30 active:scale-[0.98]"
                    >
                        <MaterialIcons name="list-alt" size={20} color={COLORS.primary.DEFAULT} style={{ marginRight: 8 }} />
                        <Text className="text-primary text-base font-bold">Randevularım</Text>
                    </Pressable>
                </View>

            </View>
        </View>
    );
}
