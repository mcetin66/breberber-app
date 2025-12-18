import { View, Text, Pressable, ScrollView, Image, Dimensions } from 'react-native';
import { StandardScreen } from '@/components/ui/StandardScreen';
import { COLORS } from '@/constants/theme';
import { Menu, Bell, ChevronDown, Plus, LayoutGrid, List, Clock, Coffee } from 'lucide-react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

// Mock Data
const DAYS = [
  { day: 'Pzt', date: '10' },
  { day: 'Sal', date: '11' },
  { day: 'Çar', date: '12', active: true },
  { day: 'Per', date: '13' },
  { day: 'Cum', date: '14' },
];

const STAFF_AVATARS = [
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/men/44.jpg',
  'https://randomuser.me/api/portraits/men/85.jpg',
];

const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

export default function BusinessCalendarScreen() {
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('timeline');

  return (
    <StandardScreen
      title="Haziran 2024"
      subtitle="Pazartesi, 12"
      rightElement={
        <View className="flex-row items-center gap-3">
          <Pressable className="relative w-10 h-10 items-center justify-center rounded-full bg-transparent active:bg-white/10">
            <Bell size={24} color="#9CA3AF" />
            <View className="absolute top-2 right-2 w-2 h-2 bg-[#d4af35] rounded-full" />
          </Pressable>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
            className="w-8 h-8 rounded-full border border-[#d4af35]/50"
          />
        </View>
      }
    // Add a FAB via absolute positioning in children, or use a separate View if needed. 
    // StandardScreen doesn't strictly support FAB prop but we can render it as absolute.
    >
      {/* 1. View Switcher */}
      <View className="mb-4">
        <View className="flex-row bg-[#1E1E1E] p-1 rounded-xl">
          <Pressable
            onPress={() => setViewMode('grid')}
            className={`flex-1 py-2 items-center rounded-lg ${viewMode === 'grid' ? 'bg-[#d4af35]' : 'bg-transparent'}`}
          >
            <Text className={`text-sm font-medium ${viewMode === 'grid' ? 'text-black' : 'text-gray-400'}`}>Izgara</Text>
          </Pressable>
          <Pressable
            onPress={() => setViewMode('timeline')}
            className={`flex-1 py-2 flex-row items-center justify-center gap-2 rounded-lg ${viewMode === 'timeline' ? 'bg-[#d4af35]' : 'bg-transparent'}`}
          >
            <List size={18} color={viewMode === 'timeline' ? 'black' : '#9CA3AF'} />
            <Text className={`text-sm font-medium ${viewMode === 'timeline' ? 'text-black' : 'text-gray-400'}`}>Zaman Çizelgesi</Text>
          </Pressable>
        </View>
      </View>

      {/* 2. Staff & Day Filter */}
      <View className="gap-4 border-b border-white/5 pb-4 mb-2">
        {/* Staff */}
        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Personel Filtresi</Text>
          <View className="flex-row items-center pl-2">
            {STAFF_AVATARS.map((uri, i) => (
              <Image
                key={i}
                source={{ uri }}
                className="w-10 h-10 rounded-full border-2 border-[#121212] -ml-3"
              />
            ))}
            <Pressable className="w-10 h-10 rounded-full border-2 border-[#121212] bg-[#1E1E1E] -ml-3 items-center justify-center">
              <Plus size={16} color="gray" />
            </Pressable>
          </View>
        </View>

        {/* Days */}
        <View className="flex-row justify-between">
          {DAYS.map((d, i) => (
            <Pressable
              key={i}
              className={`items-center justify-center w-12 h-14 rounded-xl ${d.active ? 'bg-gradient-to-br from-[#d4af35] to-orange-600' : 'bg-transparent hover:bg-[#1E1E1E]'}`}
              style={d.active ? { backgroundColor: '#d4af35' } : {}}
            >
              <Text className={`text-[10px] uppercase font-medium ${d.active ? 'text-black' : 'text-gray-500'}`}>{d.day}</Text>
              <Text className={`text-lg font-bold ${d.active ? 'text-black' : 'text-white'}`}>{d.date}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* 3. Timeline Grid */}
      <View className="relative min-h-[800px] flex-row">
        {/* Time Column */}
        <View className="w-12 border-r border-white/10 pt-4 gap-20">
          {TIME_SLOTS.map((t, i) => (
            <Text key={i} className="text-xs text-gray-500 font-medium text-center h-4">{t}</Text>
          ))}
        </View>

        {/* Events Area */}
        <View className="flex-1 relative pt-4 pl-2">
          {/* Horizontal Lines */}
          {TIME_SLOTS.map((_, i) => (
            <View key={i} className="absolute w-full h-[1px] bg-white/5" style={{ top: 16 + (i * 84) }} />
          ))}

          {/* Current Time Line Mock */}
          <View className="absolute w-full border-t border-red-500 z-10 top-[220px] pointer-events-none flex-row items-center">
            <View className="w-2 h-2 bg-red-500 rounded-full -ml-1" />
            <View className="bg-red-500/10 px-1 rounded ml-1">
              <Text className="text-red-500 text-[10px] font-bold">11:15</Text>
            </View>
          </View>

          {/* Event 1: Appointment (Green-ish/Gold) */}
          <View className="absolute top-[30px] left-2 right-2 h-[80px] rounded-lg border-l-4 border-green-600 bg-[#1E1E1E] p-2 justify-between">
            <View className="flex-row justify-between items-start">
              <View>
                <Text className="text-white text-sm font-bold truncate">Ahmet Yılmaz</Text>
                <Text className="text-gray-400 text-xs">Saç Kesimi & Yıkama</Text>
              </View>
              <View className="bg-green-600/20 px-1.5 py-0.5 rounded">
                <Text className="text-green-600 text-[10px] font-bold">Randevu</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-1">
              <Clock size={12} color="gray" />
              <Text className="text-gray-500 text-xs">09:15 - 10:15</Text>
              <Text className="text-gray-600 text-xs mx-1">•</Text>
              <Text className="text-[#d4af35] text-xs font-medium">Mehmet</Text>
            </View>
          </View>

          {/* Event 2: Walk-in (Orange) */}
          <View className="absolute top-[140px] left-2 right-10 h-[60px] rounded-lg border-l-4 border-orange-500 bg-[#1E1E1E] p-2 justify-between">
            <View className="flex-row justify-between items-start">
              <View>
                <Text className="text-white text-sm font-bold truncate">Misafir (Walk-in)</Text>
                <Text className="text-gray-400 text-xs">Sakal Tıraşı</Text>
              </View>
              <View className="bg-orange-500/20 px-1.5 py-0.5 rounded">
                <Text className="text-orange-500 text-[10px] font-bold">Walk-in</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-1">
              <Clock size={12} color="gray" />
              <Text className="text-gray-500 text-xs">11:00 - 11:45</Text>
            </View>
          </View>

          {/* Event 3: Break (Gray) */}
          <View className="absolute top-[280px] left-2 right-2 h-[40px] rounded-lg bg-[#1E1E1E]/50 border border-gray-700 border-dashed flex-row items-center px-3">
            <Coffee size={16} color="gray" className="mr-2" />
            <Text className="text-gray-400 text-xs font-medium uppercase tracking-wider">Öğle Molası (Herkes)</Text>
          </View>
        </View>
      </View>

      {/* FAB */}
      <Pressable className="absolute bottom-6 right-6 w-14 h-14 bg-[#d4af35] rounded-full justify-center items-center shadow-lg shadow-[#d4af35]/40 active:scale-95 z-50">
        <Plus size={30} color="#121212" />
      </Pressable>

    </StandardScreen>
  );
}
