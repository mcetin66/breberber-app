import { View, Text, TextInput, Pressable, Image, Switch, ScrollView, ActivityIndicator } from 'react-native';
import { StandardScreen } from '@/components/ui/StandardScreen';
import { COLORS } from '@/constants/theme';
import { Search, Plus, Edit2, UserPlus, Filter, Users } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase';

const FILTER_CHIPS = ['Tümü', 'Berberler', 'Kuaförler', 'Manikür'];

export default function BusinessStaffScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tümü');

  const isStaff = user?.role === 'staff';

  useEffect(() => {
    fetchStaff();
  }, [user]);

  const fetchStaff = async () => {
    if (!user?.barberId) return;
    setLoading(true);
    try {
      // If user is Staff, we only want to fetch THEIR record
      // Ideally we query by business_id AND (if staff) by email or profile_id
      // Assuming business_staff has email that matches user.email

      let query = supabase
        .from('business_staff')
        .select('*')
        .eq('business_id', user.barberId);

      if (isStaff && user.email) {
        query = query.eq('email', user.email);
      }

      const { data, error } = await query;

      if (error) throw error;
      setStaffList(data || []);

    } catch (err) {
      console.error('Error fetching staff:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStaff = staffList.filter(staff => {
    const matchesSearch = staff.name?.toLowerCase().includes(searchQuery.toLowerCase()) || staff.role?.toLowerCase().includes(searchQuery.toLowerCase());
    // Basic category filter mapping (if category exists in DB, otherwise ignore)
    const matchesFilter = activeFilter === 'Tümü';
    return matchesSearch && matchesFilter;
  });

  return (
    <StandardScreen
      title="Personel Yönetimi"
      headerIcon={<Users size={20} color="#121212" />}
      rightElement={
        !isStaff ? (
          <Pressable className="w-10 h-10 rounded-full bg-[#d4af35] items-center justify-center shadow-[0_0_15px_rgba(212,175,53,0.4)] active:scale-95">
            <Plus size={24} color="#121212" />
          </Pressable>
        ) : null
      }
    >
      {/* Search & Filter - Only show for Owner */}
      {!isStaff && (
        <View className="mb-6 gap-4">
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
      )}

      {/* List */}
      <View className="gap-4 pb-24">
        <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
          {isStaff ? 'Profilim' : `Personel Listesi (${filteredStaff.length})`}
        </Text>

        {loading ? (
          <ActivityIndicator color={COLORS.primary.DEFAULT} size="large" className="mt-10" />
        ) : filteredStaff.length === 0 ? (
          <Text className="text-gray-400 text-center mt-10">Kayıt bulunamadı.</Text>
        ) : (
          filteredStaff.map((staff) => (
            <View
              key={staff.id}
              className={`relative flex-row items-center p-3 bg-[#1E1E1E] rounded-2xl border border-white/5 shadow-sm ${!staff.is_active ? 'opacity-70' : ''}`}
            >
              <View className="relative">
                {staff.avatar_url ? (
                  <Image
                    source={{ uri: staff.avatar_url }}
                    className={`w-14 h-14 rounded-full border-2 ${staff.is_active ? 'border-[#2a2a2a]' : 'border-[#2a2a2a] grayscale'}`}
                  />
                ) : (
                  <View className="w-14 h-14 rounded-full bg-zinc-800 items-center justify-center border-2 border-zinc-700">
                    <Text className="text-zinc-500 font-bold text-lg">{staff.name?.charAt(0)}</Text>
                  </View>
                )}

                <View className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#1E1E1E] ${staff.is_active ? 'bg-green-500' : 'bg-gray-500'}`} />
              </View>

              <View className="flex-1 ml-4 justify-center">
                <Text className={`text-base font-bold leading-tight ${staff.is_active ? 'text-white' : 'text-gray-300'}`}>
                  {staff.name}
                </Text>
                <Text className={`text-xs font-medium ${staff.is_active ? 'text-[#d4af35]/80' : 'text-gray-500'}`}>
                  {staff.role || 'Personel'}
                </Text>
                {isStaff && (
                  <Text className="text-[10px] text-zinc-500 mt-1">{staff.email}</Text>
                )}
              </View>

              <View className="flex-row items-center gap-3 pl-2">
                {!isStaff && (
                  <>
                    <Pressable className="p-2 rounded-full hover:bg-white/5 active:bg-white/10">
                      <Edit2 size={18} color="#9CA3AF" />
                    </Pressable>
                    <Switch
                      value={staff.is_active}
                      trackColor={{ false: '#374151', true: COLORS.primary.DEFAULT }}
                      thumbColor={staff.is_active ? '#121212' : '#f4f3f4'}
                      ios_backgroundColor="#374151"
                      style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                    />
                  </>
                )}
              </View>
            </View>
          ))
        )}
      </View>

    </StandardScreen>
  );
}
