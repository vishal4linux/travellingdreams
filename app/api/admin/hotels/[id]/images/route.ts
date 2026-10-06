import { requireAdmin } from "@/lib/auth/rbac";
import { saveUploadedImage } from "@/lib/admin/upload";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: Request, ctx: Ctx) {
  try {
    await requireAdmin(["ADMIN", "HOTEL_MANAGER"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: hotelId } = await ctx.params;
  const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });
  if (!hotel) return NextResponse.json({ error: "Hotel not found" }, { status: 404 });

  const contentType = request.headers.get("content-type") ?? "";

  try {
    let url: string;
    let alt: string | null = null;
    let isPrimary = false;

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("file");
      alt = String(form.get("alt") ?? "").trim() || null;
      isPrimary = String(form.get("isPrimary") ?? "") === "true";
      if (file instanceof File && file.size > 0) {
        const saved = await saveUploadedImage(file, "hotels");
        url = saved.url;
        await prisma.media.create({
          data: {
            url: saved.url,
            alt,
            folder: "hotels",
            mimeType: saved.mimeType,
            sizeBytes: saved.sizeBytes,
          },
        });
      } else {
        const urlField = String(form.get("url") ?? "").trim();
        if (!urlField) {
          return NextResponse.json({ error: "file or url required" }, { status: 400 });
        }
        url = urlField;
      }
    } else {
      const body = z
        .object({
          url: z.string().min(1),
          alt: z.string().optional().nullable(),
          isPrimary: z.boolean().optional(),
        })
        .safeParse(await request.json());
      if (!body.success) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
      }
      url = body.data.url;
      alt = body.data.alt ?? null;
      isPrimary = body.data.isPrimary ?? false;
    }

    const count = await prisma.hotelImage.count({ where: { hotelId } });
    if (isPrimary || count === 0) {
      await prisma.hotelImage.updateMany({
        where: { hotelId },
        data: { isPrimary: false },
      });
      isPrimary = true;
    }

    const image = await prisma.hotelImage.create({
      data: {
        hotelId,
        url,
        alt: alt ?? hotel.name,
        isPrimary,
        sortOrder: count,
      },
    });
    return NextResponse.json({ image });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload failed" },
      { status: 400 }
    );
  }
}
