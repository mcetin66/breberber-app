# BreBerber Master Plan

> **STATUS:** ACTIVE & DEFINITIVE
> **LAST UPDATED:** 15 Dec 2025
> **ROLE:** Single Source of Truth

---

## 1. Project Overview

**Mission:** Build a scalable, multi-tenant SaaS platform for the beauty and grooming industry (Barbershops, Salons) that seamlessly connects Platform Admins, Business Owners, Staff, and Customers.

**Core Value:** A unified, premium ecosystem where:
*   **Businesses** manage operations effortlessly.
*   **Staff** focus on their craft and schedule.
*   **Customers** enjoy a frictionless booking experience.
*   **Platform Admins** oversee the entire SaaS lifecycle.

---

## 2. Definitive Role Hierarchy (5-Tier)

The system is strictly architected around these 5 distinct tiers. All logic, routing, and data security (RLS) must adhere to this hierarchy.

### 1. Platform Admin (Super Admin)
*   **Definition:** The owner/operator of the SaaS software.
*   **Scope:** System-wide (All Tenants).
*   **Responsibilities:**
    *   Manage Subscriptions & Licensing.
    *   Inspect Business Entities (Shadow view).
    *   View Global Audit Logs.
    *   Configure Platform Settings (Payment gateways, global rules).
*   **Route:** `app/(platform)` (Target) / `app/(admin)` (Current)

### 2. Business Entity (Tenant)
*   **Definition:** The legal organization (e.g., "Kral Berber", "Elite Salon").
*   **Scope:** Data Boundary.
*   **Role:** Not a user, but the **Context** within which Owners and Staff operate. All business data (`bookings`, `services`, `revenue`) is scoped to a `business_id`.

### 3. Business Owner (Tenant Admin)
*   **Definition:** The primary administrator of a Business Entity.
*   **Scope:** Single Tenant (Full Access).
*   **Responsibilities:**
    *   Manage Staff & Services.
    *   Manage Financials & Settings.
    *   Perform Services (Can act as a worker).
    *   View Business-level Audit Logs.
*   **Route:** `app/(business)`

### 4. Staff (Employee)
*   **Definition:** A worker employed by a Business Entity.
*   **Scope:** Single Tenant (Restricted Access).
*   **Responsibilities:**
    *   Manage personal Calendar/Availability.
    *   View assigned Bookings.
    *   Manage Personal Profile.
    *   **Restriction:** Cannot access Financials, Global Settings, or other Staff's data (unless explicitly allowed).
*   **Route:** `app/(staff)`

### 5. Customer (End User)
*   **Definition:** The public user consuming services.
*   **Scope:** Personal Data.
*   **Responsibilities:**
    *   Search & Discovery.
    *   Booking & Cancellation.
    *   Profile & Favorites management.
*   **Route:** `app/(customer)`

---

## 3. Core Architectural Principles

### 3.1 Unified Patterns & Contextual Content
**Principle:** "Write once, render contextually."
*   **Do NOT** build separate "Settings" pages for Admin, Owner, and Staff.
*   **DO** build a shared `SettingsShell` layout that accepts a configuration object based on the User Role.
*   **Implementation:** `components/shared/settings/SettingsLayout.tsx` driven by `SettingsConfig.ts`.

### 3.2 Key Modules
1.  **Services Module:**
    *   **Owner:** Defines Service Menu (Duration, Price, Category).
    *   **Logic:** Services are linked to eligible Staff.
2.  **Calendar/Appointments Engine:**
    *   **The Heart of the App.**
    *   **Requirements:**
        *   Rigorous Time Zone handling.
        *   Double-booking prevention (Database constraints + App Logic).
        *   Smart Availability (Staff Shift + Break Time + Existing Bookings).
3.  **Audit Logging System:**
    *   **Critical Requirement.**
    *   Every mutation (Create/Update/Delete) by Admin or Staff must be logged.
    *   **Structure:** `audit_logs` table (Who, What, When, IP, OldVal, NewVal).

---

## 4. Technical Architecture

### 4.1 Tech Stack
*   **Framework:** React Native + Expo (Latest Stable).
*   **Web Support:** Expo Web (Universal).
*   **State:** Zustand (`authStore`, `businessStore`, `bookingStore`).
*   **Data:** Supabase (PostgreSQL, Auth, Realtime, Storage).
*   **UI:** NativeWind (Tailwind), Lucide Icons, Reanimated.
*   **Lists:** `@shopify/flash-list` (Mandatory).

### 4.2 Folder Structure (Ideal State)
This structure reflects the definitive hierarchy.

```text
app/
├── (platform)/          # Platform Admin (Rename from 'admin')
│   ├── _layout.tsx
│   ├── dashboard.tsx    # Global Stats
│   ├── tenants/         # Business Management
│   ├── audit.tsx        # Global Logs
│   └── settings.tsx     # Uses Shared SettingsShell
│
├── (business)/          # Business Owner
│   ├── _layout.tsx
│   ├── (tabs)/
│   │   ├── dashboard.tsx
│   │   ├── calendar.tsx
│   │   ├── staff/
│   │   └── services/
│   └── settings.tsx     # Uses Shared SettingsShell
│
├── (staff)/             # Staff Workspace
│   ├── _layout.tsx
│   ├── (tabs)/
│   │   ├── dashboard.tsx
│   │   ├── calendar.tsx
│   │   └── profile.tsx
│   └── settings.tsx     # Uses Shared SettingsShell
│
├── (customer)/          # Customer App
│   ├── _layout.tsx
│   ├── home.tsx
│   ├── booking/
│   └── profile.tsx      # Uses Shared SettingsShell (or linked)
│
├── (auth)/              # Shared Authentication
│   ├── login.tsx
│   └── register.tsx
```

---

## 5. Consolidated Roadmap

### Phase 1: Architecture Cleanup & Consolidation (Immediate)
*   [ ] **Delete Legacy Files:** Remove `master.md`, `todo.md`, etc. (Done).
*   [ ] **Refactor Admin Route:** Rename `app/(admin)` to `app/(platform)` to match hierarchy.
*   [ ] **Delete Legacy Staff File:** Remove `app/(business)/staff-dashboard.tsx` (Migrated to `(staff)`).
*   [ ] **Implement Shared Settings:** Ensure `SettingsShell` is used across Platform, Business, and Staff.

### Phase 2: Core Feature Hardening
*   [ ] **Audit Logging:** Build `auditService` and connect to UI.
*   [ ] **Image Storage:** Implement Supabase Storage for profile/business images.
*   [ ] **Booking Conflict Logic:** Enhance `bookingStore` with robust availability checks.

### Phase 3: Web & Scale
*   [ ] **Web Compatibility Check:** Verify FlashList and Gestures on Web.
*   [ ] **Performance:** Optimize re-renders in Calendar.

---

**CONFIRMATION:** This file supersedes all previous documentation.
