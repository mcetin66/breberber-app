import { Database } from './database';

export type Role = 'customer' | 'business_owner' | 'staff' | 'platform_admin';

// --- Database Derived Types ---
type DbProfile = Database['public']['Tables']['profiles']['Row'];
type DbBusiness = Database['public']['Tables']['businesses']['Row'];
type DbService = Database['public']['Tables']['services']['Row'];
type DbStaff = Database['public']['Tables']['business_staff']['Row'];
type DbBooking = Database['public']['Tables']['bookings']['Row'];
type DbReview = Database['public']['Tables']['reviews']['Row'];

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
  // Maintaining compatibility and Aliases
  isOpen?: boolean;
  image?: string; // Mapped from cover_url
  coverImage?: string; // Alias for cover_url

  // CamelCase Aliases for DB fields
  isActive?: boolean; // is_active
  contactName?: string; // contact_name
  businessType?: string; // business_type
  subscriptionTier?: string; // subscription_tier
  subscriptionEndDate?: string; // subscription_end_date
  createdAt?: string; // created_at

  workingHours?: any; // business_working_hours

  // Extended properties (used in Admin Store/UI)
  staffList?: any[];
  staffCount?: number;
  reviewCount?: number; // Alias for review_count
}

export interface Service extends Omit<DbService, 'duration'> {
  // UI helper fields
  duration?: number; // alias for duration_minutes
}

export interface StaffProfile extends DbStaff {
  // UI helpers
  expertise?: string[]; // UI-only field for service names
  isAvailable?: boolean; // Computed from is_active
  avatar?: string; // Alias for avatar_url
  workingHours?: any; // Joined data
}

// Alias for backward compatibility
export type Staff = StaffProfile;

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
  totalDuration?: number; // UI helper

  // Aggregated Data (Joined fields)
  customerName?: string;
  staffName?: string;
  serviceName?: string;

  // Store Helpers
  serviceIds?: string[]; // Optional, for multi-service support or store compatibility
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


export interface Review extends DbReview {
  // UI Aliases
  userId?: string; // alias for customer_id
  userName?: string; // joined profile full_name
  userAvatar?: string; // joined profile avatar_url

  date?: string; // alias for created_at

  // Optional: Staff info if review is specific to staff
  staffName?: string;

  // Optional: Business info if viewing my reviews
  businessName?: string;
  businessLogo?: string;
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
