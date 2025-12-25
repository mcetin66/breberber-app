import { supabase } from '@/lib/supabase';
import type { Review } from '@/types';
import { mapReviewToDb, mapReviewToDomain } from '@/utils/supabaseMapper';

export const reviewService = {
  async create(review: Partial<Review>) {
    const dbPayload = mapReviewToDb(review);

    const { data, error } = await (supabase
      .from('reviews') as any)
      .insert(dbPayload)
      .select()
      .single();

    if (error) throw error;
    return mapReviewToDomain(data);
  },

  async update(id: string, updates: Partial<Review>) {
    const dbPayload = mapReviewToDb(updates);
    // Remove ID if present in payload to avoid update error
    delete dbPayload.id;

    const { data, error } = await (supabase
      .from('reviews') as any)
      .update(dbPayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapReviewToDomain(data);
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
    return data ? mapReviewToDomain(data as any) : null;
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
    return (data || []).map((r: any) => mapReviewToDomain(r));
  },

  async getMyReviews(userId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        businesses (
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
    return (data || []).map((r: any) => mapReviewToDomain(r));
  },
};
