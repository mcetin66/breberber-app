# Sentry - Detaylı Kurallar

## 1. Kurulum (Expo)

```bash
npx expo install @sentry/react-native
```

```typescript
// app/_layout.tsx
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.2,  // %20 performance sampling
  environment: __DEV__ ? 'development' : 'production',
  enableAutoSessionTracking: true,
  attachStacktrace: true,
});

function RootLayout() {
  return (
    <Stack>
      ...
    </Stack>
  );
}

export default Sentry.wrap(RootLayout);
```

---

## 2. Manuel Hata Yakalama

```typescript
// try-catch ile
async function processPayment(amount: number) {
  try {
    const result = await paymentService.charge(amount);
    return result;
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        feature: 'payment',
        action: 'charge',
      },
      extra: {
        amount,
        userId: currentUser?.id,
      },
    });
    throw error;
  }
}

// Error boundary
Sentry.captureException(error, {
  contexts: {
    component: {
      name: 'BookingForm',
      props: { staffId, date },
    },
  },
});
```

---

## 3. User Context

```typescript
// Login sonrası
function onLoginSuccess(user: User) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.name,
  });
}

// Logout'ta temizle
function onLogout() {
  Sentry.setUser(null);
}

// Extra context
Sentry.setContext('tenant', {
  id: tenant.id,
  name: tenant.name,
  plan: tenant.plan,
});
```

---

## 4. Breadcrumbs

```typescript
// Manuel breadcrumb
Sentry.addBreadcrumb({
  category: 'navigation',
  message: 'User navigated to booking detail',
  level: 'info',
  data: {
    bookingId,
    from: 'calendar',
  },
});

// API call breadcrumb
Sentry.addBreadcrumb({
  category: 'api',
  message: 'Fetching bookings',
  level: 'info',
  data: {
    url: '/api/bookings',
    method: 'GET',
  },
});
```

---

## 5. Performance Monitoring

```typescript
// Transaction başlat
const transaction = Sentry.startTransaction({
  name: 'booking-creation',
  op: 'task',
});

try {
  // Span 1: Validation
  const validationSpan = transaction.startChild({
    op: 'validation',
    description: 'Validate booking data',
  });
  await validateBooking(data);
  validationSpan.finish();

  // Span 2: Database
  const dbSpan = transaction.startChild({
    op: 'db',
    description: 'Insert booking',
  });
  await supabase.from('bookings').insert(data);
  dbSpan.finish();

  transaction.setStatus('ok');
} catch (error) {
  transaction.setStatus('internal_error');
  Sentry.captureException(error);
} finally {
  transaction.finish();
}
```

---

## 6. Severity Levels

```typescript
// Info
Sentry.captureMessage('User upgraded plan', 'info');

// Warning
Sentry.captureMessage('API rate limit approaching', 'warning');

// Error
Sentry.captureException(error);

// Fatal
Sentry.captureException(criticalError, {
  level: 'fatal',
});
```

---

## 7. Source Maps (Production)

```bash
# eas.json
{
  "build": {
    "production": {
      "env": {
        "SENTRY_ORG": "your-org",
        "SENTRY_PROJECT": "your-project"
      }
    }
  }
}
```

```javascript
// app.config.js
export default {
  plugins: [
    [
      '@sentry/react-native/expo',
      {
        organization: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
      },
    ],
  ],
};
```

---

## 8. Error Filtering

```typescript
Sentry.init({
  dsn: '...',
  beforeSend(event, hint) {
    // Network error'ları filtele
    if (hint.originalException?.message?.includes('Network request failed')) {
      return null;
    }
    
    // Development'ta üretim hataları atla
    if (__DEV__ && event.environment === 'production') {
      return null;
    }
    
    return event;
  },
});
```

---

## 9. Alerts & Dashboard

Sentry dashboard'da:
- **Issue Alerts**: Yeni hata geldiğinde bildirim
- **Performance Alerts**: Yavaşlık tespit edildiğinde
- **Integrations**: Slack, Email, PagerDuty

---

## 10. Kontrol Listesi

- [ ] Sentry.init production-only veya düşük sample rate
- [ ] User context login sonrası set ediliyor
- [ ] Manuel try-catch'lerde Sentry.captureException
- [ ] Kritik flow'larda transaction/span
- [ ] Source maps upload ediliyor
- [ ] beforeSend ile gereksiz hatalar filtreleniyor
- [ ] Alert'ler yapılandırılmış
