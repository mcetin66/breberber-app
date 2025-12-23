import React, { useState, useRef } from 'react';
import { View, Image, PanResponder, Animated, Dimensions, Text } from 'react-native';

interface BeforeAfterSliderProps {
    beforeImage: string;
    afterImage: string;
    width?: number;
    height?: number;
}

export function BeforeAfterSlider({
    beforeImage,
    afterImage,
    width = Dimensions.get('window').width - 32,
    height = 300,
}: BeforeAfterSliderProps) {
    const [sliderPosition, setSliderPosition] = useState(width / 2);
    const pan = useRef(new Animated.Value(width / 2)).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                let newPosition = width / 2 + gestureState.dx;
                // Clamp position
                newPosition = Math.max(20, Math.min(width - 20, newPosition));
                setSliderPosition(newPosition);
                pan.setValue(newPosition);
            },
        })
    ).current;

    return (
        <View
            style={{ width, height, borderRadius: 16, overflow: 'hidden' }}
            className="relative bg-[#1E1E1E]"
        >
            {/* After Image (Full Width Background) */}
            <Image
                source={{ uri: afterImage }}
                style={{ width, height }}
                resizeMode="cover"
            />

            {/* Before Image (Clipped by slider position) */}
            <View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: sliderPosition,
                    height,
                    overflow: 'hidden',
                }}
            >
                <Image
                    source={{ uri: beforeImage }}
                    style={{ width, height }}
                    resizeMode="cover"
                />
            </View>

            {/* Labels */}
            <View className="absolute top-3 left-3 bg-black/60 px-2 py-1 rounded">
                <Text className="text-white text-[10px] font-bold uppercase">Öncesi</Text>
            </View>
            <View className="absolute top-3 right-3 bg-primary/80 px-2 py-1 rounded">
                <Text className="text-black text-[10px] font-bold uppercase">Sonrası</Text>
            </View>

            {/* Slider Line */}
            <View
                {...panResponder.panHandlers}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: sliderPosition - 20,
                    width: 40,
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {/* Vertical Line */}
                <View className="w-[2px] h-full bg-white shadow-lg" />

                {/* Handle Circle */}
                <View
                    className="absolute w-10 h-10 rounded-full bg-white items-center justify-center shadow-xl"
                    style={{
                        top: height / 2 - 20,
                    }}
                >
                    <View className="flex-row">
                        <View className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-gray-400" />
                        <View className="w-1" />
                        <View className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-gray-400" />
                    </View>
                </View>
            </View>
        </View>
    );
}
