# YOBELL Entry — Project Status

**Version:** 0.8.0  
**Last updated:** 2026-06-29  
**Stages completed:** 1–8 + commercial polish sprint

## Completion estimates

| Area | % | Notes |
|------|---|-------|
| **Overall product** | 78% | Core flows complete; enterprise hardening pending |
| **Commercial readiness** | 72% | UX polish done; server auth & billing not started |
| **Showroom / demo readiness** | 92% | DK Marunouchi idle mode, premium UI ready |
| **Enterprise readiness** | 45% | No RBAC, audit log, multi-tenant |
| **UI quality** | 88% | Consistent design system; minor a11y gaps |
| **Backend quality** | 70% | APIs work; auth whitelist needed on all mutations |
| **Technical debt** | 35% | Moderate — mostly security & test coverage |

## What works today

- Visitor kiosk (`/`) — idle showroom, purpose cards, host selection, call methods, waiting
- Staff dashboard (`/staff`) — i18n, mobile layout, real-time polling
- Admin console (`/admin`) — dashboard, branding, CRUD, visits, notifications
- Email host notifications + respond links
- Password gate (client sessionStorage)
- Health check (`/health`)

## Open issues

See [TODO.md](./TODO.md) and [POLISH_REPORT.md](./POLISH_REPORT.md).

### Critical (pre-production)
- [ ] Server-side API authentication (admin/staff roles)
- [ ] Rate limiting on public endpoints

### High
- [ ] Unit / integration tests
- [ ] `next/image` for photo URLs
- [ ] Privacy consent on quick-call path (legal review)

### Medium
- [ ] Admin lazy-load per section
- [ ] Visit photo lazy-load on staff cards
- [ ] Webhook / Slack notification channels

## Next milestone

**v0.9 — Security & reliability**
1. API auth middleware with session cookies
2. Basic test suite (visit lifecycle, settings CRUD)
3. Error boundary on kiosk root

## Technical debt

- Duplicated label maps partially consolidated via `visitStatusLabel`
- Client-only password gate
- No E2E tests
- SQLite single-file DB (fine for MVP, not multi-site)

## Known bugs

- None blocking demo as of 0.8.0 build

## Ideas (post v1.0)

- LINE WORKS / Slack direct integration
- Pre-registration QR check-in
- Multi-tenant SaaS billing
- Analytics: avg wait time trends, peak hours
- Kiosk offline mode with sync queue
