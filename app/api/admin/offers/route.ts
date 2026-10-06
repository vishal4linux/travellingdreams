import { requireAdmin } from "@/lib/auth/rbac";
import { slugify } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  linkUrl: z.string().optional().nullable(),
  badge: z.string().optional().nullable(),
  sortOrder: z.coerce.number().int().optional(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  try {
    await requireAdmin(["ADMIN", "CONTENT_MANAGER"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const offers = await prisma.offer.findMany({ orderBy: [{ sortOrder: "asc" }, { title: "asc" }] });
  return NextResponse.json({ offers });
}

export async function POST(request: Request) {
  try {
    await requireAdmin(["ADMIN", "CONTENT_MANAGER"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = schema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const slug = body.data.slug?.trim() || slugify(body.data.title);
  try {
    const offer = await prisma.offer.create({
      data: {
        title: body.data.title,
        slug,
        description: body.data.description ?? undefined,
        image: body.data.image ?? undefined,
        linkUrl: body.data.linkUrl ?? undefined,
        badge: body.data.badge ?? undefined,
        sortOrder: body.data.sortOrder ?? 0,
        isActive: body.data.isActive ?? true,
      },
    });
    return NextResponse.json({ offer });
  } catch {
    return NextResponse.json({ error: "Could not create offer (slug taken?)" }, { status: 400 });
  }
}
