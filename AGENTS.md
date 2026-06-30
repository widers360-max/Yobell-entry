# AGENTS.md

YOBELL Entry — a touch-first Japanese office reception kiosk (Next.js 14 App Router + TypeScript + Tailwind + Prisma/SQLite). Default UI language is Japanese.

See `README.md` for the full page/API list and standard scripts.

## Cursor Cloud specific instructions

- **One-time DB setup before running anything**: the SQLite database (`prisma/dev.db`) is gitignored and is NOT created by the startup update script (which only runs `npm install`). On a fresh VM you must run `npm run db:setup` once before `npm run dev`, `npm run build`, or hitting any page/API. `db:setup` = `prisma db push` (creates tables) + `prisma db seed` (seeds WIDERS / 大建 / 共立防災設備 and their staff). It is idempotent — the seed upserts, so re-running it is safe.
- **`.env` is committed on purpose**: it only contains the non-secret `DATABASE_URL="file:./dev.db"`. Prisma needs it for generate/push/runtime. Do not move secrets here.
- **Prisma client**: generated automatically via the `postinstall` hook (`prisma generate`). After editing `prisma/schema.prisma`, run `npm run prisma:push` (or `prisma generate`) — the running dev server does NOT auto-regenerate the client.
- **Dev server**: `npm run dev` serves on http://localhost:3000. Standard Next.js commands (`lint`, `build`, `start`) are in `package.json`.
- **Webcam capture** (`/checkin`): uses browser `getUserMedia`, which only works over `localhost` or HTTPS and requires camera permission. The photo step is always optional — check-in completes without a camera, so missing/denied camera is not a failure.
- **Staff dashboard** (`/staff`) polls `/api/visits` every 5 seconds; new check-ins appear within a few seconds rather than instantly.
