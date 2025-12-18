import { useEffect, useRef } from 'react';
import { View, ViewStyle, Animated, Easing } from 'react-native';

interface SkeletonProps {
    width?: number | string;
    height?: number | string;
    variant?: 'circle' | 'rect' | 'text';
    style?: ViewStyle;
    className?: string; // Support for NativeWind
}

export const Skeleton = ({
    width,
    height,
    variant = 'rect',
    style,
    className
}: SkeletonProps) => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.7,
                    duration: 800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );

        animation.start();

        return () => animation.stop();
    }, [opacity]);

    const borderRadius = variant === 'circle' ? 9999 : variant === 'text' ? 4 : 8;

    return (
        <Animated.View
            className={`bg-[#2A2A2A] border border-white/5 ${className}`}
            style={[
                {
                    opacity,
                    width: width,
                    height: height,
                    borderRadius,
                },
                style,
            ] as any}
        />
    );
};
