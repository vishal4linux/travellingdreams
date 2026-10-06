import { createHmac, timingSafeEqual } from "crypto";

export function sessionSecret() {
  const secret = process.env.SESSION_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SESSION_SECRET (or NEXTAUTH_SECRET) must be set in production"
    );
  }
  return "dev-only-change-before-production";
}

export function signSessionPayload(payload: object): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", sessionSecret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifySessionPayload<T>(token: string): T | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", sessionSecret()).update(body).digest("base64url");
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    const data = JSON.parse(Buffer.from(body, "base64url").toString()) as T & {
      exp: number;
    };
    if (data.exp < Date.now() / 1000) return null;
    return data;
  } catch {
    return null;
  }
}
