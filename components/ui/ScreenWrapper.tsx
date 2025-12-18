import React from 'react';
import { SafeAreaView, StatusBar, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ScreenWrapperProps {
    children: React.ReactNode;
    style?: ViewStyle;
    noPadding?: boolean;
    className?: string;
}

export const ScreenWrapper = ({ children, style, noPadding, className }: ScreenWrapperProps) => {
    return (
        <LinearGradient
            colors={['#121212', '#0a0a0a']} // Main dark theme gradient
            style={{ flex: 1 }}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar barStyle="light-content" />
                <View
                    className={`flex-1 ${noPadding ? '' : 'px-4'} ${className || ''}`}
                    style={style}
                >
                    {children}
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};
