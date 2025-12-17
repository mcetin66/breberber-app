// @ts-nocheck - Supabase type generation issues with profiles table
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { User, Role } from '@/types';
import { logAudit } from '@/services/auditService';

// ViewMode type for business owners to switch views
type ViewMode = 'business' | 'staff' | 'customer' | 'platform';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  selectedRole: Role | null; // For pre-login selection
  originalUser: User | null; // For admin impersonation
  viewMode: ViewMode | null; // Current view mode (can differ from role for business_owner)

  initialize: () => Promise<void>;
  setSelectedRole: (role: Role | null) => void;
  switchViewMode: (mode: ViewMode) => void; // Switch between business/staff views
  impersonateBusiness: (businessId: string, businessName: string) => void;
  stopImpersonating: () => void;
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>;
  setUser: (user: User | null) => void;
  setBarberId: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  selectedRole: null,
  viewMode: null,

  setSelectedRole: (role) => set({ selectedRole: role }),
  setBarberId: (id) => set((state) => ({ user: state.user ? { ...state.user, barberId: id } : null })),

  // Switch view mode (for business owners to toggle between business/staff views)
  switchViewMode: (mode) => {
    const { user } = get();
    // Only business_owner can switch between business and staff
    if (user?.role === 'business_owner' && (mode === 'business' || mode === 'staff')) {
      console.log('🔄 Switching view mode to:', mode);
      set({ viewMode: mode });
    }
  },

  initialize: async () => {
    try {
      set({ isLoading: true });

      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profile) {
          const user: User = {
            id: profile.id as string,
            email: profile.email as string,
            fullName: (profile.full_name as string) || '',
            phone: (profile.phone as string) || '',
            avatar: (profile.avatar_url as string) || undefined,
            role: profile.role as Role,
            // subRole removed
          };

          // If Staff, fetch their Business ID
          if (user.role === 'staff') {
            const { data: staffData } = await supabase
              .from('business_staff')
              .select('business_id')
              .eq('email', user.email)
              .maybeSingle();

            if (staffData?.business_id) {
              user.barberId = staffData.business_id;
            }
          }

          set({
            user,
            token: session.access_token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({ isLoading: false });
        }
      } else {
        set({ isLoading: false });
      }

      supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profile) {
            const user: User = {
              id: profile.id as string,
              email: profile.email as string,
              fullName: (profile.full_name as string) || '',
              phone: (profile.phone as string) || '',
              avatar: (profile.avatar_url as string) || undefined,
              role: profile.role as Role,
              // subRole removed
            };

            // If Staff, fetch their Business ID
            if (user.role === 'staff') {
              const { data: staffData } = await supabase
                .from('business_staff')
                .select('business_id')
                .eq('email', user.email)
                .maybeSingle();

              if (staffData?.business_id) {
                user.barberId = staffData.business_id;
              }
            }

            set({
              user,
              token: session.access_token,
              isAuthenticated: true,
            });
          }
        } else {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      });
    } catch (error: any) {
      console.error('Auth initialization error:', error);
      set({ isLoading: false, error: error.message });
    }
  },

  signUp: async (email, password, fullName, phone) => {
    try {
      console.log('authStore.signUp: Starting', { email, fullName });
      console.log('authStore.signUp: Starting request...');

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('İstek zaman aşımına uğradı (10sn). İnternet bağlantınızı kontrol edin.')), 10000)
      );

      const signUpPromise = supabase.auth.signUp({
        email,
        password,
      });

      const { data: authData, error: authError } = await Promise.race([signUpPromise, timeoutPromise]) as any;

      console.log('authStore.signUp: Supabase response received', { authData, authError });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Kayıt başarısız');

      console.log('authStore.signUp: Inserting profile', authData.user.id);
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email,
          full_name: fullName,
          phone: phone || null,
          role: 'customer',
        });
      console.log('authStore.signUp: Profile inserted', { profileError });

      if (profileError) throw profileError;

      const user: User = {
        id: authData.user.id,
        email,
        fullName,
        phone: phone || '',
        role: 'customer',
      };

      set({
        user,
        token: authData.session?.access_token || null,
        isAuthenticated: true,
        isLoading: false,
      });
      console.log('authStore.signUp: Finished successfully');

      return { success: true };
    } catch (error: any) {
      console.error('authStore.signUp: Error', error);
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  signIn: async (email, password) => {
    try {
      set({ isLoading: true, error: null });

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      if (!data.user) throw new Error('Giriş başarısız');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile) throw new Error('Kullanıcı profili bulunamadı');

      const user: User = {
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name || '',
        phone: profile.phone || '',
        avatar: profile.avatar_url || undefined,
        role: profile.role as Role,
      };

      // Set initial viewMode based on role
      const initialViewMode =
        user.role === 'business_owner' ? 'business' :
          user.role === 'staff' ? 'staff' :
            user.role === 'platform_admin' ? 'platform' : 'customer';

      set({
        user,
        token: data.session.access_token,
        isAuthenticated: true,
        isLoading: false,
        viewMode: initialViewMode as ViewMode,
      });

      logAudit('AUTH_LOGIN', { email: user.email, role: user.role });

      return { success: true };
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true });
      logAudit('AUTH_LOGOUT', {});
      await supabase.auth.signOut();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        viewMode: null,
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      set({ isLoading: false, error: error.message });
    }
  },

  updateProfile: async (updates) => {
    try {
      const { user } = get();
      if (!user) throw new Error('Kullanıcı oturumu bulunamadı');

      set({ error: null });

      const profileUpdates: any = {};
      if (updates.fullName !== undefined) profileUpdates.full_name = updates.fullName;
      if (updates.phone !== undefined) profileUpdates.phone = updates.phone;
      if (updates.avatar !== undefined) profileUpdates.avatar_url = updates.avatar;

      const { error } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', user.id);

      if (error) throw error;

      set({
        user: { ...user, ...updates },
      });

      logAudit('PROFILE_UPDATE', { changes: updates });

      return { success: true };
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  updatePassword: async (password: string) => {
    try {
      set({ error: null });
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      logAudit('PASSWORD_UPDATE', { method: 'user_initiated' });

      return { success: true };
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  originalUser: null, // For admin impersonation

  impersonateBusiness: (businessId: string, businessName: string) => {
    const currentUser = get().user;
    if (!currentUser || currentUser.role !== 'admin') return;

    set({
      originalUser: currentUser,
      user: {
        id: currentUser.id, // Keep same ID to avoid auth errors
        email: `impersonated@${businessId}.com`,
        fullName: businessName,
        role: 'business_owner', // Changed from business
        barberId: businessId // CRITICAL: This allows dashboard to query correct data
      } as User
    });
  },

  stopImpersonating: () => {
    const original = get().originalUser;
    if (!original) return;

    set({
      user: original,
      originalUser: null
    });
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
