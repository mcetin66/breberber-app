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
      .insert(booking)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: BookingUpdate) {
    const { data, error } = await supabase
      .from('bookings')
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

    const bookedSlots = bookings?.map(b => ({
      start: b.start_time,
      end: b.end_time,
    })) || [];

    return {
      workingHours,
      bookedSlots,
    };
  },
};
