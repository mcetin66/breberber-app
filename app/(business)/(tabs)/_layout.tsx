import { View, Text, Pressable } from 'react-native';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { BlurView } from 'expo-blur';

export default function BusinessTabsLayout() {
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
                name="dashboard"
                options={{
                    title: 'Ana Sayfa',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialIcons name="home" size={28} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="calendar"
                options={{
                    title: 'Takvim',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialIcons name="calendar-today" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="finance"
                options={{
                    title: 'Raporlar',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialIcons name="bar-chart" size={26} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Ayarlar',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialIcons name="settings" size={26} color={color} />
                    ),
                }}
            />
            {/* Hidden Routes */}
            <Tabs.Screen name="staff" options={{ href: null }} />
            <Tabs.Screen name="services" options={{ href: null }} />
        </Tabs>
    );
}

function CustomTabBar({ state, descriptors, navigation }: any) {
    const VISIBLE_TABS = ['dashboard', 'calendar', 'finance', 'settings'];

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
