import { getCustomerSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1).max(120).optional(),
  phone: z.string().min(8).max(20).optional(),
});

export async function PATCH(request: Request) {
  const session = await getCustomerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = schema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  await prisma.customer.update({
    where: { id: session.customerId },
    data: body.data,
  });

  return NextResponse.json({ ok: true });
}
