
import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList as OriginalFlashList } from '@shopify/flash-list';
const FlashList = OriginalFlashList as any;
import { MaterialIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useBusinessStore } from '@/stores/businessStore';
import { COLORS } from '@/constants/theme';
import type { Barber } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Top App Bar Component
const TopAppBar = () => (
  <View className="flex-row items-center justify-between px-4 pb-2 pt-2">
    <View className="flex-row items-center gap-2 group">
      <View className="items-center justify-center p-2 rounded-full bg-primary/10">
        <MaterialIcons name="location-pin" size={20} color={COLORS.primary.DEFAULT} />
      </View>
      <View className="flex-col">
        <Text className="text-xs text-text-muted font-medium mb-0.5">Location</Text>
        <View className="flex-row items-center gap-1">
          <Text className="text-sm font-bold text-text-DEFAULT">Istanbul, TR</Text>
          <MaterialIcons name="expand-more" size={16} color={COLORS.text.DEFAULT} />
        </View>
      </View>
    </View>

    <Pressable
      onPress={() => alert('Bildirimler yakında!')}
      className="relative items-center justify-center w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/5 active:bg-white/10"
    >
      <MaterialIcons name="notifications" size={24} color="white" />
      <View className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-[#1a1a1a]" />
    </Pressable>
  </View>
);

// Search Bar Component
const SearchBar = ({ value, onChange }: { value: string, onChange: (text: string) => void }) => (
  <View className="px-4 py-2">
    <View className="flex-row items-center w-full h-12 rounded-full bg-[#283039] border border-white/5 overflow-hidden shadow-sm">
      <View className="w-12 h-full items-center justify-center">
        <MaterialIcons name="search" size={24} color="#94a3b8" />
      </View>
      <TextInput
        className="flex-1 h-full bg-transparent text-sm font-medium text-white placeholder:text-slate-500"
        placeholder="Yakınınızda berber arayın"
        placeholderTextColor="#64748b"
        value={value}
        onChangeText={onChange}
      />
      <Pressable
        onPress={() => alert('Filtreleme seçenekleri yakında!')}
        className="w-12 h-full items-center justify-center border-l border-white/5 active:bg-white/5"
      >
        <MaterialIcons name="tune" size={24} color={COLORS.primary.DEFAULT} />
      </Pressable>
    </View>
  </View>
);

// Filter Chips Component
const FilterChips = () => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingVertical: 8 }}
    className="flex-row"
  >
    <Pressable onPress={() => alert('Sıralama: En yakın')} className="flex-row items-center justify-center gap-2 rounded-full bg-primary h-9 pl-3 pr-4 shadow-lg shadow-primary/20 active:scale-95">
      <MaterialIcons name="near-me" size={18} color="white" />
      <Text className="text-white text-xs font-bold">En yakın</Text>
    </Pressable>

    <Pressable onPress={() => alert('Sıralama: En iyi puan')} className="flex-row items-center justify-center gap-2 rounded-full bg-[#283039] border border-white/10 h-9 pl-3 pr-4 active:scale-95">
      <MaterialIcons name="star" size={18} color="#FACC15" />
      <Text className="text-slate-300 text-xs font-semibold">En iyi puan</Text>
    </Pressable>

    <Pressable onPress={() => alert('Filtre: Şimdi açık')} className="flex-row items-center justify-center gap-2 rounded-full bg-[#283039] border border-white/10 h-9 pl-3 pr-4 active:scale-95">
      <MaterialIcons name="lock-open" size={18} color="#22C55E" />
      <Text className="text-slate-300 text-xs font-semibold">Şimdi açık</Text>
    </Pressable>

    <Pressable onPress={() => alert('Kategori: Sakal')} className="flex-row items-center justify-center gap-2 rounded-full bg-[#283039] border border-white/10 h-9 pl-3 pr-4 active:scale-95">
      <MaterialIcons name="content-cut" size={18} color="#60A5FA" />
      <Text className="text-slate-300 text-xs font-semibold">Beard</Text>
    </Pressable>
  </ScrollView>
);

