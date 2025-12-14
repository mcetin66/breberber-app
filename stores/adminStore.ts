import { create } from 'zustand';
import type { Barber, Activity } from '@/types';
import { supabase } from '@/lib/supabase';
import { logAudit } from '@/services/auditService';

interface AggregateStats {
  totalBusinesses: number;
  totalActiveBusinesses: number;
  totalAppointments: number;
  totalRevenue: number;
  averageBasket: number;
  recentActivity?: any[];
  planDistribution?: { [key: string]: number };
  typeDistribution?: { [key: string]: number };
  revenueHistory?: { date: string; amount: number; label: string; height: number }[];
}

interface BarberStats {
  barberId: string;
  barberName: string;
  totalAppointments: number;
  totalRevenue: number;
  activeStaff: number;
  subscriptionTier: string;
  subscriptionEndDate: string;
}

interface AdminState {
  barbers: Barber[];
  aggregateStats: AggregateStats;
  barberStats: BarberStats[];
  recentActivity: Activity[];
  loading: boolean;
  error: string | null;

  // Pagination State
  page: number;
  hasMore: boolean;

  fetchDashboardStats: () => Promise<void>;
  fetchBarbers: (page?: number, refresh?: boolean) => Promise<void>;
  fetchBarberDetail: (id: string) => Promise<{ revenue: number; bookings: number; staffCount: number } | null>;
  addBusiness: (business: Partial<Barber>) => Promise<{ success: boolean; error?: string }>;
  updateBusinessStatus: (id: string, isActive: boolean) => Promise<void>;
  updateBusinessSubscription: (id: string, tier: string, endDate: string) => Promise<{ success: boolean; error?: string }>;
  updateBusinessInfo: (id: string, data: Partial<Barber>) => Promise<{ success: boolean; error?: string }>;
  deleteBusiness: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  barbers: [],
  aggregateStats: {
    totalBusinesses: 0,
    totalActiveBusinesses: 0,
    totalAppointments: 0,
    totalRevenue: 0,
    averageBasket: 0,
    revenueHistory: [],
  },
  barberStats: [],
  recentActivity: [],
  loading: false,
  error: null,

  page: 1,
  hasMore: true,

  // New initialize function encapsulating dashboard stats logic
  initialize: async () => {
    get().fetchDashboardStats();
  },

  fetchDashboardStats: async () => {
    set({ loading: true, error: null });
    try {
      // 1. Calculate Date Range (Last 7 Days)
      const today = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 6); // Include today + 6 previous days
      sevenDaysAgo.setHours(0, 0, 0, 0);

      // Parallel requests for stats
      const [barbersRes, activeBarbersRes, appointmentsRes] = await Promise.all([
        supabase.from('businesses').select('*', { count: 'exact', head: false }),
        supabase.from('businesses').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
      ]);

      // 2. Fetch Total Revenue (All time)
      const { data: totalRevenueData } = await supabase
        .from('bookings')
        .select('total_price')
        .eq('status', 'completed');

      const totalRevenue = (totalRevenueData as any[])?.reduce((sum, item) => sum + (item.total_price || 0), 0) || 0;

      // 3. Fetch Last 7 Days Revenue
      // Note: Supabase doesn't support grouping in simple client queries easily, fetching raw data to process
      const { data: weeklyRevenueData } = await supabase
        .from('bookings')
        .select('created_at, total_price')
        .eq('status', 'completed')
        .gte('created_at', sevenDaysAgo.toISOString());

      // 4. Process Weekly Data
      const dailyMap = new Map<string, number>();

      // Initialize last 7 days with 0
      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateKey = d.toISOString().split('T')[0]; // YYYY-MM-DD
        dailyMap.set(dateKey, 0);
      }

      // Sum up actual data
      (weeklyRevenueData as any[])?.forEach(booking => {
        const dateKey = new Date(booking.created_at).toISOString().split('T')[0];
        if (dailyMap.has(dateKey)) {
          dailyMap.set(dateKey, (dailyMap.get(dateKey) || 0) + (booking.total_price || 0));
        }
      });

