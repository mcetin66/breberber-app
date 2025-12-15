import { create } from 'zustand';
import type { Staff, Service, Appointment, Barber } from '@/types';
import { businessService } from '@/services/businesses';
import { staffService } from '@/services/staff';
import { servicesApi } from '@/services/servicesApi';
import { bookingService } from '@/services/bookings';

interface BusinessData {
  staff: Staff[];
  services: Service[];
  appointments: Appointment[];
}

interface BusinessState {
  businesses: Barber[];
  currentBusiness: Barber | null;
  barberData: Record<string, BusinessData>;
  currentBarberId: string | null;
  loading: boolean;
  error: string | null;

  fetchBusinesses: () => Promise<void>;
  searchBusinesses: (query: string) => Promise<void>;
  getBusinessById: (id: string) => Promise<Barber | null>;
  updateBusiness: (id: string, updates: Partial<Barber>) => Promise<void>;
  fetchAppointmentsRange: (barberId: string, startDate: string, endDate: string) => Promise<void>;
  setCurrentBarberId: (barberId: string) => void;

  fetchStaff: (businessId: string) => Promise<void>;
  getStaff: (barberId: string) => Staff[];
  addStaff: (businessId: string, staff: Omit<Staff, 'id' | 'createdAt'>) => Promise<void>;
  updateStaff: (barberId: string, staffId: string, updates: Partial<Staff>) => Promise<void>;
  removeStaff: (barberId: string, staffId: string) => Promise<void>;

  fetchServices: (businessId: string) => Promise<void>;
  getServices: (barberId: string) => Service[];
  addService: (businessId: string, service: Omit<Service, 'id' | 'createdAt'>) => Promise<void>;
  updateService: (barberId: string, serviceId: string, updates: Partial<Service>) => Promise<void>;
  removeService: (barberId: string, serviceId: string) => Promise<void>;

  fetchAppointments: (barberId: string, date?: string) => Promise<void>;
  getAppointments: (barberId: string) => Appointment[];
  addAppointment: (barberId: string, appointment: Appointment) => void;
  createAppointment: (barberId: string, booking: any) => Promise<void>;
  updateAppointment: (barberId: string, appointmentId: string, updates: Partial<Appointment>) => void;
  cancelAppointment: (barberId: string, appointmentId: string) => void;
  deleteAppointment: (barberId: string, appointmentId: string) => Promise<void>;

  getAvailableSlots: (barberId: string, staffId: string, date: string, duration: number) => string[];

  financeStats: {
    revenue: number;
    revenueChange: number;
    customers: number;
    customerChange: number;
    transactions: Appointment[];
  };
  fetchFinanceStats: (barberId: string, period: 'day' | 'week' | 'month') => Promise<void>;
}

const initializeBarberData = (): BusinessData => ({
  staff: [],
  services: [],
  appointments: [],
});

