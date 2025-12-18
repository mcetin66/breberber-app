import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, Image, Dimensions, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/theme';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Mock Data
const FEATURED_RESULTS = [
  {
    id: 1,
    name: 'Emirgan Beyefendisi',
    location: 'Emirgan, İstanbul • 2.4 km',
    rating: 5.0,
    reviewCount: 42,
    image: 'https://images.unsplash.com/photo-1503951914875-befea74701c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    badge: 'LÜKS'
  },
  {
    id: 2,
    name: 'Vogue Hair Design',
    location: 'Etiler, İstanbul • 3.1 km',
    rating: 4.8,
    reviewCount: 88,
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    badge: 'POPÜLER'
  }
];

const ALL_RESULTS = [
  {
    id: 3,
    name: 'Golden Scissor Studio',
    location: 'Beşiktaş, İstanbul • 1.2 km',
    rating: 4.9,
    reviewCount: 120,
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    tags: ['Saç Kesimi', 'Sakal Tasarım', 'Cilt Bakımı'],
    isPremium: true
  },
  {
    id: 4,
    name: "Royal Gentlemen's Club",
    location: 'Nişantaşı, İstanbul • 0.8 km',
    rating: 4.8,
    reviewCount: 85,
    image: 'https://images.unsplash.com/photo-1599351431202-6e0000a4024a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    tags: ['VIP Oda', 'Masaj'],
    isPremium: false
  }
];

const EXPERTS = [
  {
    id: 5,
    name: 'Ahmet Demir',
    salon: 'Black Scissors Salon',
    location: 'Levent',
    rating: 4.9,
    priceStart: 350,
    image: 'https://randomuser.me/api/portraits/men/32.jpg'
  }
];

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
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
            {FEATURED_RESULTS.map((item) => (
              <Pressable
                key={item.id}
                className="w-[280px] bg-[#1E1E1E] rounded-xl overflow-hidden border border-primary/20"
                onPress={() => router.push(`/(customer)/business/${item.id}`)}
              >
                <View className="h-40 w-full relative">
                  <Image source={{ uri: item.image }} className="w-full h-full" resizeMode="cover" />
                  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} className="absolute inset-0" />
                  <View className="absolute top-2 right-2 bg-primary px-2 py-1 rounded-md">
                    <Text className="text-[#121212] text-xs font-bold">{item.badge}</Text>
                  </View>
                </View>
                <View className="p-3">
                  <Text className="text-white text-lg font-bold truncate">{item.name}</Text>
                  <Text className="text-gray-400 text-sm truncate">{item.location}</Text>
                  <View className="flex-row items-center gap-1 mt-2">
                    <MaterialIcons name="star" size={16} color={COLORS.primary.DEFAULT} />
                    <Text className="text-white text-sm font-semibold">{item.rating}</Text>
                    <Text className="text-gray-500 text-xs">({item.reviewCount} Yorum)</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View className="h-[1px] bg-[#333] mx-4 my-2" />

        {/* All Results (Vertical) */}
        <View className="px-4 pt-2 gap-4">
          <Text className="text-white text-xl font-bold font-serif">Tüm Sonuçlar</Text>

          {ALL_RESULTS.map((item) => (
            <Pressable
              key={item.id}
              className="bg-[#1E1E1E] rounded-xl overflow-hidden border border-[#333]"
              onPress={() => router.push(`/(customer)/business/${item.id}`)}
            >
              <View className="h-48 w-full relative">
                <Image source={{ uri: item.image }} className="w-full h-full" resizeMode="cover" />
                <LinearGradient colors={['rgba(0,0,0,0.9)', 'rgba(0,0,0,0.2)', 'transparent']} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} className="absolute inset-0" />
                <View className="absolute top-3 right-3 bg-black/40 p-1.5 rounded-full backdrop-blur-sm">
                  <MaterialIcons name="favorite-border" size={20} color="white" />
                </View>
                <View className="absolute bottom-3 left-3">
                  {item.isPremium && <Text className="text-primary text-xs font-bold tracking-wider mb-0.5">PREMIUM PARTNER</Text>}
                  <Text className="text-white text-xl font-bold font-serif">{item.name}</Text>
                </View>
              </View>
              <View className="p-4">
                <View className="mb-3">
                  <View className="flex-row items-center gap-1 mb-1">
                    <MaterialIcons name="location-on" size={16} color="#9ca3af" />
                    <Text className="text-gray-400 text-sm">{item.location}</Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <MaterialIcons name="star" size={16} color={COLORS.primary.DEFAULT} />
                    <Text className="text-white text-sm font-semibold">{item.rating}</Text>
                    <Text className="text-gray-500 text-xs underline">({item.reviewCount} Yorum)</Text>
                  </View>
                </View>
                <View className="flex-row gap-2 mb-4">
                  {item.tags.map((tag, idx) => (
                    <View key={idx} className="bg-[#2A2A2A] px-2 py-1 rounded border border-[#333]">
                      <Text className="text-xs text-gray-400">{tag}</Text>
                    </View>
                  ))}
                </View>
                <Pressable className="w-full h-10 bg-primary rounded-lg items-center justify-center">
                  <Text className="text-[#121212] text-sm font-bold">Randevu Al</Text>
                </Pressable>
              </View>
            </Pressable>
          ))}

          {/* Expert Card Variation */}
          {EXPERTS.map((expert) => (
            <Pressable
              key={expert.id}
              className="bg-[#1E1E1E] rounded-xl border border-[#333] p-3 flex-row gap-3 items-center"
              onPress={() => { }} // Could link to expert profile
            >
              <Image source={{ uri: expert.image }} className="w-20 h-20 rounded-lg border border-[#333]" resizeMode="cover" />
              <View className="flex-1">
                <View className="flex-row justify-between items-start">
                  <View>
                    <Text className="text-primary text-xs font-bold uppercase tracking-wide">Özel Uzman</Text>
                    <Text className="text-white text-base font-bold">{expert.name}</Text>
                  </View>
                  <View className="flex-row items-center bg-[#2A2A2A] px-1.5 py-0.5 rounded gap-1">
                    <MaterialIcons name="star" size={12} color={COLORS.primary.DEFAULT} />
                    <Text className="text-white text-xs font-bold">{expert.rating}</Text>
                  </View>
                </View>
                <Text className="text-gray-400 text-xs mt-1">{expert.salon} • {expert.location}</Text>
                <View className="mt-2 flex-row items-center justify-between">
                  <View className="bg-[#2A2A2A] px-2 py-1 rounded border border-[#333]">
                    <Text className="text-white text-xs font-medium">₺ {expert.priceStart}'den başlar</Text>
                  </View>
                  <Pressable className="h-7 px-3 bg-[#333] border border-primary/30 rounded justify-center">
                    <Text className="text-primary text-xs font-bold">İncele</Text>
                  </Pressable>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
