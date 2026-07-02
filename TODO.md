# YOBELL Entry — TODO

## v0.9 Security & reliability (next)

- [ ] Server-side session auth for `/api/*` mutations
- [ ] Protect `GET /api/visits/export`
- [ ] Rate limit `POST /api/visits` and auth endpoints
- [ ] Add Playwright smoke tests: kiosk flow, staff respond, admin save
- [ ] Kiosk error boundary component

## v1.0 Commercial launch

- [ ] Legal review: privacy consent on all call paths
- [ ] Production deployment guide (Docker / PM2 / Windows service)
- [ ] SMTP production checklist in admin onboarding
- [ ] Customer onboarding wizard in admin
- [ ] Audit log for admin actions

## UX polish (backlog)

- [ ] Health page i18n
- [ ] Admin toast exit animation
- [ ] Visit photo thumbnail lazy-load on staff
- [ ] Host selection card sweep effect (like purpose cards)
- [ ] `next/image` migration for base64 photos

## Performance

- [ ] Admin dashboard lazy-load per section
- [ ] Service worker for kiosk static assets
- [ ] Bundle analyze + tree-shake lucide imports

## Done (0.8.0)

- [x] Privacy consent validation (manual flow)
- [x] Visit lifecycle on reset / host change
- [x] PATCH visit whitelist
- [x] Staff i18n + mobile
- [x] Staff polling optimization (`summary=true`)
- [x] Admin mobile sidebar
- [x] CSV export with filters
- [x] Shared kiosk defaults
- [x] Kiosk top bar touch targets
