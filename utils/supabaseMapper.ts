import { Database } from '@/types/database';
import { Appointment, Barber, Service, StaffProfile, Review } from '@/types';

// Type shortcuts
type DbBooking = Database['public']['Tables']['bookings']['Row'];
type DbBusiness = Database['public']['Tables']['businesses']['Row'];
type DbService = Database['public']['Tables']['services']['Row'];
type DbStaff = Database['public']['Tables']['business_staff']['Row'];
type DbReview = Database['public']['Tables']['reviews']['Row'];

type DbBookingInsert = Database['public']['Tables']['bookings']['Insert'];
type DbBusinessInsert = Database['public']['Tables']['businesses']['Insert'];
type DbServiceInsert = Database['public']['Tables']['services']['Insert'];
type DbStaffInsert = Database['public']['Tables']['business_staff']['Insert'];

// --- APPOINTMENT (Booking) MAPPERS ---

export const mapAppointmentToDomain = (
    db: DbBooking & {
        profiles?: { full_name?: string | null; avatar_url?: string | null } | null;
        businesses?: { name?: string | null } | null;
        business_staff?: { name?: string | null } | null;
        services?: { name?: string | null } | null;
    }
): Appointment => {
    return {
        ...db,
        // UI Aliases
        barberId: db.business_id || undefined,
        staffId: db.staff_id || undefined,
        serviceId: db.service_id || undefined,
        customerId: db.customer_id || undefined,
        date: db.booking_date,
        startTime: db.start_time,
        endTime: db.end_time,
        totalPrice: db.total_price,

        // Joined Data
        customerName: db.profiles?.full_name || undefined,
        staffName: db.business_staff?.name || undefined,
        serviceName: db.services?.name || undefined,
    };
};

export const mapAppointmentToDb = (app: Partial<Appointment>): DbBookingInsert => {
    // We prioritize snake_case if present, else fallback to camelCase aliases
    return {
        // Required fields (or fields we expect to insert)
        booking_date: app.booking_date || app.date!,
        start_time: app.start_time || app.startTime!,
        end_time: app.end_time || app.endTime!,
        total_price: app.total_price ?? app.totalPrice!,

        business_id: app.business_id || app.barberId,
        staff_id: app.staff_id || app.staffId,
        service_id: app.service_id || app.serviceId,
        customer_id: app.customer_id || app.customerId,

        status: app.status || 'pending',
        notes: app.notes,
        cancellation_reason: app.cancellation_reason,

        // Allow ID if updating
        ...(app.id ? { id: app.id } : {}),
    } as DbBookingInsert;
};

// --- STAFF MAPPERS ---

export const mapStaffToDomain = (db: DbStaff & { staff_services?: any[]; staff_working_hours?: any[] }): StaffProfile => {
    // Map expertise from joined staff_services if available
    const expertise = db.staff_services?.map((ss: any) => ss.services?.name).filter(Boolean) || [];

    // Map working hours usually returned as array or undefined
    const workingHours = db.staff_working_hours;

    return {
        ...db,
        // UI Aliases
        // full_name removed from type, name is sufficient
        isAvailable: db.is_active || false,
        expertise,
        avatar: db.avatar_url || undefined,
        workingHours,
    };
};

export const mapStaffToDb = (staff: Partial<StaffProfile>): DbStaffInsert => {
    return {
        name: staff.name!,
        is_active: staff.is_active ?? staff.isAvailable,
        title: staff.title,
        bio: staff.bio,
        avatar_url: staff.avatar_url ?? staff.avatar,
        business_id: staff.business_id,
        user_id: staff.user_id,
        phone: staff.phone,
        rating: staff.rating,
        review_count: staff.review_count,

        // Allow ID if updating
        ...(staff.id ? { id: staff.id } : {}),
    } as DbStaffInsert;
};

// --- BUSINESS (Barber) MAPPERS ---

export const mapBusinessToDomain = (db: DbBusiness): Barber => {
    return {
        ...db,
        // UI Aliases
        isOpen: db.is_active || false,
        image: db.cover_url || undefined,
        coverImage: db.cover_url || undefined,

        isActive: db.is_active ?? undefined,
        contactName: db.contact_name || undefined,
        businessType: db.business_type || undefined,
        subscriptionTier: db.subscription_tier || undefined,
        subscriptionEndDate: db.subscription_end_date || undefined,
        createdAt: db.created_at || undefined,
        reviewCount: db.review_count || 0,

        // workingHours is usually JSONB, passed as is
        workingHours: db.working_hours,
    };
};

export const mapBusinessToDb = (barber: Partial<Barber>): DbBusinessInsert => {
    return {
        name: barber.name!,
        is_active: barber.is_active ?? barber.isActive ?? barber.isOpen,
        cover_url: barber.cover_url ?? barber.coverImage ?? barber.image,
        working_hours: barber.working_hours ?? barber.workingHours,

        address: barber.address,
        business_type: barber.business_type ?? barber.businessType,
        city: barber.city,
        contact_name: barber.contact_name ?? barber.contactName,
        description: barber.description,
        email: barber.email,
        instagram: barber.instagram,
        latitude: barber.latitude,
        logo_url: barber.logo_url,
        longitude: barber.longitude,
        owner_id: barber.owner_id,
        phone: barber.phone,
        subscription_tier: barber.subscription_tier ?? barber.subscriptionTier,
        subscription_end_date: barber.subscription_end_date ?? barber.subscriptionEndDate,

        // Allow ID if updating
        ...(barber.id ? { id: barber.id } : {}),
    } as DbBusinessInsert;
};

// --- SERVICE MAPPERS ---

export const mapServiceToDomain = (db: DbService): Service => {
    return {
        ...db,
        // UI Aliases
        duration: db.duration_minutes,
    };
};

export const mapServiceToDb = (service: Partial<Service>): DbServiceInsert => {
    return {
        name: service.name!,
        duration_minutes: service.duration_minutes ?? service.duration!,
        price: service.price!,
        is_active: service.is_active,

        business_id: service.business_id,
        category: service.category,
        category_id: service.category_id,
        description: service.description,

        // Allow ID if updating
        ...(service.id ? { id: service.id } : {}),
    } as DbServiceInsert;
};

// --- REVIEW MAPPERS ---

export const mapReviewToDomain = (db: DbReview & {
    profiles?: { full_name?: string | null; avatar_url?: string | null } | null;
    business_staff?: { name?: string | null } | null;
    businesses?: { name?: string | null; logo_url?: string | null } | null;
}): Review => {
    return {
        ...db,
        userId: db.customer_id || undefined,
        userName: db.profiles?.full_name || 'Misafir',
        userAvatar: db.profiles?.avatar_url || undefined,
        date: db.created_at || undefined,

        staffName: db.business_staff?.name || undefined,
        businessName: db.businesses?.name || undefined,
        businessLogo: db.businesses?.logo_url || undefined,
    };
};

export const mapReviewToDb = (review: Partial<Review>): any => {
    return {
        rating: review.rating!,
        comment: review.comment,
        customer_id: review.customer_id || review.userId,
        business_id: review.business_id,
        staff_id: review.staff_id,
        booking_id: review.booking_id,

        ...(review.id ? { id: review.id } : {}),
    };
};
