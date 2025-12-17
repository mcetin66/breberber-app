import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@/components/shared/layouts/AppHeader';

export default function StaffCalendarScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#0F172A]" edges={['top']}>
      <AppHeader title="Takvimim" subtitle="Randevu Planı" />
      <View className="flex-1 items-center justify-center">
        <Text className="text-white">Takvim yakında burada olacak.</Text>
      </View>
    </SafeAreaView>
  );
}
