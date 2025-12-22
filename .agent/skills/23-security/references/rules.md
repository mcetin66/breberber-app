# Security - Detaylı Kurallar

## 1. Input Validation (Zod)

```typescript
import { z } from 'zod';

// User input
const userSchema = z.object({
  email: z.string().email('Geçerli email girin'),
  password: z.string()
    .min(8, 'En az 8 karakter')
    .regex(/[A-Z]/, 'En az 1 büyük harf')
    .regex(/[0-9]/, 'En az 1 rakam'),
  phone: z.string().regex(/^05\d{9}$/, 'Geçerli telefon numarası'),
});

// API input
const bookingSchema = z.object({
  staffId: z.string().uuid(),
  serviceId: z.string().uuid(),
  date: z.string().pipe(z.coerce.date()),
  time: z.string().regex(/^\d{2}:\d{2}$/),
});

// Validation
function validateInput<T>(schema: z.Schema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(result.error.message);
  }
  return result.data;
}
```

---

## 2. XSS Koruması

```typescript
// React otomatik escape eder ✅
<Text>{userInput}</Text>

// Tehlikeli: dangerouslySetInnerHTML ❌
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// Sanitize gerekirse
import DOMPurify from 'dompurify';
const safeHtml = DOMPurify.sanitize(userInput);
```

---

## 3. CSRF Koruması

```typescript
// Supabase auth token otomatik CSRF koruması sağlar
// Ek koruma için:

// 1. SameSite cookie
// 2. Origin header kontrolü
// 3. CSRF token (özel durumlar için)

// API Route'da origin kontrolü
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  const allowedOrigins = ['https://example.com'];
  
  if (!allowedOrigins.includes(origin ?? '')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  // ...
}
```

---

## 4. Authentication Security

```typescript
// Password hashing (Supabase otomatik yapar)
// Kendi auth sistemi için:
import bcrypt from 'bcryptjs';

const hash = await bcrypt.hash(password, 12);
const isValid = await bcrypt.compare(password, hash);

// Session security
Sentry.init({
  // Session verilerini loglama
  beforeSend(event) {
    delete event.request?.cookies;
    delete event.extra?.password;
    return event;
  },
});

// Brute force koruması
// 5 başarısız denemeden sonra 15 dk beklet
```

---

## 5. Authorization (RLS)

```sql
-- Her tablo için RLS aktif
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Tenant izolasyonu
CREATE POLICY "Tenant isolation" ON bookings
  FOR ALL
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

-- Role-based access
CREATE POLICY "Staff access" ON bookings
  FOR SELECT
  USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
    AND (
      auth.jwt() ->> 'role' IN ('owner', 'manager')
      OR staff_id = auth.uid()
    )
  );
```

---

## 6. API Key Security

```typescript
// ❌ Yanlış: Hardcoded
const apiKey = 'sk_live_xxx';

// ✅ Doğru: Environment variable
const apiKey = process.env.STRIPE_SECRET_KEY;

// ❌ Yanlış: Client'ta secret key
// Client-side code
const response = await fetch('/api/charge', {
  headers: { 'X-API-Key': 'secret_key' },  // ❌
});

// ✅ Doğru: Server-side API call
// Server action veya API route
async function chargePayment(amount: number) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  // ...
}
```

---

## 7. Rate Limiting

```typescript
// Next.js API Route
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),  // 10 istek / 10 saniye
});

export async function POST(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const { success, limit, reset, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      }
    );
  }

  // Normal işlem
}
```

---

## 8. Sensitive Data Handling

```typescript
// ❌ Yanlış: Hassas veri loglama
console.log('User data:', { email, password, creditCard });

// ✅ Doğru: Masking
console.log('User data:', { 
  email, 
  password: '***', 
  creditCard: `****${last4}` 
});

// ❌ Yanlış: Hassas veri URL'de
router.push(`/payment?card=${cardNumber}`);

// ✅ Doğru: POST body'de
await fetch('/api/payment', {
  method: 'POST',
  body: JSON.stringify({ cardNumber }),
});
```

---

## 9. HTTPS & Headers

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

---

## 10. Dependency Security

```bash
# Düzenli güvenlik taraması
npm audit
npm audit fix

# CI/CD'de
- name: Security audit
  run: npm audit --audit-level=high
```

---

## 11. Error Handling (No Leak)

```typescript
// ❌ Yanlış: Detaylı hata mesajı
return NextResponse.json({
  error: `Database error: ${error.message}`,
  stack: error.stack,
});

// ✅ Doğru: Generic mesaj + internal logging
Sentry.captureException(error);
return NextResponse.json(
  { error: 'Bir hata oluştu. Lütfen tekrar deneyin.' },
  { status: 500 }
);
```

---

## 12. Kontrol Listesi

- [ ] Tüm input'lar Zod ile validate
- [ ] RLS her tabloda aktif
- [ ] API key'ler env'de, client'ta yok
- [ ] Rate limiting API'larda
- [ ] Hassas veri loglanmıyor
- [ ] Security headers aktif
- [ ] npm audit düzenli çalışıyor
- [ ] Error mesajları detay içermiyor
- [ ] HTTPS zorunlu
- [ ] Password hashing (bcrypt 12+)
