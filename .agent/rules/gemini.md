---
trigger: always_on
---

# GEMINI.md - Global Agent Kuralları

> Bu dosya sistemin temel çalışma kurallarını tanımlar.
> Her görev başlangıcında bu kurallar geçerlidir.

---

## 🚨 MUTLAK KURALLAR (Her Zaman Geçerli)

### 1. CORE.md Zorunluluğu

Kullanıcı herhangi bir görev verdiğinde:

1. **ÖNCE** `CORE.md` dosyası okunmalıdır
2. CORE.md, görev tipine göre uygun skill(ler)i belirler
3. Belirlenen skill dosyası `.claude/skills/` dizininden yüklenir
4. Skill yüklenene kadar işleme **BAŞLANMAZ**

```
Görev Geldi
    │
    ▼
┌─────────────────┐
│  CORE.md Oku    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Skill(ler)i     │
│ Belirle         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Skill'i Yükle   │
│ ve İşleme Başla │
└─────────────────┘
```

---

### 2. Kod Kalite Kontrolleri (Her İşlem Sonrası)

Her kod değişikliğinden SONRA şu kontroller **MUTLAKA** yapılmalıdır:

#### ✅ Zorunlu Kontroller

| Kontrol | Komut | Açıklama |
|---------|-------|----------|
| **ESLint** | `npx eslint .` | Kod kalitesi ve stil kontrolü |
| **TypeScript** | `npx tsc --noEmit` | Tip güvenliği kontrolü |
| **Prettier** | `npx prettier --check .` | Kod formatlama kontrolü |

#### ✅ 2x Kod Review Kuralı

Yazılan kod **EN AZ 2 KERE** kontrol edilmelidir:

**1. İlk Kontrol (Yazım Sonrası):**
- Syntax hataları var mı?
- Değişken isimleri anlamlı mı?
- Import'lar doğru mu?

**2. İkinci Kontrol (Final Review):**
- Edge case'ler düşünüldü mü?
- Error handling yeterli mi?
- Type safety sağlandı mı?
- Best practices uygulandı mı?

---

### 3. İşlem Sonrası Kontrol Listesi

```markdown
## ✅ Son Kontrol Listesi

### Kod Kalitesi
- [ ] ESLint hatası yok
- [ ] TypeScript hatası yok
- [ ] Kod 2. kez review edildi

### Güvenlik & Güvenilirlik
- [ ] Input validation yapıldı
- [ ] Error handling eklendi
- [ ] Edge case'ler düşünüldü

### Temizlik
- [ ] Kullanılmayan import yok
- [ ] Console.log temizlendi
- [ ] Gereksiz yorum yok
```

---

## 🔧 Skill Kategorileri

| Kategori | Skills | Kullanım |
|----------|--------|----------|
| **Düşünme** | `ultrathink`, `architecture` | Derin analiz, sistem tasarımı |
| **Yapı** | `project-structure`, `multi-tenant` | Proje organizasyonu |
| **Kod** | `typescript`, `react`, `nextjs`, `expo`, `supabase` | Kod yazma |
| **UI** | `design-system`, `nativewind`, `dashboard` | Arayüz tasarımı |
| **Kalite** | `testing`, `debugging`, `refactoring`, `sentry` | Kalite güvence |
| **Ops** | `deployment`, `dependency`, `multi-file`, `optimization` | Operasyon |
| **Docs** | `documentation` | Dokümantasyon |

---

## ⚠️ Kritik Uyarılar

> [!CAUTION]
> Skills yüklenmeden KOD YAZMA!

> [!WARNING]
> ESLint/TypeScript kontrolü yapılmadan işlemi TAMAMLAMA!

> [!IMPORTANT]
> Her kod değişikliği 2 KERE kontrol edilmeli!

---

**Son Güncelleme:** Aralık 2025
**Versiyon:** 4.0