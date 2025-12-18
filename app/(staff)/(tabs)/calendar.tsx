import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar as CalendarIcon, Clock, MoreHorizontal, User, Filter, ChevronLeft, ChevronRight, Plus } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const STAFF_MEMBERS = [
  { id: 'all', name: 'Tümü', image: null },
  { id: '1', name: 'Ahmet', image: 'https://randomuser.me/api/portraits/men/32.jpg', status: 'online' },
  { id: '2', name: 'Selin', image: 'https://randomuser.me/api/portraits/women/44.jpg', status: 'offline' },
  { id: '3', name: 'Mehmet', image: 'https://randomuser.me/api/portraits/men/86.jpg', status: 'busy' },
];

const APPOINTMENTS = [
  {
    id: '1',
    startTime: '10:00',
    endTime: '11:00',
    customer: 'Ali Yılmaz',
    service: 'Saç Kesimi',
    status: 'confirmed', // confirmed, in_progress, completed, break
    price: '350₺',
    duration: '60 dk',
    staffId: '1'
  },
  {
    id: '2',
    startTime: '12:30',
    endTime: '13:30',
    status: 'break',
    title: 'Öğle Arası',
    subtitle: 'Personel Molası',
    staffId: '1'
  },
  {
    id: '3',
    startTime: '15:00',
    endTime: '16:30',
    customer: 'Canan Demir',
    service: 'Saç Boyama & Bakım',
    status: 'in_progress',
    price: '',
    duration: '90 dk',
    isVip: true,
    staffId: '2'
  }
];

const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

