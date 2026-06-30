import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type StaffSeed = {
  name: string;
  department?: string;
  title?: string;
  email?: string;
  phone?: string;
};

type CompanySeed = {
  name: string;
  nameKana?: string;
  slug: string;
  staff: StaffSeed[];
};

const companies: CompanySeed[] = [
  {
    name: "WIDERS",
    nameKana: "ワイダース",
    slug: "widers",
    staff: [
      { name: "山田 太郎", department: "営業部", title: "部長", email: "yamada@widers.example.jp" },
      { name: "佐藤 花子", department: "総務部", title: "主任", email: "sato@widers.example.jp" },
      { name: "鈴木 一郎", department: "開発部", title: "エンジニア", email: "suzuki@widers.example.jp" },
    ],
  },
  {
    name: "大建",
    nameKana: "ダイケン",
    slug: "daiken",
    staff: [
      { name: "高橋 健", department: "工事部", title: "課長", email: "takahashi@daiken.example.jp" },
      { name: "田中 美咲", department: "設計部", title: "設計士", email: "tanaka@daiken.example.jp" },
    ],
  },
  {
    name: "共立防災設備",
    nameKana: "キョウリツボウサイセツビ",
    slug: "kyoritsu-bousai",
    staff: [
      { name: "伊藤 誠", department: "防災課", title: "課長", email: "ito@kyoritsu.example.jp" },
      { name: "渡辺 由美", department: "保守点検課", title: "技士", email: "watanabe@kyoritsu.example.jp" },
      { name: "中村 大輔", department: "営業課", title: "担当", email: "nakamura@kyoritsu.example.jp" },
    ],
  },
];

async function main() {
  console.log("Seeding companies and staff...");

  for (const company of companies) {
    const created = await prisma.company.upsert({
      where: { slug: company.slug },
      update: { name: company.name, nameKana: company.nameKana, active: true },
      create: {
        name: company.name,
        nameKana: company.nameKana,
        slug: company.slug,
        active: true,
      },
    });

    let sortOrder = 0;
    for (const member of company.staff) {
      const existing = await prisma.staff.findFirst({
        where: { companyId: created.id, name: member.name },
      });

      if (existing) {
        await prisma.staff.update({
          where: { id: existing.id },
          data: { ...member, sortOrder, active: true },
        });
      } else {
        await prisma.staff.create({
          data: { ...member, sortOrder, companyId: created.id },
        });
      }
      sortOrder += 1;
    }

    console.log(`  ${company.name}: ${company.staff.length} staff`);
  }

  // Add a couple of sample visits if the visit table is empty.
  const visitCount = await prisma.visit.count();
  if (visitCount === 0) {
    const widersStaff = await prisma.staff.findFirst({
      where: { company: { slug: "widers" } },
      orderBy: { sortOrder: "asc" },
    });

    if (widersStaff) {
      await prisma.visit.create({
        data: {
          visitorName: "見本 訪問者",
          visitorCompany: "サンプル商事",
          visitorType: "APPOINTMENT",
          purpose: "打ち合わせ",
          partySize: 1,
          status: "COMPLETED",
          staffId: widersStaff.id,
          respondedAt: new Date(),
          completedAt: new Date(),
        },
      });
      console.log("  Added 1 sample visit");
    }
  }

  console.log("Seeding complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
