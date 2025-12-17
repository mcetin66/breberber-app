import { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search as SearchIcon, X, TrendingUp, Clock, AlertCircle } from 'lucide-react-native';
import { useBusinessStore } from '@/stores/businessStore';
import BarberCard from '@/components/BarberCard';
import { COLORS } from '@/constants/theme';
import type { Barber } from '@/types';

const POPULAR_SEARCHES = [
  'Saç Kesimi',
  'Sakal Tıraşı',
  'Cilt Bakımı',
  'Renklendirme',
  'Premium',
];

const RECENT_SEARCHES = ['Golden Scissors', 'Urban Cut', 'Kadıköy'];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Use the store
  const { businesses, loading, error, searchBusinesses, fetchBusinesses } = useBusinessStore();

  useEffect(() => {
    // Initial fetch to ensure we have data if user just browses
    if (businesses.length === 0) {
      fetchBusinesses();
    }
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim() !== '') {
        setIsSearching(true);
        searchBusinesses(searchQuery);
      } else {
        setIsSearching(false);
        // calculated from client side or just show all/none? 
        // Showing all businesses when empty might be better than nothing
        if (businesses.length === 0) fetchBusinesses();
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSearchTag = (tag: string) => {
    setSearchQuery(tag);
  };

  const clearSearch = () => {
    setSearchQuery('');
    fetchBusinesses(); // Reset to all
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']} style={{ flex: 1 }}>
      <View className="px-4 py-4">
        <Text className="text-white text-2xl font-poppins-bold mb-4">Ara</Text>

        <View className="flex-row items-center bg-background-card rounded-xl px-4 py-3 border border-white/5">
          <SearchIcon size={20} color={COLORS.text.secondary} />
          <TextInput
            className="flex-1 ml-3 text-white font-poppins text-base"
            placeholder="Berber veya hizmet ara..."
            placeholderTextColor={COLORS.text.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={clearSearch}>
              <X size={20} color={COLORS.text.secondary} />
            </Pressable>
          )}
        </View>
      </View>

      {!isSearching && searchQuery.length === 0 ? (
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <TrendingUp size={20} color={COLORS.primary.DEFAULT} />
              <Text className="text-white text-lg font-poppins-bold ml-2">
                Popüler Aramalar
              </Text>
            </View>
            <View className="flex-row flex-wrap">
              {POPULAR_SEARCHES.map((tag, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleSearchTag(tag)}
                  className="bg-background-card rounded-xl px-4 py-2 mr-2 mb-2 active:bg-primary/20"
                >
                  <Text className="text-text-secondary font-poppins">{tag}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View>
            <View className="flex-row items-center mb-3">
              <Clock size={20} color={COLORS.primary.DEFAULT} />
              <Text className="text-white text-lg font-poppins-bold ml-2">
                Son Aramalar
              </Text>
            </View>
            <View className="flex-row flex-wrap">
              {RECENT_SEARCHES.map((tag, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleSearchTag(tag)}
                  className="bg-background-card rounded-xl px-4 py-2 mr-2 mb-2 active:bg-primary/20"
                >
                  <Text className="text-text-secondary font-poppins">{tag}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      ) : (
        <View className="flex-1">
          {loading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color={COLORS.primary.DEFAULT} />
              <Text className="text-text-secondary font-poppins mt-4">Aranıyor...</Text>
            </View>
          ) : error ? (
            <View className="flex-1 items-center justify-center px-8">
              <AlertCircle size={48} color={COLORS.status.error} />
              <Text className="text-error text-center font-poppins mt-4">{error}</Text>
            </View>
          ) : (
            <>
              <View className="px-4 pb-2">
                <Text className="text-text-secondary text-sm font-poppins">
                  {businesses.length} sonuç bulundu
                </Text>
              </View>

              {businesses.length > 0 ? (
                <FlatList
                  data={businesses}
                  renderItem={({ item }) => <BarberCard barber={item} />}
                  keyExtractor={item => item.id}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
                />
              ) : (
                <View className="flex-1 items-center justify-center px-8">
                  <SearchIcon size={64} color={COLORS.text.muted} />
                  <Text className="text-text-secondary text-lg font-poppins-semibold mt-4 mb-2">
                    Sonuç bulunamadı
                  </Text>
                  <Text className="text-text-muted text-sm font-poppins text-center">
                    "{searchQuery}" için sonuç bulunamadı. Farklı bir arama deneyin.
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}
