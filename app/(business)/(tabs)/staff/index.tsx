import { View, Text, TextInput, Pressable, Image, Switch, ScrollView } from 'react-native';
import { StandardScreen } from '@/components/ui/StandardScreen';
import { COLORS } from '@/constants/theme';
import { Search, Plus, Edit2, UserPlus, Filter } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const FILTER_CHIPS = ['Tümü', 'Berberler', 'Kuaförler', 'Manikür'];

const STAFF_DATA = [
  {
    id: '1',
    name: 'Burak Özçivit',
    role: 'Kıdemli Stilist',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    isActive: true,
    category: 'Berberler'
  },
  {
    id: '2',
    name: 'Ahmet Yılmaz',
    role: 'Baş Berber',
    image: 'https://randomuser.me/api/portraits/men/44.jpg',
    isActive: true,
    category: 'Berberler'
  },
  {
    id: '3',
    name: 'Zeynep Demir',
    role: 'Saç Uzmanı',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    isActive: false,
    category: 'Kuaförler'
  },
  {
    id: '4',
    name: 'Can Yıldız',
    role: 'Asistan',
    image: 'https://randomuser.me/api/portraits/men/85.jpg',
    isActive: true,
    isNew: true,
    category: 'Berberler'
  }
];

export default function BusinessStaffScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tümü');

  const filteredStaff = STAFF_DATA.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) || staff.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'Tümü' || staff.category === activeFilter || (activeFilter === 'Kuaförler' && staff.category === 'Kuaförler'); // simplified logic
    return matchesSearch && matchesFilter;
  });

  return (
    <StandardScreen
      title="Personel Yönetimi"
      rightElement={
        <Pressable className="w-10 h-10 rounded-full bg-[#d4af35] items-center justify-center shadow-[0_0_15px_rgba(212,175,53,0.4)] active:scale-95">
          <Plus size={24} color="#121212" />
        </Pressable>
      }
    >
      {/* Search & Filter */}
      <View className="mb-6 gap-4">
        {/* Search Bar */}
        <View className="relative">
          <View className="absolute inset-y-0 left-0 flex items-center justify-center pl-4 pointer-events-none z-10">
            <Search size={20} color="#6B7280" />
          </View>
          <TextInput
            className="w-full h-12 bg-[#1E1E1E] border border-white/5 rounded-2xl pl-12 pr-4 text-white text-sm placeholder-gray-500 shadow-sm"
            placeholder="Personel ara..."
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
          {FILTER_CHIPS.map(chip => {
            const isActive = activeFilter === chip;
            return (
              <Pressable
                key={chip}
                onPress={() => setActiveFilter(chip)}
                className={`h-9 px-5 rounded-full items-center justify-center border ${isActive
                    ? 'bg-[#d4af35] border-[#d4af35]'
                    : 'bg-[#1E1E1E] border-white/10'
                  }`}
              >
                <Text className={`text-sm font-semibold ${isActive ? 'text-[#121212]' : 'text-gray-300'}`}>
                  {chip}
                </Text>
              </Pressable>
            )
          })}
        </ScrollView>
      </View>

      {/* List */}
      <View className="gap-4 pb-24">
        <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
          Personel Listesi ({filteredStaff.length})
        </Text>

        {filteredStaff.map((staff) => (
          <View
            key={staff.id}
            className={`relative flex-row items-center p-3 bg-[#1E1E1E] rounded-2xl border border-white/5 shadow-sm ${!staff.isActive ? 'opacity-70' : ''}`}
          >
            {/* Glow effect for active items (simulated with standard view for now, could be gradient) */}
            {staff.isActive && (
              <View className="absolute -inset-0.5 bg-[#d4af35]/5 rounded-2xl -z-10" />
            )}

            <View className="relative">
              <Image
                source={{ uri: staff.image }}
                className={`w-14 h-14 rounded-full border-2 ${staff.isActive ? 'border-[#2a2a2a]' : 'border-[#2a2a2a] grayscale'}`}
              />
              {staff.isNew && (
                <View className="absolute -top-1 -left-1 bg-[#d4af35] px-1.5 py-0.5 rounded shadow-sm z-10">
                  <Text className="text-[#121212] text-[9px] font-bold">YENİ</Text>
                </View>
              )}
              <View className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#1E1E1E] ${staff.isActive ? 'bg-green-500' : 'bg-gray-500'}`} />
            </View>

            <View className="flex-1 ml-4 justify-center">
              <Text className={`text-base font-bold leading-tight ${staff.isActive ? 'text-white' : 'text-gray-300'}`}>
                {staff.name}
              </Text>
              <Text className={`text-xs font-medium ${staff.isActive ? 'text-[#d4af35]/80' : 'text-gray-500'}`}>
                {staff.role}
              </Text>
            </View>

            <View className="flex-row items-center gap-3 pl-2">
              <Pressable className="p-2 rounded-full hover:bg-white/5 active:bg-white/10">
                <Edit2 size={18} color="#9CA3AF" />
              </Pressable>
              <Switch
                value={staff.isActive}
                trackColor={{ false: '#374151', true: COLORS.primary.DEFAULT }}
                thumbColor={staff.isActive ? '#121212' : '#f4f3f4'}
                ios_backgroundColor="#374151"
                style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
              />
            </View>
          </View>
        ))}
      </View>

    </StandardScreen>
  );
}
