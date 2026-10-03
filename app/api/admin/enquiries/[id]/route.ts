import { requireAdmin } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const patchSchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "CLOSED"]).optional(),
  adminNotes: z.string().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(["ADMIN", "BOOKING_MANAGER"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = patchSchema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const enquiry = await prisma.enquiry.update({
    where: { id },
    data: body.data,
  });

  return NextResponse.json({ enquiry });
}
