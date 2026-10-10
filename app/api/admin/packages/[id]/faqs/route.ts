import { requireAdmin } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

type Ctx = { params: Promise<{ id: string }> };

const schema = z.object({
  question: z.string().min(4),
  answer: z.string().min(4),
  sortOrder: z.coerce.number().int().optional(),
});

export async function POST(request: Request, ctx: Ctx) {
  try {
    await requireAdmin(["ADMIN", "CONTENT_MANAGER"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: packageId } = await ctx.params;
  const body = schema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const count = await prisma.packageFaq.count({ where: { packageId } });
  const faq = await prisma.packageFaq.create({
    data: {
      packageId,
      question: body.data.question,
      answer: body.data.answer,
      sortOrder: body.data.sortOrder ?? count,
    },
  });
  return NextResponse.json({ faq });
}
