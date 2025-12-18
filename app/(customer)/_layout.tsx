
import { View, Text, Platform, Pressable } from 'react-native';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { useAuthStore } from '@/stores/authStore';
import { BlurView } from 'expo-blur';

export default function CustomerLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 85,
          elevation: 0,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
        },
        tabBarShowLabel: false,
        sceneStyle: { backgroundColor: '#121212' }
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Keşfet',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="home" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Randevular',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="calendar-today" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoriler',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name={focused ? "favorite" : "favorite-border"} size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name={focused ? "person" : "person-outline"} size={28} color={color} />
          ),
        }}
      />
      {/* Hidden Routes */}
      <Tabs.Screen name="search" options={{ href: null }} />
      <Tabs.Screen name="booking/staff-selection" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="booking/time-slot-selection" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="booking/booking-summary" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="booking/booking-success" options={{ href: null, tabBarStyle: { display: 'none' } }} />
    </Tabs>
  );
}

function CustomTabBar({ state, descriptors, navigation }: any) {
  // Whitelist of visible tabs
  const VISIBLE_TABS = ['home', 'appointments', 'favorites', 'profile'];

  return (
    <View className="absolute bottom-0 left-0 right-0 overflow-hidden border-t border-white/5">
      <BlurView intensity={80} tint="dark" className="absolute inset-0" />

      <View className="flex-row items-center justify-between px-6 pt-3 pb-8 bg-[#121212]/80">
        {VISIBLE_TABS.map((routeName, index) => {
          const route = state.routes.find((r: any) => r.name === routeName);

          if (!route) return null;

          const { options } = descriptors[route.key];
          const isFocused = state.index === state.routes.indexOf(route);

          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const color = isFocused ? COLORS.primary.DEFAULT : '#6b7280'; // Gray-500

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              className="items-center justify-center gap-1 active:opacity-70 group"
              style={{ minWidth: 64 }}
            >
              <View className="items-center justify-center h-8 relative">
                {/* Icon */}
                {options.tabBarIcon && options.tabBarIcon({ color, size: 28, focused: isFocused })}

                {/* Active Indicator Dot (Optional polish) */}
                {isFocused && (
                  <View className="absolute -top-1 right-0 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(212,175,53,0.8)]" />
                )}
              </View>
              <Text
                style={{
                  color,
                  fontSize: 10,
                  fontWeight: isFocused ? '600' : '500',
                  marginTop: 2
                }}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
