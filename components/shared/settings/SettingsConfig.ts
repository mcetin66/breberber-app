import { LucideIcon, User, Store, Clock, Image, Wallet, Bell, Lock, LogOut, Shield, Users, CreditCard, Calendar } from 'lucide-react-native';

export type SettingsItem = {
    icon: LucideIcon;
    label: string;
    route?: string;
    action?: 'logout' | 'toggle_notifications' | 'password_reset';
    danger?: boolean;
    modal?: string;
    type?: 'toggle' | 'link' | 'button';
    key?: string; // for toggles
};

export const SETTINGS_MENU: Record<string, SettingsItem[]> = {
    admin: [
        { icon: Users, label: 'Kullanıcı Yönetimi', route: '/(admin)/users' },
        { icon: Shield, label: 'Sistem Ayarları', route: '/(admin)/system' },
        { icon: Bell, label: 'Bildirimler', type: 'toggle', key: 'notifications', action: 'toggle_notifications' },
        { icon: Lock, label: 'Şifre Değiştir', modal: 'password', action: 'password_reset' },
        { icon: LogOut, label: 'Çıkış Yap', action: 'logout', danger: true },
    ],
    business_owner: [
        { icon: Store, label: 'İşletme Profili', route: '/(business)/(tabs)/settings/profile' },
        { icon: Clock, label: 'Çalışma Saatleri', route: '/(business)/(tabs)/settings/hours' },
        { icon: Image, label: 'Galeri Yönetimi', route: '/(business)/(tabs)/settings/gallery' },
        { icon: Wallet, label: 'Ödeme ve Finans', route: '/(business)/finance' },
        { icon: Bell, label: 'Bildirimler', type: 'toggle', key: 'notifications', action: 'toggle_notifications' },
        { icon: LogOut, label: 'Çıkış Yap', action: 'logout', danger: true },
    ],
    staff: [
        { icon: User, label: 'Profilim', route: '/(staff)/(tabs)/profile' },
        { icon: Clock, label: 'Çalışma Saatlerim', route: '/(staff)/(tabs)/hours' },
        { icon: Bell, label: 'Bildirimler', type: 'toggle', key: 'notifications', action: 'toggle_notifications' },
        { icon: LogOut, label: 'Çıkış Yap', action: 'logout', danger: true },
    ],
    customer: [
        { icon: Calendar, label: 'Randevularım', route: '/(customer)/appointments' },
        { icon: User, label: 'Hesap Bilgileri', route: '/(customer)/profile/edit' },
        { icon: Bell, label: 'Bildirimler', type: 'toggle', key: 'notifications', action: 'toggle_notifications' },
        { icon: CreditCard, label: 'Ödeme Yöntemleri', route: '/(customer)/profile/payments' },
        { icon: LogOut, label: 'Çıkış Yap', action: 'logout', danger: true },
    ],
};
