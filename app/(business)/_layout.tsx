import { Drawer } from 'expo-router/drawer';
import { LayoutDashboard, Users, Scissors, Calendar, DollarSign } from 'lucide-react-native';
import { useAuthStore } from '@/stores/authStore';
import { COLORS } from '@/constants/theme';

export default function BusinessLayout() {
  const user = useAuthStore(state => state.user);
  const isOwner = user?.subRole === 'owner';

  return (
    <Drawer
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.background.card,
        },
        headerTintColor: COLORS.text.DEFAULT,
        drawerStyle: {
          backgroundColor: COLORS.background.card,
        },
        drawerActiveTintColor: COLORS.primary.DEFAULT,
        drawerInactiveTintColor: COLORS.text.secondary,
        drawerLabelStyle: {
          fontFamily: 'Poppins_500Medium',
        },
      }}
    >
      {isOwner ? (
        <>
          <Drawer.Screen
            name="dashboard"
            options={{
              title: 'Dashboard',
              drawerIcon: ({ color, size }: { color: string; size: number }) => <LayoutDashboard size={size} color={color} />,
            }}
          />
          <Drawer.Screen
            name="staff"
            options={{
              title: 'Personel',
              drawerIcon: ({ color, size }: { color: string; size: number }) => <Users size={size} color={color} />,
            }}
          />
          <Drawer.Screen
            name="services"
            options={{
              title: 'Hizmetler',
              drawerIcon: ({ color, size }: { color: string; size: number }) => <Scissors size={size} color={color} />,
            }}
          />
          <Drawer.Screen
            name="calendar"
            options={{
              title: 'Takvim',
              drawerIcon: ({ color, size }: { color: string; size: number }) => <Calendar size={size} color={color} />,
            }}
          />
          <Drawer.Screen
            name="finance"
            options={{
              title: 'Gelir & Kasa',
              drawerIcon: ({ color, size }: { color: string; size: number }) => <DollarSign size={size} color={color} />,
            }}
          />
        </>
      ) : (
        <Drawer.Screen
          name="staff-dashboard"
          options={{
            title: 'Personel Paneli',
            drawerIcon: ({ color, size }: { color: string; size: number }) => <LayoutDashboard size={size} color={color} />,
          }}
        />
      )}
    </Drawer>
  );
}
