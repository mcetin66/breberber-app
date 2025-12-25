// Re-export all types from database.ts
export * from './database';

// Convenience type aliases
import { Database } from './database';

export type Tables = Database['public']['Tables'];
export type Business = Tables['businesses']['Row'];
export type Profile = Tables['profiles']['Row'];
export type Service = Tables['services']['Row'];
export type Staff = Tables['business_staff']['Row'];
export type Booking = Tables['bookings']['Row'];
export type Review = Tables['reviews']['Row'];
export type Favorite = Tables['favorites']['Row'];
export type WorkingHour = Tables['staff_working_hours']['Row'];
// GalleryImage removed - table doesn't exist in database.ts