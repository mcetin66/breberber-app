import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Booking = Database['public']['Tables']['bookings']['Row'];
type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
type BookingUpdate = Database['public']['Tables']['bookings']['Update'];

export const bookingService = {
  async getMyBookings(userId: string, status?: Booking['status']) {
    let query = supabase
      .from('bookings')
      .select(`
        *,
        businesses (
          id,
          name,
          logo_url,
          address,
          phone
        ),
        business_staff (
          id,
          name,
          avatar_url
        ),
        services (
          id,
          name,
          duration_minutes,
          price
        )
      `)
      .eq('customer_id', userId)
      .order('booking_date', { ascending: false })
      .order('start_time', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async getBusinessBookings(businessId: string, filters?: {
    status?: Booking['status'];
    startDate?: string;
    endDate?: string;
    staffId?: string;
  }) {
    let query = supabase
      .from('bookings')
      .select(`
        *,
        profiles:customer_id (
          id,
          full_name,
          phone,
          avatar_url
        ),
        business_staff (
          id,
          name,
          avatar_url
        ),
        services (
          id,
          name,
          duration_minutes,
          price
        )
      `)
      .eq('business_id', businessId)
      .order('booking_date', { ascending: true })
      .order('start_time', { ascending: true });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.startDate) {
      query = query.gte('booking_date', filters.startDate);
    }

    if (filters?.endDate) {
      query = query.lte('booking_date', filters.endDate);
    }

    if (filters?.staffId) {
      query = query.eq('staff_id', filters.staffId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async getStaffBookings(staffId: string, filters?: {
    status?: Booking['status'];
    date?: string;
  }) {
    let query = supabase
      .from('bookings')
      .select(`
        *,
        profiles:customer_id (
          id,
          full_name,
          phone,
          avatar_url
        ),
        businesses (
          id,
          name,
          logo_url
        ),
        services (
          id,
          name,
          duration_minutes,
          price
        )
      `)
      .eq('staff_id', staffId)
      .order('booking_date', { ascending: true })
      .order('start_time', { ascending: true });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.date) {
      query = query.eq('booking_date', filters.date);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        profiles:customer_id (
          id,
          full_name,
          phone,
          email,
          avatar_url
        ),
        businesses (
          id,
          name,
          logo_url,
          address,
          phone,
          email
        ),
        business_staff (
          id,
          name,
          avatar_url,
          title
        ),
        services (
          id,
          name,
          description,
          duration_minutes,
          price
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async create(booking: BookingInsert) {
    const { data, error } = await supabase
      .from('bookings')
      // @ts-ignore
      .insert(booking)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: BookingUpdate) {
    const { data, error } = await supabase
      .from('bookings')
      // @ts-ignore
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async cancel(id: string, reason?: string) {
    return this.update(id, {
      status: 'cancelled',
      cancellation_reason: reason || null,
    });
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async confirm(id: string) {
    return this.update(id, {
      status: 'confirmed',
    });
  },

  async complete(id: string) {
    return this.update(id, {
      status: 'completed',
    });
  },

  async getAvailableSlots(staffId: string, date: string) {
    const { data: workingHours, error: whError } = await supabase
      .from('staff_working_hours')
      .select('*')
      .eq('staff_id', staffId)
      .eq('is_available', true)
      .maybeSingle();

    if (whError) throw whError;
    if (!workingHours) return [];

    const { data: bookings, error: bookingError } = await supabase
      .from('bookings')
      .select('start_time, end_time')
      .eq('staff_id', staffId)
      .eq('booking_date', date)
      .in('status', ['pending', 'confirmed']);

    if (bookingError) throw bookingError;

    const bookedSlots = (bookings as any[])?.map(b => ({
      start: b.start_time,
      end: b.end_time,
    })) || [];

    return {
      workingHours,
      bookedSlots,
    };
  },
};

// Aliases for compatibility with bookingStore
export const createBooking = async (params: any) => {
  // Convert friendly params to DB params if needed, or just pass through
  // The store passes: { userId, businessId, staffId, serviceIds, date, startTime, endTime, totalPrice, notes }
  // The DB expects: { customer_id, business_id, staff_id, service_id (single?), booking_date, start_time, end_time, total_price, notes }

  // Note: DB schema has 'service_id' (singular). But store passes serviceIds (plural).
  // If we support multiple services per booking, we might need a separate table or just pick the first one for the main reference.
  // The schema I saw earlier: `service_id UUID REFERENCES services` in bookings.
  // So it seems it supports single service per booking, OR we need to handle multiple.
  // Assuming single service for now or primary service.

  const { userId, businessId, staffId, serviceIds, date, startTime, endTime, totalPrice, notes } = params;

  // --- VALIDATION: 10-Minute Rule ---
  if (!startTime) throw new Error('Başlangıç saati zorunludur.');

  const [h, m] = startTime.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) throw new Error('Geçersiz saat formatı.');

  if (m % 10 !== 0) {
    throw new Error('Randevu başlangıç saati 10 dakikanın katı olmalıdır (Örn: 10:00, 10:10).');
  }

  if (endTime) {
    const [eh, em] = endTime.split(':').map(Number);
    const startMins = h * 60 + m;
    const endMins = eh * 60 + em;
    const duration = endMins - startMins;

    if (duration > 0 && duration % 10 !== 0) {
      throw new Error('Randevu süresi 10 dakikanın katı olmalıdır.');
    }
  }
  // ----------------------------------

  return bookingService.create({
    customer_id: userId,
    business_id: businessId,
    staff_id: staffId,
    service_id: serviceIds[0], // Taking the first one as primary
    booking_date: date,
    start_time: startTime,
    end_time: endTime,
    total_price: totalPrice,
    notes: notes,
    status: 'pending'
  } as any);
};

export const getUserBookings = bookingService.getMyBookings;
export const cancelBooking = bookingService.cancel;
