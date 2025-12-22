---
name: deployment
description: CI/CD pipeline, Docker ve production deployment kuralları. Uygulamayı deploy ederken bu skill'i kullan.
---

# Deployment - CI/CD

> CI/CD pipeline, Docker ve production deployment.

## GitHub Actions

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
      - name: Deploy
        run: # ...
```

## Deployment Stratejileri

| Strateji | Kullanım |
|----------|----------|
| Rolling | Varsayılan |
| Blue-Green | Zero downtime |
| Canary | Gradual rollout |

## Key Principles

- Lint → Test → Build → Deploy
- Environment secrets kullan
- Rollback planı hazır tut
- Monitoring aktif

## References

See [rules.md](references/rules.md) for complete guidelines.
