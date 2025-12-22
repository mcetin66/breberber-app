import React from 'react';
import { View, Text } from 'react-native';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';

export default function BusinessSettingsScreen() {
    return (
        <ScreenWrapper>
            <View className="py-4 border-b border-white/10 mb-4">
                <Text className="text-xl font-bold text-white">Ayarlar</Text>
            </View>
            <View className="flex-1 items-center justify-center">
                <Text className="text-zinc-400">Ayarlar yakında eklenecek.</Text>
            </View>
        </ScreenWrapper>
    );
}
