import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Review = Database['public']['Tables']['reviews']['Row'];
type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];
type ReviewUpdate = Database['public']['Tables']['reviews']['Update'];

export const reviewService = {
  async create(review: ReviewInsert) {
    const { data, error } = await (supabase
      .from('reviews') as any)
      .insert(review)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: ReviewUpdate) {
    const { data, error } = await (supabase
      .from('reviews') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await (supabase
      .from('reviews') as any)
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getByBookingId(bookingId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('booking_id', bookingId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getByBusinessId(businessId: string) {
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

  async getMyReviews(userId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        businesses (
          id,
          name,
          logo_url
        ),
        business_staff:staff_id (
          name
        )
      `)
      .eq('customer_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};
