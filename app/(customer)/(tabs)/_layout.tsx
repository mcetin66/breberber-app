import { CUSTOMER_TABS } from '@/constants/navigation';
import { RoleTabLayout } from '@/components/shared/layouts/RoleTabLayout';

export default function CustomerTabsLayout() {
    return <RoleTabLayout tabs={CUSTOMER_TABS} />;
}
