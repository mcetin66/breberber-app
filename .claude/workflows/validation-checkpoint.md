# Workflow: Validation Checkpoint

> Bu workflow, kod teslim etmeden ÖNCE çalıştırılması ZORUNLU kontrol listesidir.
> Hiçbir adım atlanamaz.

---

## 🔴 Zorunlu Kontroller

### 1. Syntax & Type Safety
```bash
# TypeScript kontrolü
npx tsc --noEmit

# ESLint kontrolü
npx eslint . --ext .ts,.tsx

# Prettier kontrolü
npx prettier --check .
```

| Kontrol | Komut | Durum |
|---------|-------|-------|
| TypeScript | `npx tsc --noEmit` | [ ] Geçti |
| ESLint | `npx eslint .` | [ ] Geçti |
| Prettier | `npx prettier --check .` | [ ] Geçti |

---

### 2. Anti-Gravity Kuralları

> [!CAUTION]
> Bu kurallar İHLAL EDİLEMEZ

| Kural | Kontrol | Durum |
|-------|---------|-------|
| **Zero-Deletion** | Çalışan kod silindi mi? | [ ] Silme yok |
| **No-Hallucination** | Var olmayan API/prop kullanıldı mı? | [ ] Hallüsinasyon yok |
| **No-Shortcut** | Placeholder bırakıldı mı? | [ ] Placeholder yok |

---

### 3. Kod Kalitesi

| Kontrol | Durum |
|---------|-------|
| Kullanılmayan import var mı? | [ ] Yok |
| Console.log/debugger kaldı mı? | [ ] Yok |
| Hardcoded değer var mı? | [ ] Yok |
| any kullanıldı mı? | [ ] Yok |
| Magic number var mı? | [ ] Yok |

---

### 4. UI Standartları (NativeWind)

| Kontrol | Durum |
|---------|-------|
| Dark mode (`dark:`) eklendi mi? | [ ] Evet |
| Spacing tutarlı mı? (4, 8, 12, 16...) | [ ] Evet |
| Semantic renkler kullanıldı mı? | [ ] Evet |
| SafeAreaView var mı? (ekran ise) | [ ] Evet |

---

### 5. 2x Review

| Review | Yapıldı mı? |
|--------|-------------|
| **1. Review**: Syntax, import, değişken isimleri | [ ] Evet |
| **2. Review**: Edge case, error handling, type safety | [ ] Evet |

---

### 6. Test (Kritik Alanlar)

| Alan | Test Edildi mi? |
|------|-----------------|
| Authentication değişti mi? | [ ] Test edildi / [ ] Değişmedi |
| Ödeme işlemi değişti mi? | [ ] Test edildi / [ ] Değişmedi |
| Veri silme/güncelleme değişti mi? | [ ] Test edildi / [ ] Değişmedi |

---

## 📋 Final Kontrol Listesi

```markdown
## ✅ Validation Özeti

### Otomatik Kontroller
- [ ] TypeScript: PASS
- [ ] ESLint: PASS
- [ ] Prettier: PASS

### Manuel Kontroller
- [ ] Anti-Gravity kuralları ihlal yok
- [ ] Console.log temizlendi
- [ ] Dark mode eklendi
- [ ] 2x review yapıldı

### Risk Değerlendirmesi
- Riskli değişiklik var mı? [ ] Evet / [ ] Hayır
- Test edilmeli mi? [ ] Evet / [ ] Hayır

### Sonuç
[ ] ✅ Commit'e hazır
[ ] ❌ Düzeltme gerekli: [açıklama]
```

---

## Kural İhlali Durumunda

Eğer herhangi bir kontrol BAŞARISIZ olursa:

1. **DURMA**: Commit yapma
2. **DÜZELT**: Sorunu gider
3. **TEKRAR**: Bu workflow'u baştan çalıştır

> [!CAUTION]
> Validation PASS olmadan ASLA commit yapma!
