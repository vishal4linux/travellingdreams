import { requireAdmin } from "@/lib/auth/rbac";
import { slugify } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  state: z.string().optional(),
  tagline: z.string().optional(),
  isPopular: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    await requireAdmin(["ADMIN", "CONTENT_MANAGER"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = schema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const slug = slugify(body.data.name);
  const row = await prisma.destination.create({
    data: { ...body.data, slug, isPublished: true },
  });
  return NextResponse.json({ destination: row });
}
