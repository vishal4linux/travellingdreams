import { requireAdmin } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string; dayId: string }> };

export async function DELETE(_request: Request, ctx: Ctx) {
  try {
    await requireAdmin(["ADMIN", "CONTENT_MANAGER"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: packageId, dayId } = await ctx.params;
  const day = await prisma.packageItinerary.findFirst({
    where: { id: dayId, packageId },
  });
  if (!day) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.packageItinerary.delete({ where: { id: dayId } });
  return NextResponse.json({ ok: true });
}
