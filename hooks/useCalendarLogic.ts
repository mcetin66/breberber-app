import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useBusinessStore } from '@/stores/businessStore';
import { useAuthStore } from '@/stores/authStore';
import { bookingService, createBooking as createBookingAlias } from '@/services/bookings';
import { format } from 'date-fns/format'; // Assuming date-fns is available or use native

// Helper to get week days based on a start date
export const getWeekDays = (startDate: Date) => {
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
export const formatTimeRange = (startTime: string, duration: number) => {
    const [h, m] = startTime.split(':').map(Number);
    const startMin = h * 60 + m;
    const endMin = startMin + duration;

    const endH = Math.floor(endMin / 60);
    const endM = endMin % 60;

    const endTime = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
    return `${startTime} - ${endTime}`;
};

export const useCalendarLogic = (initialDate: Date = new Date()) => {
    const [weekStartDate, setWeekStartDate] = useState(initialDate);
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [blockedTimes, setBlockedTimes] = useState<any[]>([]);
    const [isLoadingBookings, setIsLoadingBookings] = useState(false);

    // Create Modal Config
    const [createModalConfig, setCreateModalConfig] = useState<{
        staffId: string;
        staffName: string;
        date: Date;
        time: string;
        businessId: string;
        id?: string;
        customerName?: string;
        serviceIds?: string[];
        duration?: number;
        endTime?: string;
        notes?: string;
    } | null>(null);

    const [detailModalConfig, setDetailModalConfig] = useState<any>(null);

    // Store Hooks
    const { user } = useAuthStore();
    const { getStaff, fetchStaff, fetchServices, currentBusiness, getBusinessById, loading: storeLoading } = useBusinessStore();

    const businessId = user?.barberId;
    const { days: weekDays, title } = getWeekDays(weekStartDate);

    // Fetch Business Data
    useEffect(() => {
        if (businessId) {
            fetchStaff(businessId);
            fetchServices(businessId);
            if (!currentBusiness) {
                getBusinessById(businessId);
            }
        }
    }, [businessId]);

    // Fetch Bookings
    const refreshBookings = async () => {
        if (!businessId) return;
        setIsLoadingBookings(true);
        try {
            const queryStart = weekDays[0].fullDate.toISOString().split('T')[0];
            const queryEnd = weekDays[6].fullDate.toISOString().split('T')[0];

            const data = await bookingService.getBusinessBookings(businessId, {
                startDate: queryStart,
                endDate: queryEnd
            });

            console.log(`Hook: Found ${data.length} bookings`);
            const formatted = data.map((b: any) => {
                // Calculate Duration if not present (fallback)
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
                    date: new Date(b.booking_date),
                    startTime: b.start_time.slice(0, 5), // HH:MM
                    duration: b.services?.duration_minutes || duration || 30, // Prefer service duration
                    status: b.status,
                    notes: b.notes,
                    endTime: b.end_time
                };
            });
            setAppointments(formatted);

        } catch (err) {
            console.error("Hook: Booking Fetch Error:", err);
        } finally {
            setIsLoadingBookings(false);
        }
    };

    useEffect(() => {
        refreshBookings();
    }, [businessId, weekStartDate]);

    // Actions
    const handleCreateSave = async (data: any) => {
        // Basic Overlap Check
        const [newH, newM] = data.startTime.split(':').map(Number);
        const newStart = newH * 60 + newM;
        const newEnd = newStart + data.duration;

        const hasAptConflict = appointments.some(apt => {
            if (apt.staffId !== data.staffId || apt.date.toDateString() !== data.date.toDateString()) return false;
            const [aptH, aptM] = apt.startTime.split(':').map(Number);
            const aptStart = aptH * 60 + aptM;
            const aptEnd = aptStart + apt.duration;
            return (newStart < aptEnd && newEnd > aptStart) && apt.id !== data.id; // Ignore self if editing
        });

        if (hasAptConflict) {
            Alert.alert('Saat Çakışması', 'Seçilen saat aralığında başka bir randevu var.');
            return;
        }

        try {
            // Logic for Create/Update
            if (data.id) {
                // Update Logic
                // Calculate End Time
                const endMin = newStart + data.duration;
                const eH = Math.floor(endMin / 60);
                const eM = endMin % 60;
                const endTimeStr = `${eH.toString().padStart(2, '0')}:${eM.toString().padStart(2, '0')}`;

                await bookingService.update(data.id, {
                    customer_id: data.customerId || user?.id,
                    staff_id: data.staffId,
                    service_id: data.serviceIds?.[0] || null,
                    booking_date: data.date.toISOString().split('T')[0],
                    start_time: data.startTime,
                    end_time: endTimeStr,
                    total_price: data.totalPrice || 0,
                    status: data.status || 'confirmed',
                    notes: data.notes
                });

                // Optimistic Update
                setAppointments(prev => prev.map(a => a.id === data.id ? { ...a, ...data } : a)); // Simplified optimistic
            } else {
                // Create Logic - using the secure service 
                await createBookingAlias({
                    userId: data.customerId || user?.id,
                    businessId: businessId,
                    staffId: data.staffId,
                    serviceIds: data.serviceIds,
                    date: data.date.toISOString().split('T')[0],
                    startTime: data.startTime,
                    endTime: formatTimeRange(data.startTime, data.duration).split(' - ')[1],
                    totalPrice: data.totalPrice || 0,
                    notes: data.notes
                });
                // Trigger refresh to be safe or optimistic add
            }
            setCreateModalConfig(null);
            refreshBookings(); // Refresh to get proper data from DB
        } catch (error: any) {
            Alert.alert('Hata', error.message || 'İşlem başarısız.');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await bookingService.delete(id);
            setAppointments(prev => prev.filter(a => a.id !== id));
            setDetailModalConfig(null);
        } catch (error) {
            Alert.alert('Hata', 'Silme işlemi başarısız.');
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            // Optimistic
            setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
            setDetailModalConfig(null);
            // DB
            await bookingService.update(id, { status: newStatus as any });
        } catch (error) {
            Alert.alert('Hata', 'Durum güncellenemedi.');
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

    return {
        // State
        weekStartDate,
        selectedDate,
        setSelectedDate,
        appointments,
        blockedTimes,
        isLoading: isLoadingBookings || storeLoading,
        createModalConfig,
        setCreateModalConfig,
        detailModalConfig,
        setDetailModalConfig,

        // Actions
        nextWeek,
        prevWeek,
        refreshBookings,
        handleCreateSave, // Renamed in UI usage or keep same
        handleDelete,
        handleStatusChange,

        // Helpers
        weekDays,
        title,
        currentBusiness
    };
};
