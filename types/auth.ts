export interface User {
    id: string;
    email: string;
    phone?: string;
    fullName: string;
    role: 'platform_admin' | 'business_owner' | 'staff' | 'customer';
    barberId?: string; // Links to a specific business/tenant
    avatarUrl?: string;
    createdAt: string;
}

export interface Session {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
}

export interface AuthError {
    message: string;
    code?: string;
}

// Zod Schema Inference Types (will be used with the actual Zod schema in components)
export interface LoginCredentials {
    phone: string;
    password?: string; // Optional if using OTP flow later, but required for password login
}

export interface RegisterCredentials {
    fullName: string;
    email: string;
    phone: string;
    password?: string;
    role: 'business_owner' | 'customer'; // Staff is usually invited
    kvkkAccepted: boolean;
    marketingAllowed: boolean;
}
