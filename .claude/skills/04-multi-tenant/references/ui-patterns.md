# Multi-tenant UI Patterns

## 1. Role-based Layout İzolasyonu

**Prensip:** Sistemdeki her rol için izole layout grubu oluştur.

```
app/
├── (platform-admin)/     # Platform yöneticisi
│   ├── _layout.tsx
│   ├── tenants/
│   └── reports/
├── (business)/           # İşletme sahibi
│   ├── _layout.tsx
│   ├── staff/
│   └── settings/
├── (staff)/              # Çalışan
│   ├── _layout.tsx
│   └── calendar/
└── (customer)/           # Müşteri
    ├── _layout.tsx
    └── bookings/
```

---

## 2. Base + Variant Pattern

```typescript
// components/shared/BaseHeader.tsx
interface BaseHeaderProps {
  title: string;
  showBack?: boolean;
  actions?: React.ReactNode;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
}

export function BaseHeader({ title, showBack, actions }: BaseHeaderProps) {
  return (
    <View className="flex-row items-center p-4 bg-white dark:bg-gray-900">
      {showBack && <BackButton />}
      <Text className="text-xl font-bold flex-1">{title}</Text>
      {actions}
    </View>
  );
}

// Rol-specific kullanım
function BusinessHeader() {
  return (
    <BaseHeader
      title="Dashboard"
      actions={<NotificationBell />}
    />
  );
}
```

---

## 3. Permission-aware Rendering

```typescript
// hooks/usePermissions.ts
export function usePermissions() {
  const user = useAuthStore(s => s.user);
  
  return {
    canManageStaff: checkPermission(user, 'staff:manage'),
    canViewReports: checkPermission(user, 'reports:view'),
    canDeleteBooking: checkPermission(user, 'booking:delete'),
  };
}

// Kullanım
function SettingsScreen() {
  const { canManageStaff, canViewReports } = usePermissions();

  return (
    <View>
      {canManageStaff && <StaffManagement />}
      {canViewReports && <ReportsSection />}
    </View>
  );
}
```

❌ Yanlış:
```typescript
// Role ismine göre kontrol - yeni rol eklenince kırılır
{role === 'admin' && <StaffManagement />}
```

---

## 4. Navigation Config

```typescript
// config/navigation.ts
export const navigationConfig: Record<string, NavItem[]> = {
  platformAdmin: [
    { name: 'Tenants', icon: 'building', screen: 'tenants' },
    { name: 'Reports', icon: 'chart', screen: 'reports' },
  ],
  business: [
    { name: 'Dashboard', icon: 'home', screen: 'dashboard' },
    { name: 'Staff', icon: 'users', screen: 'staff' },
  ],
  staff: [
    { name: 'Calendar', icon: 'calendar', screen: 'calendar' },
    { name: 'Profile', icon: 'user', screen: 'profile' },
  ],
};
```

---

## 5. Modal Standardizasyonu

```typescript
// components/shared/BaseModal.tsx
interface BaseModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function BaseModal({ visible, onClose, title, size = 'md', children, footer }: BaseModalProps) {
  return (
    <Modal visible={visible} onRequestClose={onClose}>
      <View className={modalSizeClasses[size]}>
        {title && <ModalHeader title={title} onClose={onClose} />}
        <ScrollView>{children}</ScrollView>
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </View>
    </Modal>
  );
}
```

---

## 6. Settings Composition

```typescript
// config/settings.ts
export const settingsSections: SettingsSection[] = [
  { key: 'profile', component: ProfileSettings },
  { key: 'notifications', component: NotificationSettings },
  { key: 'billing', component: BillingSettings, requiredPermission: 'billing:manage' },
  { key: 'team', component: TeamSettings, requiredPermission: 'team:manage' },
];

// SettingsScreen
function SettingsScreen() {
  const { hasPermission } = usePermissions();

  return (
    <ScrollView>
      {settingsSections
        .filter(s => !s.requiredPermission || hasPermission(s.requiredPermission))
        .map(s => <s.component key={s.key} />)
      }
    </ScrollView>
  );
}
```

---

## 7. Kontrol Listesi

- [ ] Her rol için izole layout grubu var
- [ ] Ortak bileşenler base + variant pattern kullanıyor
- [ ] Permission bazlı rendering (rol ismine göre değil)
- [ ] Navigation config-driven
- [ ] Modal'lar BaseModal kullanıyor
- [ ] Settings composition pattern uygulanmış
