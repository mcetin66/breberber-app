import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Service = Database['public']['Tables']['services']['Row'];
type ServiceInsert = Database['public']['Tables']['services']['Insert'];
type ServiceUpdate = Database['public']['Tables']['services']['Update'];
type ServiceCategory = Database['public']['Tables']['service_categories']['Row'];

export const servicesApi = {
  async getByBusinessId(businessId: string) {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        service_categories (
          id,
          name,
          icon
        )
      `)
      .eq('business_id', businessId)
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        service_categories (
          id,
          name,
          icon
        ),
        businesses (
          id,
          name
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async create(service: ServiceInsert) {
    const { data, error } = await supabase
      .from('services')
      .insert(service as any)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: ServiceUpdate) {
    const { data, error } = await supabase
      .from('services')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('services')
      .update({ is_active: false } as any)
      .eq('id', id);

    if (error) throw error;
  },

  async getCategories() {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createCategory(category: Omit<ServiceCategory, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('service_categories')
      .insert(category as any)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
