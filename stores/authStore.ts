// @ts-nocheck - Supabase type generation issues with profiles table
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { User, Role } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  selectedRole: Role | null; // For pre-login selection

  initialize: () => Promise<void>;
  setSelectedRole: (role: Role | null) => void;
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>;
  setUser: (user: User | null) => void;
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

  setSelectedRole: (role) => set({ selectedRole: role }),

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
          };

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
            };

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

      set({
        user,
        token: data.session.access_token,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true };
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true });
      await supabase.auth.signOut();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
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

      set({ isLoading: true, error: null });

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
        isLoading: false,
      });

      return { success: true };
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  updatePassword: async (password: string) => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      set({ isLoading: false });
      return { success: true };
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
