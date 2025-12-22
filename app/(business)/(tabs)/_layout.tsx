import { useAuthStore } from '@/stores/authStore';
import { BUSINESS_TABS } from '@/constants/navigation';
import { RoleTabLayout } from '@/components/shared/layouts/RoleTabLayout';

export default function BusinessTabsLayout() {
    const { user } = useAuthStore();
    const isStaff = user?.role === 'staff';

    return <RoleTabLayout tabs={BUSINESS_TABS} isStaff={isStaff} />;
}

