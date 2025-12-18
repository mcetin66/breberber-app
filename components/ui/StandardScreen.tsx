import React from 'react';
import { View, ScrollView, RefreshControl, ViewStyle } from 'react-native';
import { ScreenWrapper } from './ScreenWrapper';
import { AdminHeader } from '../admin/AdminHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/* 
    STANDARD SCREEN STRUCTURE
    -------------------------
    - Wraps content in ScreenWrapper (Gradient Background + SafeArea)
    - Provides a standard Header (title, subtitle, back button)
    - Provides a standard ScrollView Body (or View if not scrollable)
    - Provides a standard Footer slot (Sticky bottom)
*/

interface StandardScreenProps {
    // Header Props
    title: string;
    subtitle?: string;
    showBack?: boolean;
    rightElement?: React.ReactNode;

    // Body Props
    isScrollable?: boolean;
    children: React.ReactNode;
    refreshing?: boolean;
    onRefresh?: () => void;
    contentContainerStyle?: ViewStyle;

    // Footer Props
    footer?: React.ReactNode;

    // Custom
    noPadding?: boolean;
}

export const StandardScreen = ({
    title,
    subtitle,
    showBack,
    rightElement,
    isScrollable = true,
    children,
    refreshing = false,
    onRefresh,
    contentContainerStyle,
    footer,
    noPadding = false,
}: StandardScreenProps) => {
    const insets = useSafeAreaInsets();

    return (
        <ScreenWrapper noPadding className="flex-1">
            {/* 1. Header Area */}
            {/* Uses AdminHeader for now, but we can make it generic if needed. 
                Ideally AdminHeader should be renamed to just "Header" or "AppHeader". 
                For now reusing it as it fits the design. 
            */}
            <View className="z-20">
                <AdminHeader
                    title={title}
                    subtitle={subtitle}
                    showBack={showBack}
                    rightElement={rightElement}
                />
            </View>

            {/* 2. Body Area */}
            <View className="flex-1 z-10">
                {isScrollable ? (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={[
                            { paddingBottom: footer ? 100 : 20, paddingHorizontal: noPadding ? 0 : 16 },
                            contentContainerStyle
                        ]}
                        refreshControl={
                            onRefresh ? (
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#d4af35" />
                            ) : undefined
                        }
                    >
                        {children}
                    </ScrollView>
                ) : (
                    <View style={[{ flex: 1, paddingHorizontal: noPadding ? 0 : 16 }, contentContainerStyle]}>
                        {children}
                    </View>
                )}
            </View>

            {/* 3. Footer Area */}
            {footer && (
                <View
                    style={{ paddingBottom: insets.bottom + 10 }}
                    className="absolute bottom-0 left-0 right-0 bg-[#121212]/95 backdrop-blur-md border-t border-white/5 px-4 pt-4 z-30"
                >
                    {footer}
                </View>
            )}
        </ScreenWrapper>
    );
};
