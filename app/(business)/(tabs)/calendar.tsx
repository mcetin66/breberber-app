import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, X, Lock, UserPlus, LayoutGrid, List } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '@/constants/theme';
import { useBusinessStore } from '@/stores/businessStore';
import { useAuthStore } from '@/stores/authStore';
import { SchedulerGrid } from '@/components/business/SchedulerGrid';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AppointmentDetailModal } from '@/components/business/AppointmentDetailModal';

const DAYS_TR = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
const MONTHS_TR = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

export default function CalendarScreen() {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  // Slot Action State
  const [slotModalVisible, setSlotModalVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ staffId: string, time: string, staffName: string } | null>(null);
  const [blockDuration, setBlockDuration] = useState(60);
  const [blockReason, setBlockReason] = useState('Mola');

  // Time Selection State
  const [blockStartTime, setBlockStartTime] = useState(new Date());
  const [blockEndTime, setBlockEndTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState<'start' | 'end' | null>(null);

  // View Mode State
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedSlot && date) {
      const [h, m] = selectedSlot.time.split(':').map(Number);
      const s = new Date(date);
      s.setHours(h, m, 0, 0);
      setBlockStartTime(s);

      const e = new Date(s);
      e.setMinutes(s.getMinutes() + 60); // Default 1 hour
      setBlockEndTime(e);
    }
  }, [selectedSlot]);

  const { user } = useAuthStore();
  const { fetchAppointments, fetchAppointmentsRange, getAppointments, fetchStaff, getStaff, loading, addAppointment, createAppointment, deleteAppointment } = useBusinessStore();

  const barberId = user?.barberId || user?.id;

  const appointments = barberId ? getAppointments(barberId) : [];
  const staffList = barberId ? getStaff(barberId) : [];

  // ... useEffect and other logic ...

  // To save tokens, I will NOT replace lines 30-68 if I can avoid it.
  // But wait, the `handleAppointmentPress` is later.
  // I replaced imports (lines 1-10) and start of component (lines 18-20).
  // I will target lines 1-28 roughly.

  // Wait, I can't skip middle lines if I replace a block unless I include them.
  // I will replace `import ...` to `export default function ... { ... state definitions`

  // Actually, I can just ADD imports and replace function start.
  // Let's replace lines 1-21.




  // Generate Mon-Sun for the week containing 'date'
  const getWeekDates = () => {
    const days = [];
    const currentDay = date.getDay(); // 0=Sun, 1=Mon, ...
    const diffToMonday = currentDay === 0 ? 6 : currentDay - 1;

    const monday = new Date(date);
    monday.setDate(date.getDate() - diffToMonday);

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d);
    }
    return days;
  };

  useEffect(() => {
    if (barberId) {
      if (viewMode === 'day') {
        const dateStr = date.toISOString().split('T')[0];
        fetchAppointments(barberId, dateStr);
      } else {
        const days = getWeekDates();
        const startStr = days[0].toISOString().split('T')[0];
        const endStr = days[6].toISOString().split('T')[0];
        fetchAppointmentsRange(barberId, startStr, endStr);
      }

      if (staffList.length === 0) {
        fetchStaff(barberId);
      }
    }
  }, [date, barberId, viewMode]);


  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
  };

  const confirmDate = () => {
    setShowPicker(false);
  };

  const shiftDate = (days: number) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    setDate(newDate);
  };

  const handleAppointmentPress = (apt: any) => {
    setSelectedAppointment(apt);
    setDetailModalVisible(true);
  };

  const handleSlotPress = (staffId: string, time: string) => {
    const staff = staffList.find(s => s.id === staffId);
    setSelectedSlot({ staffId, time, staffName: staff?.name || 'Personel' });
    setSlotModalVisible(true);
  };

  const calculateEndTime = (start: string, durationMinutes: number) => {
    const [h, m] = start.split(':').map(Number);
    const total = h * 60 + m + durationMinutes;
    const newH = Math.floor(total / 60);
    const newM = total % 60;
    return `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`;
  };

  const handleBlockTime = async () => {
    if (!selectedSlot || !barberId) return;

    if (blockEndTime <= blockStartTime) {
      Alert.alert('Hata', 'Bitiş saati başlangıç saatinden sonra olmalıdır.');
      return;
    }

    const startMins = blockStartTime.getHours() * 60 + blockStartTime.getMinutes();
    const endMins = blockEndTime.getHours() * 60 + blockEndTime.getMinutes();

    // Staff Working Hours Validation
    const currentStaff = staffList.find(s => s.id === selectedSlot.staffId);
    if (currentStaff?.workingHours) {
      const { start, end } = currentStaff.workingHours;
      if (start && end) {
        const [wStartH, wStartM] = start.split(':').map(Number);
        const [wEndH, wEndM] = end.split(':').map(Number);
        const wStartVal = wStartH * 60 + wStartM;
        const wEndVal = wEndH * 60 + wEndM;

        // Handle overnight shifts? Assuming day shift for now based on Scheduler
        if (startMins < wStartVal || endMins > wEndVal) {
          Alert.alert('Uyarı', `Seçilen saatler personelin çalışma saatleri (${start} - ${end}) dışındadır.`);
          return;
        }
      }
    }

    const hasOverlap = appointments.some(a => {
      if (a.staffId !== selectedSlot.staffId || a.status === 'cancelled' || !a.startTime || !a.endTime) return false;
      const [sH, sM] = a.startTime.split(':').map(Number);
      const [eH, eM] = a.endTime.split(':').map(Number);
      return (startMins < (eH * 60 + eM) && endMins > (sH * 60 + sM));
    });

    if (hasOverlap) {
      Alert.alert('Uyarı', 'Seçilen saat aralığında başka bir plan bulunmaktadır.');
      return;
    }

    try {
      const dateTime = new Date(date);
      const dateStr = dateTime.toISOString().split('T')[0];

      await createAppointment(barberId, {
        staff_id: selectedSlot.staffId,
        booking_date: dateStr,
        start_time: blockStartTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        end_time: blockEndTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        status: 'blocked',
        notes: blockReason,
        total_price: 0
      });

      Alert.alert('Başarılı', 'Saat kapatıldı.');
      setSlotModalVisible(false);
    } catch (e: any) {
      Alert.alert('Hata', e.message || 'İşlem başarısız');
    }
  };

  const handleAddBooking = () => {
    setSlotModalVisible(false);
    // Navigate to booking creation passing data
    // router.push(`/appointments/new?staffId=${selectedSlot?.staffId}&date=${date.toISOString()}&time=${selectedSlot?.time}`);
    Alert.alert('Bilgi', 'Randevu oluşturma ekranına yönlendirilecek.');
  };

  const handleDeleteAppointment = async (id: string) => {
    Alert.alert('Emin misiniz?', 'Bu kaydı silmek istediğinize emin misiniz?', [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          try {
            if (!barberId) return;
            await deleteAppointment(barberId, id);
            setDetailModalVisible(false);
            Alert.alert('Başarılı', 'Kayıt silindi.');
          } catch (e: any) {
            Alert.alert('Hata', 'Silme işlemi başarısız.');
          }
        }
      }
    ]);
  };

  const formatDateTitle = (d: Date) => {
    return `${MONTHS_TR[d.getMonth()]} ${d.getFullYear()}`;
  };

  // Grid Data Preparation
  const weekDates = getWeekDates();
  const effectiveStaffId = selectedStaffId || staffList[0]?.id;

  const gridColumns = viewMode === 'day'
    ? staffList
    : weekDates.map(d => ({
      id: d.toISOString().split('T')[0],
      name: `${DAYS_TR[d.getDay()]} ${d.getDate()}`,
      avatar: null,
      workingHours: staffList.find(s => s.id === effectiveStaffId)?.workingHours
    } as any));

  const gridAppointments = viewMode === 'day'
    ? appointments
    : appointments
      .filter(a => a.staffId === effectiveStaffId)
      .map(a => ({
        ...a,
        staffId: a.date // Map to Date Column
      }));

  const handleCustomSlotPress = (colId: string, time: string) => {
    if (viewMode === 'week') {
      // We clicked a Date Column (colId is 'YYYY-MM-DD')
      const clickedDate = new Date(colId);
      // Update date state so modal uses correct day
      setDate(clickedDate);

      // Find Staff Name
      const staff = staffList.find(s => s.id === effectiveStaffId);

      setSelectedSlot({
        staffId: effectiveStaffId,
        time,
        staffName: staff?.name || 'Personel'
      });
      setSlotModalVisible(true);
    } else {
      handleSlotPress(colId, time);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0F172A]" edges={['top']}>
      <AdminHeader
        title="Takvim"
        subtitle="Randevu Yönetimi"
        rightElement={
          <View className="flex-row gap-2">
            <Pressable
              onPress={() => setViewMode(viewMode === 'day' ? 'week' : 'day')}
              className={`p-2 rounded-full border border-white/10 ${viewMode === 'week' ? 'bg-primary' : 'bg-[#1E293B]'}`}
            >
              {viewMode === 'day' ? <LayoutGrid size={16} color="white" /> : <List size={16} color="white" />}
            </Pressable>
            <Pressable
              onPress={() => setDate(new Date())}
              className="px-3 py-1.5 rounded-full bg-[#1E293B] border border-white/10 active:bg-white/5 items-center justify-center"
            >
              <Text className="text-primary text-xs font-bold">Bugün</Text>
            </Pressable>
          </View>
        }
      >
        {/* Month/Year Selector */}
        <View className="flex-row items-center justify-between mb-4 bg-[#1E293B] p-2 rounded-xl border border-white/5 mt-2">
          <Pressable className="p-2" onPress={() => shiftDate(-7)}>
            <ChevronLeft size={20} color={COLORS.text.DEFAULT} />
          </Pressable>

          <Pressable
            onPress={() => setShowPicker(true)}
            className="flex-row items-center"
          >
            <CalendarIcon size={18} color="white" style={{ marginRight: 8 }} />
            <Text className="text-white text-base font-poppins-bold">{formatDateTitle(date)}</Text>
          </Pressable>

          <Pressable className="p-2" onPress={() => shiftDate(7)}>
            <ChevronRight size={20} color={COLORS.text.DEFAULT} />
          </Pressable>
        </View>

        {/* Date Picker Modal */}
        {showPicker && (
          Platform.OS === 'ios' ? (
            <Modal
              transparent={true}
              animationType="slide"
              visible={showPicker}
              onRequestClose={() => setShowPicker(false)}
            >
              <View className="flex-1 justify-end bg-black/50">
                <View className="bg-[#1E293B] pb-8 pt-4 rounded-t-3xl">
                  <View className="flex-row justify-between px-4 mb-4 border-b border-white/10 pb-2">
                    <Pressable onPress={() => setShowPicker(false)}>
                      <Text className="text-white">İptal</Text>
                    </Pressable>
                    <Pressable onPress={() => confirmDate()}>
                      <Text className="text-primary font-bold">Kaydet</Text>
                    </Pressable>
                  </View>
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    textColor="white"
                    themeVariant="dark"
                    locale="tr-TR"
                  />
                </View>
              </View>
            </Modal>
          ) : (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
              locale="tr-TR"
            />
          )
        )}

        {/* Weekly Horizontal List */}
        {viewMode === 'day' && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
            {getWeekDates().map((d, idx) => {
              const isSelected = d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
              return (
                <Pressable
                  key={idx}
                  onPress={() => setDate(d)}
                  className="mr-2 rounded-xl items-center justify-center w-14 h-14"
                  style={{
                    backgroundColor: isSelected ? COLORS.primary.DEFAULT : '#1E293B',
                    borderWidth: 1,
                    borderColor: isSelected ? COLORS.primary.DEFAULT : 'rgba(255,255,255,0.05)'
                  }}
                >
                  <Text
                    className="text-xs font-poppins mb-1 uppercase"
                    style={{ color: isSelected ? COLORS.background.DEFAULT : COLORS.text.secondary }}
                  >
                    {DAYS_TR[d.getDay()]}
                  </Text>
                  <Text
                    className="text-lg font-poppins-bold"
                    style={{ color: isSelected ? COLORS.background.DEFAULT : COLORS.text.DEFAULT }}
                  >
                    {d.getDate()}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </AdminHeader>

      {/* Staff Selector for Week Mode */}
      {viewMode === 'week' && (
        <View className="px-4 py-2 border-b border-white/5 mb-2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {staffList.map(staff => (
              <Pressable
                key={staff.id}
                onPress={() => setSelectedStaffId(staff.id)}
                className={`mr-3 px-4 py-2 rounded-full border ${selectedStaffId === staff.id || (!selectedStaffId && (staffList[0] && staffList[0].id === staff.id)) ? 'bg-primary border-primary' : 'bg-[#1E293B] border-white/10'}`}
              >
                <Text className={`text-xs font-bold ${selectedStaffId === staff.id || (!selectedStaffId && (staffList[0] && staffList[0].id === staff.id)) ? 'text-white' : 'text-slate-400'}`}>{staff.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Scheduler Grid Area */}
      {loading && appointments.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={COLORS.primary.DEFAULT} size="large" />
        </View>
      ) : staffList.length > 0 ? (
        <SchedulerGrid
          staffList={gridColumns}
          appointments={gridAppointments}
          onAppointmentPress={handleAppointmentPress}
          onSlotPress={handleCustomSlotPress}
        />
      ) : (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-white text-center font-bold text-lg mb-2">Henüz Personel Yok</Text>
          <Text className="text-slate-500 text-center">Takvimi kullanmak için önce "Ekip" sekmesinden personel eklemelisiniz.</Text>
        </View>
      )}
      <AppointmentDetailModal
        visible={detailModalVisible}
        appointment={selectedAppointment}
        onClose={() => setDetailModalVisible(false)}
        onDelete={handleDeleteAppointment}
      />

      {/* Slot Action Modal */}
      <Modal
        transparent
        visible={slotModalVisible}
        animationType="fade"
        onRequestClose={() => setSlotModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/60 items-center justify-center p-4"
          onPress={() => setSlotModalVisible(false)}
        >
          <View className="bg-[#1E293B] w-full max-w-sm rounded-2xl p-4 border border-white/10">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white font-bold text-lg">
                {selectedSlot?.time} - {selectedSlot?.staffName}
              </Text>
              <Pressable onPress={() => setSlotModalVisible(false)} className="p-1">
                <X size={20} color="#94A3B8" />
              </Pressable>
            </View>

            {/* Time Range Selector */}
            <View className="mb-4 flex-row gap-3">
              <View className="flex-1">
                <Text className="text-slate-400 text-xs font-bold mb-2 uppercase">Başlangıç</Text>
                <Pressable
                  onPress={() => setShowTimePicker('start')}
                  className="bg-white/5 border border-white/10 p-3 rounded-xl items-center active:bg-white/10"
                >
                  <Text className="text-white font-bold text-lg">
                    {blockStartTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </Pressable>
              </View>

              <View className="items-center justify-center pt-5">
                <Text className="text-slate-500 font-bold">-</Text>
              </View>

              <View className="flex-1">
                <Text className="text-slate-400 text-xs font-bold mb-2 uppercase">Bitiş</Text>
                <Pressable
                  onPress={() => setShowTimePicker('end')}
                  className="bg-white/5 border border-white/10 p-3 rounded-xl items-center active:bg-white/10"
                >
                  <Text className="text-white font-bold text-lg">
                    {blockEndTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* DateTimePicker Logic */}
            {showTimePicker && (
              Platform.OS === 'ios' ? (
                <Modal transparent animationType="fade">
                  <Pressable className="flex-1 bg-black/60 justify-end" onPress={() => setShowTimePicker(null)}>
                    <View className="bg-[#1E293B] pb-8 pt-4 rounded-t-3xl">
                      <View className="flex-row justify-between px-4 mb-4 border-b border-white/10 pb-2">
                        <Pressable onPress={() => setShowTimePicker(null)}>
                          <Text className="text-primary font-bold">Tamam</Text>
                        </Pressable>
                      </View>
                      <DateTimePicker
                        value={showTimePicker === 'start' ? blockStartTime : blockEndTime}
                        mode="time"
                        is24Hour={true}
                        minuteInterval={10}
                        display="spinner"
                        onChange={(e, d) => {
                          if (d) {
                            if (showTimePicker === 'start') {
                              setBlockStartTime(d);
                              if (d > blockEndTime) {
                                const newEnd = new Date(d);
                                newEnd.setMinutes(d.getMinutes() + 60);
                                setBlockEndTime(newEnd);
                              }
                            } else {
                              setBlockEndTime(d);
                            }
                          }
                        }}
                        textColor="white"
                        locale="tr-TR"
                      />
                    </View>
                  </Pressable>
                </Modal>
              ) : (
                <DateTimePicker
                  value={showTimePicker === 'start' ? blockStartTime : blockEndTime}
                  mode="time"
                  is24Hour={true}
                  minuteInterval={10}
                  display="default"
                  onChange={(e, d) => {
                    setShowTimePicker(null);
                    if (d) {
                      if (showTimePicker === 'start') setBlockStartTime(d);
                      else setBlockEndTime(d);
                    }
                  }}
                />
              )
            )}

            {/* Reason Selector */}
            <View className="mb-4">
              <Text className="text-slate-400 text-xs font-bold mb-2 uppercase">İşlem Türü</Text>
              <View className="flex-row gap-2 flex-wrap">
                {['Mola', 'Yemek', 'Dolu', 'Temizlik'].map(reason => (
                  <Pressable
                    key={reason}
                    onPress={() => setBlockReason(reason)}
                    className={`flex-1 min-w-[70px] items-center py-2 rounded-lg border ${blockReason === reason ? 'bg-orange-500/20 border-orange-500' : 'bg-white/5 border-white/10'}`}
                  >
                    <Text className={`${blockReason === reason ? 'text-orange-400' : 'text-slate-400'} font-bold text-xs`}>
                      {reason}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View className="flex-row gap-3">
              <Pressable
                className="flex-1 bg-primary/10 border border-primary/30 p-4 rounded-xl items-center active:bg-primary/20"
                onPress={handleAddBooking}
              >
                <UserPlus size={24} color={COLORS.primary.DEFAULT} className="mb-2" />
                <Text className="text-primary font-bold">Randevu Ekle</Text>
              </Pressable>

              <Pressable
                className="flex-1 bg-slate-800 border border-slate-700 p-4 rounded-xl items-center active:bg-slate-700"
                onPress={handleBlockTime}
              >
                <Lock size={24} color="#94A3B8" className="mb-2" />
                <Text className="text-slate-300 font-bold">Saati Kapat</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
