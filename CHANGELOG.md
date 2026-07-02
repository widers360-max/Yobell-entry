# Changelog

All notable changes to YOBELL Entry are documented here.

## [0.8.0] — 2026-06-29

### Added
- Showroom idle mode with 60s timeout and slide rotation (Stage 7)
- Micro-interactions polish across kiosk, staff, admin (Stage 8)
- Staff page full i18n (ja/en/ko) with language toggle
- `GET /api/visits?summary=true` for lightweight staff polling
- Shared `kiosk-defaults`, `visit-query`, `visit-client` libraries
- Admin mobile sidebar drawer
- CSV export respects admin visit filters
- Project documentation: `PROJECT_STATUS.md`, `TODO.md`, `POLISH_REPORT.md`

### Fixed
- Privacy consent now enforced on manual visitor flow
- Abandoned pending visits marked `completed` on kiosk reset / host change
- `PATCH /api/visits/:id` whitelisted to status field only
- Waiting poll stops after terminal status
- Staff respond errors are per-card, not page-wide
- Dashboard "responded" stat excludes declined / no_response
- Admin EN/KO test email description translations

### Changed
- Version aligned to `0.8.0` (package.json + APP_VERSION)
- Kiosk top bar buttons enlarged for touch accessibility
- Staff response buttons stack vertically on mobile

## [0.3.0] — Stages 1–6

- WIDERS/YOBELL design system
- Premium kiosk home, host selection, waiting screen
- SaaS-style admin console
- Email notifications and respond links
- Password protection (client-side gate)
