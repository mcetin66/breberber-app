import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';
import { Service } from '@/types';
import { mapServiceToDomain, mapServiceToDb } from '@/utils/supabaseMapper';

type ServiceCategory = Database['public']['Tables']['service_categories']['Row'];

export const servicesApi = {
  async getByBusinessId(businessId: string): Promise<Service[]> {
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
      .order('name', { ascending: true });

    if (error) throw error;
    return (data || []).map(item => mapServiceToDomain(item));
  },

  async getById(id: string): Promise<Service | null> {
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
    return data ? mapServiceToDomain(data as any) : null;
  },

  async create(service: Partial<Service>): Promise<Service> {
    const dbPayload = mapServiceToDb(service);

    // Remove ID if present/empty
    if (!dbPayload.id) delete (dbPayload as any).id;

    const { data, error } = await (supabase
      .from('services') as any)
      .insert(dbPayload)
      .select()
      .single();

    if (error) throw error;
    return mapServiceToDomain(data);
  },

  async update(id: string, updates: Partial<Service>): Promise<Service> {
    const dbPayload = mapServiceToDb(updates);
    delete (dbPayload as any).id;

    const { data, error } = await (supabase
      .from('services') as any)
      .update(dbPayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapServiceToDomain(data);
  },

  async delete(id: string) {
    const { error } = await (supabase
      .from('services') as any)
      .update({ is_active: false })
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
    const { data, error } = await (supabase
      .from('service_categories') as any)
      .insert(category)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
