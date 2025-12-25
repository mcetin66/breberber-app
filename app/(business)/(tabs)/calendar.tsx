import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator, NativeSyntheticEvent, NativeScrollEvent, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Bell, Check } from 'lucide-react-native';
import { useAuthStore } from '@/stores/authStore';
import { useBusinessStore } from '@/stores/businessStore';
import { COLORS } from '@/constants/theme';
import { StandardScreen } from '@/components/ui/StandardScreen';
import { CreateAppointmentModal } from '@/components/business/CreateAppointmentModal';
import { AppointmentDetailModal } from '@/components/business/AppointmentDetailModal';
import { supabase } from '@/lib/supabase'; // DIRECT IMPORT

// Helper to get week days based on a start date
const getWeekDays = (startDate: Date) => {
  const days = [];
  const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

  // Ensure we are starting from Monday of that week
  const currentDay = startDate.getDay();
  const diff = currentDay === 0 ? 6 : currentDay - 1;
  const monday = new Date(startDate);
  monday.setDate(startDate.getDate() - diff);

  const currentMonth = monthNames[monday.getMonth()];
  const currentYear = monday.getFullYear();

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push({
      day: dayNames[d.getDay()],
      date: d.getDate().toString(),
      fullDate: new Date(d),
      isToday: new Date().toDateString() === d.toDateString()
    });
  }

  return { days, title: `${currentMonth} ${currentYear}`, subtitle: `${dayNames[new Date().getDay()]}, ${new Date().getDate()}` };
};

// Helper: Format Time Range
const formatTimeRange = (startTime: string, duration: number) => {
  const [h, m] = startTime.split(':').map(Number);
  const startMin = h * 60 + m;
  const endMin = startMin + duration;

  const endH = Math.floor(endMin / 60);
  const endM = endMin % 60;

  const endTime = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
  return `${startTime} - ${endTime}`;
};

