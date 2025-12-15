import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { BookingFlow, Service, Barber, Staff, Appointment } from '@/types';
import * as bookingsApi from '@/services/bookings';

interface BookingState extends BookingFlow {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;

  setBarber: (barber: Barber) => void;
  setStaff: (staff: Staff) => void;
  addService: (service: Service) => void;
  removeService: (serviceId: string) => void;
  clearServices: () => void;
  setDateTime: (date: string, slot: string) => void;
  setNotes: (notes: string) => void;
  calculateTotals: () => void;
  resetBooking: () => void;

  createBooking: (userId: string) => Promise<Appointment | null>;
  fetchUserAppointments: (userId: string) => Promise<void>;
  cancelAppointment: (appointmentId: string) => Promise<void>;
}

const initialState: BookingFlow = {
  barberId: undefined,
  barber: undefined,
  staffId: undefined,
  staff: undefined,
  selectedServices: [],
  selectedDate: undefined,
  selectedSlot: undefined,
  notes: undefined,
  totalDuration: 0,
  totalPrice: 0,
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      ...initialState,
      appointments: [],
      loading: false,
      error: null,

      setBarber: (barber) =>
        set({
          barberId: barber.id,
          barber
        }),

      setStaff: (staff) =>
        set({
          staffId: staff.id,
          staff
        }),

      addService: (service) => {
        const { selectedServices } = get();
        const exists = selectedServices.find(s => s.id === service.id);

        if (!exists) {
          const newServices = [...selectedServices, service];
          set({ selectedServices: newServices });
          get().calculateTotals();
        }
      },

      removeService: (serviceId) => {
        const { selectedServices } = get();
        const newServices = selectedServices.filter(s => s.id !== serviceId);
        set({ selectedServices: newServices });
        get().calculateTotals();
      },

      clearServices: () => {
        set({ selectedServices: [] });
        get().calculateTotals();
      },

      setDateTime: (date, slot) =>
        set({
          selectedDate: date,
          selectedSlot: slot
        }),

      setNotes: (notes) =>
        set({ notes }),

      calculateTotals: () => {
        const { selectedServices } = get();
        const totalDuration = selectedServices.reduce((sum, service) => sum + service.duration, 0);
        const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0);
        set({ totalDuration, totalPrice });
      },

      resetBooking: () =>
        set({ ...initialState, appointments: get().appointments }),

      createBooking: async (userId: string) => {
        const state = get();

        if (!state.barberId || !state.staffId || !state.selectedDate || !state.selectedSlot || state.selectedServices.length === 0) {
          set({ error: 'Missing required booking information' });
          return null;
        }

        set({ loading: true, error: null });
        try {
          const startTime = state.selectedSlot;
          const [hours, minutes] = startTime.split(':').map(Number);
          const endDate = new Date();
          endDate.setHours(hours, minutes + state.totalDuration, 0, 0);
          const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;

          const appointment = await bookingsApi.createBooking({
            userId,
            businessId: state.barberId,
            staffId: state.staffId,
            serviceIds: state.selectedServices.map(s => s.id),
            date: state.selectedDate,
            startTime,
            endTime,
            totalPrice: state.totalPrice,
            notes: state.notes,
          }) as any; // Cast because Api return type might differ from Appointment interface slightly

          set({
            appointments: [...state.appointments, appointment],
            loading: false
          });
          get().resetBooking();
          return appointment;
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
          return null;
        }
      },

      fetchUserAppointments: async (userId: string) => {
        set({ loading: true, error: null });
        try {
          const appointments = await bookingsApi.getUserBookings(userId) as any[];
          set({ appointments, loading: false });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      cancelAppointment: async (appointmentId: string) => {
        set({ loading: true, error: null });
        try {
          await bookingsApi.cancelBooking(appointmentId);
          const state = get();
          set({
            appointments: state.appointments.map(apt =>
              apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
            ),
            loading: false,
          });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },
    }),
    {
      name: 'booking-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        barberId: state.barberId,
        barber: state.barber,
        staffId: state.staffId,
        staff: state.staff,
        selectedServices: state.selectedServices,
        totalDuration: state.totalDuration,
        totalPrice: state.totalPrice,
      }),
    }
  )
);
