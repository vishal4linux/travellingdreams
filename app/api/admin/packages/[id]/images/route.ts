import { requireAdmin } from "@/lib/auth/rbac";
import { saveUploadedImage } from "@/lib/admin/upload";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: Request, ctx: Ctx) {
  try {
    await requireAdmin(["ADMIN", "CONTENT_MANAGER"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: packageId } = await ctx.params;
  const pkg = await prisma.package.findUnique({ where: { id: packageId } });
  if (!pkg) return NextResponse.json({ error: "Package not found" }, { status: 404 });

  const contentType = request.headers.get("content-type") ?? "";

  try {
    let url: string;
    let alt: string | null = null;

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("file");
      alt = String(form.get("alt") ?? "").trim() || null;
      if (file instanceof File && file.size > 0) {
        const saved = await saveUploadedImage(file, "packages");
        url = saved.url;
        await prisma.media.create({
          data: {
            url: saved.url,
            alt,
            folder: "packages",
            mimeType: saved.mimeType,
            sizeBytes: saved.sizeBytes,
          },
        });
      } else {
        url = String(form.get("url") ?? "").trim();
        if (!url) return NextResponse.json({ error: "file or url required" }, { status: 400 });
      }
    } else {
      const body = z
        .object({ url: z.string().min(1), alt: z.string().optional().nullable() })
        .safeParse(await request.json());
      if (!body.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
      url = body.data.url;
      alt = body.data.alt ?? null;
    }

    const count = await prisma.packageImage.count({ where: { packageId } });
    const image = await prisma.packageImage.create({
      data: {
        packageId,
        url,
        alt: alt ?? pkg.title,
        sortOrder: count,
      },
    });

    if (!pkg.heroImage) {
      await prisma.package.update({
        where: { id: packageId },
        data: { heroImage: url },
      });
    }

    return NextResponse.json({ image });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload failed" },
      { status: 400 }
    );
  }
}
