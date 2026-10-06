import { requireAdmin } from "@/lib/auth/rbac";
import { deleteLocalUpload } from "@/lib/admin/upload";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, ctx: Ctx) {
  try {
    await requireAdmin(["ADMIN", "CONTENT_MANAGER", "HOTEL_MANAGER"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await deleteLocalUpload(media.url);
  await prisma.media.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
