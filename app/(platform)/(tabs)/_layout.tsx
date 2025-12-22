import { PLATFORM_TABS } from '@/constants/navigation';
import { RoleTabLayout } from '@/components/shared/layouts/RoleTabLayout';

export default function PlatformLayout() {
  return <RoleTabLayout tabs={PLATFORM_TABS} elevated />;
}

