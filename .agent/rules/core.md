---
trigger: always_on
---

# CORE.md - Skills Orchestrator

> Bu dosya tüm görevler için merkezi yönlendirme noktasıdır.
> Görev tipine göre uygun skill(ler) belirlenir ve yüklenir.

---

# 📋 İçindekiler

1. [Skills Referansı - Ne Zaman Hangi Skill?](#1-skills-referansı)
2. [Skill Kombinasyonları](#2-skill-kombinasyonları)
3. [Skills Dizin Yapısı](#3-skills-dizin-yapısı)

---

# 1. Skills Referansı

## 🧠 DÜŞÜNME (Thinking)

### 01-ultrathink - Derin Analiz Protokolü
**Dosya:** [skills/01-ultrathink/SKILL.md](skills/01-ultrathink/SKILL.md)

| Senaryo | Örnek |
|---------|-------|
| Mimari kararlar | "Monolith'i mikroservislere bölelim mi?" |
| Karmaşık bug analizi | "Race condition nereden kaynaklanıyor?" |
| Trade-off değerlendirmesi | "SQL vs NoSQL hangisi daha uygun?" |
| Risk analizi | "Bu değişikliğin potansiyel etkileri neler?" |

### 02-architecture - Sistem Tasarımı
**Dosya:** [skills/02-architecture/SKILL.md](skills/02-architecture/SKILL.md)

| Senaryo | Örnek |
|---------|-------|
| Yeni sistem tasarımı | "E-ticaret platformu mimarisi oluştur" |
| Database seçimi | "PostgreSQL mı MongoDB mi?" |
| Scaling stratejisi | "10x kullanıcıya nasıl ölçekleniriz?" |

---

## 📁 YAPI (Structure)

### 03-project-structure - Proje Yapısı
**Dosya:** [skills/03-project-structure/SKILL.md](skills/03-project-structure/SKILL.md)

| Senaryo | Örnek |
|---------|-------|
| Yeni proje oluşturma | "Expo + Next.js monorepo kur" |
| Klasör organizasyonu | "Feature-based yapıya geç" |
| Import alias | "@/components şeklinde import" |

### 04-multi-tenant - Çok Kiracılı Mimari
**Dosya:** [skills/04-multi-tenant/SKILL.md](skills/04-multi-tenant/SKILL.md)

| Senaryo | Örnek |
|---------|-------|
| Rol bazlı ekranlar | "Admin ve müşteri için ayrı layout" |
| Tenant izolasyonu | "Her işletme kendi verisini görsün" |
| Permission sistemi | "Rol bazlı yetkilendirme" |

---

## 💻 KOD (Coding)

### 05-typescript - TypeScript Kuralları
**Dosya:** [skills/05-typescript/SKILL.md](skills/05-typescript/SKILL.md)

| Senaryo | Örnek |
|---------|-------|
| Tip tanımlama | "Interface mi type mı?" |
| Generic kullanımı | "Reusable tip yaz" |
| any temizliği | "any'leri kaldır" |

### 06-react-patterns - React + Zustand
**Dosya:** [skills/06-react-patterns/SKILL.md](skills/06-react-patterns/SKILL.md)

| Senaryo | Örnek |
|---------|-------|
| Component yazma | "Button component oluştur" |
| State yönetimi | "Zustand store kur" |
| Custom hook | "useBookings hook'u yaz" |

### 07-nextjs-web - Next.js App Router
**Dosya:** [skills/07-nextjs-web/SKILL.md](skills/07-nextjs-web/SKILL.md)

| Senaryo | Örnek |
|---------|-------|
| Sayfa oluşturma | "Dashboard sayfası yap" |
| Server Component | "Veri çeken sayfa" |
| API Route | "REST endpoint yaz" |

### 08-expo-mobile - Expo Cross-Platform
**Dosya:** [skills/08-expo-mobile/SKILL.md](skills/08-expo-mobile/SKILL.md)

| Senaryo | Örnek |
|---------|-------|
| Mobil ekran | "Randevu listesi ekranı" |
| Navigation | "Tab navigator kur" |
| Platform kontrolü | "iOS/Android farklı davranış" |

### 09-supabase - Veritabanı + Auth
**Dosya:** [skills/09-supabase/SKILL.md](skills/09-supabase/SKILL.md)

| Senaryo | Örnek |
|---------|-------|
| Veri çekme | "Bookings tablosunu sorgula" |
| Authentication | "Login/logout sistemi" |
| RLS | "Row Level Security kur" |

---

## 🎨 UI (Design)

### 10-design-system - UI/UX Rehberi
**Dosya:** [skills/10-design-system/SKILL.md](skills/10-design-system/SKILL.md)

| Senaryo | Örnek |
|---------|-------|
| Grid sistemi | "8-point grid uygula" |
| Typography | "Font hierarchy belirle" |
| Color system | "Dark mode desteği" |

### 11-nativewind - TailwindCSS
**Dosya:** [skills/11-nativewind/SKILL.md](skills/11-nativewind/SKILL.md)

| Senaryo | Örnek |
|---------|-------|
| Styling | "Card component stili" |
| Dark mode | "dark: prefix kullan" |
| Responsive | "sm: md: lg: breakpoints" |

### 12-dashboard - Form, Grafik, Tablo
**Dosya:** [skills/12-dashboard/SKILL.md](skills/12-dashboard/SKILL.md)

| Senaryo | Örnek |
|---------|-------|
| Form oluşturma | "React Hook Form + Zod" |
| Grafik | "Victory ile chart" |
| Tablo | "Sortable data table" |

---

## 🌍 LOCALE

### 13-i18n - Çoklu Dil
**Dosya:** [skills/13-i18n/SKILL.md](skills/13-i18n/SKILL.md)

| Senaryo | Örnek |
|---------|-------|
| Çeviri | "Türkçe/İngilizce destek" |
| RTL | "Arapça sağdan sola" |
| Tarih formatı | "Locale aware tarih" |

---

## 🔧 KALİTE (Quality)

### 14-testing - Test Stratejisi
**Dosya:** [skills/14-testing/SKILL.md](skills/14-testing/SKILL.md)

| Senaryo | Örnek |
|---------|-------|
| Unit test | "Jest ile fonksiyon testi" |
| Integration test | "API endpoint testi" |
| E2E test | "Playwright senaryosu" |

### 15-debugging - Bug Çözme
**Dosya:** [skills/15-debugging/SKILL.md](skills/15-debugging/SKILL.md)

| Senaryo | Örnek |
|---------|-------|
| Runtime error | "TypeError çöz" |
| Performance issue | "Yavaş sayfa debug" |
| Intermittent bug | "Bazen olan hata" |

### 16-refactoring - Kod İyileştirme
**Dosya:** [skills/16-refactoring/SKILL.md](skills/16-refactoring/SKILL.md)

| Senaryo | Örnek |
|---------|-------|
| Code smell | "Uzun fonksiyonu böl" |
| DRY | "Duplicate kodu birleştir" |
| Design pattern | "Strategy pattern uygula" |

### 17-sentry - Hata Takibi
**Dosya:** [skills/17-sentry/SKILL.md](skills/17-sentry/SKILL.md)

| Senaryo | Örnek |
|---------|-------|
| Sentry kurulumu | "Expo'ya Sentry ekle" |
| Error capture | "Manuel hata yakala" |
| Performance | "Transaction izle" |

---

## 🔐 GÜVENLİK (Security)

### 23-security - Güvenlik Kuralları
**Dosya:** [skills/23-security/SKILL.md](skills/23-security/SKILL.md)

| Senaryo | Örnek |
|---------|-------|
| Input validation | "Zod ile doğrulama" |
| XSS/CSRF koruması | "Güvenlik açıkları" |
| API security | "Rate limiting ekle" |
| RLS best practices | "Supabase güvenlik" |

---

## 📦 OPS (Operations)

### 18-deployment - CI/CD
**Dosya:** [skills/18-deployment/SKILL.md](skills/18-deployment/SKILL.md)

| Senaryo | Örnek |
|---------|-------|
| CI/CD pipeline | "GitHub Actions kur" |
| Docker | "Container'ize et" |
| Rollback | "Önceki versiyona dön" |

### 19-dependency - Paket Yönetimi
**Dosya:** [skills/19-dependency/SKILL.md](skills/19-dependency/SKILL.md)

| Senaryo | Örnek |
|---------|-------|
| Security audit | "npm audit fix" |
| Major upgrade | "React 18'den 19'a geç" |
| Cleanup | "Kullanılmayan paketleri kaldır" |

### 20-multi-file - Çoklu Dosya Sync
**Dosya:** [skills/20-multi-file/SKILL.md](skills/20-multi-file/SKILL.md)

| Senaryo | Örnek |
|---------|-------|
| Global rename | "userId'yi customerId yap" |
| API versioning | "v1'den v2'ye migrate" |
| Folder restructure | "Feature-first yapıya geç" |

### 21-optimization - Performans
**Dosya:** [skills/21-optimization/SKILL.md](skills/21-optimization/SKILL.md)

| Senaryo | Örnek |
|---------|-------|
| Bottleneck | "Yavaş yerleri bul" |
| Bundle size | "Bundle'ı küçült" |
| Memory leak | "Memory sorunu çöz" |

---

## 📝 DOCS

### 22-documentation - Dokümantasyon
**Dosya:** [skills/22-documentation/SKILL.md](skills/22-documentation/SKILL.md)

| Senaryo | Örnek |
|---------|-------|
| README | "Proje README'si yaz" |
| API docs | "OpenAPI dokümantasyonu" |
| ADR | "Mimari karar belgele" |

---

# 2. Skill Kombinasyonları

Karmaşık görevler birden fazla skill gerektirebilir:

| Senaryo | Skill Kombinasyonu | Yükleme Sırası |
|---------|-------------------|----------------|
| **Karmaşık Karar** | ultrathink + architecture | 1→2 |
| **Yeni Feature** | react-patterns + testing | 1→2 |
| **Bug Fix** | debugging + refactoring | 1→2 |
| **Büyük Refactoring** | ultrathink + refactoring + multi-file + testing | 1→2→3→4 |
| **Production Release** | deployment + testing | 1→2 |
| **Mimari Tasarım** | ultrathink + architecture + multi-tenant | 1→2→3 |
| **UI Feature** | design-system + nativewind + dashboard | 1→2→3 |

---

# 3. Skills Dizin Yapısı

```
.claude/
├── GEMINI.md           ← Global kurallar
├── CORE.md             ← Bu dosya (Merkezi orchestrator)
└── skills/
    ├── 01-ultrathink/
    ├── 02-architecture/
    ├── 03-project-structure/
    ├── 04-multi-tenant/
    ├── 05-typescript/
    ├── 06-react-patterns/
    ├── 07-nextjs-web/
    ├── 08-expo-mobile/
    ├── 09-supabase/
    ├── 10-design-system/
    ├── 11-nativewind/
    ├── 12-dashboard/
    ├── 13-i18n/
    ├── 14-testing/
    ├── 15-debugging/
    ├── 16-refactoring/
    ├── 17-sentry/
    ├── 18-deployment/
    ├── 19-dependency/
    ├── 20-multi-file/
    ├── 21-optimization/
    ├── 22-documentation/
    └── 23-security/
```

---

> [!CAUTION]
> **Skill yüklemeden işleme BAŞLAMA!**

> [!IMPORTANT]
> **Karmaşık görevler için ultrathink skill'ini ÖNCE yükle!**

---

**Son Güncelleme:** Aralık 2025
**Versiyon:** 4.0