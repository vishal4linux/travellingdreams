import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const CUSTOMER_COOKIE = "td_customer_session";
const ADMIN_COOKIE = "td_admin_session";
const TTL_SEC = 60 * 60 * 24 * 14;

function secret() {
  return (
    process.env.SESSION_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    "dev-only-change-before-production"
  );
}

function sign(payload: object): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verify<T>(token: string): T | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", secret()).update(body).digest("base64url");
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  } catch {
    return null;
  }
  const data = JSON.parse(Buffer.from(body, "base64url").toString()) as T & {
    exp: number;
  };
  if (data.exp < Date.now() / 1000) return null;
  return data;
}

export type CustomerSession = { kind: "customer"; customerId: string; email: string; exp: number };
export type AdminSession = {
  kind: "admin";
  userId: string;
  email: string;
  role: string;
  exp: number;
};

export async function setCustomerSession(customerId: string, email: string) {
  const token = sign({
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
  const token = sign({
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
  const data = verify<CustomerSession>(token);
  return data?.kind === "customer" ? data : null;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  const data = verify<AdminSession>(token);
  return data?.kind === "admin" ? data : null;
}
