import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ReactNode } from 'react';

interface SimpleHeaderProps {
    title: string;
    subtitle?: string;
    showBack?: boolean;
    rightElement?: ReactNode;
    noBorder?: boolean;
}

/**
 * Standart header component - Tüm projede kullanılacak
 * Üstte büyük başlık, altında küçük açıklama
 */
export function SimpleHeader({
    title,
    subtitle,
    showBack = false,
    rightElement,
    noBorder = false
}: SimpleHeaderProps) {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View
            className={`px-4 py-3 flex-row items-center justify-between bg-[#121212] ${!noBorder ? 'border-b border-white/5' : ''}`}
            style={{ paddingTop: insets.top > 0 ? insets.top + 8 : 12 }}
        >
            <View className="flex-row items-center gap-3 flex-1">
                {showBack && (
                    <Pressable
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full bg-[#1E1E1E] items-center justify-center -ml-1"
                    >
                        <ChevronLeft size={24} color="white" />
                    </Pressable>
                )}
                <View className="flex-1">
                    <Text className="text-white text-lg font-bold" numberOfLines={1}>{title}</Text>
                    {subtitle && (
                        <Text className="text-gray-500 text-xs">{subtitle}</Text>
                    )}
                </View>
            </View>
            {rightElement && (
                <View className="ml-3">
                    {rightElement}
                </View>
            )}
        </View>
    );
}
