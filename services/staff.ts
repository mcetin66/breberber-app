import { StaffProfile } from '@/types';

// Mock data for now, will replace with Supabase calls
const MOCK_STAFF: StaffProfile[] = [
  {
    id: '1',
    business_id: 'biz_1',
    user_id: 'user_1',
    name: 'Ahmet Yılmaz',
    full_name: 'Ahmet Yılmaz',
    title: 'Senior Barber',
    bio: '10 yıllık tecrübe.',
    rating: 4.8,
    review_count: 120,
    role: 'owner',
    phone: '5551234567',
    avatar_url: 'https://i.pravatar.cc/150?u=1',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    business_id: 'biz_1',
    user_id: 'user_2',
    name: 'Mehmet Demir',
    full_name: 'Mehmet Demir',
    title: 'Barber',
    bio: 'Genç yetenek.',
    rating: 4.5,
    review_count: 45,
    role: 'staff',
    phone: '5559876543',
    avatar_url: 'https://i.pravatar.cc/150?u=2',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const StaffService = {
  fetchStaff: async (tenantId: string): Promise<{ data: StaffProfile[] | null; error: string | null }> => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return { data: MOCK_STAFF, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  createStaff: async (staff: Partial<StaffProfile>): Promise<{ data: StaffProfile | null; error: string | null }> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real implementation, this would join with profiles table
      const newStaff: StaffProfile = {
        id: Math.random().toString(36).substr(2, 9),
        business_id: 'biz_1',
        user_id: `user_${Math.random()}`,
        name: staff.full_name || staff.name || '',
        full_name: staff.full_name || staff.name || '',
        title: staff.title || 'Barber',
        bio: staff.bio || '',
        rating: 0,
        review_count: 0,
        role: staff.role || 'staff',
        phone: staff.phone || '',
        avatar_url: `https://i.pravatar.cc/150?u=${Math.random()}`,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...staff
      } as StaffProfile;

      MOCK_STAFF.push(newStaff);
      return { data: newStaff, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }
};
