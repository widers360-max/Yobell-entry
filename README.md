# YOBELL Entry

**内線電話のないオフィス受付** — A touch-first Japanese office reception kiosk for 32-inch Windows touch monitors and commercial showroom demos.

YOBELL Entry replaces the internal phone at office entrances. Visitors check in via a premium touch display; staff respond from a notification dashboard; administrators configure branding, staff, and visit logs from a SaaS-style console.

**Current version:** 0.8.0 (Stages 1–8 complete)

## Features

- **Kiosk flow** (`/`): Showroom idle mode → purpose selection → host → call method → visitor info → photo → waiting
- **Multi-language**: Japanese (default), English, Korean
- **Staff dashboard** (`/staff`): Real-time notifications, i18n, mobile-friendly response UI
- **Admin console** (`/admin`): Dashboard, branding, companies, staff, visits, notifications, system tools
- **Email notifications**: SMTP host alerts with one-click respond links
- **Password protection**: Client-side gate for `/admin` and `/staff`
- **Health check** (`/health`): Application and database status

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + WIDERS/YOBELL design system
- Prisma + SQLite

## Prerequisites

- Node.js 18+ (recommended: 20+)
- npm
- Windows mini PC with Chrome (kiosk deployment)
- Logitech USB camera (optional)

## Installation

```bash
git clone https://github.com/widers360-max/Yobell-entry.git
cd Yobell-entry
npm install
cp .env.example .env
npm run db:push
npm run db:seed
```

## Development

```bash
npm run dev
```

| Route | Description |
|-------|-------------|
| `/` | Kiosk (main entry) |
| `/staff` | Staff notification panel |
| `/admin` | Admin dashboard |
| `/health` | Health check |

## Production

```bash
npm run build
npm start
```

Default port: 3000. Override with `PORT=8080 npm start`.

Windows service example:

```bash
npm install -g pm2
pm2 start npm --name yobell-entry -- start
pm2 save
```

## Environment Variables

See `.env.example`:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | SQLite path (default `file:./dev.db`) |
| `ADMIN_PASSWORD` | Admin console password |
| `STAFF_PASSWORD` | Staff panel password |
| `SMTP_HOST` | SMTP server for email notifications |
| `SMTP_PORT` | SMTP port (default 587) |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password |
| `SMTP_FROM` | From address |
| `APP_BASE_URL` | Public URL for email respond links |

## Chrome Kiosk Mode (Windows)

Append to Chrome shortcut Target:

```
"C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --no-first-run --disable-infobars --app=http://localhost:3000
```

Place shortcut in `shell:startup` for auto-launch on boot.

## Database

```bash
npm run db:push    # Apply schema
npm run db:seed    # Seed sample data
npm run db:reset   # Reset + re-seed
```

## Documentation

- [CHANGELOG.md](./CHANGELOG.md) — version history
- [PROJECT_STATUS.md](./PROJECT_STATUS.md) — completion estimates
- [TODO.md](./TODO.md) — roadmap
- [POLISH_REPORT.md](./POLISH_REPORT.md) — latest polish sprint report

## Architecture

```
Kiosk (/)     → POST /api/visits        → SQLite
Staff (/staff)→ PATCH /api/visits/:id   → Kiosk polls status
Admin (/admin)→ CRUD APIs               → Settings, companies, staff
Email         → GET /api/visits/respond → Staff one-click response
```

## License

Proprietary — YOBELL / WIDERS
