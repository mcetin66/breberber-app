import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/theme';

interface PremiumBackgroundProps extends ViewProps {
    children: React.ReactNode;
}

/**
 * A premium background component that applies a subtle dark gradient.
 * Aligns with the Black/Gold theme.
 */
export const PremiumBackground = ({ children, style, ...props }: PremiumBackgroundProps) => {
    return (
        <View style={[styles.container, style]} {...props}>
            <LinearGradient
                // Subtle gradient: Dark -> Slightly Lighter -> Dark
                // Creates a premium depth effect without being distracting
                colors={['#0f0f0f', '#151515', '#0f0f0f']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />
            {/* Optional: Add a very subtle gold glow at top right if desired for extra premium feel */}
            <LinearGradient
                colors={['rgba(212, 175, 55, 0.03)', 'transparent']}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
            />

            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background.DEFAULT,
    },
});
