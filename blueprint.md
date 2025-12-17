~~# Engineering Blueprint: Technical Implementation Steps~~

~~This document is the execution guide to align the codebase 100% with `master-plan.md`.~~

~~---~~

~~## Phase 1: Platform & Admin Restructuring~~
~~**Goal:** Rename `(admin)` to `(platform)` and standardize terminology.~~

~~1.  **Rename Root Folder**~~
~~    *   `mv app/(admin) app/(platform)`~~
~~2.  **Rename Tenants Module**~~
~~    *   `mv app/(platform)/barbers app/(platform)/tenants`~~
~~3.  **Consolidate Reports**~~
~~    *   *Action:* Analyze `app/(platform)/reports.tsx`. If valuable, merge into `dashboard.tsx` or `audit.tsx`.~~
~~    *   *Delete:* `rm app/(platform)/reports.tsx` (Enforce strict MP structure).~~
~~4.  **Update Routes & Layouts**~~
~~    *   File: `app/(platform)/_layout.tsx` -> Update tab names/icons.~~
~~    *   File: `app/_layout.tsx` -> Change `(admin)` to `(platform)`.~~
~~    *   File: `stores/authStore.ts` -> Redirect `admin` role to `/(platform)/dashboard`.~~
~~    *   Global Search/Replace: `/(admin)` -> `/(platform)` in all files.~~

~~---~~

~~## Phase 2: Business & Staff Cleanup~~
~~**Goal:** Remove legacy files and enforce the `SettingsShell` pattern.~~

~~1.  **Delete Legacy Staff Dashboard**~~
~~    *   `rm app/(business)/staff-dashboard.tsx`~~
~~2.  **Refactor Business Settings**~~
~~    *   *Current:* `app/(business)/settings/` (folder with `gallery`, `hours`, `profile`).~~
~~    *   *Target:* `app/(business)/settings.tsx` (using `SettingsShell`).~~
~~    *   *Action:* Move specific setting pages to `app/(business)/settings/` sub-routes ONLY if `SettingsConfig` links to them.~~
~~    *   Ensure `app/(business)/settings.tsx` is the entry point.~~
~~3.  **Handle Finance**~~
~~    *   *Action:* Move `app/(business)/finance.tsx` to `app/(business)/(tabs)/finance.tsx` OR link it from Dashboard.~~
~~    *   *Decision:* If not in MP tabs, keep as a separate route `app/(business)/finance.tsx` but ensure it's accessible.~~
~~4.  **Staff Settings Alignment**~~
~~    *   Create `app/(staff)/settings.tsx` using `SettingsShell`.~~
~~    *   Ensure `app/(staff)/(tabs)/profile.tsx` links to Settings or *is* the Settings view.~~

~~---~~

~~## Phase 3: Shared Components & Architecture~~
~~**Goal:** Implement the "Unified Patterns" defined in MP.~~

~~1.  **Implement `SettingsShell`~~
~~    *   Path: `components/shared/settings/SettingsShell.tsx`~~
~~    *   Props: `{ role: Role, config: SettingsItem[] }`~~
~~    *   Logic: Renders `AppHeader` + `ScrollView` of `SettingsRow` items.~~
~~2.  **Update `SettingsConfig.ts`~~
~~    *   Ensure keys match: `platform_admin`, `business_owner`, `staff`, `customer`.~~
~~    *   Update routes to match new folder structure (e.g., `/platform/tenants`).~~
~~3.  **Refactor All Settings Screens**~~
~~    *   `app/(platform)/settings.tsx` -> Use `SettingsShell`.~~
~~    *   `app/(business)/settings.tsx` -> Use `SettingsShell`.~~
~~    *   `app/(staff)/settings.tsx` -> Use `SettingsShell`.~~
~~    *   `app/(customer)/profile.tsx` -> Use `SettingsShell` (or embed it).~~

~~---~~

~~## Phase 4: Data & Logic Alignment~~
~~**Goal:** Enforce 5-Tier Role Model.~~

~~1.  **Type Definitions (`types/index.ts`)**~~
~~    *   Remove `role: 'business'` (ambiguous).~~
~~    *   Enforce `role: 'business_owner' | 'staff' | 'platform_admin' | 'customer'`.~~
~~2.  **Auth Store Updates**~~
~~    *   Fix `impersonateBusiness` to work with `business_owner` role.~~
~~    *   Ensure `validateRoles` logic supports the new strict types.~~

~~---~~

~~## Phase 5: Final Cleanup~~
~~1.  **Delete `app/(auth)/admin-login.tsx`~~
~~    *   *Reason:* MP specifies "Shared Authentication". All users log in via `login.tsx`.~~
~~    *   *Action:* Ensure `login.tsx` can handle admin credentials and redirect to `/(platform)`.~~
~~2.  **Verify Imports**~~
~~    *   Run `npx expo start --clear` and check for broken imports due to renames.~~
~~    *   Fix any `import ... from '@/app/(admin)/...'` paths.~~

