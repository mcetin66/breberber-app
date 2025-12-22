import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';

interface LegalCheckboxProps {
    label: string;
    linkText?: string;
    onLinkPress?: () => void;
    checked: boolean;
    onChange: (checked: boolean) => void;
    error?: string;
}

export const LegalCheckbox: React.FC<LegalCheckboxProps> = ({
    label,
    linkText,
    onLinkPress,
    checked,
    onChange,
    error
}) => {
    return (
        <View className="mb-2">
            <View className="flex-row items-center gap-3">
                <Pressable
                    onPress={() => onChange(!checked)}
                    className={`w-6 h-6 rounded-md border items-center justify-center ${checked ? 'bg-[#d4af35] border-[#d4af35]' : 'bg-transparent border-zinc-500'}`}
                >
                    {checked && <MaterialIcons name="check" size={16} color="black" />}
                </Pressable>

                <View className="flex-1 flex-row flex-wrap items-center">
                    <Pressable onPress={() => onChange(!checked)}>
                        <Text className="text-zinc-400 text-xs leading-5">
                            {label}{' '}
                        </Text>
                    </Pressable>
                    {linkText && (
                        <Pressable onPress={onLinkPress}>
                            <Text className="text-[#d4af35] text-xs font-bold underline leading-5">
                                {linkText}
                            </Text>
                        </Pressable>
                    )}
                </View>
            </View>
            {error && <Text className="text-red-500 text-[10px] ml-9 mt-1">{error}</Text>}
        </View>
    );
};
