import { LucideIcon, User, Store, Clock, Image, Wallet, Bell, Lock, LogOut, Shield, Users, CreditCard, Calendar, UserCog, Building2, Scissors } from 'lucide-react-native';

export type SettingsItem = {
    icon: LucideIcon;
    label: string;
    route?: string;
    action?: 'logout' | 'toggle_notifications' | 'password_reset' | 'switch_to_staff' | 'switch_to_business';
    danger?: boolean;
    modal?: string;
    type?: 'toggle' | 'link' | 'button';
    key?: string; // for toggles
    accent?: string; // accent color for special items
};

export const SETTINGS_MENU: Record<string, SettingsItem[]> = {
    platform_admin: [
        { icon: Users, label: 'İşletme Yönetimi', route: '/(platform)/(tabs)/businesses' },
        { icon: Shield, label: 'Sistem Kayıtları', route: '/(platform)/audit' },
        { icon: Bell, label: 'Bildirimler', type: 'toggle', key: 'notifications', action: 'toggle_notifications' },
        { icon: Lock, label: 'Şifre Değiştir', modal: 'password', action: 'password_reset' },
        { icon: LogOut, label: 'Çıkış Yap', action: 'logout', danger: true },
    ],
    business_owner: [
        { icon: Store, label: 'İşletme Profili', route: '/(business)/settings/profile' },
        { icon: Clock, label: 'Çalışma Saatleri', route: '/(business)/settings/hours' },
        { icon: Image, label: 'Galeri Yönetimi', route: '/(business)/settings/gallery' },
        { icon: Scissors, label: 'Hizmetler', route: '/(business)/(tabs)/services' },
        { icon: Users, label: 'Personel Yönetimi', route: '/(business)/(tabs)/staff' },
        { icon: Wallet, label: 'Ödeme ve Finans', route: '/(business)/finance' },
        { icon: Bell, label: 'Bildirimler', type: 'toggle', key: 'notifications', action: 'toggle_notifications' },
        { icon: UserCog, label: 'Personel Moduna Geç', action: 'switch_to_staff', accent: '#8B5CF6' }, // Purple
        { icon: LogOut, label: 'Çıkış Yap', action: 'logout', danger: true },
    ],
    // Special menu for business_owner viewing as staff
    business_owner_as_staff: [
        { icon: User, label: 'Profilim', route: '/(staff)/(tabs)/profile' },
        { icon: Calendar, label: 'Randevularım', route: '/(staff)/(tabs)/appointments' },
        { icon: Bell, label: 'Bildirimler', type: 'toggle', key: 'notifications', action: 'toggle_notifications' },
        { icon: Building2, label: 'Yönetici Moduna Dön', action: 'switch_to_business', accent: '#10B981' }, // Green
        { icon: LogOut, label: 'Çıkış Yap', action: 'logout', danger: true },
    ],
    staff: [
        { icon: User, label: 'Profilim', route: '/(staff)/(tabs)/profile' },
        { icon: Bell, label: 'Bildirimler', type: 'toggle', key: 'notifications', action: 'toggle_notifications' },
        { icon: LogOut, label: 'Çıkış Yap', action: 'logout', danger: true },
    ],
    customer: [
        { icon: Calendar, label: 'Randevularım', route: '/(customer)/appointments' },
        { icon: User, label: 'Hesap Bilgileri', route: '/(customer)/profile-edit' },
        { icon: Bell, label: 'Bildirimler', type: 'toggle', key: 'notifications', action: 'toggle_notifications' },
        { icon: LogOut, label: 'Çıkış Yap', action: 'logout', danger: true },
    ],
};
