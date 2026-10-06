import { requireAdmin } from "@/lib/auth/rbac";
import { deleteLocalUpload } from "@/lib/admin/upload";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string; imageId: string }> };

export async function DELETE(_request: Request, ctx: Ctx) {
  try {
    await requireAdmin(["ADMIN", "CONTENT_MANAGER"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: packageId, imageId } = await ctx.params;
  const image = await prisma.packageImage.findFirst({
    where: { id: imageId, packageId },
  });
  if (!image) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await deleteLocalUpload(image.url);
  await prisma.packageImage.delete({ where: { id: imageId } });

  const pkg = await prisma.package.findUnique({ where: { id: packageId } });
  if (pkg?.heroImage === image.url) {
    const next = await prisma.packageImage.findFirst({
      where: { packageId },
      orderBy: { sortOrder: "asc" },
    });
    await prisma.package.update({
      where: { id: packageId },
      data: { heroImage: next?.url ?? null },
    });
  }

  return NextResponse.json({ ok: true });
}
