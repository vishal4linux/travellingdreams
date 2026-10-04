import { verifySessionPayload } from "@/lib/auth/token";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isValidAdminSession(token: string | undefined): boolean {
  if (!token) return false;
  const data = verifySessionPayload<{ kind: string }>(token);
  return data?.kind === "admin";
}

const ADMIN_PUBLIC = ["/admin/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  if (pathname.startsWith("/admin") && !ADMIN_PUBLIC.some((p) => pathname.startsWith(p))) {
    const token = request.cookies.get("td_admin_session")?.value;
    if (!isValidAdminSession(token)) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  const accountPublic = [
    "/account/login",
    "/account/register",
    "/account/forgot-password",
    "/account/reset-password",
    "/account/lookup",
  ];
  if (
    pathname.startsWith("/account") &&
    !accountPublic.some((p) => pathname.startsWith(p))
  ) {
    const token = request.cookies.get("td_customer_session")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/account/login", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
