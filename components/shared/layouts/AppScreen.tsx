/**
 * AppScreen - Tüm ekranlar için merkezi wrapper
 * 
 * Bu bileşen:
 * 1. Safe area insets'i hook ile alır (flicker önler)
 * 2. Header'a otomatik paddingTop uygular
 * 3. Tutarlı arka plan rengi sağlar
 * 4. Standart body padding sağlar (isteğe bağlı)
 * 
 * Kullanım:
 * <AppScreen header={<BaseHeader title="Dashboard" />}>
 *   <ScrollView>...</ScrollView>
 * </AppScreen>
 */

import { View, ViewProps, StatusBar, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ReactNode } from 'react';

// Standart padding değerleri - tek yerden yönetim
export const SCREEN_PADDING = {
    horizontal: 16,  // px-4
    top: 16,         // pt-4
    bottom: 100,     // Tab bar için alan
};

interface AppScreenProps extends ViewProps {
    children: ReactNode;
    header?: ReactNode;
    /** Header için safe area padding uygula (varsayılan: true) */
    useSafeArea?: boolean;
    /** Arka plan rengi (varsayılan: #121212) */
    backgroundColor?: string;
    /** Body için padding uygulama (varsayılan: false - children kendi padding'ini uygular) */
    noPadding?: boolean;
    /** ScrollView olarak render et (varsayılan: false) */
    scrollable?: boolean;
}

export function AppScreen({
    children,
    header,
    useSafeArea = true,
    backgroundColor = '#121212',
    noPadding = false,
    scrollable = false,
    style,
    ...props
}: AppScreenProps) {
    const insets = useSafeAreaInsets();

    const bodyContent = noPadding ? children : (
        <View style={{ paddingHorizontal: SCREEN_PADDING.horizontal, paddingTop: SCREEN_PADDING.top }}>
            {children}
        </View>
    );

    return (
        <View
            className="flex-1"
            style={[{ backgroundColor }, style]}
            {...props}
        >
            <StatusBar barStyle="light-content" />

            {/* Header varsa, safe area padding ile render et */}
            {header && (
                <View style={useSafeArea ? { paddingTop: insets.top } : undefined}>
                    {header}
                </View>
            )}

            {/* Ana içerik - scrollable veya normal View */}
            {scrollable ? (
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: SCREEN_PADDING.bottom }}
                >
                    {bodyContent}
                </ScrollView>
            ) : (
                <View className="flex-1">
                    {bodyContent}
                </View>
            )}
        </View>
    );
}

