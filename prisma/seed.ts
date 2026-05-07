import { hash } from "bcryptjs";
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { Category } from "../src/generated/prisma/enums";
import { PrismaPg } from "@prisma/adapter-pg";
import data from "../data.json" with { type: "json" };

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const categoryMap: Record<string, Category> = {
  Entertainment: Category.Entertainment,
  Bills: Category.Bills,
  Groceries: Category.Groceries,
  "Dining Out": Category.DiningOut,
  Transportation: Category.Transportation,
  "Personal Care": Category.PersonalCare,
  Education: Category.Education,
  Lifestyle: Category.Lifestyle,
  Shopping: Category.Shopping,
  General: Category.General,
};

async function main() {
  const passwordHash = await hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test User",
      passwordHash,
    },
  });

  console.log(`Upserted user: ${user.email}`);

  await prisma.transaction.deleteMany({ where: { userId: user.id } });

  const transactions = await prisma.transaction.createMany({
    data: data.transactions.map((t) => {
      const category = categoryMap[t.category];
      if (!category) throw new Error(`Unknown category: ${t.category}`);
      return {
        name: t.name,
        amount: t.amount,
        date: new Date(t.date),
        category,
        recurring: t.recurring,
        avatar: t.avatar,
        userId: user.id,
      };
    }),
  });

  console.log(`Created ${transactions.count} transactions.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
