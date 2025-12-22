import { Database } from './database';

export type Role = 'customer' | 'business_owner' | 'staff' | 'platform_admin';

// --- Database Derived Types ---
type DbProfile = Database['public']['Tables']['profiles']['Row'];
type DbBusiness = Database['public']['Tables']['businesses']['Row'];
type DbService = Database['public']['Tables']['services']['Row'];
type DbStaff = Database['public']['Tables']['business_staff']['Row'];
type DbBooking = Database['public']['Tables']['bookings']['Row'];

export interface User {
  id: string;
  email: string;
  fullName: string;
  name?: string;
  phone: string;
  avatar?: string;
  avatar_url?: string;
  role: Role;
  barberId?: string;
  createdAt?: string;
}

export interface Barber extends DbBusiness {
  // Maintaining compatibility with existing UI components that might expect 'isOpen' or 'image'
  isOpen?: boolean;
  image?: string; // Mapped from cover_url or similar
  workingHours?: any; // business_working_hours or specific logic
}

export interface Service extends DbService {
  // UI helper fields
  duration?: number; // alias for duration_minutes
  category?: string; // UI category
}

export interface StaffProfile extends DbStaff {
  // Alias for compatibility
  expertise?: string[]; // If not in DB, UI might need it. Schema shows 'bio' but not expertise array.
  isAvailable?: boolean; // Mapped from 'is_active' or checking working hours
  phone?: string; // Fetched from joined user profile
  role?: string; // UI helper
  full_name?: string; // UI alias for name
}

export interface Appointment extends DbBooking {
  // UI Helpers
  barberId?: string; // alias for business_id
  staffId?: string; // alias for staff_id
  serviceId?: string; // alias for service_id
  customerId?: string; // alias for customer_id

  date?: string; // alias for booking_date
  startTime?: string; // alias for start_time
  endTime?: string; // alias for end_time

  totalPrice?: number; // alias for total_price

  // Aggregated Data (Joined fields)
  customerName?: string;
  staffName?: string;
  serviceName?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Activity {
  id: string;
  type: 'business' | 'booking';
  [key: string]: any;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalAppointments: number;
  activeBarbers: number;
  totalUsers: number;
}

export interface BookingFlow {
  barberId?: string;
  barber?: Barber;
  staffId?: string;
  staff?: StaffProfile;
  selectedServices: Service[];
  selectedDate?: string;
  selectedSlot?: string;
  notes?: string;
  totalDuration: number;
  totalPrice: number;
}
