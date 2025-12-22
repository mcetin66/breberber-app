/**
 * RoleTabLayout - Rol bazlı tab navigation komponenti
 * 
 * Her rol için farklı tab'ları gösterir. Tab tanımları constants/navigation.ts'den gelir.
 * Bu komponent doğrudan kullanılmaz, her rolün _layout.tsx dosyasında import edilir.
 */

import React from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { TAB_BAR_STYLES, TAB_BAR_COLORS, TabDefinition } from '@/constants/navigation';

interface RoleTabLayoutProps {
    tabs: TabDefinition[];
    hideForStaff?: boolean; // Staff kullanıcı için bazı tab'ları gizle
    isStaff?: boolean;
    elevated?: boolean; // Platform'daki merkez buton için
}

export function RoleTabLayout({ tabs, isStaff = false, elevated = false }: RoleTabLayoutProps) {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    ...TAB_BAR_STYLES.container,
                    borderTopWidth: 1,
                },
                tabBarItemStyle: TAB_BAR_STYLES.item,
                tabBarActiveTintColor: TAB_BAR_COLORS.active,
                tabBarInactiveTintColor: TAB_BAR_COLORS.inactive,
                tabBarLabelStyle: TAB_BAR_STYLES.label,
            }}
        >
            {tabs.map((tab) => {
                // Staff için gizlenmesi gereken tab'ları kontrol et
                const shouldHide = tab.hidden || (isStaff && tab.hideForStaff);

                // Elevated buton stili (Platform dashboard için)
                const elevatedStyle = tab.elevated ? {
                    tabBarIcon: ({ focused }: { focused: boolean }) => (
                        <View
                            className="w-[64px] h-[64px] rounded-full items-center justify-center -mt-6 shadow-lg shadow-black/50 border-[4px] border-[#121212]"
                            style={{
                                backgroundColor: focused ? TAB_BAR_COLORS.active : '#1E1E1E',
                                shadowColor: focused ? TAB_BAR_COLORS.active : '#000',
                                shadowOpacity: focused ? 0.4 : 0.2,
                                shadowRadius: 10,
                                elevation: 8
                            }}
                        >
                            <tab.icon size={28} color={focused ? '#121212' : TAB_BAR_COLORS.inactive} />
                        </View>
                    ),
                    tabBarLabelStyle: { display: 'none' as const },
                } : {};

                return (
                    <Tabs.Screen
                        key={tab.name}
                        name={tab.name}
                        options={{
                            title: tab.title,
                            href: shouldHide ? null : undefined,
                            tabBarIcon: tab.elevated ? elevatedStyle.tabBarIcon : ({ color }) => (
                                <tab.icon size={24} color={color} />
                            ),
                            ...(tab.elevated ? { tabBarLabelStyle: elevatedStyle.tabBarLabelStyle } : {}),
                        }}
                    />
                );
            })}
        </Tabs>
    );
}
