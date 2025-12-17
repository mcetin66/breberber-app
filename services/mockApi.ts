import type { User, Barber, Staff, Service } from '@/types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockUsers: User[] = [
  {
    id: 'user-1',
    fullName: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    phone: '+905551234567',
    role: 'customer',
    avatar: 'https://picsum.photos/seed/user1/200',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'user-2',
    fullName: 'Mehmet Kaya',
    email: 'mehmet@breberber.com',
    phone: '+905551234568',
    role: 'business_owner',
    barberId: 'barber-1',
    avatar: 'https://picsum.photos/seed/user2/200',
    createdAt: '2024-01-10T09:00:00Z',
  },
  {
    id: 'user-3',
    fullName: 'Can Demir',
    email: 'can@breberber.com',
    phone: '+905551234569',
    role: 'staff',
    barberId: 'barber-1',
    avatar: 'https://picsum.photos/seed/user3/200',
    createdAt: '2024-02-01T11:00:00Z',
  },
  {
    id: 'admin-1',
    fullName: 'Admin User',
    email: 'admin@breberber.com',
    phone: '+905551234570',
    role: 'platform_admin',
    avatar: 'https://picsum.photos/seed/admin/200',
    createdAt: '2023-12-01T08:00:00Z',
  },
];

export const mockBarbers: Barber[] = [
  {
    id: 'barber-1',
    name: 'Golden Scissors',
    description: 'Premium barbershop experience with master barbers',
    address: 'Kadıköy, İstanbul',
    city: 'Istanbul',
    rating: 4.8,
    reviewCount: 128,
    coverImage: 'https://picsum.photos/seed/barber1/800/400',
    image: 'https://picsum.photos/seed/logo1/200',
    logo: 'https://picsum.photos/seed/logo1/200',
    phone: '+902161234567',
    email: 'info@goldenscissors.com',
    isOpen: true,
    latitude: 41.0082,
    longitude: 28.9784,
    workingHours: {
      monday: { isOpen: true, openTime: '09:00', closeTime: '19:00' },
      tuesday: { isOpen: true, openTime: '09:00', closeTime: '19:00' },
      wednesday: { isOpen: true, openTime: '09:00', closeTime: '19:00' },
      thursday: { isOpen: true, openTime: '09:00', closeTime: '19:00' },
      friday: { isOpen: true, openTime: '09:00', closeTime: '19:00' },
      saturday: { isOpen: true, openTime: '10:00', closeTime: '18:00' },
      sunday: { isOpen: false, openTime: '', closeTime: '' },
    },
    subscriptionTier: 'premium',
    subscriptionEndDate: '2025-12-31T23:59:59Z',
    createdAt: '2023-06-01T10:00:00Z',
  },
  {
    id: 'barber-2',
    name: 'Urban Cut',
    description: 'Modern styling and trendy cuts',
    address: 'Beşiktaş, İstanbul',
    city: 'Istanbul',
    rating: 4.5,
    reviewCount: 85,
    coverImage: 'https://picsum.photos/seed/barber2/800/400',
    image: 'https://picsum.photos/seed/logo2/200',
    logo: 'https://picsum.photos/seed/logo2/200',
    phone: '+902161234568',
    email: 'info@urbancut.com',
    isOpen: false,
    latitude: 41.0422,
    longitude: 29.0067,
    workingHours: {
      monday: { isOpen: true, openTime: '10:00', closeTime: '20:00' },
      tuesday: { isOpen: true, openTime: '10:00', closeTime: '20:00' },
      wednesday: { isOpen: true, openTime: '10:00', closeTime: '20:00' },
      thursday: { isOpen: true, openTime: '10:00', closeTime: '20:00' },
      friday: { isOpen: true, openTime: '10:00', closeTime: '20:00' },
      saturday: { isOpen: true, openTime: '11:00', closeTime: '19:00' },
      sunday: { isOpen: true, openTime: '11:00', closeTime: '17:00' },
    },
    subscriptionTier: 'basic',
    subscriptionEndDate: '2025-06-30T23:59:59Z',
    createdAt: '2023-08-15T14:00:00Z',
  },
];

export const mockStaff: Staff[] = [
  {
    id: 'staff-1',
    barberId: 'barber-1',
    name: 'Ali Yılmaz',
    avatar: 'https://picsum.photos/seed/staff1/200',
    expertise: ['Saç Kesimi', 'Sakal Tıraşı', 'Cilt Bakımı'],
    rating: 4.9,
    reviewCount: 45,
    isActive: true,
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    workingHours: { start: '09:00', end: '18:00' },
  },
  {
    id: 'staff-2',
    barberId: 'barber-1',
    name: 'Can Demir',
    avatar: 'https://picsum.photos/seed/staff2/200',
    expertise: ['Saç Kesimi', 'Renklendirme'],
    rating: 4.7,
    reviewCount: 32,
    isActive: true,
    workingDays: ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    workingHours: { start: '10:00', end: '19:00' },
  },
];

export const mockServices: Service[] = [
  {
    id: 'service-1',
    barberId: 'barber-1',
    name: 'Saç Kesimi',
    description: 'Profesyonel saç kesimi ve şekillendirme',
    duration: 30,
    price: 250,
    category: 'Saç',
    staffIds: ['staff-1', 'staff-2'],
  },
  {
    id: 'service-2',
    barberId: 'barber-1',
    name: 'Sakal Tıraşı',
    description: 'Sıcak havlu ile geleneksel tıraş',
    duration: 20,
    price: 150,
    category: 'Sakal',
    staffIds: ['staff-1'],
  },
  {
    id: 'service-3',
    barberId: 'barber-1',
    name: 'Cilt Bakımı',
    description: 'Premium cilt bakımı ve maske',
    duration: 45,
    price: 400,
    category: 'Bakım',
    staffIds: ['staff-1'],
  },
];

export class MockApiService {
  static async login(phone: string, code: string): Promise<{ user: User; token: string }> {
    await delay(800);

    const user = mockUsers.find(u => u.phone === phone);
    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }

    return {
      user,
      token: `mock-token-${user.id}-${Date.now()}`,
    };
  }

  static async register(name: string, phone: string, role: 'customer' | 'business_owner'): Promise<{ user: User; token: string }> {
    await delay(1000);

    const newUser: User = {
      id: `user-${Date.now()}`,
      fullName: name,
      phone,
      email: `${phone}@example.com`,
      role,
      avatar: `https://picsum.photos/seed/${phone}/200`,
      createdAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);

    return {
      user: newUser,
      token: `mock-token-${newUser.id}-${Date.now()}`,
    };
  }

  static async getBarbers(): Promise<Barber[]> {
    await delay(500);
    return mockBarbers;
  }

  static async getBarberById(id: string): Promise<Barber | null> {
    await delay(300);
    return mockBarbers.find(b => b.id === id) || null;
  }

  static async getStaffByBarberId(barberId: string): Promise<Staff[]> {
    await delay(300);
    return mockStaff.filter(s => s.barberId === barberId);
  }

  static async getServicesByBarberId(barberId: string): Promise<Service[]> {
    await delay(300);
    return mockServices.filter(s => s.barberId === barberId);
  }
}
