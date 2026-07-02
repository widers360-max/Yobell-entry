# YOBELL Polish Report — Sprint 2026-06-29

Autonomous product-team polish pass after Stages 1–8.

## Everything improved

### Milestone 1 — Commercial readiness (#19)
- Privacy consent enforced on manual visitor path
- Abandoned visits marked `completed` on kiosk reset / host change
- Visit PATCH API restricted to `status` only
- `no_response` timeout awaits server before UI update
- Waiting poll stops on terminal status
- Reception contact shows error when no staff found
- Dashboard responded stat accuracy
- Waiting screen `aria-live` for status changes

### Milestone 2 — Staff experience (#20)
- Full staff i18n (ja/en/ko) + language toggle
- Mobile-responsive header and stacked response buttons
- Per-card error on failed respond
- Response buttons scoped to active visit only
- `GET /api/visits?summary=true` excludes photo payloads

### Milestone 3 — Product polish (#21, this branch)
- `kiosk-defaults.ts` — single source for settings defaults
- `visit-query.ts` — shared filter builder for list + CSV export
- CSV export respects admin filters
- Admin mobile sidebar drawer
- Visits admin load error handling
- Kiosk top bar 48px touch targets
- Camera capture alt text i18n
- Password gate loading i18n
- Health page polls only when tab visible
- Admin EN/KO notification test copy fixed
- Version aligned to **0.8.0**

## Remaining issues

| Priority | Issue |
|----------|-------|
| P0 | No server-side API authentication |
| P1 | No automated tests |
| P1 | Quick-call path skips privacy consent (legal review) |
| P2 | Health page hardcoded Japanese |
| P2 | Base64 photos in API responses (admin visits list) |
| P3 | Admin toast no exit animation |

## Commercial risks

1. **Security** — Password gate is client-only; APIs are open. Must fix before any production deployment with real visitor data.
2. **Compliance** — Privacy consent not on quick-call / business-card paths; needs legal sign-off for Japan PDPA/APPI.
3. **Single-tenant** — SQLite + single settings row; fine for pilot, not for multi-customer SaaS yet.
4. **No SLA monitoring** — Health page exists but no alerting integration.

## Recommended work for tomorrow

1. Implement API auth middleware (4–6h)
2. Playwright smoke test: kiosk → staff respond (3h)
3. Legal review checklist for consent flows (1h meeting)
4. Production `.env` template + SMTP setup guide in README (2h)

## Estimated hours remaining until Version 1.0

| Workstream | Hours |
|------------|-------|
| Security (API auth, export protection) | 12–16 |
| Testing (unit + E2E smoke) | 16–20 |
| Production ops (deploy, monitoring, backup) | 8–12 |
| Legal / compliance polish | 4–8 |
| Multi-tenant prep (optional for v1) | 40+ |
| **Total to v1.0 (single-tenant commercial)** | **~40–56h** |

## Pull requests opened this sprint

| PR | Title |
|----|-------|
| #19 | fix: commercial readiness — consent, visits, API safety |
| #20 | feat: staff i18n, mobile layout, optimized polling |
| #21 | feat: product polish — defaults, admin mobile, export filters |
