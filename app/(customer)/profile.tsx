import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/authStore';
import { COLORS } from '@/constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Oturum Kapat',
      'Çıkış yapmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: () => {
            // Sign out the user
            signOut().then(() => {
              // Force redirect to root (Role Selection)
              // Use a slight delay to ensure state updates propagate if needed, 
              // though usually signOut clears state immediately.
              router.replace('/');
            });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Top App Bar */}
        <View className="flex-row items-center justify-between px-5 py-4 bg-background-light/90 dark:bg-background-dark/90 sticky top-0 z-50">
          <Text className="text-xl font-bold text-[#111418] dark:text-white">Profil</Text>
          <Pressable
            onPress={() => alert('Ayarlar yakında!')}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
          >
            <MaterialIcons name="settings" size={24} color={COLORS.text.DEFAULT} />
          </Pressable>
        </View>

        {/* Profile Header */}
        <View className="items-center gap-4 px-5 py-6">
          <View className="relative">
            <View className="h-28 w-28 rounded-full overflow-hidden shadow-xl border-4 border-surface-dark dark:border-[#232d38]">
              {user?.avatar ? (
                <Image
                  source={{ uri: user.avatar }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full bg-gray-200 items-center justify-center">
                  <MaterialIcons name="person" size={48} color={COLORS.text.secondary} />
                </View>
              )}
            </View>
            <Pressable
              onPress={() => alert('Profil düzenleme yakında!')}
              className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full bg-primary shadow-lg border-2 border-background-dark"
            >
              <MaterialIcons name="edit" size={16} color="white" />
            </Pressable>
          </View>

          <View className="items-center gap-1">
            <Text className="text-2xl font-bold text-[#111418] dark:text-white text-center">
              {user?.fullName || user?.email?.split('@')[0]}
            </Text>
            <View className="flex-row items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1">
              <MaterialIcons name="person" size={16} color={COLORS.primary.DEFAULT} />
              <Text className="text-sm font-semibold text-primary">Müşteri Hesabı</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View className="px-5 pb-6">
          <View className="flex-row items-center rounded-full bg-surface-dark/5 dark:bg-[#1c242d] p-1.5">
            <Pressable
              onPress={() => setActiveTab('upcoming')}
              className={`flex-1 rounded-full px-4 py-2.5 items-center justify-center transition-all ${activeTab === 'upcoming' ? 'bg-primary' : ''}`}
            >
              <Text className={`text-sm font-bold ${activeTab === 'upcoming' ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                Yaklaşan
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setActiveTab('past')}
              className={`flex-1 rounded-full px-4 py-2.5 items-center justify-center transition-all ${activeTab === 'past' ? 'bg-primary' : ''}`}
            >
              <Text className={`text-sm font-bold ${activeTab === 'past' ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                Geçmiş
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Content Area: Appointments */}
        <View className="gap-5 px-5 mb-8">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold text-[#111418] dark:text-white">Randevularım</Text>
            <Pressable onPress={() => router.push('/(customer)/appointments')}>
              <Text className="text-sm font-semibold text-primary">Tümünü Gör</Text>
            </Pressable>
          </View>

          {/* Appointment Card (Mock for UI Match) */}
          <View className="overflow-hidden rounded-xl bg-white dark:bg-[#1c242d] p-4 shadow-sm">
            <View className="flex-row items-start gap-4">
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1542359649-31e03cd4d909?ixlib=rb-4.0.3&auto=format&fit=crop&w=1774&q=80' }} // Placeholder image
                className="h-20 w-20 rounded-lg bg-gray-200"
              />
              <View className="flex-1 gap-1">
                <View className="flex-row items-start justify-between">
                  <View>
                    <Text className="font-bold text-lg text-[#111418] dark:text-white leading-tight">Golden Scissor</Text>
                    <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">Mehmet Usta</Text>
                  </View>
                  <View className="rounded-md bg-green-500/10 px-2 py-1">
                    <Text className="text-xs font-bold text-green-500">Onaylandı</Text>
                  </View>
                </View>

                <View className="mt-1 flex-row items-center gap-2">
                  <MaterialIcons name="calendar-today" size={18} color="#9ca3af" />
                  <Text className="text-sm text-gray-600 dark:text-gray-300">12 Ekim, 14:30</Text>
                </View>
                <Text className="text-xs text-gray-400 mt-0.5">Saç & Sakal Kesimi</Text>
              </View>
            </View>

            <View className="flex-row gap-3 border-t border-gray-100 dark:border-gray-700 pt-3 mt-3">
              <Pressable
                onPress={() => alert('Randevu iptali yakında!')}
                className="flex-1 rounded-lg bg-gray-100 dark:bg-[#2a3441] py-2.5 items-center"
              >
                <Text className="text-sm font-bold text-gray-700 dark:text-gray-300">İptal Et</Text>
              </Pressable>
              <Pressable
                onPress={() => alert('Randevu detayları yakında!')}
                className="flex-1 rounded-lg bg-primary py-2.5 items-center"
              >
                <Text className="text-sm font-bold text-white">Detaylar</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View className="gap-4 px-5">
          <Text className="text-lg font-bold text-[#111418] dark:text-white">Ayarlar</Text>
          <View className="overflow-hidden rounded-xl bg-white dark:bg-[#1c242d] shadow-sm">

            {/* Notifications */}
            <View className="flex-row items-center justify-between border-b border-gray-100 dark:border-gray-700 p-4">
              <View className="flex-row items-center gap-3">
                <View className="h-9 w-9 items-center justify-center rounded-full bg-blue-500/10">
                  <MaterialIcons name="notifications" size={20} color="#3b82f6" />
                </View>
                <Text className="font-medium text-[#111418] dark:text-white">Bildirimler</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#374151', true: COLORS.primary.DEFAULT }}
                thumbColor={'#ffffff'}
              />
            </View>

            {/* Language */}
            <Pressable
              onPress={() => alert('Dil seçimi yakında!')}
              className="flex-row items-center justify-between border-b border-gray-100 dark:border-gray-700 p-4"
            >
              <View className="flex-row items-center gap-3">
                <View className="h-9 w-9 items-center justify-center rounded-full bg-purple-500/10">
                  <MaterialIcons name="language" size={20} color="#a855f7" />
                </View>
                <Text className="font-medium text-[#111418] dark:text-white">Dil</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Text className="text-sm text-gray-400">Türkçe</Text>
                <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
              </View>
            </Pressable>

            {/* Change Role */}
            <Pressable onPress={() => router.replace('/')} className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center gap-3">
                <View className="h-9 w-9 items-center justify-center rounded-full bg-orange-500/10">
                  <MaterialIcons name="swap-horiz" size={20} color="#f97316" />
                </View>
                <Text className="font-medium text-[#111418] dark:text-white">Rol Değiştir</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
            </Pressable>

          </View>
        </View>

        {/* Logout Button */}
        <View className="mt-6 px-5 pb-8">
          <Pressable
            onPress={handleLogout}
            className="w-full flex-row items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-4 active:opacity-80"
          >
            <MaterialIcons name="logout" size={20} color="#ef4444" />
            <Text className="font-bold text-red-500">Oturum Kapat</Text>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
