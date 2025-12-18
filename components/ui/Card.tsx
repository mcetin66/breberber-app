import React from 'react';
import { View, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Simulating the gold border gradient effect from the UI templates
export const Card = ({ children, className, style, ...props }: ViewProps & { className?: string }) => {
    return (
        <LinearGradient
            colors={['rgba(212, 175, 53, 0.5)', 'rgba(212, 175, 53, 0.1)', 'rgba(212, 175, 53, 0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 12, padding: 1 }} // 1px padding acts as border
            className={`shadow-lg shadow-primary/5 ${className}`} // nativewind might overwrite padding if not careful
        >
            <View
                className="bg-card-dark rounded-[11px] p-4 flex-1"
                style={style}
                {...props}
            >
                {children}
            </View>
        </LinearGradient>
    );
};
