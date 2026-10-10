import { requireAdmin } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

type Ctx = { params: Promise<{ id: string; faqId: string }> };

const schema = z.object({
  question: z.string().min(4).optional(),
  answer: z.string().min(4).optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export async function PATCH(request: Request, ctx: Ctx) {
  try {
    await requireAdmin(["ADMIN", "CONTENT_MANAGER"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: packageId, faqId } = await ctx.params;
  const body = schema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const existing = await prisma.packageFaq.findFirst({ where: { id: faqId, packageId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const faq = await prisma.packageFaq.update({ where: { id: faqId }, data: body.data });
  return NextResponse.json({ faq });
}

export async function DELETE(_request: Request, ctx: Ctx) {
  try {
    await requireAdmin(["ADMIN", "CONTENT_MANAGER"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: packageId, faqId } = await ctx.params;
  const existing = await prisma.packageFaq.findFirst({ where: { id: faqId, packageId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.packageFaq.delete({ where: { id: faqId } });
  return NextResponse.json({ ok: true });
}
