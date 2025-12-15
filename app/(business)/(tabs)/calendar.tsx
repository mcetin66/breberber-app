import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react-native';
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
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const { user } = useAuthStore();
  const { fetchAppointments, getAppointments, fetchStaff, getStaff, loading } = useBusinessStore();

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




  useEffect(() => {
    if (barberId) {
      const dateStr = date.toISOString().split('T')[0];
      fetchAppointments(barberId, dateStr);
      if (staffList.length === 0) {
        fetchStaff(barberId);
      }
    }
  }, [date, barberId]);

  // Generate 7 days centered on selected date
  const getWeekDates = () => {
    const days = [];
    for (let i = -3; i <= 3; i++) {
      const d = new Date(date);
      d.setDate(date.getDate() + i);
      days.push(d);
    }
    return days;
  };

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
    // Future
  };

  const formatDateTitle = (d: Date) => {
    return `${MONTHS_TR[d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0F172A]" edges={['top']}>
      <AdminHeader
        title="Takvim"
        subtitle="Randevu Yönetimi"
        rightElement={
          <Pressable
            onPress={() => setDate(new Date())}
            className="px-3 py-1.5 rounded-full bg-[#1E293B] border border-white/10 active:bg-white/5"
          >
            <Text className="text-primary text-xs font-bold">Bugün</Text>
          </Pressable>
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
          {getWeekDates().map((d, idx) => {
            const isSelected = d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
            return (
              <Pressable
                key={idx}
                onPress={() => setDate(d)}
                className="mr-2 rounded-xl p-3 w-16 items-center justify-center"
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
      </AdminHeader>

      {/* Scheduler Grid Area */}
      {loading && appointments.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={COLORS.primary.DEFAULT} size="large" />
        </View>
      ) : staffList.length > 0 ? (
        <SchedulerGrid
          staffList={staffList}
          appointments={appointments}
          onAppointmentPress={handleAppointmentPress}
          onSlotPress={handleSlotPress}
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
      />
    </SafeAreaView>
  );
}
