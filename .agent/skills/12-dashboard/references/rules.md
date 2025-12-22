# Dashboard Components - Detaylı Kurallar

## 1. Form (React Hook Form + Zod)

```tsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Schema
const bookingSchema = z.object({
  customerName: z.string().min(2, 'İsim en az 2 karakter'),
  phone: z.string().regex(/^05\d{9}$/, 'Geçerli telefon girin'),
  date: z.date({ required_error: 'Tarih seçin' }),
  serviceId: z.string().uuid('Hizmet seçin'),
  notes: z.string().optional(),
});

type BookingForm = z.infer<typeof bookingSchema>;

// Component
function BookingForm({ onSubmit }: { onSubmit: (data: BookingForm) => void }) {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
  });

  return (
    <View className="gap-4">
      <Controller
        control={control}
        name="customerName"
        render={({ field: { onChange, value } }) => (
          <View>
            <Text className="text-sm font-medium mb-1">İsim</Text>
            <TextInput
              value={value}
              onChangeText={onChange}
              className="border border-gray-300 p-3 rounded-xl"
            />
            {errors.customerName && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.customerName.message}
              </Text>
            )}
          </View>
        )}
      />
      
      <Button
        title={isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      />
    </View>
  );
}
```

---

## 2. Grafik (Victory Native)

```tsx
import { VictoryChart, VictoryBar, VictoryAxis, VictoryTheme } from 'victory-native';

function RevenueChart({ data }: { data: { month: string; revenue: number }[] }) {
  return (
    <View className="bg-white dark:bg-gray-800 p-4 rounded-2xl">
      <Text className="text-lg font-bold mb-4">Aylık Gelir</Text>
      <VictoryChart theme={VictoryTheme.material} height={200}>
        <VictoryAxis
          tickFormat={(t) => t}
          style={{ tickLabels: { fontSize: 10 } }}
        />
        <VictoryAxis
          dependentAxis
          tickFormat={(t) => `${t / 1000}K`}
        />
        <VictoryBar
          data={data}
          x="month"
          y="revenue"
          style={{ data: { fill: '#D4A574' } }}
        />
      </VictoryChart>
    </View>
  );
}

// Pie chart
import { VictoryPie } from 'victory-native';

function ServiceDistribution({ data }: Props) {
  return (
    <VictoryPie
      data={data}
      x="service"
      y="count"
      colorScale={['#D4A574', '#4ECDC4', '#FF6B6B', '#95E1D3']}
      innerRadius={50}
      labels={({ datum }) => `${datum.service}: ${datum.count}`}
    />
  );
}
```

---

## 3. Tablo / Liste

```tsx
function DataTable<T>({ 
  data, 
  columns, 
  onRowPress 
}: TableProps<T>) {
  return (
    <View className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <View className="flex-row bg-gray-100 dark:bg-gray-700 p-3">
        {columns.map((col) => (
          <Text 
            key={col.key} 
            className="flex-1 font-semibold text-gray-600 dark:text-gray-300"
          >
            {col.label}
          </Text>
        ))}
      </View>
      
      {/* Rows */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable 
            onPress={() => onRowPress?.(item)}
            className="flex-row p-3 border-b border-gray-100 dark:border-gray-700"
          >
            {columns.map((col) => (
              <Text key={col.key} className="flex-1 text-gray-800 dark:text-gray-200">
                {col.render ? col.render(item) : item[col.key]}
              </Text>
            ))}
          </Pressable>
        )}
      />
    </View>
  );
}
```

---

## 4. Skeleton Loader

```tsx
function Skeleton({ className }: { className?: string }) {
  return (
    <View className={twMerge('bg-gray-200 dark:bg-gray-700 rounded animate-pulse', className)} />
  );
}

// Kullanım
function BookingCardSkeleton() {
  return (
    <View className="bg-white dark:bg-gray-800 p-4 rounded-2xl gap-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-1/4" />
    </View>
  );
}

function BookingList() {
  const { bookings, loading } = useBookings();

  if (loading) {
    return (
      <View className="gap-3">
        <BookingCardSkeleton />
        <BookingCardSkeleton />
        <BookingCardSkeleton />
      </View>
    );
  }

  return <FlatList data={bookings} ... />;
}
```

---

## 5. Empty State

```tsx
function EmptyState({ 
  icon, 
  title, 
  description, 
  action 
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <View className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full items-center justify-center mb-4">
        <Ionicons name={icon} size={32} color="#9CA3AF" />
      </View>
      <Text className="text-xl font-bold text-gray-800 dark:text-white text-center">
        {title}
      </Text>
      <Text className="text-gray-500 text-center mt-2">
        {description}
      </Text>
      {action && (
        <Button
          title={action.label}
          onPress={action.onPress}
          className="mt-6"
        />
      )}
    </View>
  );
}

// Kullanım
<EmptyState
  icon="calendar-outline"
  title="Randevu yok"
  description="Henüz randevunuz bulunmuyor"
  action={{ label: 'Randevu Al', onPress: () => router.push('/booking/new') }}
/>
```

---

## 6. Error State

```tsx
function ErrorState({ 
  message, 
  onRetry 
}: { 
  message: string; 
  onRetry?: () => void 
}) {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
        <Ionicons name="alert-circle" size={32} color="#EF4444" />
      </View>
      <Text className="text-lg font-bold text-gray-800 dark:text-white text-center">
        Bir hata oluştu
      </Text>
      <Text className="text-gray-500 text-center mt-2">
        {message}
      </Text>
      {onRetry && (
        <Button
          title="Tekrar Dene"
          onPress={onRetry}
          variant="outline"
          className="mt-4"
        />
      )}
    </View>
  );
}
```

---

## 7. Modal / Bottom Sheet

```tsx
import BottomSheet from '@gorhom/bottom-sheet';

function FilterSheet({ isOpen, onClose, onApply }: FilterSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['50%', '80%'], []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isOpen ? 0 : -1}
      snapPoints={snapPoints}
      onClose={onClose}
      enablePanDownToClose
    >
      <View className="p-4">
        <Text className="text-xl font-bold mb-4">Filtrele</Text>
        {/* Filter options */}
        <Button title="Uygula" onPress={onApply} />
      </View>
    </BottomSheet>
  );
}
```

---

## 8. Kontrol Listesi

- [ ] Form'larda React Hook Form + Zod
- [ ] Validation error'ları gösteriliyor
- [ ] Grafiklerde Victory Native
- [ ] Skeleton loader loading state için
- [ ] Empty state boş liste için
- [ ] Error state hata durumu için
- [ ] Bottom sheet modal'lar için
