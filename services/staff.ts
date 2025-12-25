import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';
import { StaffProfile } from '@/types';
import { mapStaffToDomain, mapStaffToDb } from '@/utils/supabaseMapper';

type Staff = Database['public']['Tables']['business_staff']['Row'];

export const staffService = {
  async getByBusinessId(businessId: string): Promise<StaffProfile[]> {
    const { data, error } = await supabase
      .from('business_staff')
      .select(`
        *,
        staff_services(service_id, services(name)),
        staff_working_hours(*)
      `)
      .eq('business_id', businessId)
      .eq('is_active', true)
      .order('is_active', { ascending: false }) // Active first
      .order('name', { ascending: true });

    if (error) throw error;
    return (data || []).map(item => mapStaffToDomain(item as any));
  },

  async create(staffData: Partial<StaffProfile>): Promise<StaffProfile> {
    const dbPayload = mapStaffToDb(staffData);

    // Remove ID if empty
    if (!dbPayload.id) delete (dbPayload as any).id;

    const { data, error } = await supabase
      .from('business_staff')
      .insert(dbPayload)
      .select()
      .single();

    if (error) throw error;
    return mapStaffToDomain(data as any);
  },

  async update(staffId: string, updates: Partial<StaffProfile>): Promise<StaffProfile> {
    const dbPayload = mapStaffToDb(updates);
    delete (dbPayload as any).id;

    const { data, error } = await supabase
      .from('business_staff')
      .update({ ...dbPayload, updated_at: new Date().toISOString() } as any)
      .eq('id', staffId)
      .select()
      .single();

    if (error) throw error;
    return mapStaffToDomain(data as any);
  },

  async delete(staffId: string) {
    const { error } = await supabase
      .from('business_staff')
      .update({ is_active: false } as any)
      .eq('id', staffId);

    if (error) throw error;
  },

  async assignServices(staffId: string, serviceIds: string[]) {
    // Service logic remains same, handles junction table
    const { error: deleteError } = await supabase
      .from('staff_services')
      .delete()
      .eq('staff_id', staffId);

    if (deleteError) throw deleteError;

    if (serviceIds.length > 0) {
      const assignments = serviceIds.map(serviceId => ({
        staff_id: staffId,
        service_id: serviceId,
      }));

      const { error } = await supabase
        .from('staff_services')
        .insert(assignments as any);

      if (error) throw error;
    }
  },

  async setWorkingHours(staffId: string, hours: Array<Record<string, any>>) {
    // Working hours logic remains same
    const { error: deleteError } = await supabase
      .from('staff_working_hours')
      .delete()
      .eq('staff_id', staffId);

    if (deleteError) throw deleteError;

    if (hours.length > 0) {
      const { error } = await supabase
        .from('staff_working_hours')
        .insert(hours.map(h => ({ ...h, staff_id: staffId })) as any);

      if (error) throw error;
    }
  },
};

// Backward compatibility alias
export const StaffService = staffService;

