import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Favorite = Database['public']['Tables']['favorites']['Row'];

export const favoriteService = {
  async getMyFavorites(userId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        businesses (
          id,
          name,
          description,
          logo_url,
          cover_url,
          address,
          city,
          rating,
          review_count,
          phone
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async isFavorite(userId: string, businessId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('business_id', businessId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },

  async add(userId: string, businessId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: userId,
        business_id: businessId,
      } as any)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('Bu işletme zaten favorilerinizde');
      }
      throw error;
    }
    return data;
  },

  async remove(userId: string, businessId: string) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('business_id', businessId);

    if (error) throw error;
  },

  async toggle(userId: string, businessId: string) {
    const isFav = await this.isFavorite(userId, businessId);

    if (isFav) {
      await this.remove(userId, businessId);
      return false;
    } else {
      await this.add(userId, businessId);
      return true;
    }
  },
};
