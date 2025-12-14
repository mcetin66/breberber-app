import { View, Text, Switch, Pressable, ScrollView, Image, Alert, TextInput, ActivityIndicator } from 'react-native';
import MaskInput from 'react-native-mask-input';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import {
    ChevronRight,
    LogOut,
    User,
    Bell,
    Moon,
    Shield,
    HelpCircle,
    Mail,
    Lock,
    Edit2,
    Check,
    Smartphone
} from 'lucide-react-native';
import { useState } from 'react';
import { FormModal } from '@/components/common/FormModal';
import { SystemHealth } from '@/components/admin/SystemHealth';
import { formatPhoneNumber } from '@/utils/format';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminSettingsScreen() {
    const router = useRouter();
    const { signOut, user, updateProfile, updatePassword } = useAuthStore();

    // UI Toggles
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(true);

    // Modals
    const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
    const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form Data
    const [profileForm, setProfileForm] = useState({
        fullName: user?.fullName || '',
        phone: user?.phone || '',
    });
    const [passwordForm, setPasswordForm] = useState({
        password: '',
        confirmPassword: '',
    });

    const handleUpdateProfile = async () => {
        setLoading(true);
        const { success, error } = await updateProfile(profileForm);
        setLoading(false);
        if (success) {
            setIsProfileModalVisible(false);
            Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi.');
        } else {
            Alert.alert('Hata', error || 'Profil güncellenemedi.');
        }
    };

    const handleUpdatePassword = async () => {
        if (passwordForm.password !== passwordForm.confirmPassword) {
            Alert.alert('Hata', 'Şifreler uyuşmuyor.');
            return;
        }
        if (passwordForm.password.length < 6) {
            Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır.');
            return;
        }

        setLoading(true);
        const { success, error } = await updatePassword(passwordForm.password);
        setLoading(false);

        if (success) {
            setIsPasswordModalVisible(false);
            setPasswordForm({ password: '', confirmPassword: '' });
            Alert.alert('Başarılı', 'Şifreniz başarıyla değiştirildi.');
        } else {
            Alert.alert('Hata', error || 'Şifre değiştirilemedi.');
        }
    };

    const handleLogout = () => {
        Alert.alert(
            "Çıkış Yap",
            "Hesabınızdan çıkış yapmak istediğinize emin misiniz?",
            [
                { text: "İptal", style: "cancel" },
                {
                    text: "Çıkış Yap",
                    style: "destructive",
                    onPress: async () => {
                        await signOut();
                        router.replace('/');
                    }
                }
            ]
        );
    };

    const SettingItem = ({ icon: Icon, label, value, type = 'link', showBorder = true, onPress }: any) => (
        <Pressable
            onPress={onPress}
            className={`flex-row items-center justify-between py-4 ${showBorder ? 'border-b border-white/5' : ''}`}
        >
            <View className="flex-row items-center gap-3">
                <View className="w-8 h-8 rounded-lg bg-slate-800 items-center justify-center">
                    <Icon size={18} color="#94A3B8" />
                </View>
                <Text className="text-white text-base font-medium">{label}</Text>
            </View>

            {type === 'toggle' ? (
                <Switch
                    value={value}
                    onValueChange={(val) => {
                        if (label === 'Bildirimler') setNotificationsEnabled(val);
                        if (label === 'Karanlık Mod') setDarkModeEnabled(val);
                    }}
                    trackColor={{ false: '#334155', true: '#3B82F6' }}
                    thumbColor={'#fff'}
                    ios_backgroundColor="#334155"
                    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                />
            ) : (
                <ChevronRight size={20} color="#64748B" />
            )}
        </Pressable>
    );

    return (
        <SafeAreaView className="flex-1 bg-[#0F172A]" edges={['top']}>
            <AdminHeader
                title="Ayarlar"
                subtitle="HESAP & SİSTEM"
            />
            <View className="flex-1 px-5">


                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 120 }}
                >
                    {/* Profile Card */}
                    <View className="bg-[#1E293B] p-4 rounded-2xl flex-row items-center mb-6 border border-white/5 relative">
                        <View className="w-14 h-14 rounded-full bg-slate-700 items-center justify-center overflow-hidden">
                            {user?.avatar ? (
                                <Image source={{ uri: user.avatar }} className="w-full h-full" />
                            ) : (
                                <User size={24} color="#CBD5E1" />
                            )}
                        </View>
                        <View className="ml-4 flex-1">
                            <Text className="text-white text-lg font-bold">{user?.fullName || 'Admin Kullanıcısı'}</Text>
                            <Text className="text-slate-400 text-sm">{user?.email}</Text>
                        </View>

                        <Pressable
                            onPress={() => {
                                setProfileForm({ fullName: user?.fullName || '', phone: user?.phone || '' });
                                setIsProfileModalVisible(true);
                            }}
                            className="absolute right-4 top-4 bg-slate-700 p-2 rounded-full"
                        >
                            <Edit2 size={16} color="white" />
                        </Pressable>
                    </View>

                    {/* System Health */}
                    <SystemHealth />

                    {/* General Settings */}
                    <Text className="text-slate-400 text-xs font-bold uppercase mb-3 ml-1 tracking-wider">Genel</Text>
                    <View className="bg-[#1E293B] rounded-2xl px-4 overflow-hidden mb-6 border border-white/5">
                        <SettingItem icon={Bell} label="Bildirimler" type="toggle" value={notificationsEnabled} />
                        <SettingItem icon={Moon} label="Karanlık Mod" type="toggle" showBorder={false} value={darkModeEnabled} />
                    </View>

                    {/* Security */}
                    <Text className="text-slate-400 text-xs font-bold uppercase mb-3 ml-1 tracking-wider">Güvenlik</Text>
                    <View className="bg-[#1E293B] rounded-2xl px-4 overflow-hidden mb-6 border border-white/5">
                        <SettingItem
                            icon={Lock}
                            label="Şifre Değiştir"
                            showBorder={false}
                            onPress={() => setIsPasswordModalVisible(true)}
                        />
                    </View>

                    {/* Account Settings */}
                    <Text className="text-slate-400 text-xs font-bold uppercase mb-3 ml-1 tracking-wider">Hesap</Text>
                    <View className="bg-[#1E293B] rounded-2xl px-4 overflow-hidden mb-6 border border-white/5">
                        <SettingItem icon={Mail} label="E-posta Tercihleri" />
                        <SettingItem icon={HelpCircle} label="Yardım & Destek" showBorder={false} />
                    </View>

                    {/* Logout */}
                    <Pressable
                        onPress={handleLogout}
                        className="bg-red-500/10 rounded-2xl p-4 flex-row items-center justify-center border border-red-500/20 active:opacity-80"
                    >
                        <LogOut size={20} color="#EF4444" className="mr-2" />
                        <Text className="text-red-400 font-bold text-base">Çıkış Yap</Text>
                    </Pressable>

                    <Text className="text-center text-slate-600 text-xs mt-6 mb-10">v1.0.0 (Build 124) • BreBerber Admin</Text>
                </ScrollView>
            </View>

            {/* Edit Profile Modal */}
            <FormModal
                visible={isProfileModalVisible}
                onClose={() => setIsProfileModalVisible(false)}
                title="Profili Düzenle"
                footer={
                    <Pressable
                        onPress={handleUpdateProfile}
                        disabled={loading}
                        className={`${loading ? 'opacity-50' : 'active:opacity-90'} bg-[#3B82F6] rounded-xl py-4 flex-row items-center justify-center gap-3`}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Check size={20} color="white" strokeWidth={2.5} />
                                <Text className="text-white font-bold text-base">Kaydet</Text>
                            </>
                        )}
                    </Pressable>
                }
            >
                <View className="gap-6">
                    <View>
                        <Text className="text-gray-400 text-xs mb-1.5 ml-1">Ad Soyad</Text>
                        <View className="bg-[#1E293B] text-white rounded-2xl border border-white/5 flex-row items-center px-4 h-14">
                            <TextInput
                                className="flex-1 text-white text-base font-medium h-full"
                                placeholder="Ad Soyad"
                                placeholderTextColor="#475569"
                                value={profileForm.fullName}
                                onChangeText={(text) => setProfileForm(prev => ({ ...prev, fullName: text }))}
                            />
                            <User size={18} color="#64748B" />
                        </View>
                    </View>
                    <View>
                        <Text className="text-gray-400 text-xs mb-1.5 ml-1">Telefon</Text>
                        <View className="bg-[#1E293B] text-white rounded-2xl border border-white/5 flex-row items-center px-4 h-14">
                            <MaskInput
                                className="flex-1 text-white text-base font-medium h-full"
                                placeholder="(555) 123 45 67"
                                placeholderTextColor="#475569"
                                value={profileForm.phone}
                                onChangeText={(masked, unmasked) => setProfileForm(prev => ({ ...prev, phone: masked }))}
                                mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/]}
                                keyboardType="phone-pad"
                            />
                            <Smartphone size={18} color="#64748B" />
                        </View>
                    </View>
                </View>
            </FormModal>

            {/* Change Password Modal */}
            <FormModal
                visible={isPasswordModalVisible}
                onClose={() => setIsPasswordModalVisible(false)}
                title="Şifre Değiştir"
                footer={
                    <Pressable
                        onPress={handleUpdatePassword}
                        disabled={loading}
                        className={`bg-primary h-14 rounded-2xl items-center justify-center ${loading ? 'opacity-50' : ''}`}
                    >
                        <Text className="text-white font-bold text-lg">{loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}</Text>
                    </Pressable>
                }
            >
                <View className="gap-6">
                    <View>
                        <Text className="text-gray-400 text-xs mb-1.5 ml-1">Yeni Şifre</Text>
                        <View className="bg-[#1E293B] text-white rounded-2xl border border-white/5 flex-row items-center px-4 h-14">
                            <TextInput
                                className="flex-1 text-white text-base font-medium h-full"
                                placeholder="Yeni Şifre (En az 6 karakter)"
                                placeholderTextColor="#475569"
                                value={passwordForm.password}
                                onChangeText={(text) => setPasswordForm(prev => ({ ...prev, password: text }))}
                                secureTextEntry
                            />
                        </View>
                    </View>
                    <View>
                        <Text className="text-gray-400 text-xs mb-1.5 ml-1">Şifre Tekrar</Text>
                        <View className="bg-[#1E293B] text-white rounded-2xl border border-white/5 flex-row items-center px-4 h-14">
                            <TextInput
                                className="flex-1 text-white text-base font-medium h-full"
                                placeholder="Şifreyi Tekrar Girin"
                                placeholderTextColor="#475569"
                                value={passwordForm.confirmPassword}
                                onChangeText={(text) => setPasswordForm(prev => ({ ...prev, confirmPassword: text }))}
                                secureTextEntry
                            />
                        </View>
                    </View>
                </View>
            </FormModal>
        </SafeAreaView>
    );
}
