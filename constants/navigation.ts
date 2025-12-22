import { LucideIcon } from 'lucide-react-native';
import { Calendar, Scissors, LayoutDashboard, Wallet, Settings, FileBarChart, Home, Heart, User } from 'lucide-react-native';

// =============================================================================
// TAB BAR CONFIG - Ortak stil tanımları
// =============================================================================

export const TAB_BAR_STYLES = {
    container: {
        backgroundColor: '#1E1E1E',
        borderTopWidth: 1,
        borderTopColor: 'rgba(212, 175, 53, 0.2)',
        height: 90,
        paddingTop: 10,
        paddingBottom: 30,
    },
    item: {
        height: 50,
    },
    label: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 10,
        marginTop: 4,
    },
};

export const TAB_BAR_COLORS = {
    active: '#d4af35',    // Gold
    inactive: '#64748B',  // Slate
};

// =============================================================================
// TAB DEFINITIONS - Rol bazlı tab tanımları
// =============================================================================

export interface TabDefinition {
    name: string;
    title: string;
    icon: LucideIcon;
    elevated?: boolean;     // Merkezdeki elevated buton için
    hideForStaff?: boolean; // Staff görmesin
    hidden?: boolean;       // Tab bar'da görünmesin
}

export const BUSINESS_TABS: TabDefinition[] = [
    { name: 'calendar', title: 'Takvim', icon: Calendar },
    { name: 'services', title: 'Hizmetler', icon: Scissors, hideForStaff: true },
    { name: 'dashboard', title: 'Panel', icon: LayoutDashboard },
    { name: 'finance', title: 'Finans', icon: Wallet, hideForStaff: true },
    { name: 'settings', title: 'Ayarlar', icon: Settings },
    { name: 'staff', title: 'Personel', icon: User, hidden: true },
];

export const CUSTOMER_TABS: TabDefinition[] = [
    { name: 'home', title: 'Keşfet', icon: Home },
    { name: 'appointments', title: 'Randevular', icon: Calendar },
    { name: 'favorites', title: 'Favoriler', icon: Heart },
    { name: 'profile', title: 'Profil', icon: User },
    // Hidden routes
    { name: 'search', title: '', icon: Home, hidden: true },
    { name: 'booking/staff-selection', title: '', icon: Home, hidden: true },
    { name: 'booking/time-slot-selection', title: '', icon: Home, hidden: true },
    { name: 'booking/booking-summary', title: '', icon: Home, hidden: true },
    { name: 'booking/booking-success', title: '', icon: Home, hidden: true },
];

export const PLATFORM_TABS: TabDefinition[] = [
    { name: 'businesses', title: 'İşletmeler', icon: Scissors },
    { name: 'finance', title: 'Finans', icon: Wallet },
    { name: 'dashboard', title: '', icon: LayoutDashboard, elevated: true },
    { name: 'reports', title: 'Raporlar', icon: FileBarChart },
    { name: 'settings', title: 'Ayarlar', icon: Settings },
    { name: 'reports-new', title: 'Raporlar', icon: FileBarChart, hidden: true },
];

export const STAFF_TABS: TabDefinition[] = [
    { name: 'calendar', title: 'Takvim', icon: Calendar },
    { name: 'dashboard', title: 'Panel', icon: LayoutDashboard },
    { name: 'profile', title: 'Profil', icon: User },
];

// Rol bazlı tab seçici
export const ROLE_TABS: Record<string, TabDefinition[]> = {
    business_owner: BUSINESS_TABS,
    staff: STAFF_TABS,
    customer: CUSTOMER_TABS,
    platform_admin: PLATFORM_TABS,
};

// =============================================================================
// HEADER CONFIG - Ortak header tanımları
// =============================================================================

export interface HeaderConfig {
    showBack?: boolean;
    showLogo?: boolean;
    showNotifications?: boolean;
    backgroundColor?: string;
    title?: string;
}

export const DEFAULT_HEADER_CONFIG: HeaderConfig = {
    showBack: false,
    showLogo: true,
    showNotifications: true,
    backgroundColor: 'transparent',
};
