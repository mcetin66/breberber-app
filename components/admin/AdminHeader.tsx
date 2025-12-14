import { View, Text } from 'react-native';
import { ReactNode } from 'react';

interface AdminHeaderProps {
    title: string;
    subtitle?: string;
    rightElement?: ReactNode;
    showBack?: boolean;
    children?: ReactNode; // Add children prop
}

export const AdminHeader = ({ title, subtitle, rightElement, children }: AdminHeaderProps) => {
    return (
        <View className="px-5 pt-2 pb-6 z-10">
            <View className="flex-row items-center justify-between mb-2">
                <View>
                    {subtitle && (
                        <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                            {subtitle}
                        </Text>
                    )}
                    <Text className="text-white text-3xl font-bold tracking-tight">
                        {title}
                    </Text>
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
