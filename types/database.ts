export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          role: 'customer' | 'business_owner' | 'staff' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'business_owner' | 'staff' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'business_owner' | 'staff' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      businesses: {
        Row: {
          id: string
          owner_id: string | null
          name: string
          description: string | null
          address: string | null
          city: string | null
          phone: string | null
          email: string | null
          logo_url: string | null
          cover_url: string | null
          rating: number
          review_count: number
          latitude: number | null
          longitude: number | null
          is_active: boolean
          instagram: string | null
          business_type: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id?: string | null
          name: string
          description?: string | null
          address?: string | null
          city?: string | null
          phone?: string | null
          email?: string | null
          logo_url?: string | null
          cover_url?: string | null
          rating?: number
          review_count?: number
          latitude?: number | null
          longitude?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string | null
          name?: string
          description?: string | null
          address?: string | null
          city?: string | null
          phone?: string | null
          email?: string | null
          logo_url?: string | null
          cover_url?: string | null
          rating?: number
          review_count?: number
          latitude?: number | null
          longitude?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      business_staff: {
        Row: {
          id: string
          business_id: string | null
          user_id: string | null
          name: string
          title: string | null
          avatar_url: string | null
          bio: string | null
          rating: number
          review_count: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id?: string | null
          user_id?: string | null
          name: string
          title?: string | null
          avatar_url?: string | null
          bio?: string | null
          rating?: number
          review_count?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string | null
          user_id?: string | null
          name?: string
          title?: string | null
          avatar_url?: string | null
          bio?: string | null
          rating?: number
          review_count?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      service_categories: {
        Row: {
          id: string
          name: string
          icon: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          icon?: string | null
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon?: string | null
          display_order?: number
          created_at?: string
        }
      }
      services: {
        Row: {
          id: string
          business_id: string | null
          category_id: string | null
          name: string
          description: string | null
          duration_minutes: number
          price: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id?: string | null
          category_id?: string | null
          name: string
          description?: string | null
          duration_minutes: number
          price: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string | null
          category_id?: string | null
          name?: string
          description?: string | null
          duration_minutes?: number
          price?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      staff_services: {
        Row: {
          id: string
          staff_id: string | null
          service_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          staff_id?: string | null
          service_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          staff_id?: string | null
          service_id?: string | null
          created_at?: string
        }
      }
      staff_working_hours: {
        Row: {
          id: string
          staff_id: string | null
          day_of_week: number
          start_time: string
          end_time: string
          is_available: boolean
          created_at: string
        }
        Insert: {
          id?: string
          staff_id?: string | null
          day_of_week: number
          start_time: string
          end_time: string
          is_available?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          staff_id?: string | null
          day_of_week?: number
          start_time?: string
          end_time?: string
          is_available?: boolean
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          customer_id: string | null
          business_id: string | null
          staff_id: string | null
          service_id: string | null
          booking_date: string
          start_time: string
          end_time: string
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          total_price: number
          notes: string | null
          cancellation_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id?: string | null
          business_id?: string | null
          staff_id?: string | null
          service_id?: string | null
          booking_date: string
          start_time: string
          end_time: string
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          total_price: number
          notes?: string | null
          cancellation_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string | null
          business_id?: string | null
          staff_id?: string | null
          service_id?: string | null
          booking_date?: string
          start_time?: string
          end_time?: string
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          total_price?: number
          notes?: string | null
          cancellation_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          customer_id: string | null
          business_id: string | null
          staff_id: string | null
          booking_id: string | null
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id?: string | null
          business_id?: string | null
          staff_id?: string | null
          booking_id?: string | null
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string | null
          business_id?: string | null
          staff_id?: string | null
          booking_id?: string | null
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string | null
          business_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          business_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          business_id?: string | null
          created_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string
          action: string
          details: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          details?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          details?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
