import { ReactNode } from 'react';

/**
 * Rol bazlı header konfigürasyonu
 * BaseHeader komponenti bu config'i kullanır
 */

export interface HeaderConfig {
    variant?: 'default' | 'large' | 'settings';
    showBack?: boolean;
    showNotifications?: boolean;
    showLogo?: boolean;
    showSearch?: boolean;
    subtitle?: string;
}

export const ROLE_HEADER_CONFIG: Record<string, HeaderConfig> = {
    business_owner: {
        variant: 'large',
        showNotifications: true,
        subtitle: 'İŞLETME',
    },
    staff: {
        variant: 'default',
        showNotifications: true,
        subtitle: 'PERSONEL',
    },
    customer: {
        variant: 'default',
        showBack: false,
    },
    platform_admin: {
        variant: 'settings',
        subtitle: 'PLATFORM',
    },
};

// Screen-specific header configs
export const SCREEN_HEADER_CONFIG: Record<string, HeaderConfig> = {
    dashboard: {
        variant: 'large',
        showNotifications: true,
    },
    calendar: {
        variant: 'large',
        showNotifications: true,
    },
    settings: {
        variant: 'settings',
    },
    profile: {
        variant: 'default',
        showBack: true,
    },
};
