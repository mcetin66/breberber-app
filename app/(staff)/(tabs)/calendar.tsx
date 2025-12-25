import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, User, Filter } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { StandardScreen } from '@/components/ui/StandardScreen';
import { useAuthStore } from '@/stores/authStore';
import { useBusinessStore } from '@/stores/businessStore';

export default function StaffCalendarScreen() {
  const { user } = useAuthStore();
  const { fetchAppointments, appointments, loading, fetchStaff, staff = [] } = useBusinessStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.barberId) {
      fetchAppointments(user.barberId);
      fetchStaff(user.barberId);
    }
  }, [user?.barberId]);

  const filteredAppointments = appointments.filter(a => {
    const isDateMatch = a.date === selectedDate.toISOString().split('T')[0];
    const isStaffMatch = selectedStaffId ? a.staffId === selectedStaffId : true;
    return isDateMatch && isStaffMatch;
  });
  /* 
     RESTORING TOGGLE FUNCTIONALITY:
     The user confirmed this page originally had BOTH Daily and Weekly views.
     We are re-implementing the toggle and the logic for both modes.
  */
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

  // --- WEEK VIEW HELPER (Re-integrated) ---
  const getWeekDays = (startDate: Date) => {
    const days = [];
    const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    const currentDay = startDate.getDay();
    const diff = currentDay === 0 ? 6 : currentDay - 1;
    const monday = new Date(startDate);
    monday.setDate(startDate.getDate() - diff);

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push({
        dayName: dayNames[d.getDay()],
        dayNumber: d.getDate(),
        fullDate: new Date(d),
        isToday: new Date().toDateString() === d.toDateString()
      });
    }
    return days;
  };

  const TIME_SLOTS = Array.from({ length: 15 }, (_, i) => `${(i + 9).toString().padStart(2, '0')}:00`);

  // --- DAY VIEW HELPER ---
  const generateDays = () => {
    const days = [];
    for (let i = -2; i <= 4; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  };
  const days = generateDays();

  // State for Week View navigation
  const [weekStartDate, setWeekStartDate] = useState(new Date());

  // Render Week Cell
  const renderWeekCell = (day: any, timeSlot: string) => {
    const dateStr = day.fullDate.toISOString().split('T')[0];
    // In week view, show all appointments for the logged-in user (filtered by staffId if needed, but usually staff sees their own)
    const weekAppt = appointments.find(a => {
      if (a.date !== dateStr) return false;
      const aHour = parseInt(a.startTime?.split(':')[0] || '0');
      const sHour = parseInt(timeSlot.split(':')[0]);
      return aHour === sHour;
    });

    if (weekAppt) {
      return (
        <Pressable className="bg-primary/20 border-l-2 border-primary p-1 absolute top-0 left-0 right-0 bottom-1 rounded overflow-hidden">
          <Text className="text-[8px] font-bold text-white" numberOfLines={1}>{weekAppt.customerName}</Text>
        </Pressable>
      );
    }
    return null;
  };


  return (
    <StandardScreen
      title="Randevu Takvimi"
      subtitle={viewMode === 'day' ? "Günlük Liste" : "Haftalık Görünüm"}
      rightElement={
        <View className="flex-row bg-[#1E1E1E] rounded-lg border border-white/10 p-1">
          <Pressable
            onPress={() => setViewMode('day')}
            className={`px-3 py-1.5 rounded-md ${viewMode === 'day' ? 'bg-[#333]' : 'bg-transparent'}`}
          >
            <Text className={`text-xs font-bold ${viewMode === 'day' ? 'text-primary' : 'text-gray-400'}`}>Gün</Text>
          </Pressable>
          <Pressable
            onPress={() => setViewMode('week')}
            className={`px-3 py-1.5 rounded-md ${viewMode === 'week' ? 'bg-[#333]' : 'bg-transparent'}`}
          >
            <Text className={`text-xs font-bold ${viewMode === 'week' ? 'text-primary' : 'text-gray-400'}`}>Hafta</Text>
          </Pressable>
        </View>
      }
    >
      <View className="flex-col gap-4">

        {/* --- DAY VIEW UI --- */}
        {viewMode === 'day' && (
          <>
            {/* Horizontal Date Selector */}
            <View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-2">
                {days.map((date, index) => {
                  const isSelected = date.toDateString() === selectedDate.toDateString();
                  return (
                    <Pressable
                      key={index}
                      onPress={() => setSelectedDate(date)}
                      className={`mr-3 rounded-2xl p-3 w-[70px] items-center border ${isSelected ? 'bg-primary border-primary' : 'bg-[#1E1E1E] border-white/10'}`}
                    >
                      <Text className={`text-xs mb-1 font-medium ${isSelected ? 'text-black' : 'text-gray-400'}`}>
                        {date.toLocaleDateString('tr-TR', { weekday: 'short' })}
                      </Text>
                      <Text className={`text-xl font-bold ${isSelected ? 'text-black' : 'text-white'}`}>
                        {date.getDate()}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            {/* Staff Filter */}
            <View>
              <View className="flex-row items-center gap-2 mb-2 px-1">
                <Filter size={14} color="#64748B" />
                <Text className="text-gray-400 text-xs font-medium">Personel Filtrele</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Pressable
                  onPress={() => setSelectedStaffId(null)}
                  className={`mr-3 px-4 py-2 rounded-full border ${!selectedStaffId ? 'bg-primary border-primary' : 'bg-[#1E1E1E] border-white/10'}`}
                >
                  <Text className={`text-xs font-bold ${!selectedStaffId ? 'text-black' : 'text-white'}`}>Tümü</Text>
                </Pressable>
                {staff.map((s, idx) => (
                  <Pressable
                    key={idx}
                    onPress={() => setSelectedStaffId(s.id)}
                    className={`mr-3 px-4 py-2 rounded-full border ${selectedStaffId === s.id ? 'bg-primary border-primary' : 'bg-[#1E1E1E] border-white/10'}`}
                  >
                    <Text className={`text-xs font-bold ${selectedStaffId === s.id ? 'text-black' : 'text-white'}`}>{s.name.split(' ')[0]}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Day View List */}
            <View className="pb-20">
              <Text className="text-white font-bold text-lg mb-3">
                {selectedDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} Randevuları
              </Text>

              {loading ? (
                <ActivityIndicator size="large" color={COLORS.primary.DEFAULT} className="mt-10" />
              ) : filteredAppointments.length > 0 ? (
                filteredAppointments.map((appt, i) => (
                  <View key={i} className="mb-3 bg-[#1E1E1E] p-4 rounded-2xl border-l-4 border-l-[#d4af35] border border-white/5">
                    <View className="flex-row justify-between items-start mb-3">
                      <View className="flex-row gap-3 items-center">
                        <View className="w-12 h-12 rounded-full bg-[#2A2A2A] overflow-hidden border border-white/10 items-center justify-center">
                          {/* Use Initials if no image, or standard user icon */}
                          <Text className="text-[#d4af35] font-bold text-lg">{(appt.customerName || 'M').charAt(0)}</Text>
                        </View>
                        <View>
                          <Text className="text-base font-bold text-white">{appt.customerName || 'Misafir'}</Text>
                          <Text className="text-xs font-medium text-[#d4af35] mt-0.5">{appt.serviceName}</Text>
                        </View>
                      </View>
                      <View className="items-end">
                        <Text className="text-xl font-black text-white tracking-tight">{appt.startTime ? appt.startTime.slice(0, 5) : '--:--'}</Text>
                        <Text className="text-xs font-medium text-gray-400">45 dk</Text>
                      </View>
                    </View>

                    <View className="h-[1px] bg-white/5 my-2" />

                    <View className="flex-row justify-between items-center">
                      <View className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                        <View className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <Text className="text-[10px] font-bold text-green-500 uppercase">Onaylandı</Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Text className="text-xs text-gray-500">{appt.staffName || 'Atanmamış'}</Text>
                        <Text className="text-sm font-bold text-white">₺{appt.totalPrice}</Text>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <View className="items-center justify-center py-10 opacity-50">
                  <Clock size={40} color="#64748B" />
                  <Text className="text-gray-400 mt-3 font-medium">Bu tarih için randevu bulunamadı.</Text>
                </View>
              )}
            </View>
          </>
        )}

        {/* --- WEEK VIEW UI (Restored Grid) --- */}
        {viewMode === 'week' && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-col pb-20">
              {/* Header Row */}
              <View className="flex-row border-b border-white/10 pb-2 mb-2">
                <View className="w-12" />
                {getWeekDays(weekStartDate).map((d, i) => (
                  <View key={i} className={`w-24 items-center gap-1 ${d.isToday ? 'opacity-100' : 'opacity-60'}`}>
                    <Text className={`text-xs font-medium ${d.isToday ? 'text-primary' : 'text-gray-400'}`}>{d.dayName}</Text>
                    <View className={`w-8 h-8 rounded-full items-center justify-center ${d.isToday ? 'bg-primary' : 'bg-transparent'}`}>
                      <Text className={`text-sm font-bold ${d.isToday ? 'text-black' : 'text-white'}`}>{d.dayNumber}</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Grid */}
              <View>
                {TIME_SLOTS.map((time, tIndex) => (
                  <View key={time} className="flex-row h-16 border-b border-white/5">
                    <View className="w-12 items-end pr-2 -mt-2">
                      <Text className="text-[10px] text-gray-500 font-medium">{time}</Text>
                    </View>
                    {getWeekDays(weekStartDate).map((day, dIndex) => (
                      <View key={dIndex} className="w-24 border-r border-white/5 relative p-0.5">
                        {renderWeekCell(day, time)}
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        )}

      </View>
    </StandardScreen>
  );
}
