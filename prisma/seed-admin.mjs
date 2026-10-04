import { PrismaClient, StaffRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  for (const role of Object.values(StaffRole)) {
    await prisma.role.upsert({
      where: { name: role },
      create: {
        name: role,
        description: `${role.replace("_", " ")} role`,
      },
      update: {},
    });
  }

  const adminRole = await prisma.role.findUniqueOrThrow({
    where: { name: StaffRole.ADMIN },
  });

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@travellingdreams.in";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    create: {
      email: adminEmail,
      name: "Travelling Dreams Admin",
      passwordHash,
      roleId: adminRole.id,
      isActive: true,
    },
    update: {
      passwordHash,
      roleId: adminRole.id,
      isActive: true,
    },
  });

  console.log(`Admin ready: ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
