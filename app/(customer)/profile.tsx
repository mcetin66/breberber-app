import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Pressable, StatusBar, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/theme';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'expo-router';
import { Input } from '@/components/ui/Input';

export default function ProfileScreen() {
    const { user, signOut } = useAuthStore();
    const router = useRouter();

    // Form State
    const [name, setName] = useState(user?.name || 'Mert Yılmaz');
    const [phone, setPhone] = useState(user?.phone || '+90 555 123 45 67');
    const [email, setEmail] = useState(user?.email || 'mert.yilmaz@example.com');

    const menuItems = [
        { icon: 'favorite', label: 'Favori Berberlerim', route: '/(customer)/favorites' },
        { icon: 'history', label: 'Geçmiş Randevular', route: '/(customer)/appointments' },
        { icon: 'credit-card', label: 'Ödeme Yöntemleri', route: '/(customer)/payments' }, // Placeholder
        { icon: 'notifications', label: 'Bildirim Ayarları', route: '/notifications' }, // Placeholder
    ];

    const handleLogout = async () => {
        await signOut();
        router.replace('/(auth)/login');
    };

    return (
        <View className="flex-1 bg-[#121212]">
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <SafeAreaView edges={['top']} className="bg-[#121212]/95 backdrop-blur-md border-b border-white/5 z-50">
                <View className="flex-row items-center justify-between px-4 py-3">
                    <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full hover:bg-white/10">
                        <MaterialIcons name="arrow-back" size={24} color="white" />
                    </Pressable>
                    <Text className="text-white text-lg font-bold tracking-wide">Profilim</Text>
                    <Pressable className="px-2 py-1">
                        <Text className="text-primary text-base font-semibold">Kaydet</Text>
                    </Pressable>
                </View>
            </SafeAreaView>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Profile Header */}
                <View className="items-center py-8 px-4">
                    <View className="relative mb-4">
                        <LinearGradient
                            colors={[COLORS.primary.DEFAULT, '#FFE5A0', COLORS.primary.DEFAULT]}
                            className="w-32 h-32 rounded-full p-[3px]"
                        >
                            <View className="w-full h-full rounded-full border-4 border-[#121212] overflow-hidden bg-gray-700">
                                <Image
                                    source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            </View>
                        </LinearGradient>
                        <Pressable className="absolute bottom-1 right-1 bg-primary p-2 rounded-full border-2 border-[#121212] shadow-lg">
                            <MaterialIcons name="edit" size={18} color="#121212" />
                        </Pressable>
                    </View>
                    <Text className="text-2xl font-bold text-white tracking-tight text-center">{name}</Text>
                    <View className="flex-row items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                        <MaterialIcons name="diamond" size={16} color={COLORS.primary.DEFAULT} />
                        <Text className="text-primary text-xs font-bold uppercase tracking-wider">VIP Üye</Text>
                    </View>
                </View>

                {/* Personal Info Form */}
                <View className="px-4 mb-6 gap-4">
                    <Text className="text-[#A0A0A0] text-xs font-bold uppercase tracking-widest ml-1">Kişisel Bilgiler</Text>

                    <View className="relative bg-[#1E1E1E] rounded-xl border border-white/5">
                        <Text className="absolute left-4 top-3 text-xs text-[#A0A0A0] font-medium z-10">Ad Soyad</Text>
                        <MaterialIcons name="person" size={20} color={COLORS.primary.DEFAULT} style={{ position: 'absolute', right: 16, top: 20, opacity: 0.5 }} />
                        <Input
                            value={name}
                            onChangeText={setName}
                            className="border-0 bg-transparent mt-1"
                            style={{ paddingTop: 20, paddingBottom: 8, height: 60, fontSize: 16 }}
                        />
                    </View>

                    <View className="relative bg-[#1E1E1E] rounded-xl border border-white/5">
                        <Text className="absolute left-4 top-3 text-xs text-[#A0A0A0] font-medium z-10">Telefon</Text>
                        <MaterialIcons name="phone" size={20} color={COLORS.primary.DEFAULT} style={{ position: 'absolute', right: 16, top: 20, opacity: 0.5 }} />
                        <Input
                            value={phone}
                            onChangeText={setPhone}
                            className="border-0 bg-transparent mt-1"
                            style={{ paddingTop: 20, paddingBottom: 8, height: 60, fontSize: 16 }}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View className="relative bg-[#1E1E1E] rounded-xl border border-white/5">
                        <Text className="absolute left-4 top-3 text-xs text-[#A0A0A0] font-medium z-10">E-posta</Text>
                        <MaterialIcons name="mail" size={20} color={COLORS.primary.DEFAULT} style={{ position: 'absolute', right: 16, top: 20, opacity: 0.5 }} />
                        <Input
                            value={email}
                            onChangeText={setEmail}
                            className="border-0 bg-transparent mt-1"
                            style={{ paddingTop: 20, paddingBottom: 8, height: 60, fontSize: 16 }}
                            keyboardType="email-address"
                        />
                    </View>
                </View>

                {/* Account Settings Menu */}
                <View className="px-4 mb-8">
                    <Text className="text-[#A0A0A0] text-xs font-bold uppercase tracking-widest mb-3 ml-1">Hesap Ayarları</Text>
                    <View className="bg-[#1E1E1E] rounded-xl border border-white/5 overflow-hidden">
                        {menuItems.map((item, index) => (
                            <Pressable
                                key={index}
                                onPress={() => router.push(item.route as any)}
                                className={`flex-row items-center justify-between p-4 active:bg-white/5 ${index !== menuItems.length - 1 ? 'border-b border-white/5' : ''}`}
                            >
                                <View className="flex-row items-center gap-4">
                                    <View className="w-10 h-10 rounded-full bg-[#121212] items-center justify-center">
                                        <MaterialIcons name={item.icon as any} size={20} color={COLORS.primary.DEFAULT} />
                                    </View>
                                    <Text className="text-white font-medium text-base">{item.label}</Text>
                                </View>
                                <MaterialIcons name="chevron-right" size={24} color="#A0A0A0" />
                            </Pressable>
                        ))}
                        <Pressable
                            onPress={handleLogout}
                            className="flex-row items-center justify-between p-4 border-t border-white/5 active:bg-white/5"
                        >
                            <View className="flex-row items-center gap-4">
                                <View className="w-10 h-10 rounded-full bg-[#121212] items-center justify-center">
                                    <MaterialIcons name="logout" size={20} color="#EF4444" />
                                </View>
                                <Text className="text-red-500 font-medium text-base">Çıkış Yap</Text>
                            </View>
                        </Pressable>
                    </View>
                </View>

                {/* Security Section */}
                <View className="px-4 mb-8">
                    <Text className="text-[#A0A0A0] text-xs font-bold uppercase tracking-widest mb-3 ml-1">Güvenlik ve Gizlilik</Text>
                    <View className="bg-[#1E1E1E] rounded-xl border border-white/5 p-4 gap-4">
                        <View className="flex-row items-start gap-3">
                            <MaterialIcons name="verified-user" size={20} color="#A0A0A0" style={{ marginTop: 2 }} />
                            <Text className="text-sm text-[#A0A0A0] leading-relaxed flex-1">
                                Kişisel verileriniz <Text className="text-primary font-medium">KVKK</Text> kapsamında korunmaktadır. Detaylı bilgi için <Text className="text-white underline" onPress={() => { }}>Aydınlatma Metni</Text>'ni inceleyebilirsiniz.
                            </Text>
                        </View>
                        <View className="h-[1px] bg-white/5" />
                        <Pressable className="flex-row items-center justify-center gap-2 py-3 rounded-lg border border-red-900/50 active:bg-red-900/10">
                            <MaterialIcons name="delete" size={20} color="#EF4444" />
                            <Text className="text-red-500 font-medium">Hesabımı ve Verilerimi Sil</Text>
                        </Pressable>
                    </View>
                </View>

                <View className="items-center pb-8">
                    <Text className="text-xs text-[#A0A0A0]/50">v2.4.0 • Build 202310</Text>
                </View>

            </ScrollView>
        </View>
    );
}
