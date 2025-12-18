import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
    label: string;
    onPress: () => void;
    variant?: 'primary' | 'outline' | 'ghost' | 'danger';
    loading?: boolean;
    disabled?: boolean;
    className?: string;
    icon?: React.ReactNode;
}

export const Button = ({ label, onPress, variant = 'primary', loading, disabled, className, icon }: ButtonProps) => {
    // Styles mapping
    const baseStyles = "h-12 rounded-xl flex-row items-center justify-center px-4";

    const variants = {
        primary: "bg-primary shadow-lg shadow-primary/20",
        outline: "bg-transparent border border-primary/50",
        ghost: "bg-transparent",
        danger: "bg-red-500/10 border border-red-500/50"
    };

    const textVariants = {
        primary: "text-black font-bold text-base",
        outline: "text-primary font-bold text-base",
        ghost: "text-primary font-medium text-sm",
        danger: "text-red-500 font-bold text-base"
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50' : ''} ${className}`}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'primary' ? 'black' : '#d4af35'} />
            ) : (
                <>
                    {icon}
                    <Text className={`${textVariants[variant]} ${icon ? 'ml-2' : ''}`}>
                        {label}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
}
