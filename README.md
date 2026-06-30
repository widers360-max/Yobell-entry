# YOBELL Entry

タッチ操作対応の日本語オフィス受付キオスク（玄関の内線電話を置き換えるための受付システム）。

A touch-first Japanese office reception kiosk that replaces the entrance internal phone.

## 技術スタック / Tech Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS**
- **Prisma** + **SQLite**
- ブラウザ `getUserMedia` による任意のWebカメラ撮影（Logitech 等のUSBカメラ対応）

## ページ / Pages

| パス | 説明 |
| --- | --- |
| `/` | キオスク待機画面（会社ブランディング） |
| `/checkin` | 来訪受付フロー（区分選択 → 会社 → 担当者 → 入力 → 任意の写真撮影） |
| `/staff` | スタッフ応答ダッシュボード（5秒ごと自動更新、応答ボタン） |
| `/admin` | 来訪ログ・スタッフ管理（CSVエクスポート） |
| `/health` | アプリ状態 |

## API

| メソッド | パス | 説明 |
| --- | --- | --- |
| GET | `/api/health` | 稼働状態（JSON） |
| GET | `/api/companies` | 会社一覧（スタッフ込み） |
| GET / POST | `/api/staff` | スタッフ一覧 / 追加 |
| PATCH / DELETE | `/api/staff/:id` | スタッフ更新 / 無効化（ソフト削除） |
| GET / POST | `/api/visits` | 来訪一覧 / 受付作成 |
| GET / PATCH | `/api/visits/:id` | 来訪取得 / ステータス更新 |
| GET | `/api/visits/export` | 来訪ログCSV（UTF-8 BOM付き） |

## セットアップ / Setup

```bash
# 1. 依存関係のインストール（postinstall で prisma generate も実行）
npm install

# 2. 環境変数（SQLite のパス）
cp .env.example .env

# 3. データベース作成とシード投入（WIDERS / 大建 / 共立防災設備）
npm run db:setup

# 4. 開発サーバー起動
npm run dev
```

開発サーバーは http://localhost:3000 で起動します。

## スクリプト / Scripts

| コマンド | 説明 |
| --- | --- |
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番ビルド |
| `npm run start` | 本番サーバー起動 |
| `npm run lint` | ESLint |
| `npm run prisma:generate` | Prisma クライアント生成 |
| `npm run prisma:push` | スキーマをDBへ反映 |
| `npm run prisma:seed` | シードデータ投入 |
| `npm run db:setup` | `prisma db push` + シード |

## データモデル / Data Model

- **Company** — 訪問先の会社（WIDERS, 大建, 共立防災設備）
- **Staff** — 各会社の担当者（ソフト削除対応）
- **Visit** — 来訪記録（来訪者情報・区分・担当者・ステータス・写真）

## 来訪ステータス / Visit Status

`WAITING`（呼び出し中）→ `ACKNOWLEDGED`（確認済み）/ `ON_THE_WAY`（対応中）→ `COMPLETED`（対応完了）/ `CANCELLED`（キャンセル）

## Webカメラについて

来訪受付の写真撮影はブラウザの `getUserMedia` を使用します。HTTPS もしくは `localhost` でのみ利用可能で、ブラウザのカメラ権限が必要です。写真は任意で、カメラが無くても受付は完了できます。
