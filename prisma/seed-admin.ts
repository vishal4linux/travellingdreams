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

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existing) {
    await prisma.user.update({
      where: { email: adminEmail },
      data: {
        roleId: adminRole.id,
        isActive: true,
        ...(process.env.SEED_ADMIN_RESET_PASSWORD === "1" ? { passwordHash } : {}),
      },
    });
    console.log(`Admin exists: ${adminEmail}`);
  } else {
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Travelling Dreams Admin",
        passwordHash,
        roleId: adminRole.id,
        isActive: true,
      },
    });
    console.log(`Admin created: ${adminEmail}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
