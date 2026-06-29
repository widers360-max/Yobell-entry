import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import "dotenv/config";

const dbUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const dbPath = dbUrl.startsWith("file:") ? dbUrl.replace("file:", "") : dbUrl;
const resolvedPath = path.isAbsolute(dbPath)
  ? dbPath
  : path.join(process.cwd(), dbPath.replace(/^\.\//, ""));

const adapter = new PrismaBetterSqlite3({ url: `file:${resolvedPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.visit.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.company.deleteMany();
  await prisma.kioskSetting.deleteMany();

  const widers = await prisma.company.create({
    data: {
      name: "株式会社WIDERS",
      logoUrl: null,
      welcomeMessage: "ご来社ありがとうございます",
    },
  });

  const daiken = await prisma.company.create({
    data: {
      name: "株式会社大建",
      logoUrl: null,
      welcomeMessage: "ご来社ありがとうございます",
    },
  });

  const kyoritsu = await prisma.company.create({
    data: {
      name: "株式会社共立防災設備",
      logoUrl: null,
      welcomeMessage: "ご来社ありがとうございます",
    },
  });

  await prisma.staff.createMany({
    data: [
      {
        companyId: widers.id,
        name: "橋本 賢一",
        department: "経営",
        role: "代表",
        email: "hashimoto@widers.co.jp",
        phone: "03-1234-5678",
        notificationMethod: "dashboard",
        active: true,
      },
      {
        companyId: daiken.id,
        name: "大建 受付",
        department: "総務",
        role: "管理",
        email: "reception@daiken.co.jp",
        phone: "03-2345-6789",
        notificationMethod: "dashboard",
        active: true,
      },
      {
        companyId: kyoritsu.id,
        name: "共立 防災担当",
        department: "技術",
        role: "消防設備",
        email: "bosai@kyoritsu.co.jp",
        phone: "03-3456-7890",
        notificationMethod: "dashboard",
        active: true,
      },
      {
        companyId: widers.id,
        name: "田中 美咲",
        department: "営業",
        role: "マネージャー",
        email: "tanaka@widers.co.jp",
        phone: "03-1234-5679",
        notificationMethod: "dashboard",
        active: true,
      },
      {
        companyId: daiken.id,
        name: "佐藤 健太",
        department: "開発",
        role: "エンジニア",
        email: "sato@daiken.co.jp",
        phone: "03-2345-6790",
        notificationMethod: "dashboard",
        active: true,
      },
    ],
  });

  await prisma.kioskSetting.create({
    data: {
      id: "default",
      languageDefault: "ja",
      retentionDays: 30,
      privacyNotice:
        "入力された情報は受付対応および来訪記録のために利用されます。",
      fallbackMessage:
        "担当者が応答できません。お手数ですがお電話またはメールでご連絡ください。",
      brandName: "YOBELL",
      tagline: "内線電話のないオフィス受付",
      welcomeMessage: "ご来社ありがとうございます",
    },
  });

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