export default function StaffCalendarScreen() {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [selectedStaff, setSelectedStaff] = useState('1'); // Default to Ahmet
  const router = useRouter();

  const renderAppointmentCard = (apt: any) => {
    if (apt.status === 'break') {
      return (
        <View className="flex-row items-center bg-[#1E1E1E]/50 rounded-xl p-3 border border-white/5 border-dashed">
          <View className="w-8 h-8 rounded-full bg-white/5 items-center justify-center mr-3">
            <Clock size={16} color="#9ca3af" />
          </View>
          <View>
            <Text className="text-gray-300 font-medium text-sm">{apt.title}</Text>
            <Text className="text-gray-500 text-xs">{apt.subtitle}</Text>
          </View>
        </View>
      );
    }

    const isConfirm = apt.status === 'confirmed';
    const isInProgress = apt.status === 'in_progress';

    return (
      <View className={`bg-[#1E1E1E] rounded-xl p-3 border ${isInProgress ? 'border-primary/50' : 'border-l-4 border-l-primary border-t border-r border-b border-white/5'} shadow-sm relative overflow-hidden`}>
        {isInProgress && (
          <View className="absolute bottom-0 left-0 h-0.5 w-full bg-primary/20">
            <View className="h-full bg-primary w-1/3" />
          </View>
        )}

        <View className="flex-row justify-between items-start mb-2">
          <View>
            <Text className="text-white font-bold text-base leading-tight">{apt.customer}</Text>
            <Text className="text-primary text-xs font-medium mt-0.5">{apt.service}</Text>
          </View>
          <View className={`px-2 py-0.5 rounded border ${isInProgress ? 'bg-green-500/10 border-green-500/20' : 'bg-primary/20 border-primary/20'}`}>
            <Text className={`text-[10px] font-bold uppercase tracking-wide ${isInProgress ? 'text-green-400' : 'text-primary'}`}>
              {isInProgress ? 'İşlemde' : 'Onaylandı'}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-4 mt-2">
          <View className="flex-row items-center gap-1.5">
            <Clock size={14} color="#9ca3af" />
            <Text className="text-xs text-gray-400">{apt.duration}</Text>
          </View>
          {apt.price && (
            <View className="flex-row items-center gap-1.5">
              <Text className="text-xs text-gray-400 font-medium">{apt.price}</Text>
            </View>
          )}
          {apt.isVip && (
            <View className="flex-row items-center gap-1.5">
              <User size={14} color="#9ca3af" />
              <Text className="text-xs text-gray-400">VIP</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-[#121212]">
      {/* Header */}
      <SafeAreaView edges={['top']} className="bg-[#121212] z-20">
        <View className="flex-row justify-between items-center px-5 py-4">
          <View>
            <Text className="text-primary text-xs font-bold tracking-widest uppercase mb-0.5">BUGÜN</Text>
            <View className="flex-row items-center gap-2">
              <Text className="text-2xl font-bold tracking-tight text-white">24 Ekim, Salı</Text>
            </View>
          </View>
          <Pressable className="w-10 h-10 rounded-full bg-[#1E1E1E] border border-white/10 items-center justify-center">
            <CalendarIcon size={20} color={COLORS.primary.DEFAULT} />
          </Pressable>
        </View>

        {/* View Toggle */}
        <View className="px-5 pb-3">
          <View className="flex-row bg-[#1E1E1E] p-1 rounded-lg border border-white/5">
            <Pressable
              onPress={() => setViewMode('daily')}
              className={`flex-1 items-center justify-center py-1.5 rounded-[4px] ${viewMode === 'daily' ? 'bg-primary' : 'bg-transparent'}`}
            >
              <Text className={`text-sm font-semibold ${viewMode === 'daily' ? 'text-[#121212]' : 'text-gray-400'}`}>Günlük</Text>
            </Pressable>
            <Pressable
              onPress={() => setViewMode('weekly')}
              className={`flex-1 items-center justify-center py-1.5 rounded-[4px] ${viewMode === 'weekly' ? 'bg-primary' : 'bg-transparent'}`}
            >
              <Text className={`text-sm font-semibold ${viewMode === 'weekly' ? 'text-[#121212]' : 'text-gray-400'}`}>Haftalık</Text>
            </Pressable>
          </View>
        </View>

        {/* Staff Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 20, paddingBottom: 15 }} className="border-b border-white/5">
          {STAFF_MEMBERS.map((staff) => (
            <Pressable
              key={staff.id}
              onPress={() => setSelectedStaff(staff.id)}
              className={`items-center gap-2 ${selectedStaff !== staff.id && 'opacity-60'}`}
            >
              <View className={`w-[60px] h-[60px] rounded-full justify-center items-center ${staff.id === selectedStaff ? 'border-2 border-primary p-0.5' : 'bg-[#1E1E1E] border-2 border-transparent'}`}>
                {staff.image ? (
                  <Image source={{ uri: staff.image }} className="w-full h-full rounded-full" />
                ) : (
                  <User size={24} color="#9ca3af" />
                )}
                {staff.status && staff.id !== 'all' && (
                  <View className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#121212] ${staff.status === 'online' ? 'bg-green-500' : staff.status === 'busy' ? 'bg-red-500' : 'bg-gray-500'}`} />
                )}
              </View>
              <Text className={`text-xs font-medium ${selectedStaff === staff.id ? 'text-primary' : 'text-gray-400'}`}>{staff.name}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>

      {/* Timeline */}
      <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
        {/* Current Time Line */}
        <View className="absolute left-0 right-0 top-[380px] z-10 flex-row items-center opacity-80 pointer-events-none">
          <Text className="w-14 text-right pr-3 text-[10px] font-bold text-primary">13:45</Text>
          <View className="flex-1 h-[1px] bg-primary" />
          <View className="w-2 h-2 rounded-full bg-primary -ml-1" />
        </View>

        <View className="relative">
          <View className="absolute left-[56px] top-2 bottom-0 w-[1px] bg-white/5" />

          {/* 09:00 - Store Open */}
          <View className="flex-row w-full mb-6">
            <View className="w-14 items-end pr-3 pt-1">
              <Text className="text-sm font-medium text-white">09:00</Text>
            </View>
            <View className="flex-1 pl-4 relative">
              <View className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full border-2 border-[#1E1E1E] bg-white z-10" />
              <View className="flex-row items-center gap-3 opacity-60 mt-1">
                <Clock size={18} color={COLORS.primary.DEFAULT} />
                <Text className="text-sm text-gray-300">Mağaza Açılış ve Hazırlık</Text>
              </View>
            </View>
          </View>

          {/* Appointments Loop */}
          {APPOINTMENTS.map((apt) => (
            <View key={apt.id} className="flex-row w-full mb-6">
              <View className="w-14 items-end pr-3 pt-1">
                <Text className="text-sm font-medium text-white">{apt.startTime}</Text>
                <Text className="text-xs text-gray-500">{apt.endTime}</Text>
              </View>
              <View className="flex-1 pl-4 relative">
                <View className={`absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full border-2 border-[#1E1E1E] z-10 ${apt.status === 'confirmed' ? 'bg-primary' : apt.status === 'in_progress' ? 'bg-green-500' : 'bg-gray-600'}`} />
                {renderAppointmentCard(apt)}
              </View>
            </View>
          ))}

          {/* 17:00 Empty Slot */}
          <View className="flex-row w-full pb-8">
            <View className="w-14 items-end pr-3 pt-1">
              <Text className="text-sm font-medium text-white">17:00</Text>
            </View>
            <Pressable className="flex-1 pl-4 relative h-20 border-t border-dashed border-white/10 justify-center rounded-r-lg hover:bg-white/5 active:bg-white/5">
              <View className="pl-2 flex-row items-center gap-2">
                <Plus size={16} color={COLORS.primary.DEFAULT} />
                <Text className="text-primary text-sm font-medium">Randevu Ekle</Text>
              </View>
            </Pressable>
          </View>

        </View>
      </ScrollView>

      {/* FAB */}
      <Pressable className="absolute bottom-6 right-5 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg active:scale-95">
        <Plus size={28} color="#121212" />
      </Pressable>
    </View>
  );
}
