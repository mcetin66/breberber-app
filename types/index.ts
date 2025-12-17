export type Role = 'customer' | 'business_owner' | 'staff' | 'platform_admin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  name?: string; // Mapped from full_name or business name
  phone: string;
  avatar?: string;
  avatar_url?: string; // Mapped from avatar
  role: Role;
  // subRole removed - aligned with DB
  barberId?: string; // For business owners/staff
  createdAt?: string;
}

export interface Barber {
  id: string;
  name: string;
  address: string;
  image: string;
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  latitude: number;
  longitude: number;
  // Admin/Business specific fields
  phone?: string;
  email?: string;
  city?: string;
  contactName?: string;
  description?: string;
  coverImage?: string;
  instagram?: string;
  businessType?: string;
  subscriptionTier?: string;   // 'basic' | 'premium' | 'enterprise'
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  isActive?: boolean;
  workingHours?: any;
  createdAt?: string;
  logo?: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  category: string;
  description?: string;
  isActive?: boolean;
  barberId?: string;
  staffIds?: string[];
}

export interface Staff {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  avatar: string;
  avatar_url?: string;
  expertise: string[];
  isAvailable?: boolean;
  isActive?: boolean;
  barberId?: string;
  workingHours?: {
    start?: string;
    end?: string;
    lunchStart?: string;
    lunchEnd?: string;
  };
  workingDays?: string[];
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  barberId: string;
  staffId: string;
  serviceId: string;
  serviceIds?: string[];
  customerId: string;
  date: string;
  time?: string;
  startTime?: string;
  endTime?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'blocked';
  totalPrice: number;
  totalDuration?: number;
  customerName?: string;
  serviceName?: string;
  staffName?: string;
  notes?: string;
  createdAt?: string;
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
  staff?: Staff;
  selectedServices: Service[];
  selectedDate?: string;
  selectedSlot?: string;
  notes?: string;
  totalDuration: number;
  totalPrice: number;
}
