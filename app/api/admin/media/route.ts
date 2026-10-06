import { requireAdmin } from "@/lib/auth/rbac";
import { saveUploadedImage } from "@/lib/admin/upload";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await requireAdmin(["ADMIN", "CONTENT_MANAGER", "HOTEL_MANAGER"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const items = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  try {
    await requireAdmin(["ADMIN", "CONTENT_MANAGER", "HOTEL_MANAGER"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    const folder = String(form.get("folder") ?? "general");
    const alt = String(form.get("alt") ?? "").trim() || null;

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }

    const saved = await saveUploadedImage(file, folder);
    const media = await prisma.media.create({
      data: {
        url: saved.url,
        alt,
        folder,
        mimeType: saved.mimeType,
        sizeBytes: saved.sizeBytes,
      },
    });
    return NextResponse.json({ media });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload failed" },
      { status: 400 }
    );
  }
}
