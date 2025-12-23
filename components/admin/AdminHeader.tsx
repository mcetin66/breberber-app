/**
 * AdminHeader - Backward compatible wrapper around BaseHeader
 * 
 * This component maintains the AdminHeader API while internally using BaseHeader
 * for consistent styling across the application.
 */

import { ReactNode } from 'react';
import { BaseHeader } from '../shared/layouts/BaseHeader';
import { View } from 'react-native';

interface AdminHeaderProps {
    title: string;
    subtitle?: string;
    rightElement?: ReactNode;
    showBack?: boolean;
    headerIcon?: ReactNode;
    children?: ReactNode;
}

export const AdminHeader = ({
    title,
    subtitle,
    rightElement,
    showBack,
    headerIcon,
    children
}: AdminHeaderProps) => {
    return (
        <BaseHeader
            title={title}
            subtitle={subtitle}
            showBack={showBack}
            rightElement={rightElement}
            leftElement={!showBack && headerIcon ? (
                <View className="w-10 h-10 rounded-full bg-[#d4af35] items-center justify-center">
                    {headerIcon}
                </View>
            ) : undefined}
            noBorder={false}
        >
            {children}
        </BaseHeader>
    );
};
