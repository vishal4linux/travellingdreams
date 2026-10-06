import { requireAdmin } from "@/lib/auth/rbac";
import { deleteLocalUpload } from "@/lib/admin/upload";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string; imageId: string }> };

export async function DELETE(_request: Request, ctx: Ctx) {
  try {
    await requireAdmin(["ADMIN", "HOTEL_MANAGER"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: hotelId, imageId } = await ctx.params;
  const image = await prisma.hotelImage.findFirst({
    where: { id: imageId, hotelId },
  });
  if (!image) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await deleteLocalUpload(image.url);
  await prisma.hotelImage.delete({ where: { id: imageId } });

  if (image.isPrimary) {
    const next = await prisma.hotelImage.findFirst({
      where: { hotelId },
      orderBy: { sortOrder: "asc" },
    });
    if (next) {
      await prisma.hotelImage.update({
        where: { id: next.id },
        data: { isPrimary: true },
      });
    }
  }

  return NextResponse.json({ ok: true });
}
