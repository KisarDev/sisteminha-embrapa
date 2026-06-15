import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123456", 10);

  await prisma.user.upsert({
    where: { email: "admin@sisteminha.local" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@sisteminha.local",
      passwordHash,
      role: UserRole.SUPER_ADMIN,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