~~# GEMINI Audit & Directives (Latest)~~

~~Based on the latest architectural audit and user requests, the following actions are required to fix "Data & Type" errors and ensure alignment with `master.md` principles.~~

~~## 1. Theme Consistency~~
~~*   **Action:** Update `constants/theme.ts`.~~
~~*   **Directive:** Add `dark` key to `COLORS.background` to ensure theme reliability across components.~~
~~    *   `COLORS.background.dark` = `'#0f0f0f'`~~

~~## 2. Type Definitions (Crucial)~~
~~*   **Action:** Update `types/index.ts`.~~
~~*   **Directive:**~~
~~    *   Add `logo?: string` to `Barber` interface (Business entity).~~
~~    *   Add `notes?: string` to `Appointment` interface.~~
~~    *   Ensure `Role` type encompasses `'customer' | 'business_owner' | 'staff' | 'platform_admin'`.~~

~~## 3. Mock Data Alignment~~
~~*   **Action:** Update `services/mockApi.ts`.~~
~~*   **Directive:**~~
~~    *   Update `mockBarbers` objects to include the new `logo` field (duplicate existing `image` URL if needed).~~
~~    *   Verify `role` strings in `mockUsers` match the strict types defined in `types/index.ts`.~~

~~## 4. General Cleanup~~
~~*   **Directive:** Ensure no leftover `admin` hardcoded strings exist in business logic where `platform_admin` or `business_owner` is intended.~~

~~# GEMINI Audit & Directives (Iteration 2)~~

~~Based on the review of `claude-report.md` and current file system state, the following critical issues remain:~~

~~## 1. Persistent Unexpected Root Directories ✅ REVIEWED~~
~~*   **Problem:** The directories `app/barber` and `app/detail` exist at the root level.~~
~~*   **Finding:** These are INTENTIONAL public routes (no auth required). Defined in `app/_layout.tsx` as `isPublicRoute`.~~
~~*   **Decision:** NOT a violation - kept as-is for public access to business detail pages.~~

~~## 2. Supabase Type Generation Mismatch ✅ MITIGATED~~
~~*   **Problem:** 17 remaining type errors are flagged in `claude-report.md`, mostly related to Supabase schema mismatches.~~
~~*   **Directive:** Add `as any` casting heavily if type generation is not possible right now, to unblock the build.~~
~~*   **Result:** Added `as any` to all insert/update calls in services/. Errors reduced from 17 → 10.~~

~~## 3. FlashList Type Mismatch ✅ COMPLETED~~
~~*   **Problem:** Reported error in `app/(customer)/search.tsx` regarding FlashList generics.~~
~~*   **Fix:** Replaced `FlashList` with React Native's `FlatList` for better type compatibility.~~

~~## 4. Route Typing Regeneration (PENDING - Requires `npx expo start`)~~
~~*   **Problem:** Renaming folders (`(admin)` -> `(platform)`) breaks typed routes until regeneration.~~
~~*   **Directive:**~~
~~    *   **Regenerate:** Run `npx expo customize` or simply start the server to regenerate `expo-env.d.ts`.~~

# GEMINI Audit & Directives (Iteration 3)

**Status:** Architecture refined. Critical errors mitigated (10 errors remaining).
**Focus:** Visual Polish (Aesthetics) & Functional Validation (Testing).

## ~~1. Visual Polish & "Wow" Factor~~ ✅ COMPLETED
*   ~~**Observations:** The codebase is functional, but lacks the "Wow" factor requested in `system_instructions`.~~
*   ~~**Directive:**~~
    *   ~~**Install Dependencies:** Ensure `react-native-reanimated`, `lottie-react-native`, `expo-linear-gradient` are installed and configured.~~
    *   ~~**Global Gradient:** Implement a subtle animated gradient background wrapper component (`components/ui/PremiumBackground.tsx`) and apply it to `_layout.tsx` or key screens (Login, Welcome).~~
    *   ~~**Animations:** Add entry animations (FadeInUp) to `SettingsShell.tsx` and Dashboard cards. (Applied to `app/index.tsx` as high impact entry)~~

## ~~2. Testing & Validation~~ ✅ VERIFIED
*   ~~**Problem:** Logic changes (renaming roles, moving folders) are untested.~~
*   **Result:** Auth flow verified working:
    *   ✅ Unauthenticated users redirected to login.
    *   ✅ Route guards functioning correctly.
    *   ⚠️ Reanimated warnings in dev mode (expected, harmless).
*   **Remaining:** Full role-based login tests (customer, business_owner, platform_admin) pending user credentials.

## ~~3. Final Type Cleanup~~ ✅ COMPLETED
*   ~~**Constraint:** We cannot access the live Supabase project to regenerate types.~~
*   ~~**Directive:**~~
    *   ~~Manually PATCH `types/database.ts` to include the missing fields (`logo`, `notes`, `platform_admin` enum value) causing the remaining 10 errors.~~
    *   ~~Remove `as any` hacks where possible after patching `types/database.ts`.~~

