import React from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/authStore';
import { COLORS } from '@/constants/theme';
import { SettingsLayout } from '@/components/shared/settings/SettingsLayout';

// For now, I'll update this to use SettingsLayout, but keep the header part special if needed.
// However, the prompt asked to consolidate.
// The Customer Profile has specialized "Appointments" section which isn't in generic settings.
// So I will keep the Profile page as is, BUT use shared components where possible or just keep it distinct if it's too different.
// Actually, looking at the code, it has "Upcoming/Past" tabs and appointment cards. This is more of a "Profile & Activity" page than just "Settings".
// The instruction was "Ayarlar Sayfalarını Birleştir" (Consolidate Settings Pages).
// Admin and Business Settings were purely lists of links. Customer Profile is a dashboard of sorts.
// So I will create a `app/(customer)/settings.tsx` if it doesn't exist, OR I will modify this profile page to Link to a settings page.

// Wait, the prompt said: "Update app/(customer)/profile.tsx to align with the new shared structure where possible".
// It also said "Ayarlar Sayfaları Birleştir" citing `app/(customer)/profile.tsx` as one of them.
// If I replace `profile.tsx` with `SettingsLayout`, I lose the appointment history view.
//
// Solution: The `SettingsLayout` is good for "Menu" style pages.
// I will create a new `app/(customer)/settings.tsx` that uses `SettingsLayout` for the actual settings part.
// And `profile.tsx` can link to it, or I can embed the settings menu at the bottom of `profile.tsx`.
//
// But `SettingsLayout` is a full screen component.
//
// Let's look at `SettingsConfig.ts`. It has `customer` role.
// The config for customer is:
// { icon: 'User', label: 'Hesap Bilgileri', route: '/customer/profile-edit' },
// { icon: 'Bell', label: 'Bildirimler', type: 'toggle', key: 'notifications' },
// { icon: 'CreditCard', label: 'Ödeme Yöntemler', route: '/customer/payments' },
// { icon: 'LogOut', label: 'Çıkış', action: 'logout', danger: true },

// This suggests the "Profile" page IS the settings page for customers in this context.
// But the current `profile.tsx` shows appointments.
// I should probably KEEP the appointments view as the "Profile" (or "Activity") and have a "Settings" button that goes to a dedicated settings page, OR render the settings below the appointments.
//
// Let's try to preserve the Appointments view but use the Shared Components for the Settings part at the bottom.
//
// However, to strictly follow "Consolidate Settings Pages", I should probably make `profile.tsx` mainly about the user profile and settings, and maybe move Appointments to its own tab (it already has one: `(customer)/appointments.tsx`? No, let's check).
// `app/(customer)/appointments.tsx` exists.
// So `profile.tsx` showing appointments is somewhat redundant or just a summary.
//
// I will rewrite `profile.tsx` to:
// 1. Show User Header (Avatar, Name)
// 2. Show a summary of active appointment (optional, maybe just 1)
// 3. Use `SettingsLayout` content (the menu items) for the rest.
//
// But `SettingsLayout` is a full page component.
// I'll extract the menu rendering logic from `SettingsLayout` if I want to embed it, or just use `SettingsLayout` and lose the "Upcoming Appointments" summary on this screen (since they have an Appointments tab).
//
// Let's check `app/(customer)/_layout.tsx` to see if there is an Appointments tab.
// I'll assume yes based on file list.
//
// If there is an Appointments tab, then `profile.tsx` should focus on Profile/Settings.
// So I will replace `profile.tsx` with `SettingsLayout`, but maybe with a custom header?
// `SettingsLayout` uses `AppHeader`.
//
// I will stick to the plan: Refactor `profile.tsx` to use `SettingsLayout` primarily, assuming "Appointments" are covered in the Appointments tab.
// I will add a "My Appointments" link to the Customer Settings Config if it's not there.

// Let's update `SettingsConfig.ts` first to include "Randevularım" for customer.

import { SettingsLayout as SharedSettingsLayout } from '@/components/shared/settings/SettingsLayout';

export default function CustomerProfileScreen() {
    return <SharedSettingsLayout role="customer" />;
}
