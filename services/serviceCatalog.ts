import { supabase } from '@/lib/supabase';
import { Service } from '@/types';

// Mock Data for fallback
const MOCK_SERVICES: Service[] = [
    {
        id: '1',
        name: 'Saç Kesimi',
        price: 350,
        duration: 30,
        duration_minutes: 30,
        category: 'hair',
        category_id: '1',
        description: 'Mock service description',
        is_active: true,
        business_id: 'mock-business-id',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: '2',
        name: 'Sakal Kesimi',
        price: 200,
        duration: 20,
        duration_minutes: 20,
        category: 'beard',
        category_id: '2',
        description: 'Mock service description',
        is_active: true,
        business_id: 'mock-business-id',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: '3',
        name: 'Saç + Sakal',
        price: 500,
        duration: 50,
        duration_minutes: 50,
        category: 'package',
        category_id: '3',
        description: 'Mock service description',
        is_active: true,
        business_id: 'mock-business-id',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
];

export const ServiceCatalog = {
    fetchServices: async (tenantId: string) => {
        try {
            // Simulate API latency
            await new Promise(resolve => setTimeout(resolve, 800));

            // Real Supabase Query
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .eq('business_id', tenantId);

            if (error) {
                console.error('Error fetching services:', error);
                throw error;
            }
            return { data, error: null };
        } catch (error: any) {
            return { data: null, error: error.message };
        }
    },

    createService: async (service: Partial<Service>) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Validation: Ensure 10-minute rule
            if (service.duration_minutes && service.duration_minutes % 10 !== 0) {
                throw new Error("Hizmet süresi 10 dakikanın katı olmalıdır.");
            }

            // Real Supabase Insert
            const { data, error } = await supabase.from('services').insert(service as any).select().single();

            if (error) throw error;
            return { data, error: null };
        } catch (error: any) {
            return { data: null, error: error.message };
        }
    }
};