export const useBusinessStore = create<BusinessState>((set, get) => ({
  businesses: [],
  currentBusiness: null,
  barberData: {},
  currentBarberId: null,
  loading: false,
  error: null,
  financeStats: {
    revenue: 0,
    revenueChange: 0,
    customers: 0,
    customerChange: 0,
    transactions: [],
  },

  fetchBusinesses: async () => {
    set({ loading: true, error: null });
    try {
      const businesses = await businessService.getAll();
      // Map DB fields to application type
      const mappedBusinesses = businesses.map((b: any) => ({
        ...b,
        coverImage: b.cover_url, // Map cover_url to coverImage
        address: b.address || '', // Ensure address is string
        city: b.city || '',
        isOpen: b.is_active, // Map is_active to isOpen
        subscriptionTier: b.subscription_tier || 'basic', // Map snake_case to camelCase
        subscriptionEndDate: b.subscription_end_date,
        workingHours: b.working_hours,
      }));
      set({ businesses: mappedBusinesses as unknown as Barber[], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  searchBusinesses: async (query: string) => {
    set({ loading: true, error: null });
    try {
      const businesses = await businessService.getAll({ search: query });
      set({ businesses: businesses as unknown as Barber[], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  getBusinessById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const business = await businessService.getById(id);
      set({ currentBusiness: business as unknown as Barber, loading: false });
      return business as unknown as Barber;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return null;
    }
  },

  updateBusiness: async (id: string, updates: Partial<Barber>) => {
    set({ loading: true, error: null });
    try {
      const dbUpdates: any = {
        name: updates.name,
        address: updates.address,
        phone: updates.phone,
        description: updates.description,
        city: updates.city,
        cover_url: updates.coverImage,
        is_active: updates.isOpen,
        working_hours: updates.workingHours,
      };

      // Remove undefined fields
      Object.keys(dbUpdates).forEach(key => dbUpdates[key] === undefined && delete dbUpdates[key]);

      await businessService.update(id, dbUpdates);

      const { currentBusiness, businesses } = get();
      if (currentBusiness && currentBusiness.id === id) {
        set({ currentBusiness: { ...currentBusiness, ...updates } });
      }

      // Update list as well
      const updatedList = businesses.map(b => b.id === id ? { ...b, ...updates } : b);
      set({ businesses: updatedList, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  setCurrentBarberId: (barberId) => {
    const { barberData } = get();
    if (!barberData[barberId]) {
      set({
        barberData: {
          ...barberData,
          [barberId]: initializeBarberData(),
        },
        currentBarberId: barberId,
      });
    } else {
      set({ currentBarberId: barberId });
    }
  },

  fetchStaff: async (businessId: string) => {
    set({ loading: true, error: null });
    try {
      const staffFromDb = await staffService.getByBusinessId(businessId);

      const mappedStaff = staffFromDb.map((s: any) => ({
        ...s,
        // Map joined services to simple string array for UI
        expertise: s.staff_services?.map((ss: any) => ss.services?.name).filter(Boolean) || [],

        // Map working hours (UI assumes same hours for all active days for now)
        workingHours: s.staff_working_hours?.[0] ? {
          start: s.staff_working_hours[0].start_time?.slice(0, 5), // Ensure HH:mm format
          end: s.staff_working_hours[0].end_time?.slice(0, 5),
          lunchStart: s.staff_working_hours[0].lunch_start?.slice(0, 5),
          lunchEnd: s.staff_working_hours[0].lunch_end?.slice(0, 5)
        } : undefined,

        workingDays: s.staff_working_hours?.map((h: any) => h.day_of_week) || []
      }));

      const { barberData } = get();
      set({
        barberData: {
          ...barberData,
          [businessId]: {
            ...barberData[businessId],
            staff: mappedStaff as unknown as Staff[],
          },
        },
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  getStaff: (barberId) => {
    const { barberData } = get();
    return barberData[barberId]?.staff || [];
  },

  addStaff: async (businessId, staffData) => {
    console.log('[Store] addStaff called', { businessId, staffData });
    set({ loading: true, error: null });
    try {
      const { expertise, workingHours, isActive, avatar, name, title, bio, rating, reviewCount, ...ignored } = staffData as any;

      const dbStaffData: any = {
        name, // Name is required usually
        is_active: isActive ?? true,
        avatar_url: avatar || null
      };

      if (title !== undefined) dbStaffData.title = title;
      if (bio !== undefined) dbStaffData.bio = bio;
      if (rating !== undefined) dbStaffData.rating = rating;
      if (reviewCount !== undefined) dbStaffData.review_count = reviewCount;

      console.log('[Store] Creating staff in DB', dbStaffData);

      // 1. Create Staff
      const newStaff = await staffService.create({ ...dbStaffData, business_id: businessId }) as any;

      console.log('[Store] Staff created result:', newStaff);

      if (!newStaff) throw new Error('Personel oluşturulamadı');

      // 2. Assign Services (Expertise)
      if (expertise && expertise.length > 0) {
        console.log('[Store] Assigning services', expertise);
        const { barberData } = get();
        const services = barberData[businessId]?.services || [];
        const serviceIds = services
          .filter(s => expertise.includes(s.name))
          .map(s => s.id);

        if (serviceIds.length > 0) {
          await staffService.assignServices(newStaff.id, serviceIds);
        }
      }

      // 3. Set Working Hours
      if (workingHours) {
        console.log('[Store] Setting working hours', workingHours);
        const days = [1, 2, 3, 4, 5, 6]; // Mon-Sat
        const hoursPayload = days.map(d => ({
          staff_id: newStaff.id,
          day_of_week: d,
          start_time: workingHours.start,
          end_time: workingHours.end,
          is_available: true
        }));
        await staffService.setWorkingHours(newStaff.id, hoursPayload);
      }

      // 4. Optimistic Update
      console.log('[Store] Applying optimistic update');
      const { barberData } = get();
      const currentData = barberData[businessId];

      const optimisticStaff = {
        ...newStaff,
        isActive: isActive ?? true,
        expertise: expertise || [],
        workingHours: workingHours || { start: '09:00', end: '19:00' },
        workingDays: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
        rating: 5.0,
        reviewCount: 0
      };

      if (currentData) {
        set({
          barberData: {
            ...barberData,
            [businessId]: {
              ...currentData,
              staff: [...currentData.staff, optimisticStaff as unknown as Staff]
            }
          },
          loading: false
        });
      }

      // 5. Refetch Validation
      console.log('[Store] Triggering refetch');
      await get().fetchStaff(businessId);
      console.log('[Store] Refetch complete');
    } catch (error: any) {
      console.error('[Store] Add Staff Error:', error);
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  updateStaff: async (barberId, staffId, updates) => {
    console.log('[Store] updateStaff STARTED', { barberId, staffId, updates });
    set({ loading: true, error: null });

    try {
      // 1. Sanitize Data
      const { expertise, workingHours, isActive, avatar, name, title, bio, rating, reviewCount, ...ignored } = updates as any;

      const dbUpdates: any = {};

      if (name !== undefined) dbUpdates.name = name;
      if (title !== undefined) dbUpdates.title = title;
      if (bio !== undefined) dbUpdates.bio = bio;
      if (rating !== undefined) dbUpdates.rating = rating;

      // Map special fields
      if (isActive !== undefined) dbUpdates.is_active = isActive;
      if (avatar !== undefined) dbUpdates.avatar_url = avatar;
      if (reviewCount !== undefined) dbUpdates.review_count = reviewCount;

      console.log('[Store] Sending to DB update:', dbUpdates);

      // 2. Perform DB Update
      let updatedStaff = null;
      if (Object.keys(dbUpdates).length > 0) {
        updatedStaff = await staffService.update(staffId, dbUpdates);
        console.log('[Store] DB Update Response:', updatedStaff);

        if (!updatedStaff) {
          throw new Error('Veritabanı güncellemesi başarısız oldu (Kayıt dönmedi).');
        }
      }

      // 3. Update Services
      if (expertise) {
        console.log('[Store] Updating expertise to:', expertise);
        const { barberData } = get();
        const services = barberData[barberId]?.services || [];
        const serviceIds = services.filter(s => expertise.includes(s.name)).map(s => s.id);
        await staffService.assignServices(staffId, serviceIds);
      }

      // 4. Update Working Hours
      if (workingHours) {
        console.log('[Store] Updating working hours to:', workingHours);
        const days = [1, 2, 3, 4, 5, 6];
        const hoursPayload = days.map(d => ({
          staff_id: staffId,
          day_of_week: d,
          start_time: workingHours.start,
          end_time: workingHours.end,
          is_available: true
        }));
        await staffService.setWorkingHours(staffId, hoursPayload);
      }

      console.log('[Store] All requests finished successfully. Refetching...');

      // 5. Refetch to valid
      await get().fetchStaff(barberId);
      console.log('[Store] Refetch complete. Update SUCCESS.');

    } catch (error: any) {
      console.error('[Store] Update Staff CRITICAL FAIL:', error);
      // Ensure the error state is set so UI can react
      set({ error: error.message || 'Güncelleme sırasında bilinmeyen bir hata oluştu.' });
      // Re-throw so the UI component's try-catch block catches it and shows Alert
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  removeStaff: async (barberId, staffId) => {
    set({ loading: true, error: null });
    try {
      await staffService.delete(staffId);
      const { barberData } = get();
      const currentData = barberData[barberId];
      if (!currentData) return;

      set({
        barberData: {
          ...barberData,
          [barberId]: {
            ...currentData,
            staff: currentData.staff.filter(s => s.id !== staffId),
          },
        },
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchServices: async (businessId: string) => {
    set({ loading: true, error: null });
    try {
      const services = await servicesApi.getByBusinessId(businessId);
      const { barberData } = get();
      set({
        barberData: {
          ...barberData,
          [businessId]: {
            ...barberData[businessId],
            services: services as unknown as Service[],
          },
        },
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  getServices: (barberId) => {
    const { barberData } = get();
    return barberData[barberId]?.services || [];
  },

  addService: async (businessId, serviceData) => {
    console.log('[Store] addService STARTED', { businessId, serviceData });
    set({ loading: true, error: null });
    try {
      const { isActive, duration, ...otherProps } = serviceData as any;

      const dbServiceData: any = {
        business_id: businessId,
        name: otherProps.name,
        price: otherProps.price,
        duration_minutes: duration ? parseInt(duration) : (otherProps.duration_minutes || 30),
        is_active: isActive ?? true
      };

      if (otherProps.description !== undefined) dbServiceData.description = otherProps.description;
      if (otherProps.category !== undefined) dbServiceData.category = otherProps.category;

      console.log('[Store] Creating Service DB Payload:', dbServiceData);

      const newService = await servicesApi.create(dbServiceData);
      console.log('[Store] Service Created:', newService);

      await get().fetchServices(businessId);

    } catch (error: any) {
      console.error('[Store] Add Service FAIL:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateService: async (barberId, serviceId, updates) => {
    console.log('[Store] updateService STARTED', { barberId, serviceId, updates });
    set({ loading: true, error: null });
    try {
      const { isActive, duration, ...otherUpdates } = updates as any;

      const dbUpdates: any = {};

      // Explicitly map allowed fields
      if (otherUpdates.name !== undefined) dbUpdates.name = otherUpdates.name;
      if (otherUpdates.description !== undefined) dbUpdates.description = otherUpdates.description;
      if (otherUpdates.price !== undefined) dbUpdates.price = otherUpdates.price;
      if (otherUpdates.category !== undefined) dbUpdates.category = otherUpdates.category;

      // Map overrides
      if (isActive !== undefined) dbUpdates.is_active = isActive;
      if (duration !== undefined) dbUpdates.duration_minutes = parseInt(duration); // Ensure number
      else if (otherUpdates.duration_minutes !== undefined) dbUpdates.duration_minutes = otherUpdates.duration_minutes;

      console.log('[Store] Sending to DB update (Service):', dbUpdates);

      if (Object.keys(dbUpdates).length > 0) {
        await servicesApi.update(serviceId, dbUpdates);
      }

      // Refetch for consistency
      await get().fetchServices(barberId);
      console.log('[Store] Service update SUCCESS');

    } catch (error: any) {
      console.error('[Store] Update Service FAIL:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  removeService: async (barberId, serviceId) => {
    set({ loading: true, error: null });
    try {
      await servicesApi.delete(serviceId);
      const { barberData } = get();
      const currentData = barberData[barberId];
      if (!currentData) return;

      set({
        barberData: {
          ...barberData,
          [barberId]: {
            ...currentData,
            services: currentData.services.filter(s => s.id !== serviceId),
          },
        },
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchAppointments: async (barberId, date) => {
    set({ loading: true, error: null });
    try {
      const bookings = await bookingService.getBusinessBookings(barberId, {
        startDate: date,
        endDate: date
      });

      const appointments: Appointment[] = bookings.map((b: any) => ({
        id: b.id,
        barberId: b.business_id, // Mapped correctly
        customerId: b.customer_id,
        staffId: b.staff_id,
        serviceId: b.service_id, // Added to match type
        serviceIds: [],
        date: b.booking_date,
        startTime: b.start_time,
        endTime: b.end_time,
        totalDuration: 0,
        totalPrice: b.total_price,
        status: b.status,
        notes: b.notes,
        createdAt: b.created_at,
        customerName: b.status === 'blocked' ? (b.notes || 'KAPALI') : b.profiles?.full_name,
        serviceName: b.status === 'blocked' ? 'Mola' : b.services?.name,
        staffName: b.business_staff?.name,
      }));

      const { barberData } = get();
      const currentData = barberData[barberId] || initializeBarberData();

      set({
        barberData: {
          ...barberData,
          [barberId]: {
            ...currentData,
            appointments,
          }
        },
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchAppointmentsRange: async (barberId, startDate, endDate) => {
    set({ loading: true, error: null });
    try {
      const bookings = await bookingService.getBusinessBookings(barberId, {
        startDate,
        endDate
      });

      const appointments: Appointment[] = bookings.map((b: any) => ({
        id: b.id,
        barberId: b.business_id,
        customerId: b.customer_id,
        staffId: b.staff_id,
        serviceId: b.service_id,
        serviceIds: [],
        date: b.booking_date,
        startTime: b.start_time,
        endTime: b.end_time,
        totalDuration: 0,
        totalPrice: b.total_price,
        status: b.status,
        notes: b.notes,
        createdAt: b.created_at,
        customerName: b.status === 'blocked' ? (b.notes || 'KAPALI') : b.profiles?.full_name,
        serviceName: b.status === 'blocked' ? 'Mola' : b.services?.name,
        staffName: b.business_staff?.name,
      }));

      const { barberData } = get();
      const currentData = barberData[barberId] || initializeBarberData();

      set({
        barberData: {
          ...barberData,
          [barberId]: {
            ...currentData,
            appointments,
          },
        },
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  getAppointments: (barberId) => {
    const { barberData } = get();
    return barberData[barberId]?.appointments || [];
  },

  addAppointment: (barberId, appointment) => {
    const { barberData } = get();
    const currentData = barberData[barberId] || initializeBarberData();

    set({
      barberData: {
        ...barberData,
        [barberId]: {
          ...currentData,
          appointments: [...currentData.appointments, appointment],
        },
      },
    });
  },

  createAppointment: async (barberId, bookingData) => {
    set({ loading: true, error: null });
    try {
      const newBooking = await bookingService.create({
        business_id: barberId,
        ...bookingData
      }) as any;

      // Convert to Appointment type
      const appt: Appointment = {
        id: newBooking.id,
        barberId: newBooking.business_id,
        staffId: newBooking.staff_id,
        customerId: newBooking.customer_id || '',
        serviceId: newBooking.service_id || '',
        date: newBooking.booking_date,
        startTime: newBooking.start_time,
        endTime: newBooking.end_time,
        status: newBooking.status as any,
        totalPrice: newBooking.total_price || 0,
        customerName: newBooking.status === 'blocked' ? (newBooking.notes || 'KAPALI') : 'KAPALI',
        serviceName: 'Mola',
        staffName: '',
      };

      get().addAppointment(barberId, appt);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateAppointment: (barberId, appointmentId, updates) => {
    const { barberData } = get();
    const currentData = barberData[barberId];
    if (!currentData) return;

    set({
      barberData: {
        ...barberData,
        [barberId]: {
          ...currentData,
          appointments: currentData.appointments.map(a =>
            a.id === appointmentId ? { ...a, ...updates } : a
          ),
        },
      },
    });
  },

  cancelAppointment: (barberId, appointmentId) => {
    get().updateAppointment(barberId, appointmentId, { status: 'cancelled' });
  },

  deleteAppointment: async (barberId, appointmentId) => {
    set({ loading: true, error: null });
    try {
      await bookingService.delete(appointmentId);
      // Update local state by removing it
      const { barberData } = get();
      const currentData = barberData[barberId];
      if (currentData) {
        set({
          barberData: {
            ...barberData,
            [barberId]: {
              ...currentData,
              appointments: currentData.appointments.filter(a => a.id !== appointmentId)
            }
          },
          loading: false
        });
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  getAvailableSlots: (barberId, staffId, date, duration) => {
    const slots: string[] = [];
    const startHour = 9;
    const endHour = 19;
    const slotInterval = 15;

    const appointments = get().getAppointments(barberId).filter(
      a => a.staffId === staffId && a.date === date && a.status !== 'cancelled'
    );

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotInterval) {
        const slotTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

        const isAvailable = !appointments.some(a => {
          // Robust date parsing (simplified for example)
          // In a real app, use date-fns or similar for robust time comparison
          const aStart = a.startTime ? new Date(`2000-01-01 ${a.startTime}`) : new Date(0);
          const aEnd = a.endTime ? new Date(`2000-01-01 ${a.endTime}`) : new Date(0);
          const sStart = new Date(`2000-01-01 ${slotTime}`);
          const sEnd = new Date(sStart.getTime() + duration * 60000);

          return (sStart >= aStart && sStart < aEnd) || (sEnd > aStart && sEnd <= aEnd);
        });

        if (isAvailable) {
          slots.push(slotTime);
        }
      }
    }

    return slots;
  },

  fetchFinanceStats: async (barberId: string, period: 'day' | 'week' | 'month') => {
    set({ loading: true, error: null });
    try {
      const now = new Date();
      let startDate = new Date();
      let endDate = new Date();

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      if (period === 'week') {
        const day = startDate.getDay();
        const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
        startDate.setDate(diff);
        endDate.setDate(startDate.getDate() + 6);
      } else if (period === 'month') {
        startDate.setDate(1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
      }

      const bookings = await bookingService.getBusinessBookings(barberId, {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      });

      // Include confirmed and completed for revenue stats
      const validBookings = bookings.filter((b: any) =>
        b.status === 'completed' || b.status === 'confirmed'
      );

      const revenue = validBookings.reduce((sum: number, booking: any) => sum + (booking.total_price || 0), 0);
      const uniqueCustomers = new Set(validBookings.map((b: any) => b.customer_id)).size;

      const transactions: Appointment[] = bookings.map((b: any) => ({
        id: b.id,
        barberId: b.business_id, // FIX: businessId -> barberId
        staffId: b.staff_id,
        serviceId: b.service_id,
        serviceIds: [],
        customerId: b.customer_id,
        date: b.booking_date,
        startTime: b.start_time,
        endTime: b.end_time,
        status: b.status,
        totalPrice: b.total_price || 0,
        totalDuration: 0,
        customerName: b.profiles?.full_name || 'Misafir',
        serviceName: b.services?.name || 'Hizmet',
        staffName: b.business_staff?.name || 'Personel',
        createdAt: b.created_at
      })).slice(0, 10);

      set({
        financeStats: {
          revenue,
          revenueChange: 0,
          customers: uniqueCustomers,
          customerChange: 0,
          transactions,
        },
        loading: false
      });

    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