export default function BusinessCalendarScreen() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'collective' | 'individual'>('collective');
  const [weekStartDate, setWeekStartDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Individual Mode State
  const [activeStaffId, setActiveStaffId] = useState<string | null>(null);

  // Modal State
  const [createModalConfig, setCreateModalConfig] = useState<{
    staffId: string;
    staffName: string;
    date: Date;
    time: string;
    businessId: string;
  } | null>(null);

  const [detailModalConfig, setDetailModalConfig] = useState<any>(null);

  // Data Store
  const [appointments, setAppointments] = useState<any[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<any[]>([]);
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]); // For Collective visibility
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  // Refs for Sticky Scroll
  const headerScrollRef = useRef<ScrollView>(null);
  const gridScrollRef = useRef<ScrollView>(null);

  const { days: weekDays, title } = getWeekDays(weekStartDate);

  // Store Hooks
  const { user } = useAuthStore();
  const { getStaff, fetchStaff, fetchServices, currentBusiness, getBusinessById, loading } = useBusinessStore();

  const businessId = user?.barberId;
  const isStaff = user?.role === 'staff';

  // filtered staff list
  const allStaff = businessId ? getStaff(businessId) : [];
  const staffList = isStaff && user?.email
    ? allStaff.filter((s: any) => s.email === user.email || s.id === user.id) // Fallback to ID if email matches
    : allStaff;

  // Current Time State
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  // 1. Fetch Data
  useEffect(() => {
    if (businessId) {
      console.log('Calendar: Fetching Business Data for:', businessId);
      fetchStaff(businessId);
      fetchServices(businessId);
      if (!currentBusiness) {
        getBusinessById(businessId);
      }
    } else {
      console.log('Calendar: No Business ID found in user', user);
    }
  }, [businessId]);

  // 1.5 Fetch Bookings
  useEffect(() => {
    async function loadBookings() {
      if (!businessId) return;
      setIsLoadingBookings(true);
      try {
        // Calculate start/end of the current week view
        // weekDays[0] is Monday, weekDays[6] is Sunday
        const queryStart = weekDays[0].fullDate.toISOString().split('T')[0];
        const queryEnd = weekDays[6].fullDate.toISOString().split('T')[0];

        console.log(`Calendar: Fetching Bookings: ${queryStart} to ${queryEnd} for business ${businessId}`);

        // We assume bookingService is globally available or imported.
        // If not, we use supabase directly for safety here to avoid import errors if service isn't exported correctly.
        let query = supabase
          .from('bookings')
          .select(`
            id,
            business_id,
            staff_id,
            service_id,
            customer_id,
            booking_date,
            start_time,
            end_time,
            status,
            notes,
            profiles:customer_id (full_name),
            services (name, duration_minutes)
          `)
          .eq('business_id', businessId)
          .gte('booking_date', queryStart)
          .lte('booking_date', queryEnd)
          .neq('status', 'cancelled'); // Don't show cancelled?

        // If staff, ideally we filter bookings too, but filtering the columns (UI) is usually enough visually.
        // But for security/performance, let's filter purely by the UI columns logic first.

        const { data, error } = await query;

        if (error) {
          console.error('Calendar: Supabase Error', error);
          throw error;
        }

        if (data) {
          console.log(`Calendar: Found ${data.length} bookings`);
          const formatted = data.map((b: any) => {
            // Calculate Duration if not present (fallback)
            // DB Time is "HH:MM:SS" usually.
            const [sH, sM] = b.start_time.split(':').map(Number);
            const [eH, eM] = b.end_time.split(':').map(Number);
            const duration = (eH * 60 + eM) - (sH * 60 + sM);

            return {
              id: b.id,
              staffId: b.staff_id,
              customerId: b.customer_id,
              customerName: b.profiles?.full_name || 'Misafir',
              serviceId: b.service_id,
              serviceName: b.services?.name || 'Hizmet',
              date: new Date(b.booking_date), // Warning: TZ issues possible?
              startTime: b.start_time.slice(0, 5), // HH:MM
              duration: b.services?.duration_minutes || duration || 30, // Prefer service duration
              status: b.status,
              notes: b.notes
            };
          });
          setAppointments(formatted);
        }
      } catch (err) {
        console.error("Calendar: Booking Fetch Error:", err);
      } finally {
        setIsLoadingBookings(false);
      }
    }

    loadBookings();
  }, [businessId, weekStartDate]); // Re-fetch when week changes

  // 2. Generate Time Slots
  useEffect(() => {
    if (currentBusiness?.workingHours) {
      const start = '09:00';
      const end = '23:00'; // Extended to cover late hours
      const slots = [];
      let currentHours = parseInt(start.split(':')[0]);
      let currentMinutes = parseInt(start.split(':')[1]);
      const endHours = parseInt(end.split(':')[0]);

      while (currentHours <= endHours) {
        const timeString = `${currentHours.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;
        slots.push(timeString);
        currentHours++;
      }
      setTimeSlots(slots);
    } else {
      setTimeSlots(['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00']);
    }
  }, [currentBusiness]);

  // 3. Select All Staff Initially
  useEffect(() => {
    if (staffList.length > 0) {
      if (selectedStaffIds.length === 0) setSelectedStaffIds(staffList.map(s => s.id));
      if (!activeStaffId) setActiveStaffId(staffList[0].id);
    }
  }, [staffList.length]);

  // Handlers
  const toggleStaff = (id: string) => {
    if (viewMode === 'collective') {
      // Multi-select for visibility
      if (selectedStaffIds.includes(id)) {
        if (selectedStaffIds.length > 1) {
          setSelectedStaffIds(prev => prev.filter(sid => sid !== id));
        }
      } else {
        setSelectedStaffIds(prev => [...prev, id]);
      }
    } else {
      // Single-select for context
      setActiveStaffId(id);
    }
  };

  const nextWeek = () => {
    const next = new Date(weekStartDate);
    next.setDate(next.getDate() + 7);
    setWeekStartDate(next);
  };

  const prevWeek = () => {
    const prev = new Date(weekStartDate);
    prev.setDate(prev.getDate() - 7);
    setWeekStartDate(prev);
  };

  const handleCreateSave = (data: any) => {
    // Basic Overlap Check
    const [newH, newM] = data.startTime.split(':').map(Number);
    const newStart = newH * 60 + newM;
    const newEnd = newStart + data.duration;

    // Check Appointment Conflicts
    const hasAptConflict = appointments.some(apt => {
      if (apt.staffId !== data.staffId || apt.date.toDateString() !== data.date.toDateString()) return false;
      const [aptH, aptM] = apt.startTime.split(':').map(Number);
      const aptStart = aptH * 60 + aptM;
      const aptEnd = aptStart + apt.duration;
      return (newStart < aptEnd && newEnd > aptStart);
    });

    // Check Block/Break Conflicts
    const hasBlockConflict = blockedTimes.some(blk => {
      if (blk.staffId !== data.staffId || blk.date.toDateString() !== data.date.toDateString()) return false;
      const [blkH, blkM] = blk.startTime.split(':').map(Number);
      const blkStart = blkH * 60 + blkM;
      const blkEnd = blkStart + blk.duration;
      return (newStart < blkEnd && newEnd > blkStart);
    });

    if (hasAptConflict || hasBlockConflict) {
      Alert.alert(
        'Saat Çakışması',
        'Seçilen saat aralığında zaten başka bir randevu veya engel bulunuyor. Lütfen başka bir saat seçin.'
      );
      return;
    }

    // DB Write
    // DB Write or Update
    const payload: any = {
      business_id: businessId,
      staff_id: data.staffId,
      customer_id: data.customerId || user?.id,
      service_id: data.serviceIds?.[0] || null,
      booking_date: data.date.toISOString().split('T')[0],
      start_time: data.startTime,
      end_time: formatTimeRange(data.startTime, data.duration).split(' - ')[1],
      total_price: data.totalPrice || 0,
      status: data.status || 'confirmed',
      notes: data.notes
    };

    // Calculate End Time Properly
    const [sH, sM] = data.startTime.split(':').map(Number);
    const endMin = sH * 60 + sM + data.duration;
    const eH = Math.floor(endMin / 60);
    const eM = endMin % 60;
    payload.end_time = `${eH.toString().padStart(2, '0')}:${eM.toString().padStart(2, '0')}`;

    if (data.id) {
      // UPDATE
      // @ts-ignore
      supabase.from('bookings').update(payload as any)
        .eq('id', data.id)
        .then(({ error }) => {
          if (error) Alert.alert('Hata', 'Güncelleme başarısız: ' + error.message);
          else {
            // Optimistic Update for Edit
            setAppointments(prev => prev.map(a => a.id === data.id ? { ...a, ...data, ...payload } : a));
            // Also update blocked times if it was a block?
            // Ideally trigger refetch
          }
        });
    } else {
      // INSERT
      supabase.from('bookings').insert(payload)
        .then(({ data: inserted, error }) => {
          if (error) {
            Alert.alert('Hata', 'Randevu oluşturulamadı: ' + error.message);
            return;
          }
          // Optimistic Add
          setAppointments(prev => [...prev, {
            ...data,
            id: 'temp-' + Math.random(),
            ...payload
          }]);
        });
    }

    setCreateModalConfig(null);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    // 1. Optimistic Update
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    setDetailModalConfig(null);

    // 2. DB Update
    const { error } = await supabase
      .from('bookings')
      // @ts-ignore
      .update({ status: newStatus } as any)
      .eq('id', id);

    if (error) {
      Alert.alert('Hata', 'Durum güncellenemedi.');
      console.error(error);
      // Revert? (For V1 assuming success is okay primarily, but let's just log)
    }
  };

  const handleDelete = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    setBlockedTimes(prev => prev.filter(b => b.id !== id));
    setDetailModalConfig(null);
  };

  const handleEdit = (appointment: any) => {
    setDetailModalConfig(null);
    setTimeout(() => {
      setCreateModalConfig({
        id: appointment.id, // Pass ID for update logic check
        staffId: appointment.staffId,
        staffName: staffList.find(s => s.id === appointment.staffId)?.name || '',
        date: new Date(appointment.date),
        time: appointment.startTime,
        // Added fields for Edit Mode
        customerName: appointment.customerName,
        serviceIds: appointment.serviceId ? [appointment.serviceId] : [], // TODO: appointments should support array
        duration: appointment.duration,
        endTime: appointment.endTime, // Use calculated or DB end time
        businessId: businessId || '',
        notes: appointment.notes
      } as any);
    }, 200);
  };

  const isStaffAvailable = (staff: any, slotTime: string) => {
    return true;
  };

  const getPositionStyle = (timeStr: string, durationMin: number) => {
    const [h, m] = timeStr.split(':').map(Number);
    const startHour = parseInt(timeSlots[0]?.split(':')[0] || '9');
    const top = ((h - startHour) * 84) + ((m / 60) * 84);
    const height = (durationMin / 60) * 84;
    return { top, height };
  };

  // Sync Headers
  const handleGridScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    if (headerScrollRef.current) {
      headerScrollRef.current.scrollTo({ x, animated: false });
    }
  };

  const staffToRender = viewMode === 'collective'
    ? (selectedStaffIds.length > 0 ? staffList.filter(s => selectedStaffIds.includes(s.id)) : staffList)
    : (activeStaffId ? staffList.filter(s => s.id === activeStaffId) : []);

  if (loading && staffList.length === 0) {
    return (
      <View className="flex-1 bg-[#121212] items-center justify-center">
        <ActivityIndicator color={COLORS.primary.DEFAULT} />
      </View>
    );
  }

  // Render Calendar Column
  function renderCalendarColumn(
    staffId: string,
    staffName: string,
    date: Date,
    columnAppointments: any[],
    columnBlocks: any[],
    slots: string[],
    checkAvailability: () => boolean,
    isToday: boolean = false,
    forceShowLine: boolean = false
  ) {
    // Calc Current Time Top
    const startHour = parseInt(timeSlots[0]?.split(':')[0] || '9');
    const nowTop = ((now.getHours() - startHour) * 84) + ((now.getMinutes() / 60) * 84);
    const showTimeline = (isToday || forceShowLine) && nowTop >= 0 && nowTop <= (slots.length * 84);

    return (
      <View className="relative h-full">
        {/* Grid Lines & Touch Area */}
        {slots.map((time, i) => (
          <View key={`slot-${i}`} className="absolute w-full" style={{ top: i * 84, height: 84 }}>
            <View className="w-full h-[1px] bg-white/10" />

            {/* Sub-lines */}
            <View className="absolute top-[21px] w-full h-[1px] bg-white/5 opacity-10" />
            <View className="absolute top-[42px] w-full h-[1px] bg-white/5 opacity-20" />
            <View className="absolute top-[63px] w-full h-[1px] bg-white/5 opacity-10" />

            <Pressable
              onPress={() => setCreateModalConfig({
                staffId: staffId,
                staffName: staffName,
                date: date,
                time: time,
                businessId: businessId || ''
              })}
              className="absolute inset-0 z-10 active:bg-white/5"
            />
          </View>
        ))}

        {/* Current Time Indicator */}
        {showTimeline && (
          <View className="absolute w-full z-40 pointer-events-none" style={{ top: nowTop }}>
            <View className="w-full h-[2px] bg-green-500 shadow-sm shadow-green-500" />
            {isToday && <View className="absolute -left-1 -top-[3px] w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-500" />}
          </View>
        )}

        {/* Appointments */}
        {columnAppointments.map((apt, idx) => {
          const style = getPositionStyle(apt.startTime, apt.duration);
          const isPending = apt.status === 'pending';

          // Privacy Logic for Pending: Show Initials Only
          const displayName = isPending
            ? '🔒 ' + apt.customerName.split(' ').map((n: string) => n[0]).join('.') + '.'
            : apt.customerName;

          return (
            <View key={`apt-${idx}`} className="absolute w-full px-1 z-30" style={style}>
              <Pressable
                onPress={() => setDetailModalConfig(apt)}
                className={`w-full h-full rounded-md border-l-4 p-1 overflow-hidden shadow-sm active:opacity-80
                  ${isPending ? 'bg-zinc-700/80 border-zinc-500' : 'bg-[#d4af35] border-white'}
                `}
              >
                {isPending && (
                  <View className="absolute inset-0 bg-zinc-800/50 stripe-pattern opacity-30" />
                )}

                <Text className={`text-[9px] font-black opacity-80 mb-0.5 ${isPending ? 'text-zinc-300' : 'text-black'}`}>
                  {formatTimeRange(apt.startTime, apt.duration)}
                </Text>
                <Text className={`text-[10px] font-bold truncate leading-snug ${isPending ? 'text-zinc-200' : 'text-black'}`}>
                  {displayName}
                </Text>
                {apt.serviceName && (
                  <Text className={`text-[8px] font-medium opacity-70 truncate leading-tight ${isPending ? 'text-zinc-400' : 'text-black'}`}>
                    {apt.serviceName}
                  </Text>
                )}
              </Pressable>
            </View>
          );
        })}

        {/* Blocks (Merged) */}
        {columnBlocks.map((block, idx) => {
          const style = getPositionStyle(block.startTime, block.duration);
          // Check logic: type 'break' or note 'Mola' is Break (Blue)
          const isBreak = block.type === 'break' || block.note === 'Mola';
          const activeColor = isBreak ? '#3B82F6' : '#EF4444'; // Blue : Red

          return (
            <View key={`block-${idx}`} className="absolute w-full px-1 z-20" style={style}>
              <Pressable
                onPress={() => setDetailModalConfig(block)}
                className="w-full h-full rounded-md border-l-4 p-1 overflow-hidden active:opacity-80"
                style={{
                  backgroundColor: `${activeColor}20`,
                  borderColor: activeColor
                }}
              >
                <View
                  className="w-full h-full absolute opacity-10 stripe-pattern"
                  style={{ backgroundColor: activeColor }}
                />
                <Text
                  className="text-[9px] font-black opacity-80 mb-0.5"
                  style={{ color: activeColor }}
                >
                  {formatTimeRange(block.startTime, block.duration)}
                </Text>
                <Text
                  className="text-[10px] font-bold text-center"
                  style={{ color: activeColor }}
                >
                  {isBreak ? 'Mola' : 'Dolu'}
                  {block.note && block.note !== 'Mola' && block.note !== 'Dolu' ? ` (${block.note})` : ''}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <StandardScreen
      isScrollable={false}
      noPadding
      title={viewMode === 'collective' ? title : (staffList.find(s => s.id === activeStaffId)?.name || 'Personel Takvimi')}
      subtitle={viewMode === 'collective' ? selectedDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' }) : 'Haftalık Görünüm'}
      headerIcon={<CalendarIcon size={20} color="#121212" />}
      rightElement={
        <View className="flex-row items-center gap-3">
          <Pressable
            className="relative w-10 h-10 items-center justify-center rounded-full bg-transparent active:bg-white/10"
            onPress={() => router.push('/(business)/notifications')}
          >
            <Bell size={24} color="#9CA3AF" />
            {appointments.filter(a => a.status === 'pending').length > 0 && (
              <View className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#121212]" />
            )}
          </Pressable>
        </View>
      }
    >
      <View className="flex-1 px-4">
        {/* TOP CONTROLS (Fixed) */}
        <View>
          {/* View Switcher */}
          <View className="mb-4">
            <View className="flex-row bg-[#1E1E1E] p-1 rounded-xl">
              <Pressable
                onPress={() => setViewMode('collective')}
                className={`flex-1 py-2 items-center rounded-lg ${viewMode === 'collective' ? 'bg-[#d4af35]' : 'bg-transparent'}`}
              >
                <Text className={`text-sm font-medium ${viewMode === 'collective' ? 'text-black' : 'text-gray-400'}`}>Genel Bakış (Toplu)</Text>
              </Pressable>
              <Pressable
                onPress={() => setViewMode('individual')}
                className={`flex-1 py-2 rounded-lg items-center ${viewMode === 'individual' ? 'bg-[#d4af35]' : 'bg-transparent'}`}
              >
                <Text className={`text-sm font-medium ${viewMode === 'individual' ? 'text-black' : 'text-gray-400'}`}>Bireysel (Haftalık)</Text>
              </Pressable>
            </View>
          </View>

          {/* Controls & Filters */}
          <View className="gap-4 border-b border-white/5 pb-4 mb-2">
            {/* Staff Selector */}
            <View className="gap-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                  {viewMode === 'collective' ? 'Görüntülenen Personeller' : 'Personel Seçimi'}
                </Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {staffList.map(staff => {
                  const isSelected = viewMode === 'collective'
                    ? selectedStaffIds.includes(staff.id)
                    : activeStaffId === staff.id;

                  return (
                    <Pressable
                      key={staff.id}
                      onPress={() => toggleStaff(staff.id)}
                      className={`flex-row items-center pl-1 pr-3 py-1 rounded-full border ${isSelected ? 'bg-[#d4af35]/10 border-[#d4af35]' : 'bg-[#1E1E1E] border-white/10'}`}
                    >
                      <Image
                        source={{ uri: staff.avatar_url || 'https://via.placeholder.com/150' }}
                        className={`w-6 h-6 rounded-full mr-2 ${isSelected ? '' : 'grayscale opacity-50'}`}
                      />
                      <Text className={`text-xs font-medium ${isSelected ? 'text-[#d4af35]' : 'text-gray-500'}`}>
                        {staff.name.split(' ')[0]}
                      </Text>
                      {isSelected && viewMode === 'collective' && <View className="bg-[#d4af35] rounded-full p-0.5 ml-2"><Check size={8} color="black" /></View>}
                    </Pressable>
                  )
                })}
              </ScrollView>
            </View>

            {/* Date Navigator */}
            <View className="flex-row items-center justify-between gap-1">
              <Pressable onPress={prevWeek} className="w-8 h-16 items-center justify-center rounded-lg active:bg-white/5">
                <ChevronLeft size={20} color="#9CA3AF" />
              </Pressable>

              {viewMode === 'collective' ? (
                <View className="flex-1 flex-row justify-between gap-1">
                  {weekDays.map((d, i) => {
                    const isActive = d.fullDate.toDateString() === selectedDate.toDateString();
                    const isToday = d.isToday;
                    return (
                      <Pressable
                        key={i}
                        onPress={() => setSelectedDate(d.fullDate)}
                        className={`flex-1 items-center justify-center h-16 rounded-xl ${isActive ? 'bg-[#d4af35]' : 'bg-transparent active:bg-[#1E1E1E]'}`}
                      >
                        <Text className={`text-[10px] uppercase font-medium ${isActive ? 'text-black' : isToday ? 'text-[#d4af35]' : 'text-gray-500'}`}>{d.day}</Text>
                        <Text className={`text-lg font-bold ${isActive ? 'text-black' : 'text-white'}`}>{d.date}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              ) : (
                <View className="flex-1 items-center justify-center h-16">
                  <Text className="text-white text-lg font-bold">{title}</Text>
                  <Text className="text-zinc-500 text-xs">Tüm Hafta Görünümü</Text>
                </View>
              )}

              <Pressable onPress={nextWeek} className="w-8 h-16 items-center justify-center rounded-lg active:bg-white/5">
                <ChevronRight size={20} color="#9CA3AF" />
              </Pressable>
            </View>
          </View>
        </View>

        {/* CALENDAR - STICKY HEADERS LAYOUT */}
        <View className="flex-1 overflow-hidden rounded-t-2xl border border-white/5">

          {/* 1. Header Row (Sticky Top) */}
          <View className="flex-row bg-[#121212] border-b border-white/10 z-20">
            {/* Spacer (Corner) */}
            <View className="w-12 bg-[#121212] border-r border-white/10" />

            {/* Headers */}
            <ScrollView
              horizontal
              ref={headerScrollRef}
              scrollEnabled={false} // Driven by grid scroll
              showsHorizontalScrollIndicator={false}
            >
              {viewMode === 'collective' ? (
                staffToRender.map(staff => (
                  <View key={staff.id} className="w-40 h-10 items-center justify-center border-r border-white/5 bg-[#1E1E1E] flex-row gap-2 px-2">
                    <Image source={{ uri: staff.avatar_url || 'https://via.placeholder.com/150' }} className="w-6 h-6 rounded-full" />
                    <Text className="text-zinc-300 font-bold text-xs truncate">{staff.name.split(' ')[0]}</Text>
                  </View>
                ))
              ) : (
                weekDays.map(day => (
                  <View key={day.date} className="w-40 h-10 items-center justify-center border-r border-white/5 bg-[#1E1E1E]">
                    <Text className={`text-xs font-bold ${day.isToday ? 'text-[#d4af35]' : 'text-zinc-400'}`}>{day.day} {day.date}</Text>
                  </View>
                ))
              )}
            </ScrollView>
          </View>

          {/* 2. Body (Scrollable) */}
          <ScrollView className="flex-1 bg-[#121212]">
            <View className="flex-row">
              {/* Time Column (Sticky Left) */}
              <View className="w-12 bg-[#121212] z-10 border-r border-white/10">
                <View className="relative">
                  {timeSlots.map((t, i) => (
                    <View key={i} className="absolute w-full border-r border-white/5" style={{ top: i * 84, height: 84 }}>
                      <Text className="absolute -top-2.5 left-0 right-1 text-[10px] text-zinc-400 font-bold text-right pr-1 bg-[#121212]">{t}</Text>
                      <Text className="absolute top-[10px] right-1.5 text-[8px] text-zinc-600 font-medium">10</Text>
                      <Text className="absolute top-[24px] right-1.5 text-[8px] text-zinc-600 font-medium">20</Text>
                      <Text className="absolute top-[38px] right-1.5 text-[8px] text-zinc-500 font-medium opacity-50">30</Text>
                      <Text className="absolute top-[52px] right-1.5 text-[8px] text-zinc-600 font-medium">40</Text>
                      <Text className="absolute top-[66px] right-1.5 text-[8px] text-zinc-600 font-medium">50</Text>
                    </View>
                  ))}
                </View>
                {/* Spacer for bottom to ensure full height */}
                <View style={{ height: (timeSlots.length * 84) }} />
              </View>

              {/* Main Grid */}
              <ScrollView
                horizontal
                ref={gridScrollRef}
                onScroll={handleGridScroll}
                scrollEventThrottle={16}
                showsHorizontalScrollIndicator={false}
              >
                <View className="flex-row" style={{ height: (timeSlots.length * 84) }}>
                  {viewMode === 'collective' ? (
                    staffToRender.map(staff => (
                      <View key={staff.id} className="w-40 border-r border-white/5 bg-[#121212]">
                        {renderCalendarColumn(
                          staff.id,
                          staff.name,
                          selectedDate,
                          appointments.filter(a => a.staffId === staff.id && a.date.toDateString() === selectedDate.toDateString()),
                          blockedTimes.filter(b => b.staffId === staff.id && b.date.toDateString() === selectedDate.toDateString()),
                          timeSlots,
                          () => isStaffAvailable(staff, '00:00'),
                          selectedDate.toDateString() === now.toDateString() // Check if column is today
                        )}
                      </View>
                    ))
                  ) : (
                    weekDays.map(day => {
                      const currentStaff = staffList.find(s => s.id === activeStaffId);
                      return (
                        <View key={day.date} className="w-40 border-r border-white/5 bg-[#121212]">
                          {renderCalendarColumn(
                            activeStaffId || 'unknown',
                            currentStaff?.name || '',
                            day.fullDate,
                            appointments.filter(a => a.staffId === activeStaffId && a.date.toDateString() === day.fullDate.toDateString()),
                            blockedTimes.filter(b => b.staffId === activeStaffId && b.date.toDateString() === day.fullDate.toDateString()),
                            timeSlots,
                            () => true,
                            day.fullDate.toDateString() === now.toDateString(), // Check if column is today
                            weekDays.some(d => d.isToday) // Force line if current week
                          )}
                        </View>
                      )
                    })
                  )}
                </View>
              </ScrollView>
            </View>
          </ScrollView>
        </View>

      </View>

      {createModalConfig && (
        <CreateAppointmentModal
          visible={!!createModalConfig}
          initialData={createModalConfig}
          onClose={() => setCreateModalConfig(null)}
          onSave={handleCreateSave}
        />
      )}

      {detailModalConfig && (
        <AppointmentDetailModal
          visible={!!detailModalConfig}
          appointment={detailModalConfig}
          onClose={() => setDetailModalConfig(null)}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onStatusChange={handleStatusChange}
        />
      )}
    </StandardScreen>
  );
}
