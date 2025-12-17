import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Staff = Database['public']['Tables']['business_staff']['Row'];
type StaffInsert = Database['public']['Tables']['business_staff']['Insert'];
type StaffUpdate = Database['public']['Tables']['business_staff']['Update'];
type WorkingHours = Database['public']['Tables']['staff_working_hours']['Row'];
type WorkingHoursInsert = Database['public']['Tables']['staff_working_hours']['Insert'];

export const staffService = {
  async getByBusinessId(businessId: string) {
    const { data, error } = await supabase
      .from('business_staff')
      .select(`
        *,
        staff_services (
          services (
            id,
            name,
            duration_minutes,
            price
          )
        ),
        staff_working_hours (*)
      `)
      .eq('business_id', businessId)
      .eq('is_active', true)
      .order('rating', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('business_staff')
      .select(`
        *,
        businesses (
          id,
          name,
          logo_url
        ),
        staff_services (
          services (
            id,
            name,
            description,
            duration_minutes,
            price
          )
        ),
        staff_working_hours (*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async create(staff: StaffInsert) {
    const { data, error } = await supabase
      .from('business_staff')
      .insert(staff)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: StaffUpdate) {
    const { data, error } = await supabase
      .from('business_staff')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    // Cast updates to any because Supabase types might be strict about what can be updated
    // or if the generated types don't match exactly.
    const { error } = await supabase
      .from('business_staff')
      .update({ is_active: false } as any)
      .eq('id', id);

    if (error) throw error;
  },

  async getWorkingHours(staffId: string) {
    const { data, error } = await supabase
      .from('staff_working_hours')
      .select('*')
      .eq('staff_id', staffId)
      .order('day_of_week', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async setWorkingHours(staffId: string, hours: WorkingHoursInsert[]) {
    await supabase
      .from('staff_working_hours')
      .delete()
      .eq('staff_id', staffId);

    // Casting hours to any[] to bypass potential mismatch in generated types vs insert array
    const { data, error } = await supabase
      .from('staff_working_hours')
      .insert(hours as any[])
      .select();

    if (error) throw error;
    return data || [];
  },

  async assignServices(staffId: string, serviceIds: string[]) {
    await supabase
      .from('staff_services')
      .delete()
      .eq('staff_id', staffId);

    if (serviceIds.length === 0) return [];

    const { data, error } = await supabase
      .from('staff_services')
      .insert(serviceIds.map(serviceId => ({
        staff_id: staffId,
        service_id: serviceId,
      })) as any[])
      .select();

    if (error) throw error;
    return data || [];
  },

  async getReviews(staffId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles:customer_id (
          full_name,
          avatar_url
        ),
        businesses (
          name
        )
      `)
      .eq('staff_id', staffId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};
