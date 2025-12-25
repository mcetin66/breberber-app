import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';
import { Barber } from '@/types';
import { mapBusinessToDomain, mapBusinessToDb } from '@/utils/supabaseMapper';

type Business = Database['public']['Tables']['businesses']['Row'];

export const businessService = {
  async getAll(filters?: { city?: string; search?: string }): Promise<Barber[]> {
    let query = supabase
      .from('businesses')
      .select('*')
      .eq('is_active', true)
      .order('rating', { ascending: false });

    if (filters?.city) {
      query = query.eq('city', filters.city);
    }

    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []).map(item => mapBusinessToDomain(item));
  },

  async getById(id: string): Promise<Barber | null> {
    const { data, error } = await supabase
      .from('businesses')
      .select(`
        *,
        business_staff (
          id,
          name,
          title,
          avatar_url,
          bio,
          rating,
          review_count,
          is_active
        ),
        services (
          id,
          name,
          description,
          duration_minutes,
          price,
          is_active,
          service_categories (
            id,
            name,
            icon
          )
        )
      `)
      .eq('id', id)
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;
    return data ? mapBusinessToDomain(data as any) : null;
  },

  async getMyBusinesses(ownerId: string): Promise<Barber[]> {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(item => mapBusinessToDomain(item));
  },

  async create(business: Partial<Barber>): Promise<Barber> {
    const dbPayload = mapBusinessToDb(business);

    const { data, error } = await supabase
      .from('businesses')
      .insert(dbPayload)
      .select()
      .single();

    if (error) throw error;
    return mapBusinessToDomain(data);
  },

  async update(id: string, updates: Partial<Barber>): Promise<Barber> {
    const dbPayload = mapBusinessToDb(updates);
    delete (dbPayload as any).id;

    const { data, error } = await supabase
      .from('businesses')
      .update(dbPayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapBusinessToDomain(data);
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('businesses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getReviews(businessId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles:customer_id (
          full_name,
          avatar_url
        ),
        business_staff:staff_id (
          name
        )
      `)
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getNearby(latitude: number, longitude: number, radiusKm: number = 10): Promise<Barber[]> {
    // @ts-ignore
    const { data, error } = await supabase.rpc('nearby_businesses', {
      lat: latitude,
      long: longitude,
      radius_km: radiusKm,
    });

    if (error) {
      console.warn('Nearby search not available, falling back to all businesses');
      return this.getAll();
    }

    return ((data as any[]) || []).map((item: any) => mapBusinessToDomain(item));
  },
};
