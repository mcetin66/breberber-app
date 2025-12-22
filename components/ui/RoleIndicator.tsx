import React from 'react';
import { View, Text } from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { Role } from '@/types';

export const RoleIndicator = () => {
    const { user } = useAuthStore();

    if (!user) return null;

    let initial = '?';
    let bgColor = 'bg-zinc-500';

    // Type assertion to Role if needed, or safeguard
    const role = user.role as Role;

    switch (role) {
        case 'platform_admin':
            initial = 'A';
            bgColor = 'bg-red-600'; // Admin Red
            break;
        case 'business_owner':
            initial = 'B';
            bgColor = 'bg-[#d4af35]'; // Business Gold
            break;
        case 'staff':
            initial = 'C';
            bgColor = 'bg-blue-600'; // Staff Blue
            break;
        case 'customer':
            initial = 'D';
            bgColor = 'bg-green-600'; // Customer Green
            break;
    }

    return (
        <View className={`w-8 h-8 rounded-full ${bgColor} items-center justify-center border border-white/20`}>
            <Text className="text-white font-bold text-lg">{initial}</Text>
        </View>
    );
};
