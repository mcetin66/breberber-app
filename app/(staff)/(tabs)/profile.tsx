import { SettingsShell } from '@/components/shared/settings/SettingsShell';
import { useAuthStore } from '@/stores/authStore';
import { Role } from '@/types';

export default function StaffProfileScreen() {
    const { user } = useAuthStore();
    // Use actual user role - this is important for business_owner in staff mode
    // to see the "Return to Business Mode" option
    const actualRole = (user?.role as Role) || 'staff';

    return <SettingsShell role={actualRole} />;
}
