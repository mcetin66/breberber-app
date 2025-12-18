import { View, Text, Pressable } from 'react-native';
import { ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

interface AppHeaderProps {
    title: string;
    subtitle?: string;
    rightElement?: ReactNode;
    showBack?: boolean;
    children?: ReactNode;
}

export const AppHeader = ({ title, subtitle, rightElement, showBack, children }: AppHeaderProps) => {
    const router = useRouter();

    return (
        <View className="px-5 pt-2 pb-6 z-10">
            <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center gap-4">
                    {showBack && (
                        <Pressable
                            onPress={() => router.back()}
                            className="w-10 h-10 rounded-full bg-[#1E1E1E] items-center justify-center border border-white/5 active:bg-white/10"
                        >
                            <ChevronLeft size={24} color="white" />
                        </Pressable>
                    )}
                    <View>
                        {subtitle && (
                            <Text className="text-slate-400 text-xs font-poppins-bold uppercase tracking-wider mb-1">
                                {subtitle}
                            </Text>
                        )}
                        <Text className="text-white text-3xl font-poppins-bold tracking-tight">
                            {title}
                        </Text>
                    </View>
                </View>

                {rightElement && (
                    <View className="flex-row items-center gap-2">
                        {rightElement}
                    </View>
                )}
            </View>
            {children}
        </View>
    );
};