// Barber Card Component - Matching HTML Structure
const BarberCardItem = ({ barber }: { barber: Barber }) => {
  const router = useRouter();

  return (
    <Link href={`/detail/${barber.id}`} asChild>
      <Pressable
        className="flex-col bg-[#1a1a1a] rounded-[2rem] p-3 shadow-sm mb-5 active:scale-[0.98]"
      >
        {/* Hero Image Area */}
        <View className="relative w-full aspect-[16/9] rounded-[1.5rem] overflow-hidden bg-slate-800">
          <Image
            source={{ uri: barber.coverImage }}
            className="absolute w-full h-full"
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            className="absolute inset-0"
            start={{ x: 0.5, y: 0.4 }}
            end={{ x: 0.5, y: 1 }}
          />

          <View className={`absolute top-3 right-3 z-20 backdrop-blur-md rounded-full px-2.5 py-1 flex-row items-center gap-1 border ${barber.isOpen ? 'bg-white/10 border-white/10' : 'bg-red-500/20 border-red-500/20'}`}>
            <View className={`w-1.5 h-1.5 rounded-full ${barber.isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
            <Text className={`text-[10px] font-bold uppercase tracking-wider ${barber.isOpen ? 'text-white' : 'text-red-100'}`}>
              {barber.isOpen ? 'Open' : 'Closed'}
            </Text>
          </View>

          <View className="absolute bottom-3 left-4 z-20 flex-col">
            <Text className="text-white text-lg font-bold leading-tight shadow-sm">{barber.name}</Text>
            <Text className="text-slate-300 text-xs font-medium shadow-sm">{barber.address.split(',')[0]}</Text>
          </View>
        </View>

        {/* Card Body */}
        <View className="flex-row items-center justify-between mt-3 px-1">
          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="star" size={20} color="#FACC15" />
              <Text className="text-white font-bold text-sm">{barber.rating}</Text>
              <Text className="text-slate-400 text-xs font-medium">({barber.reviewCount})</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="near-me" size={18} color="#94a3b8" />
              <Text className="text-slate-400 text-xs font-medium">1.2 km</Text>
            </View>
          </View>

          <View className={`py-2 px-5 rounded-full ${barber.isOpen ? 'bg-primary shadow-lg shadow-primary/25' : 'bg-white/10'}`}>
            <Text className={`text-xs font-bold ${barber.isOpen ? 'text-white' : 'text-slate-300'}`}>
              {barber.isOpen ? 'Book' : 'View'}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

export default function CustomerHomeScreen() {
  const { businesses, fetchBusinesses } = useBusinessStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  // Filter Logic
  const filteredBarbers = businesses.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-[#101922]" edges={['top']}>
      <View className="flex-1">
        {/* Sticky Header Group - Simulated with simple View */}
        <View className="z-40 bg-[#101922]/95 backdrop-blur-md border-b border-white/5 pb-2">
          <TopAppBar />
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <FilterChips />
        </View>

        {/* Main Content */}
        <View className="flex-1 px-4 py-6 pb-32">
          <View className="flex-row items-center justify-between mb-5 px-1">
            <Text className="text-lg font-bold text-white">Popüler Berberler</Text>
            <Pressable onPress={() => alert('Tümünü gör: Yakında!')}>
              <Text className="text-xs font-bold text-primary">Tümünü Gör</Text>
            </Pressable>
          </View>

          {/* @ts-ignore */}
          <FlashList
            data={filteredBarbers}
            renderItem={({ item }: { item: Barber }) => <BarberCardItem barber={item} />}
            estimatedItemSize={280}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 150 }}
            ListEmptyComponent={() => (
              <View className="mt-8 pt-8 border-t border-dashed border-slate-700 flex-col items-center justify-center opacity-60">
                <View className="w-16 h-16 rounded-full bg-[#1a1a1a] items-center justify-center mb-4">
                  <MaterialIcons name="location-off" size={32} color="#64748b" />
                </View>
                <Text className="text-white text-base font-bold mb-1">Yakınında berber yok</Text>
                <Text className="text-slate-400 text-sm mb-4 text-center px-8">Maalesef henüz hiç berber bulunamadı.</Text>
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
