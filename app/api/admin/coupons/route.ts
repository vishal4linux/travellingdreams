import { requireAdmin } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  code: z.string().min(3),
  discountType: z.enum(["PERCENT", "FIXED"]).default("PERCENT"),
  discountValue: z.coerce.number().positive(),
  minAmount: z.coerce.number().optional(),
  maxUses: z.coerce.number().optional(),
});

export async function POST(request: Request) {
  try {
    await requireAdmin(["ADMIN", "BOOKING_MANAGER"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = schema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const coupon = await prisma.coupon.create({
    data: {
      code: body.data.code.toUpperCase(),
      discountType: body.data.discountType,
      discountValue: body.data.discountValue,
      minAmount: body.data.minAmount,
      maxUses: body.data.maxUses,
      isActive: true,
    },
  });
  return NextResponse.json({ coupon });
}
