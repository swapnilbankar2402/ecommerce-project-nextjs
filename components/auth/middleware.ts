// middleware.ts
import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];

  // Protected routes
  const protectedPaths = ["/dashboard", "/vendor", "/admin"];
  const isProtectedPath = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Role-based route protection
    // if (
    //   req.nextUrl.pathname.startsWith("/admin") &&
    //   !decoded.roles.includes("admin")
    // ) {
    //   return NextResponse.redirect(new URL("/unauthorized", req.url));
    // }

    // if (
    //   req.nextUrl.pathname.startsWith("/vendor") &&
    //   !decoded.roles.includes("vendor") &&
    //   !decoded.roles.includes("admin")
    // ) {
    //   return NextResponse.redirect(new URL("/unauthorized", req.url));
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/vendor/:path*", "/admin/:path*"],
};
