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
  updateAppointment: (barberId: string, appointmentId: string, updates: Partial<Appointment>) => void;
  cancelAppointment: (barberId: string, appointmentId: string) => void;

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
      const staff = await staffService.getByBusinessId(businessId);
      const { barberData } = get();
      set({
        barberData: {
          ...barberData,
          [businessId]: {
            ...barberData[businessId],
            staff: staff as unknown as Staff[],
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
    set({ loading: true, error: null });
    try {
      const newStaff = await staffService.create({ ...staffData, business_id: businessId } as any);
      const { barberData } = get();
      const currentData = barberData[businessId] || initializeBarberData();

      set({
        barberData: {
          ...barberData,
          [businessId]: {
            ...currentData,
            staff: [...currentData.staff, newStaff as unknown as Staff],
          },
        },
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateStaff: async (barberId, staffId, updates) => {
    set({ loading: true, error: null });
    try {
      await staffService.update(staffId, updates as any);
      const { barberData } = get();
      const currentData = barberData[barberId];
      if (!currentData) return;

      set({
        barberData: {
          ...barberData,
          [barberId]: {
            ...currentData,
            staff: currentData.staff.map(s =>
              s.id === staffId ? { ...s, ...updates } : s
            ),
          },
        },
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
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
    set({ loading: true, error: null });
    try {
      const newService = await servicesApi.create({ ...serviceData, business_id: businessId } as any);
      const { barberData } = get();
      const currentData = barberData[businessId] || initializeBarberData();

      set({
        barberData: {
          ...barberData,
          [businessId]: {
            ...currentData,
            services: [...currentData.services, newService as unknown as Service],
          },
        },
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateService: async (barberId, serviceId, updates) => {
    set({ loading: true, error: null });
    try {
      await servicesApi.update(serviceId, updates as any);
      const { barberData } = get();
      const currentData = barberData[barberId];
      if (!currentData) return;

      set({
        barberData: {
          ...barberData,
          [barberId]: {
            ...currentData,
            services: currentData.services.map(s =>
              s.id === serviceId ? { ...s, ...updates } : s
            ),
          },
        },
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
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
        customerName: b.profiles?.full_name,
        serviceName: b.services?.name,
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
        status: 'completed'
      });

      const revenue = bookings.reduce((sum: number, booking: any) => sum + (booking.total_price || 0), 0);
      const uniqueCustomers = new Set(bookings.map((b: any) => b.customer_id)).size;

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