      // Convert to array and sort
      const revenueHistory = Array.from(dailyMap.entries())
        .map(([date, amount]) => {
          const d = new Date(date);
          return {
            date,
            amount,
            // Format: "14 Ara" or "Bugün"
            label: date === today.toISOString().split('T')[0]
              ? 'Bugün'
              : d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
          };
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Normalize heights (0-100%)
      const maxAmount = Math.max(...revenueHistory.map(r => r.amount), 1); // Avoid div/0
      const revenueHistoryWithHeight = revenueHistory.map(item => ({
        ...item,
        height: Math.round((item.amount / maxAmount) * 100)
      }));


      // Fetch Recent Activity
      const { data: recentBusinesses } = await supabase
        .from('businesses')
        .select('id, name, created_at, cover_url')
        .order('created_at', { ascending: false })
        .limit(3);

      const { data: recentBookings } = await supabase
        .from('bookings')
        .select('id, created_at, business:businesses(name), service:services(name)')
        .order('created_at', { ascending: false })
        .limit(3);

      const businesses = recentBusinesses || [];
      const bookings = recentBookings || [];

      const combinedActivity = [
        ...businesses.map((b: any) => ({ type: 'business', ...b })),
        ...bookings.map((b: any) => ({ type: 'booking', ...b }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

      // Distributions
      const allBusinesses = barbersRes.data || [];
      const planDist = allBusinesses.reduce((acc: any, curr: any) => {
        const tier = (curr.subscription_tier || 'silver').toLowerCase();
        // Count all tiers
        acc[tier] = (acc[tier] || 0) + 1;
        return acc;
      }, {});

      const typeDist = allBusinesses.reduce((acc: any, curr: any) => {
        const type = (curr.business_type || 'berber').toLowerCase();
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      set({
        aggregateStats: {
          totalBusinesses: barbersRes.count || 0,
          totalActiveBusinesses: activeBarbersRes.count || 0,
          totalAppointments: appointmentsRes.count || 0,
          totalRevenue,
          averageBasket: appointmentsRes.count && totalRevenue > 0
            ? Math.round(totalRevenue / appointmentsRes.count)
            : 0,
          planDistribution: planDist,
          typeDistribution: typeDist,
          revenueHistory: revenueHistoryWithHeight
        },
        recentActivity: combinedActivity,
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchBarbers: async (page = 1, refresh = false) => {
    // If refreshing, reset state immediately
    if (refresh) {
      set({ loading: true, error: null, page: 1, hasMore: true, barbers: [] });
    } else {
      set({ loading: true, error: null });
    }

    // Don't fetch if no more data and not refreshing
    const currentHasMore = get().hasMore;
    if (!refresh && !currentHasMore && page > 1) {
      set({ loading: false });
      return;
    }

    try {
      const LIMIT = 10;
      const from = (page - 1) * LIMIT;
      const to = from + LIMIT - 1;

      const { data, error, count } = await supabase
        .from('businesses')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        throw error;
      };

      const mappedBarbers = data.map((b: any) => ({
        ...b,
        coverImage: b.cover_url,
        isOpen: b.is_active,
        isActive: b.is_active,
        subscriptionTier: b.subscription_tier || 'silver', // Default to Silver
        businessType: b.business_type || 'berber',
        subscriptionEndDate: b.subscription_end_date,
        contactName: b.contact_name,
        createdAt: b.created_at, // Explicit mapping
      }));

      const newHasMore = data.length === LIMIT;

      set((state) => {
        const combined = refresh ? mappedBarbers : [...state.barbers, ...mappedBarbers];
        // Deduplicate by ID to prevent key collisions
        const uniqueBarbers = Array.from(new Map(combined.map(item => [item.id, item])).values());

        return {
          barbers: uniqueBarbers,
          loading: false,
          page: page,
          hasMore: newHasMore
        };
      });

    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchBarberDetail: async (id: string) => {
    try {
      // 1. Get Revenue & Bookings
      const { data: bookings, error: bookingError } = await supabase
        .from('bookings')
        .select('total_price')
        .eq('business_id', id)
        .eq('status', 'completed');

      if (bookingError) throw bookingError;

      const totalRevenue = (bookings as any[])?.reduce((sum, item) => sum + (item.total_price || 0), 0) || 0;
      const totalBookings = bookings?.length || 0;

      // 2. Get All Bookings Count (including pending/cancelled)
      const { count: allBookingsCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', id);

      // 3. Get Active Staff Count
      const { count: staffCount } = await supabase
        .from('business_staff')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', id)
        .eq('is_active', true);

      return {
        revenue: totalRevenue,
        bookings: allBookingsCount || 0,
        staffCount: staffCount || 0
      };
    } catch (error) {
      console.error('Error fetching barber detail:', error);
      return null;
    }
  },

  updateBusinessStatus: async (id: string, isActive: boolean) => {
    try {
      // Optimistic update
      const { barbers, aggregateStats } = get();
      const barber = barbers.find(b => b.id === id);

      // Calculate new active count if status changed
      let newActiveCount = aggregateStats.totalActiveBusinesses;
      if (barber && barber.isActive !== isActive) {
        newActiveCount = isActive
          ? newActiveCount + 1
          : Math.max(0, newActiveCount - 1);
      }

      set({
        barbers: barbers.map(b =>
          b.id === id ? { ...b, isOpen: isActive, isActive: isActive } : b
        ),
        aggregateStats: {
          ...aggregateStats,
          totalActiveBusinesses: newActiveCount
        }
      });

      const { error } = await (supabase
        .from('businesses') as any)
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;
    } catch (error: any) {
      // Revert on error
      const { barbers, aggregateStats } = get();
      const barber = barbers.find(b => b.id === id);

      // Revert count
      let revertedCount = aggregateStats.totalActiveBusinesses;
      if (barber) {
        revertedCount = !isActive
          ? revertedCount + 1
          : Math.max(0, revertedCount - 1);
      }

      set({
        barbers: barbers.map(b =>
          b.id === id ? { ...b, isOpen: !isActive, isActive: !isActive } : b
        ),
        aggregateStats: {
          ...aggregateStats,
          totalActiveBusinesses: revertedCount
        },
        error: error.message
      });
    }
  },

  addBusiness: async (businessData: Partial<Barber>) => {
    set({ loading: true, error: null });
    try {
      console.log('--- ADD BUSINESS STARTED ---');
      console.log('Data:', businessData);

      // 1. Strict Auth Check
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error('Auth Error - No User:', authError);
        throw new Error('Oturum açmış kullanıcı bulunamadı. Lütfen giriş yapın.');
      }
      console.log('Current Authenticated User ID:', user.id);

      // 2. Prepare Payload
      const {
        coverImage,
        subscriptionTier = 'silver', // Default to Silver per business rule
        subscriptionEndDate,
        isOpen,
        contactName, // Destructure to exclude from rest
        businessType, // Destructure to exclude from rest (mapped manually)
        ...rest
      } = businessData;

      const dbPayload = {
        ...rest,
        owner_id: user.id, // Mandatory for confirmed user
        cover_url: coverImage,
        contact_name: (businessData as any).contactName,

        created_at: new Date().toISOString(),
        is_active: true,
        instagram: (businessData as any).instagram,
        business_type: (businessData as any).businessType || 'berber',
        subscription_tier: subscriptionTier
      };

      console.log('Sending DB Payload:', JSON.stringify(dbPayload, null, 2));

      // 3. Insert
      // Apply cast to 'any' to bypass TS 'never' error
      const { data, error } = await supabase
        .from('businesses')
        .insert([dbPayload] as any)
        .select()
        .single();

      if (error) {
        console.error('Supabase Insert Error Code:', error.code);
        console.error('Supabase Insert Error Details:', error);

        // Specific advice for RLS
        if (error.code === '42501') {
          throw new Error('Yetki Hatası (RLS): Veritabanına kayıt eklenemedi çünkü gerekli izinler yok. Supabase panelinde "businesses" tablosu için INSERT politikası (Policy) oluşturmanız gerekiyor.');
        }
        throw error;
      }

      console.log('Insert Success. New Business:', data);

      // Fix TS Error: generic spread and property access on 'never'
      const responseData = data as any;

      // 4. Update Local State
      const newBarber = {
        ...responseData,
        coverImage: responseData.cover_url,
        subscriptionTier: subscriptionTier,
        subscriptionEndDate: subscriptionEndDate,
        isOpen: isOpen ?? true
      } as Barber;

      const { barbers } = get();
      set({ barbers: [newBarber, ...barbers], loading: false });

      // Refresh Stats to ensure counts and charts are correct
      get().fetchDashboardStats();

      logAudit('BUSINESS_CREATE', {
        name: dbPayload.name,
        type: dbPayload.business_type,
        owner_email: user.email,
        owner_name: user.user_metadata?.full_name || 'Bilinmiyor'
      });

      return { success: true };
    } catch (error: any) {
      console.error('Final Add Business Error:', error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  updateBusinessSubscription: async (id: string, tier: string, endDate: string) => {
    try {
      // 1. Update Database
      const { error } = await (supabase
        .from('businesses') as any)
        .update({
          subscription_tier: tier,
          subscription_end_date: endDate
        })
        .eq('id', id);

      if (error) throw error;

      // 2. Optimistic Update (Local State)
      const { barbers } = get();
      set({
        barbers: barbers.map(b =>
          b.id === id ? { ...b, subscriptionTier: tier, subscriptionEndDate: endDate } : b
        )
      });

      // Refresh Stats for plan distribution
      get().fetchDashboardStats();

      return { success: true };
    } catch (error: any) {
      console.error('Update Plan Error:', error);
      return { success: false, error: error.message };
    }
  },

  updateBusinessInfo: async (id: string, data: Partial<Barber>) => {
    try {
      // 1. Update Database
      const { error } = await (supabase
        .from('businesses') as any)
        .update({
          name: data.name,
          phone: data.phone,
          city: data.city,
          address: data.address,
          contact_name: data.contactName,
          instagram: data.instagram,
          business_type: data.businessType
        })
        .eq('id', id);

      if (error) throw error;

      // 2. Optimistic Update
      const { barbers } = get();
      set({
        barbers: barbers.map(b =>
          b.id === id ? { ...b, ...data } : b
        )
      });

      // Refresh Stats if type changed
      if (data.businessType) {
        get().fetchDashboardStats();
      }

      const businessName = barbers.find(b => b.id === id)?.name || 'Bilinmiyor';
      logAudit('BUSINESS_UPDATE', { name: businessName, changes: data });

      return { success: true };
    } catch (error: any) {
      console.error('Update Info Error:', error);
      let errorMessage = error.message;

      // Handle Supabase Schema Cache Error
      if (typeof error.message === 'string' && error.message.includes('PGRST204')) {
        errorMessage = "Veritabanı şeması güncel değil. Lütfen Supabase panelinden 'Reload Schema Cache' yapın.";
      }

      return { success: false, error: errorMessage };
    }
  },

  deleteBusiness: async (id: string) => {
    try {
      // 1. Delete Bookings First (Manual Cascade)
      await supabase.from('bookings').delete().eq('business_id', id);

      // 2. Delete Staff
      await supabase.from('business_staff').delete().eq('business_id', id);

      // 3. Delete Business
      const { error } = await supabase.from('businesses').delete().eq('id', id);
      if (error) throw error;

      const { barbers } = get();
      set({ barbers: barbers.filter(b => b.id !== id) });

      // Refresh Stats
      get().fetchDashboardStats();

      const businessName = get().barbers.find(b => b.id === id)?.name || 'Bilinmiyor';
      logAudit('BUSINESS_DELETE', { name: businessName });

      return { success: true };
    } catch (error: any) {
      console.error('Delete Business Error:', error);
      return { success: false, error: error.message };
    }
  },
}));
