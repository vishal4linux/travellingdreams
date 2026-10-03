import { clearCustomerSession } from "@/lib/auth/session";
import { NextResponse } from "next/server";

export async function POST() {
  await clearCustomerSession();
  return NextResponse.json({ ok: true });
}
