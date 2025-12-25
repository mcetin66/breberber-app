/**
 * BaseHeader - Tüm projede kullanılacak standart header komponenti
 * 
 * NOT: Bu component safe area padding UYGULAMAZ.
 * Ekranlar SafeAreaView ile sarılmalıdır.
 * 
 * Variant'lar:
 * - default: Standart küçük header (lg font)
 * - large: Büyük başlıklı header (3xl font)
 * - settings: Gold ikonu olan ayarlar header'ı
 */

import { View, Text, Pressable } from 'react-native';
import { ChevronLeft, Settings, Bell } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ReactNode } from 'react';

export interface BaseHeaderProps {
    title: string;
    subtitle?: string;
    showBack?: boolean;
    rightElement?: ReactNode;
    leftElement?: ReactNode;
    headerIcon?: ReactNode;
    children?: ReactNode;
    variant?: 'default' | 'large' | 'settings';
    noBorder?: boolean;
    showNotifications?: boolean;
}

export function BaseHeader({
    title,
    subtitle,
    showBack = false,
    rightElement,
    leftElement,
    headerIcon,
    children,
    variant = 'default',
    noBorder = false,
    showNotifications = false,
}: BaseHeaderProps) {
    const router = useRouter();

    // Variant-based styling
    const isLarge = variant === 'large';
    const isSettings = variant === 'settings';

    const titleSize = isLarge ? 'text-3xl' : 'text-lg';
    const containerPadding = isLarge ? 'px-5 pt-2 pb-6' : 'px-4 py-3';

    return (
        <View
            className={`${containerPadding} bg-[#121212] ${!noBorder ? 'border-b border-white/5' : ''}`}
        >
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3 flex-1">
                    {/* Left Element or Back Button */}
                    {leftElement ? (
                        leftElement
                    ) : showBack ? (
                        <Pressable
                            onPress={() => router.back()}
                            className="w-10 h-10 rounded-full bg-[#1E1E1E] items-center justify-center border border-white/5 active:bg-white/10"
                        >
                            <ChevronLeft size={24} color="white" />
                        </Pressable>
                    ) : isSettings ? (
                        <View className="w-10 h-10 rounded-full bg-[#d4af35] items-center justify-center">
                            {headerIcon || <Settings size={20} color="#121212" />}
                        </View>
                    ) : null}

                    {/* Title & Subtitle */}
                    <View className="flex-1">
                        {subtitle && (
                            <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">
                                {subtitle}
                            </Text>
                        )}
                        <Text className={`text-white ${titleSize} font-bold tracking-tight`} numberOfLines={1}>
                            {title}
                        </Text>
                    </View>
                </View>

                {/* Right Element */}
                <View className="flex-row items-center gap-2">
                    {showNotifications && (
                        <Pressable className="w-10 h-10 rounded-full bg-[#1E1E1E] items-center justify-center border border-white/5">
                            <Bell size={20} color="white" />
                        </Pressable>
                    )}
                    {rightElement}
                </View>
            </View>

            {/* Optional Children */}
            {children}
        </View>
    );
}

// Legacy exports for backwards compatibility
export const AppHeader = BaseHeader;
export const SimpleHeader = BaseHeader;

