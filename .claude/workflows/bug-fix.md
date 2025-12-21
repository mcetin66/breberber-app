# Workflow: Bug Düzeltme

> Bu workflow, bug düzeltirken takip edilecek sistematik adımları tanımlar.
> Acele etme, metodun önemi hızdan önce gelir.

---

## Aşama 1: Bug Anlama

### Adımlar
1. Hatayı tam olarak anla:
   - Ne olması gerekiyor?
   - Ne oluyor?
   - Ne zaman oluyor? (Her zaman mı, bazen mi?)
2. Hatayı reproduce et
3. Error mesajı/stack trace incele
4. İlgili kodu bul

### Çıktı
```markdown
## 🐛 Bug Analizi

### Beklenen Davranış
[Ne olması gerekiyor]

### Gerçekleşen Davranış
[Ne oluyor]

### Reproduce Adımları
1. [Adım 1]
2. [Adım 2]
3. [Adım 3]

### Hata Mesajı
```
[Error message / stack trace]
```

### Şüpheliler
- [ ] dosya1.tsx:L45 - [Neden şüpheli]
- [ ] dosya2.ts:L23 - [Neden şüpheli]
```

> ⏸️ **CHECKPOINT 1: ANALİZ ONAYI**
> "Bug'ı şöyle anladım: [özet]. Doğru mu?"

---

## Aşama 2: Hipotez ve İzolasyon

### Adımlar
1. Olası nedenleri listele (en az 2-3 hipotez)
2. Her hipotezi test et
3. Binary search ile izole et:
   - Hangi commit'te başladı?
   - Hangi fonksiyonda?
   - Hangi koşulda?

### Debugging Araçları
- Console.log (sonra temizle!)
- React DevTools
- Network tab
- Supabase logs

> ⏸️ **CHECKPOINT 2: ROOT CAUSE**
> "Root cause buldum: [açıklama]. Düzeltme planı: [plan]. Onaylıyor musun?"

---

## Aşama 3: Düzeltme

### Adımlar
1. **MİNİMAL** değişiklik yap
   - Sadece sorunu çöz
   - Yan etkilerden kaçın
   - Refactoring YAPMA (ayrı iş)
2. TypeScript/ESLint kontrolü
3. Manuel test et

### Düzeltme Kuralları
- [ ] Değişiklik minimal mi?
- [ ] Başka bir şey bozulmadı mı?
- [ ] Edge case'ler düşünüldü mü?
- [ ] Console.log'lar temizlendi mi?

> ⏸️ **CHECKPOINT 3: DÜZELTME ONAYI**
> "Düzeltmeyi yaptım: [değişiklik özeti]. İnceleyip onaylar mısın?"

---

## Aşama 4: Validation

### validation-checkpoint.md Çalıştır
- [ ] Orijinal bug düzeldi
- [ ] Yeni bug oluşmadı
- [ ] TypeScript/ESLint temiz
- [ ] Mevcut testler geçiyor

> ⏸️ **CHECKPOINT 4: FİNAL**
> "Validation tamamlandı. Commit edeyim mi?"

---

## Aşama 5: Tamamlama

### Commit
```
fix(calendar): resolve race condition in booking creation

- Added mutex lock for concurrent bookings
- Fixed duplicate booking issue
- Closes #123
```

### Post-mortem (Opsiyonel ama önerilir)
```markdown
## 📝 Post-mortem

### Ne oldu?
[Kısa açıklama]

### Neden oldu?
[Root cause]

### Nasıl önlenebilirdi?
[Gelecek için öneriler]
```

---

## Kritik Kurallar

> [!CAUTION]
> Root cause bulmadan kod değiştirme!

> [!WARNING]
> Refactoring + bug fix = TEHLİKE. Ayrı ayrı yap.

> [!IMPORTANT]
> Debug console.log'larını MUTLAKA temizle!
