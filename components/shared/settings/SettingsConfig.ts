import { LucideIcon, User, Store, Clock, Image, Wallet, Bell, Lock, LogOut, Shield, Users, CreditCard, Calendar, UserCog, Building2, Scissors, FileText, Crown, BarChart3, Settings2, Key, HelpCircle, Info, Settings, Megaphone, Trash2 } from 'lucide-react-native';

export type SettingsItem = {
    icon: LucideIcon;
    label: string;
    route?: string;
    action?: 'logout' | 'toggle_notifications' | 'password_reset' | 'switch_to_staff' | 'switch_to_business' | 'delete_account';
    danger?: boolean;
    modal?: string;
    type?: 'toggle' | 'link' | 'button';
    key?: string; // for toggles
    accent?: string; // accent color for special items
    iconBg?: string; // background color for icon
};

export type SettingsCategory = {
    title: string;
    items: SettingsItem[];
};

export const SETTINGS_MENU: Record<string, SettingsCategory[]> = {
    platform_admin: [
        {
            title: 'YAPILANDIRMA',
            items: [
                { icon: Settings, label: 'Platform Ayarları', route: '/(platform)/config', iconBg: '#d4af35' },
                { icon: Crown, label: 'Abonelik Planları', route: '/(platform)/plans', iconBg: '#22D3EE' },
                { icon: Shield, label: 'Sistem Kayıtları', route: '/(platform)/audit', iconBg: '#8B5CF6' },
                { icon: FileText, label: 'Dökümantasyon', route: '/(platform)/docs', iconBg: '#6B7280' },
            ]
        },
        {
            title: 'İŞLETME YÖNETİMİ',
            items: [
                { icon: Clock, label: 'Onay Bekleyenler', route: '/(platform)/pending', iconBg: '#F97316' },
            ]
        },
        {
            title: 'İLETİŞİM',
            items: [
                { icon: Megaphone, label: 'Duyuru Gönder', route: '/(platform)/announcement', iconBg: '#F97316' },
            ]
        },
        {
            title: 'KİŞİSEL',
            items: [
                { icon: User, label: 'Profil Bilgileri', route: '/(platform)/profile', iconBg: '#3B82F6' },
                { icon: Bell, label: 'Bildirimler', type: 'toggle', key: 'notifications', action: 'toggle_notifications', iconBg: '#EAB308' },
                { icon: Key, label: 'Şifre Değiştir', route: '/(platform)/change-password', iconBg: '#94A3B8' },
            ]
        },
        {
            title: 'HESAP',
            items: [
                { icon: LogOut, label: 'Çıkış Yap', action: 'logout', danger: true, iconBg: '#EF4444' },
            ]
        }
    ],
    business_owner: [
        {
            title: 'İŞLETME',
            items: [
                { icon: Store, label: 'İşletme Profili', route: '/(business)/settings/profile', iconBg: '#d4af35' },
                { icon: Clock, label: 'Çalışma Saatleri', route: '/(business)/settings/hours', iconBg: '#3B82F6' },
                { icon: Image, label: 'Galeri Yönetimi', route: '/(business)/settings/gallery', iconBg: '#EC4899' },
                { icon: Scissors, label: 'Hizmetler', route: '/(business)/(tabs)/services', iconBg: '#8B5CF6' },
            ]
        },
        {
            title: 'EKİP',
            items: [
                { icon: Users, label: 'Personel Yönetimi', route: '/(business)/(tabs)/staff', iconBg: '#10B981' },
                { icon: Wallet, label: 'Ödeme ve Finans', route: '/(business)/(tabs)/finance', iconBg: '#F97316' },
            ]
        },
        {
            title: 'KİŞİSEL',
            items: [
                { icon: Bell, label: 'Bildirimler', type: 'toggle', key: 'notifications', action: 'toggle_notifications', iconBg: '#EAB308' },
                { icon: UserCog, label: 'Personel Moduna Geç', action: 'switch_to_staff', accent: '#8B5CF6', iconBg: '#8B5CF6' },
            ]
        },
        {
            title: 'HESAP',
            items: [
                { icon: LogOut, label: 'Çıkış Yap', action: 'logout', danger: true, iconBg: '#EF4444' },
            ]
        }
    ],
    // Special menu for business_owner viewing as staff
    business_owner_as_staff: [
        {
            title: 'PERSONEL',
            items: [
                { icon: User, label: 'Profilim', route: '/(staff)/(tabs)/profile', iconBg: '#3B82F6' },
                { icon: Calendar, label: 'Randevularım', route: '/(staff)/(tabs)/appointments', iconBg: '#10B981' },
            ]
        },
        {
            title: 'KİŞİSEL',
            items: [
                { icon: Bell, label: 'Bildirimler', type: 'toggle', key: 'notifications', action: 'toggle_notifications', iconBg: '#EAB308' },
                { icon: Building2, label: 'Yönetici Moduna Dön', action: 'switch_to_business', accent: '#10B981', iconBg: '#10B981' },
            ]
        },
        {
            title: 'HESAP',
            items: [
                { icon: LogOut, label: 'Çıkış Yap', action: 'logout', danger: true, iconBg: '#EF4444' },
            ]
        }
    ],
    staff: [
        {
            title: 'PERSONEL',
            items: [
                { icon: User, label: 'Profilim', route: '/(staff)/(tabs)/profile', iconBg: '#3B82F6' },
                { icon: Calendar, label: 'Randevularım', route: '/(staff)/(tabs)/appointments', iconBg: '#10B981' },
            ]
        },
        {
            title: 'KİŞİSEL',
            items: [
                { icon: Bell, label: 'Bildirimler', type: 'toggle', key: 'notifications', action: 'toggle_notifications', iconBg: '#EAB308' },
            ]
        },
        {
            title: 'HESAP',
            items: [
                { icon: LogOut, label: 'Çıkış Yap', action: 'logout', danger: true, iconBg: '#EF4444' },
            ]
        }
    ],
    customer: [
        {
            title: 'RANDEVULAR',
            items: [
                { icon: Calendar, label: 'Randevularım', route: '/(customer)/appointments', iconBg: '#10B981' },
            ]
        },
        {
            title: 'HESAP',
            items: [
                { icon: User, label: 'Hesap Bilgileri', route: '/(customer)/profile-edit', iconBg: '#3B82F6' },
                { icon: Bell, label: 'Bildirimler', type: 'toggle', key: 'notifications', action: 'toggle_notifications', iconBg: '#EAB308' },
            ]
        },
        {
            title: '',
            items: [
                { icon: Trash2, label: 'Hesabı Sil', action: 'delete_account', danger: true, iconBg: '#DC2626' },
                { icon: LogOut, label: 'Çıkış Yap', action: 'logout', danger: true, iconBg: '#EF4444' },
            ]
        }
    ],
};
