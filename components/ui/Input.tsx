import React from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input = ({ label, error, icon, className, ...props }: InputProps) => {
    return (
        <View className={`mb-4 ${className}`}>
            {label && <Text className="text-text-muted text-xs font-semibold mb-2 ml-1">{label}</Text>}
            <View className={`h-12 bg-card-dark rounded-xl border flex-row items-center px-4 ${error ? 'border-red-500' : 'border-white/10 focus:border-primary'}`}>
                {icon && <View className="mr-3">{icon}</View>}
                <TextInput
                    className="flex-1 text-white font-medium h-full"
                    placeholderTextColor="#6a7785"
                    style={{ outlineStyle: 'none' } as any} // Fix for web outline
                    {...props}
                />
            </View>
            {error && <Text className="text-red-500 text-xs mt-1 ml-1">{error}</Text>}
        </View>
    );
};
