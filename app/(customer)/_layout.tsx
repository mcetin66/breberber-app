import { CUSTOMER_TABS } from '@/constants/navigation';
import { RoleTabLayout } from '@/components/shared/layouts/RoleTabLayout';

export default function CustomerLayout() {
  return <RoleTabLayout tabs={CUSTOMER_TABS} />;
}
