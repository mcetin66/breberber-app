import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, Image, Dimensions, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/theme';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { businessService } from '@/services/businesses';
import type { Database } from '@/types/database';

type Business = Database['public']['Tables']['businesses']['Row'];

const TABS = [
  { id: 'salons', label: 'Salonlar' },
  { id: 'services', label: 'Hizmetler' },
  { id: 'experts', label: 'Uzmanlar' },
];

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('salons');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBusinesses();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        searchBusinesses(searchQuery);
      } else {
        loadBusinesses();
      }
    }, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const loadBusinesses = async () => {
    try {
      const data = await businessService.getAll();
      setBusinesses(data);
    } catch (error) {
      console.error('Error loading businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchBusinesses = async (query: string) => {
    setLoading(true);
    try {
      const data = await businessService.getAll({ search: query });
      setBusinesses(data);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  // Split for display sections
  const featuredBusinesses = businesses.filter(b => (b.rating ?? 0) >= 4.5).slice(0, 3);
  const allBusinesses = businesses;

  return (
    <View className="flex-1 bg-[#121212]">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header Section */}
      <SafeAreaView edges={['top']} className="bg-[#121212]/95 border-b border-[#333] z-50">
        <View className="px-4 pb-2 pt-2">
          <View className="flex-row items-center bg-[#1E1E1E] rounded-xl h-12 border border-[#333] mb-3">
            <View className="pl-4 pr-2">
              <MaterialIcons name="search" size={24} color={COLORS.primary.DEFAULT} />
            </View>
            <TextInput
              className="flex-1 text-white text-base h-full"
              placeholder="Salon, hizmet veya uzman ara..."
              placeholderTextColor="#6a7785"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={false}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')} className="pr-4">
                <MaterialIcons name="cancel" size={20} color="#6a7785" />
              </Pressable>
            )}
            <Pressable onPress={() => router.back()} className="pr-4 border-l border-[#333] pl-3 ml-1">
              <Text className="text-gray-400 text-sm">İptal</Text>
            </Pressable>
          </View>

          {/* Tabs */}
          <View className="flex-row bg-[#1E1E1E] p-1 rounded-lg border border-[#333]">
            {TABS.map((tab) => (
              <Pressable
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                className={`flex-1 py-1.5 items-center justify-center rounded-[6px] ${activeTab === tab.id ? 'bg-primary' : 'bg-transparent'}`}
              >
                <Text className={`text-sm font-medium ${activeTab === tab.id ? 'text-[#121212]' : 'text-gray-400'}`}>
                  {tab.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Stats & Filter */}
        <View className="flex-row justify-between items-center px-4 py-3">
          <Text className="text-gray-400 text-sm">24 salon bulundu</Text>
          <Pressable className="flex-row items-center gap-1">
            <MaterialIcons name="tune" size={18} color={COLORS.primary.DEFAULT} />
            <Text className="text-primary text-sm font-medium">Filtrele</Text>
          </Pressable>
        </View>

        {/* Featured Section (Horizontal) */}
        <View className="px-4 mb-2">
          <Text className="text-white text-xl font-bold mb-3 font-serif">Öne Çıkanlar</Text>
          {loading ? (
            <View className="h-40 items-center justify-center">
              <ActivityIndicator color={COLORS.primary.DEFAULT} />
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
              {featuredBusinesses.map((business) => (
                <Pressable
                  key={business.id}
                  className="w-[280px] bg-[#1E1E1E] rounded-xl overflow-hidden border border-primary/20"
                  onPress={() => router.push(`/(customer)/business/${business.id}`)}
                >
                  <View className="h-40 w-full relative">
                    <Image source={{ uri: business.cover_url || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800' }} className="w-full h-full" resizeMode="cover" />
                    <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} className="absolute inset-0" />
                    <View className="absolute top-2 right-2 bg-primary px-2 py-1 rounded-md">
                      <Text className="text-[#121212] text-xs font-bold">{(business.rating ?? 0) >= 4.9 ? 'LÜKS' : 'POPÜLER'}</Text>
                    </View>
                  </View>
                  <View className="p-3">
                    <Text className="text-white text-lg font-bold truncate">{business.name}</Text>
                    <Text className="text-gray-400 text-sm truncate">{business.city || 'Türkiye'}</Text>
                    <View className="flex-row items-center gap-1 mt-2">
                      <MaterialIcons name="star" size={16} color={COLORS.primary.DEFAULT} />
                      <Text className="text-white text-sm font-semibold">{business.rating?.toFixed(1) || '0.0'}</Text>
                      <Text className="text-gray-500 text-xs">({business.review_count || 0} Yorum)</Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>

        <View className="h-[1px] bg-[#333] mx-4 my-2" />

        {/* All Results (Vertical) */}
        <View className="px-4 pt-2 gap-4">
          <Text className="text-white text-xl font-bold font-serif">Tüm Sonuçlar</Text>

          {loading ? (
            <View className="py-8 items-center">
              <ActivityIndicator color={COLORS.primary.DEFAULT} />
            </View>
          ) : allBusinesses.length === 0 ? (
            <View className="py-8 items-center">
              <Text className="text-gray-400 text-center">Sonuç bulunamadı</Text>
            </View>
          ) : (
            allBusinesses.map((business: Business) => (
              <Pressable
                key={business.id}
                className="bg-[#1E1E1E] rounded-xl overflow-hidden border border-[#333]"
                onPress={() => router.push(`/(customer)/business/${business.id}`)}
              >
                <View className="h-48 w-full relative">
                  <Image source={{ uri: business.cover_url || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800' }} className="w-full h-full" resizeMode="cover" />
                  <LinearGradient colors={['rgba(0,0,0,0.9)', 'rgba(0,0,0,0.2)', 'transparent']} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} className="absolute inset-0" />
                  <View className="absolute top-3 right-3 bg-black/40 p-1.5 rounded-full backdrop-blur-sm">
                    <MaterialIcons name="favorite-border" size={20} color="white" />
                  </View>
                  <View className="absolute bottom-3 left-3">
                    {(business.rating ?? 0) >= 4.5 && <Text className="text-primary text-xs font-bold tracking-wider mb-0.5">PREMIUM PARTNER</Text>}
                    <Text className="text-white text-xl font-bold font-serif">{business.name}</Text>
                  </View>
                </View>
                <View className="p-4">
                  <View className="mb-3">
                    <View className="flex-row items-center gap-1 mb-1">
                      <MaterialIcons name="location-on" size={16} color="#9ca3af" />
                      <Text className="text-gray-400 text-sm">{business.city || 'Türkiye'}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <MaterialIcons name="star" size={16} color={COLORS.primary.DEFAULT} />
                      <Text className="text-white text-sm font-semibold">{business.rating?.toFixed(1) || '0.0'}</Text>
                      <Text className="text-gray-500 text-xs underline">({business.review_count || 0} Yorum)</Text>
                    </View>
                  </View>
                  <View className="flex-row gap-2 mb-4">
                    <View className="bg-[#2A2A2A] px-2 py-1 rounded border border-[#333]">
                      <Text className="text-xs text-gray-400">Salon</Text>
                    </View>
                  </View>
                  <Pressable
                    className="w-full h-10 bg-primary rounded-lg items-center justify-center"
                    onPress={() => router.push(`/(customer)/business/${business.id}`)}
                  >
                    <Text className="text-[#121212] text-sm font-bold">Randevu Al</Text>
                  </Pressable>
                </View>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
