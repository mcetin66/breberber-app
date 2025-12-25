import { View, Text, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Star, MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Barber } from '@/types';
import { COLORS } from '@/constants/theme';

interface BarberCardProps {
  barber: Barber;
}

export default function BarberCard({ barber }: BarberCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/detail/${barber.id}`);
  };

  return (
    <Pressable
      onPress={handlePress}
      className="bg-white dark:bg-background-card rounded-[2rem] p-3 shadow-sm mb-5 mx-4 active:scale-[0.98]"
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      {/* Hero Image Area */}
      <View className="relative w-full aspect-[16/9] rounded-[1.5rem] overflow-hidden bg-slate-800">
        <Image
          source={{ uri: barber.coverImage }}
          className="w-full h-full"
          resizeMode="cover"
        />

        {/* Gradient Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          className="absolute inset-0 z-10"
        />

        {/* Status Badge */}
        <View className="absolute top-3 right-3 z-20 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-2.5 py-1 flex-row items-center gap-1">
          <View
            className={`w-1.5 h-1.5 rounded-full ${barber.isOpen ? 'bg-status-success' : 'bg-status-error'}`}
          />
          <Text className="text-[10px] font-bold text-white uppercase tracking-wider">
            {barber.isOpen ? 'Açık' : 'Kapalı'}
          </Text>
        </View>

        {/* Title & Location Overlay */}
        <View className="absolute bottom-3 left-4 z-20 flex-col">
          <Text className="text-white text-lg font-bold leading-tight shadow-sm">
            {barber.name}
          </Text>
          <Text className="text-slate-300 text-xs font-medium mt-0.5 shadow-sm">
            {barber.address}
          </Text>
        </View>
      </View>

      {/* Card Body */}
      <View className="flex-row items-center justify-between mt-3 px-1">
        <View className="flex-row items-center gap-4">
          {/* Rating */}
          <View className="flex-row items-center gap-1">
            <Star size={20} color={COLORS.primary.DEFAULT} fill={COLORS.primary.DEFAULT} />
            <Text className="text-slate-900 dark:text-white font-bold text-sm">
              {(barber.rating ?? 0).toFixed(1)}
            </Text>
            <Text className="text-text-secondary text-xs font-medium">
              ({barber.reviewCount})
            </Text>
          </View>

          {/* Distance (Mock) */}
          <View className="flex-row items-center gap-1">
            <MapPin size={18} color={COLORS.text.muted} />
            <Text className="text-text-muted text-xs font-medium">
              1.2 km
            </Text>
          </View>
        </View>

        {/* Book Button */}
        <View className="bg-primary rounded-full px-5 py-2 shadow-lg shadow-primary/25">
          <Text className="text-white text-xs font-bold">
            Randevu Al
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
