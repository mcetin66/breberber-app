---
description: 
---

# Workflow: Yeni Özellik Geliştirme

> Bu workflow, yeni bir özellik eklerken takip edilecek adımları tanımlar.
> Her checkpoint'te kullanıcı onayı ZORUNLUDUR.

---

## Aşama 1: Analiz ve Planlama

### Adımlar
1. Kullanıcı talebini tam olarak anla
2. Mevcut kodu incele (etkilenen dosyalar)
3. Bağımlılıkları belirle
4. Teknik plan oluştur:
   - Hangi dosyalar değişecek?
   - Hangi yeni dosyalar oluşturulacak?
   - Hangi skill'ler kullanılacak?

### Çıktı
```markdown
## 📋 Özellik Planı

### Amaç
[Özelliğin ne yapacağı]

### Etkilenen Dosyalar
- [ ] dosya1.tsx - [Değişiklik açıklaması]
- [ ] dosya2.ts - [Değişiklik açıklaması]

### Yeni Dosyalar
- [ ] yeni-dosya.tsx - [Amaç]

### Kullanılacak Skill'ler
- [x] react-patterns
- [x] supabase
```

> ⏸️ **CHECKPOINT 1: PLAN ONAYI**
> Planı kullanıcıya sun. Onay gelmeden kodlamaya BAŞLAMA.
> "Bu plan uygun mu? Devam edeyim mi?"

---

## Aşama 2: Geliştirme

### Adımlar
1. İlgili skill'leri yükle (CORE.md'den)
2. Kodu yaz (skill kurallarına uygun)
3. Her dosya tamamlandığında:
   - TypeScript kontrolü: `npx tsc --noEmit`
   - ESLint kontrolü: `npx eslint .`
4. Küçük adımlarla ilerle (tek seferde 1-2 dosya)

### Her Dosya Sonrası Self-Check
- [ ] TypeScript hatası yok
- [ ] ESLint hatası yok
- [ ] Import'lar doğru
- [ ] Mevcut fonksiyonalite bozulmadı

> ⏸️ **CHECKPOINT 2: KOD REVIEW**
> "Aşağıdaki değişiklikleri yaptım: [özet]. İnceleyip onaylar mısın?"

---

## Aşama 3: Validation

### validation-checkpoint.md Çalıştır
Bu aşamada `validation-checkpoint.md` workflow'unu çalıştır.

Kontrol edilecekler:
- [ ] Tüm TypeScript hataları giderildi
- [ ] Tüm ESLint hataları giderildi
- [ ] Mevcut testler geçiyor (varsa)
- [ ] Yeni özellik manuel test edildi
- [ ] Kod 2. kez review edildi

> ⏸️ **CHECKPOINT 3: FİNAL ONAY**
> "Validation tamamlandı. Commit edeyim mi?"

---

## Aşama 4: Tamamlama

### Adımlar
1. Anlamlı commit mesajı yaz:
   ```
   feat(booking): add walk-in appointment support
   
   - Added WalkInModal component
   - Updated calendar store
   - Added orange color for walk-in slots
   ```
2. Push et
3. Kullanıcıya özet sun

---

## Kritik Kurallar

> [!CAUTION]
> Plan onayı OLMADAN kodlamaya başlama!

> [!WARNING]
> Her checkpoint'te KULLANICI ONAYI bekle!

> [!IMPORTANT]
> Validation-checkpoint'i ATLAMA!
