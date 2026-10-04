import { signSessionPayload, verifySessionPayload } from "@/lib/auth/token";
import { cookies } from "next/headers";

const CUSTOMER_COOKIE = "td_customer_session";
const ADMIN_COOKIE = "td_admin_session";
const TTL_SEC = 60 * 60 * 24 * 14;

export type CustomerSession = { kind: "customer"; customerId: string; email: string; exp: number };
export type AdminSession = {
  kind: "admin";
  userId: string;
  email: string;
  role: string;
  exp: number;
};

export async function setCustomerSession(customerId: string, email: string) {
  const token = signSessionPayload({
    kind: "customer",
    customerId,
    email,
    exp: Math.floor(Date.now() / 1000) + TTL_SEC,
  } satisfies CustomerSession);
  const jar = await cookies();
  jar.set(CUSTOMER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TTL_SEC,
  });
}

export async function setAdminSession(userId: string, email: string, role: string) {
  const token = signSessionPayload({
    kind: "admin",
    userId,
    email,
    role,
    exp: Math.floor(Date.now() / 1000) + TTL_SEC,
  } satisfies AdminSession);
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TTL_SEC,
  });
}

export async function clearCustomerSession() {
  const jar = await cookies();
  jar.delete(CUSTOMER_COOKIE);
}

export async function clearAdminSession() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
}

export async function getCustomerSession(): Promise<CustomerSession | null> {
  const jar = await cookies();
  const token = jar.get(CUSTOMER_COOKIE)?.value;
  if (!token) return null;
  const data = verifySessionPayload<CustomerSession>(token);
  return data?.kind === "customer" ? data : null;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  const data = verifySessionPayload<AdminSession>(token);
  return data?.kind === "admin" ? data : null;
}
