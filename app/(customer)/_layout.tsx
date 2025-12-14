
import { View, Text, Platform, Pressable } from 'react-native';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { useAuthStore } from '@/stores/authStore';
import { LinearGradient } from 'expo-linear-gradient';

export default function CustomerLayout() {
  const { user } = useAuthStore();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          height: 100,
        },
        tabBarShowLabel: false,
        sceneStyle: { backgroundColor: COLORS.background.DEFAULT }
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="home" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="calendar-today" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name={focused ? "favorite" : "favorite-border"} size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
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
    <View className="absolute bottom-0 left-0 right-0 z-50 pointer-events-box-none">
      {/* Gradient Overlay for Fade Effect */}
      <LinearGradient
        colors={['transparent', 'rgba(16, 25, 34, 0.95)', '#101922']}
        locations={[0, 0.5, 1]}
        className="absolute bottom-0 left-0 right-0 h-32"
        pointerEvents="none"
      />

      {/* Floating Bar */}
      <View className="flex-row items-center justify-between mx-5 mb-8 bg-[#1a1a1a] border border-white/10 rounded-full px-6 py-3.5 shadow-2xl shadow-black">
        {VISIBLE_TABS.map((routeName) => {
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

          const color = isFocused ? COLORS.primary.DEFAULT : '#64748b'; // Slate-500

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              className="items-center justify-center gap-1 active:opacity-70"
              style={{ minWidth: 64 }}
            >
              <View className="items-center justify-center h-7">
                {options.tabBarIcon && options.tabBarIcon({ color, size: 24, focused: isFocused })}
              </View>
              <Text
                style={{
                  color,
                  fontSize: 10,
                  fontWeight: isFocused ? '700' : '500',
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
