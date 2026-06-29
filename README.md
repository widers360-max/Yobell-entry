# YOBELL Entry

**内線電話のないオフィス受付** — A touch-first Japanese office reception kiosk MVP for 32-inch Windows touch monitors.

YOBELL Entry replaces the internal phone at office entrances. Visitors check in via a large touch display, select their host, and staff respond from a notification dashboard.

## Features

- **Kiosk flow**: Idle → visitor type → host selection → visitor info → optional camera photo → confirmation → waiting
- **Multi-language**: Japanese (default), English, Korean
- **Staff dashboard** (`/staff`): Real-time visitor notifications with response buttons
- **Admin dashboard** (`/admin`): Manage companies, staff, visit logs, kiosk branding, CSV export
- **Camera capture**: Optional visitor photo via browser `getUserMedia`
- **Health check** (`/health`): Application and database status

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma + SQLite

## Prerequisites

- Node.js 18+ (recommended: 20+)
- npm
- Windows mini PC with Chrome (for kiosk deployment)
- Logitech USB camera (optional, for photo capture)

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd yobell-entry

# Install dependencies
npm install

# Set up database
npm run db:push
npm run db:seed
```

## Development

```bash
npm run dev
```

Open in your browser:

| Route    | Description              |
|----------|--------------------------|
| `/`      | Kiosk (main entry)       |
| `/staff` | Staff notification panel |
| `/admin` | Admin dashboard          |
| `/health`| Health check             |

## Production

```bash
# Build
npm run build

# Start production server
npm start
```

The app runs on port 3000 by default. Set `PORT` to change it:

```bash
PORT=8080 npm start
```

For a Windows mini PC, run as a Windows service or use `pm2`:

```bash
npm install -g pm2
pm2 start npm --name yobell-entry -- start
pm2 save
```

## Chrome Kiosk Mode on Windows

1. Install [Google Chrome](https://www.google.com/chrome/).
2. Create a shortcut to Chrome on the desktop.
3. Right-click → Properties → Target, append:

```
"C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --no-first-run --disable-infobars --disable-session-crashed-bubble --disable-translate --app=http://localhost:3000
```

4. Optional flags:
   - `--start-fullscreen` — fullscreen on launch
   - `--disable-pinch` — disable pinch zoom on touch
   - `--overscroll-history-navigation=0` — disable swipe navigation

5. Place the shortcut in the Windows Startup folder (`Win+R` → `shell:startup`) so the kiosk launches on boot.

6. Disable screen saver and sleep in Windows Power Settings.

## Testing the Logitech USB Camera

1. Connect the Logitech USB camera to the mini PC.
2. Open Chrome and go to `chrome://settings/content/camera`.
3. Allow camera access for `http://localhost:3000`.
4. Start the kiosk flow and proceed to the photo capture step.
5. You should see a live preview. Click **写真を撮影する** to capture.
6. If the camera fails, use **写真なしで進む** — camera is optional.

To test outside the kiosk flow, open Chrome DevTools and run:

```javascript
navigator.mediaDevices.getUserMedia({ video: true })
  .then(s => { console.log('Camera OK', s.getVideoTracks()[0].label); s.getTracks().forEach(t => t.stop()); })
  .catch(e => console.error('Camera error', e));
```

## Reset Database

```bash
npm run db:reset
```

This drops all data, recreates tables, and re-seeds sample companies and staff.

## Seed Data

The seed script creates:

**Companies:**
- 株式会社WIDERS
- 株式会社大建
- 株式会社共立防災設備

**Staff:**
- 橋本 賢一 / WIDERS / 代表
- 大建 受付 / 大建 / 管理
- 共立 防災担当 / 共立防災設備 / 消防設備
- 田中 美咲 / WIDERS / 営業
- 佐藤 健太 / 大建 / 開発

## Environment Variables

Create a `.env` file (included by default):

```env
DATABASE_URL="file:./dev.db"
```

## CSV Export

From the admin dashboard → **来訪ログ** tab, click **CSVエクスポート**.

Or directly: `GET /api/visits/export`

Exports respect the retention setting (default: 30 days).

## Architecture

```
Kiosk (/)          →  POST /api/visits  →  SQLite
Staff (/staff)     →  PATCH /api/visits/:id  →  Kiosk polls status
Admin (/admin)     →  CRUD APIs for companies, staff, settings
```

Staff responses update visit status. The kiosk waiting screen polls every 2 seconds. After 60 seconds with no response, status becomes `no_response` and a fallback message is shown.

## License

Proprietary — YOBELL Entry MVP