**Priority Order:**
1.  ~~Visual Polish (High - User Experience)~~
2.  Route Validation (High - Functionality)
3.  ~~Type Cleanup (Medium - Code Quality)~~

## 5. Remaining Admin-Login Reference ✅ COMPLETED
*   **Fixed:** `app/index.tsx` was referencing deleted `/(auth)/admin-login`. Changed to `/(auth)/login`.

# GEMINI Audit & Directives (Iteration 4)

**Status:** Testing phase revealed critical route mismatches.
**Focus:** Route Repair (Broken Links) & Missing Page Implementation.

## ~~1. Route Mismatch Repairs (High Priority)~~ ✅ COMPLETED
*   ~~**Observation:** `SettingsConfig.ts` points to non-existent or misnamed paths.~~
*   ~~**Directive:** Update `components/shared/settings/SettingsConfig.ts` to match actual file system:~~
    *   ~~**Business:** Change `/(business)/(tabs)/settings/...` -> `/(business)/settings/...`~~ ✅
    *   ~~**Customer:** Change `/(customer)/profile/edit` -> `/(customer)/profile-edit`~~ ✅
    *   ~~**Customer:** Remove `/(customer)/profile/payments`~~ ✅ Removed
    *   ~~**Staff:** Remove `/(staff)/(tabs)/hours`~~ ✅ Removed
    *   ~~**Platform:** Change `/(platform)/users` -> `/(platform)/tenants`~~ ✅
    *   ~~**Platform:** Remove `/(platform)/system`~~ ✅ Removed

## ~~2. Missing Page Implementation (Medium Priority)~~ ✅ COMPLETED
*   ~~**Problem:** User expects "Business Profile" and "Hours" settings to work, but routes might be misconfigured in layout stack too.~~
*   ~~**Directive:**~~
    *   ~~Ensure `app/(business)/settings/_layout.tsx` exists~~ ✅ Created
    *   ~~Move `app/(customer)/profile-edit.tsx`~~ - Kept as-is, config updated to match

## ~~3. General Menu Audit~~ ✅ COMPLETED
*   ~~**Directive:**~~
    *   ~~Verify `app/(business)/_layout.tsx` correctly mounts the `settings` screens.~~ ✅ Added
    *   ~~Verify `app/(staff)/_layout.tsx` tabs structure.~~ ✅ Already correct

# GEMINI Audit & Directives (Iteration 5)

**Status:** Advanced UX Requirement identified.
**Focus:** Role Switching (Business Owner <-> Staff View) & Context Management.

## ~~1. Architectural Strategy: "Modlu" Kullanım~~ ✅ COMPLETED
*   ~~**Concept:** A `business_owner` is effectively a super-set of `staff`. They should login to the Business Dashboard by default but be able to "view as" a staff member to manage their personal calendar.~~
*   ~~**Decision:** Implement a `viewMode` state in frontend (Store) rather than changing DB roles.~~

## ~~2. Implementation Directives~~ ✅ COMPLETED
*   **Store Update (`stores/authStore.ts`):**
    *   ~~Add `viewMode: 'business' | 'staff' | 'customer'` state.~~ ✅
    *   ~~Default `viewMode` is set based on user's primary `role` on login.~~ ✅
    *   ~~Add action `switchViewMode(mode: 'business' | 'staff')`.~~ ✅

*   **UI - Switch Actions:**
    *   **In Business Settings (`components/shared/settings/SettingsConfig.ts`):**
        *   ~~Add a new item: `{ icon: User, label: 'Personel Moduna Geç', action: 'switch_to_staff' }` for `business_owner`.~~ ✅
    *   **In Staff Settings (accessible only when actual role is business_owner):**
        *   ~~Add item: `{ icon: Store, label: 'Yönetici Moduna Dön', action: 'switch_to_business' }`.~~ ✅

*   **Navigation Logic (`app/_layout.tsx`):**
    *   ~~Update redirect logic to listen to `viewMode` AND `role`.~~ ✅
    *   ~~If `role === 'business_owner'` AND `viewMode === 'staff'`, allow access to `(staff)` routes and redirect there.~~ ✅

## ~~3. Execution Steps~~ ✅ COMPLETED
1.  ~~Update `authStore.ts` types and actions.~~ ✅
2.  ~~Update `SettingsConfig.ts` with new menu items.~~ ✅
3.  ~~Update `SettingsShell.tsx` to handle the new `action` types (`switch_to_staff`, `switch_to_business`).~~ ✅
4.  ~~Refactor `app/_layout.tsx` (Route Guards) to respect `viewMode` overrides.~~ ✅

**OTOMATİK TALİMAT:**
> Yaptığın işlerin üzerini çiz, işlem bitince bana `claude-report.md` üzerinden yaptıklarını ilet.
Komut: `update_report` (Manual trigger if needed).