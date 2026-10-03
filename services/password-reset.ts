import { prisma } from "@/lib/prisma";
import { createHash, randomBytes } from "crypto";
import bcrypt from "bcryptjs";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createPasswordResetToken(email: string) {
  const customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer?.passwordHash) return null;

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.passwordResetToken.deleteMany({ where: { customerId: customer.id } });
  await prisma.passwordResetToken.create({
    data: {
      customerId: customer.id,
      tokenHash: hashToken(token),
      expiresAt,
    },
  });

  return { token, customerId: customer.id };
}

export async function resetPasswordWithToken(token: string, newPassword: string) {
  const row = await prisma.passwordResetToken.findFirst({
    where: { tokenHash: hashToken(token), expiresAt: { gt: new Date() } },
    include: { customer: true },
  });
  if (!row) throw new Error("Invalid or expired reset link");

  await prisma.$transaction([
    prisma.customer.update({
      where: { id: row.customerId },
      data: { passwordHash: await bcrypt.hash(newPassword, 12) },
    }),
    prisma.passwordResetToken.deleteMany({ where: { customerId: row.customerId } }),
  ]);
}
