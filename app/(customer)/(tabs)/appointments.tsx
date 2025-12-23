import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, Pressable, StatusBar, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { Skeleton } from '@/components/ui/Skeleton';
import { BaseHeader } from '@/components/shared/layouts/BaseHeader';
import { CalendarDays, Star } from 'lucide-react-native';
import { WriteReviewModal } from '@/components/customer/WriteReviewModal';
import { useAuthStore } from '@/stores/authStore';
import { bookingService } from '@/services/bookings';

export default function AppointmentsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadBookings();
    }
  }, [user?.id]);

  const loadBookings = async () => {
    try {
      const data = await bookingService.getMyBookings(user?.id || '');
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Split bookings into upcoming and past
  const upcomingBookings = bookings.filter(b =>
    ['pending', 'confirmed'].includes(b.status)
  );
  const pastBookings = bookings.filter(b =>
    ['completed', 'cancelled'].includes(b.status)
  );

  const handleWriteReview = (appointment: any) => {
    setSelectedAppointment(appointment);
    setReviewModalVisible(true);
  };

  // Helper to format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
    return {
      date: date.getDate(),
      month: months[date.getMonth()]
    };
  };

  const renderAppointmentCard = (item: any) => (
    <View key={item.id} className={`bg-[#1E1E1E] rounded-xl overflow-hidden border ${item.isPending ? 'border-white/5' : 'border-white/5 hover:border-primary/30'} mb-4`}>
      {/* Status Strip */}
      <View className={`absolute top-0 left-0 w-1 h-full ${item.isPending ? 'bg-neutral-600' : 'bg-primary'}`} />

      <View className="flex-row p-4 gap-4 items-center">
        {/* Date Block */}
        <View className="items-center justify-center bg-[#2A2A2A] rounded-lg h-16 w-14 border border-white/5">
          <Text className={`font-bold text-lg leading-none ${item.isPending ? 'text-white' : 'text-primary'}`}>{item.date}</Text>
          <Text className="text-[#A0A0A0] text-xs font-medium uppercase mt-1">{item.month}</Text>
        </View>

        {/* Details */}
        <View className="flex-1">
          <View className="flex-row justify-between items-start">
            <Text className="text-white font-bold text-base">{item.barberName}</Text>
            <View className={`px-2 py-0.5 rounded border ${item.isPending ? 'bg-neutral-800 border-neutral-700' : 'bg-primary/10 border-primary/20'}`}>
              <Text className={`text-[10px] font-bold uppercase tracking-wider ${item.isPending ? 'text-neutral-400' : 'text-primary'}`}>{item.status}</Text>
            </View>
          </View>
          <Text className="text-[#A0A0A0] text-sm mt-0.5">{item.service}</Text>
          <View className="flex-row items-center gap-3 mt-1.5">
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="schedule" size={14} color={item.isPending ? '#d4d4d4' : COLORS.primary.DEFAULT} />
              <Text className={`text-xs font-medium ${item.isPending ? 'text-neutral-300' : 'text-primary'}`}>{item.time}</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="location-on" size={14} color="#A0A0A0" />
              <Text className="text-[#A0A0A0] text-xs">{item.location}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Action Footer */}
      <View className="bg-[#2A2A2A]/50 px-4 py-3 flex-row items-center justify-between border-t border-white/5">
        <View className="flex-row items-center gap-2">
          <Image source={{ uri: item.barberImage }} className="h-6 w-6 rounded-full border border-white/10" resizeMode="cover" />
          <Text className="text-xs text-[#A0A0A0]">Barber</Text>
        </View>
        <View className="flex-row gap-3">
          {item.isPending && (
            <Pressable>
              <Text className="text-xs text-red-400">İptal Et</Text>
            </Pressable>
          )}
          {item.status === 'Tamamlandı' && (
            <Pressable
              onPress={() => handleWriteReview(item)}
              className="flex-row items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-lg"
            >
              <Star size={14} color={COLORS.primary.DEFAULT} />
              <Text className="text-primary text-xs font-medium">Yorum Yaz</Text>
            </Pressable>
          )}
          <Pressable className="flex-row items-center gap-1">
            <Text className="text-white text-xs font-medium">Detaylar</Text>
            <MaterialIcons name="chevron-right" size={16} color="white" />
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-[#121212]">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <BaseHeader
        title="Randevularım"
        showNotifications
        noBorder
        leftElement={
          <View className="w-10 h-10 rounded-full bg-[#d4af35] items-center justify-center">
            <CalendarDays size={20} color="#121212" />
          </View>
        }
      >
        {/* Tabs */}
        <View className="pt-2 flex-row border-b border-white/10 mt-2">
          <Pressable
            className="flex-1 pb-3 items-center relative"
            onPress={() => setActiveTab('upcoming')}
          >
            <Text className={`font-bold text-sm tracking-wide ${activeTab === 'upcoming' ? 'text-primary' : 'text-[#A0A0A0]'}`}>YAKLAŞAN</Text>
            {activeTab === 'upcoming' && (
              <View className="absolute bottom-0 w-full h-[2px] bg-primary shadow-lg" />
            )}
          </Pressable>
          <Pressable
            className="flex-1 pb-3 items-center relative"
            onPress={() => setActiveTab('past')}
          >
            <Text className={`font-medium text-sm tracking-wide ${activeTab === 'past' ? 'text-primary' : 'text-[#A0A0A0]'}`}>GEÇMİŞ</Text>
            {activeTab === 'past' && (
              <View className="absolute bottom-0 w-full h-[2px] bg-primary shadow-lg" />
            )}
          </Pressable>
        </View>
      </BaseHeader>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {loading ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color={COLORS.primary.DEFAULT} />
            <Text className="text-gray-400 mt-4">Yükleniyor...</Text>
          </View>
        ) : activeTab === 'upcoming' ? (
          upcomingBookings.length > 0 ? (
            <>
              {upcomingBookings.map((booking) => {
                const dateInfo = formatDate(booking.booking_date);
                const item = {
                  id: booking.id,
                  barberName: booking.business_staff?.name || 'Personel',
                  service: booking.services?.name || 'Hizmet',
                  date: dateInfo.date,
                  month: dateInfo.month,
                  time: booking.start_time?.slice(0, 5) || '',
                  location: booking.businesses?.address || '',
                  status: booking.status === 'pending' ? 'Beklemede' : 'Onaylandı',
                  barberImage: booking.business_staff?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
                  isPending: booking.status === 'pending'
                };
                return renderAppointmentCard(item);
              })}

              {/* Promo Banner */}
              <LinearGradient
                colors={['rgba(212, 175, 53, 0.2)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="mt-4 rounded-xl p-4 border border-primary/20 relative overflow-hidden"
              >
                <View className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
                  <MaterialIcons name="content-cut" size={120} color={COLORS.primary.DEFAULT} />
                </View>
                <Text className="text-primary font-bold text-sm mb-1">VIP Üyelik</Text>
                <Text className="text-[#A0A0A0] text-xs max-w-[80%]">Sonraki randevunuzda %20 indirim kazanmak için VIP üyelik avantajlarını inceleyin.</Text>
                <Pressable className="mt-3">
                  <Text className="text-xs font-bold text-white underline decoration-primary underline-offset-4">İncele</Text>
                </Pressable>
              </LinearGradient>
            </>
          ) : (
            <View className="flex-1 items-center justify-center py-20">
              <View className="w-20 h-20 rounded-3xl bg-[#1E1E1E] items-center justify-center mb-6 shadow-2xl shadow-black border border-white/5 rotate-3">
                <MaterialIcons name="event-note" size={40} color={COLORS.primary.DEFAULT} />
              </View>
              <Text className="text-white text-xl font-bold mb-2">Henüz Randevunuz Yok</Text>
              <Text className="text-[#A0A0A0] text-center px-10 mb-8 leading-relaxed">
                Kendinizi şımartmaya hazır mısınız? Size özel hizmetlerimizden dilediğinizi seçin.
              </Text>
              <Pressable
                onPress={() => router.push('/(customer)/search')}
                className="bg-primary px-8 py-3.5 rounded-xl flex-row items-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-transform"
              >
                <MaterialIcons name="add-circle-outline" size={20} color="black" />
                <Text className="text-black font-bold text-base">Randevu Oluştur</Text>
              </Pressable>
            </View>
          )
        ) : (
          pastBookings.length > 0 ? (
            pastBookings.map((booking) => {
              const dateInfo = formatDate(booking.booking_date);
              const item = {
                id: booking.id,
                barberName: booking.business_staff?.name || 'Personel',
                service: booking.services?.name || 'Hizmet',
                date: dateInfo.date,
                month: dateInfo.month,
                time: booking.start_time?.slice(0, 5) || '',
                location: booking.businesses?.address || '',
                status: booking.status === 'completed' ? 'Tamamlandı' : 'İptal Edildi',
                barberImage: booking.business_staff?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
                isPending: false,
                // Extra data for review modal
                bookingId: booking.id,
                businessId: booking.business_id,
                staffId: booking.staff_id,
                businessName: booking.businesses?.name
              };
              return renderAppointmentCard(item);
            })
          ) : (
            <View className="flex-1 items-center justify-center py-20">
              <View className="w-20 h-20 rounded-full bg-[#1E1E1E] items-center justify-center mb-4 border border-white/5">
                <MaterialIcons name="history" size={32} color="#64748B" />
              </View>
              <Text className="text-white text-lg font-bold mb-2">Geçmiş Randevu Yok</Text>
              <Text className="text-[#A0A0A0] text-sm text-center">
                Tamamlanan randevularınız burada listelenecektir.
              </Text>
            </View>
          )
        )}
      </ScrollView>

      {/* Review Modal */}
      {selectedAppointment && (
        <WriteReviewModal
          visible={reviewModalVisible}
          onClose={() => {
            setReviewModalVisible(false);
            setSelectedAppointment(null);
          }}
          bookingId={selectedAppointment.id?.toString() || ''}
          businessId="mock-business-id"
          customerId={user?.id || ''}
          businessName={selectedAppointment.barberName}
          onSuccess={() => {
            // Refresh appointments or show success state
          }}
        />
      )}
    </View>
  );
}
