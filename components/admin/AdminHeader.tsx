import { View, Text, Pressable } from 'react-native';
import { ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

interface AdminHeaderProps {
    title: string;
    subtitle?: string;
    rightElement?: ReactNode;
    showBack?: boolean;
    headerIcon?: ReactNode;
    children?: ReactNode;
}

export const AdminHeader = ({ title, subtitle, rightElement, showBack, headerIcon, children }: AdminHeaderProps) => {
    const router = useRouter();

    return (
        <View className="px-5 py-4 border-b border-white/5 bg-[#121212]">
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                    {showBack && (
                        <Pressable
                            onPress={() => router.back()}
                            className="w-8 h-8 rounded-full bg-[#1E1E1E] items-center justify-center border border-white/10 active:bg-white/10 mr-1"
                        >
                            <ChevronLeft size={18} color="#9CA3AF" />
                        </Pressable>
                    )}
                    {headerIcon && (
                        <View className="w-10 h-10 rounded-full bg-[#d4af35] items-center justify-center">
                            {headerIcon}
                        </View>
                    )}
                    <View>
                        <Text className="text-white text-2xl font-bold tracking-tight">
                            {title}
                        </Text>
                        {subtitle && (
                            <Text className="text-zinc-500 text-xs mt-1">
                                {subtitle}
                            </Text>
                        )}
                    </View>
                </View>

                {rightElement && (
                    <View className="flex-row items-center gap-2">
                        {rightElement}
                    </View>
                )}
            </View>
            {children && <View className="mt-4">{children}</View>}
        </View>
    );
};
