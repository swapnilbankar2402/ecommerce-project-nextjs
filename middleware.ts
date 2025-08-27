import { NextRequest, NextResponse } from "next/server";
import {
  signAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "./lib/auth";

// Type guard for UserPayload
function isUserPayload(payload: any): payload is { userId: string } {
  return payload && typeof payload === "object" && "userId" in payload;
}

export async function middleware(request: NextRequest) {
  // Get token from cookie
  const token = request.cookies.get("accessToken")?.value;

  // Protected routes
  const protectedPaths = ["/vendor", "/admin"];
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    const decoded = verifyAccessToken(token);
    if (
      !decoded ||
      (typeof decoded === "object" &&
        "name" in decoded &&
        decoded.name === "TokenExpiredError")
    ) {
      // For page routes, try to refresh the token
      const refreshToken = request.cookies.get("refreshToken")?.value;

      if (!refreshToken) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const refreshDecoded = verifyRefreshToken(refreshToken);

      // Check if refresh token is valid and has userId
      if (!refreshDecoded || !isUserPayload(refreshDecoded)) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      // Create new access token
      const newAccessToken = signAccessToken({ userId: refreshDecoded.userId });

      // Create response and set new token in cookie
      const response = NextResponse.next();
      response.cookies.set("accessToken", newAccessToken, {
        httpOnly: false,
        path: "/",
        maxAge: 15 * 60, // 15 minutes
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });

      return response;
    }
  }

  // Role-based route protection (uncomment when ready)
  // if (
  //   request.nextUrl.pathname.startsWith("/admin") &&
  //   !decoded.roles.includes("admin")
  // ) {
  //   return NextResponse.redirect(new URL("/unauthorized", request.url));
  // }
  // if (
  //   request.nextUrl.pathname.startsWith("/vendor") &&
  //   !decoded.roles.includes("vendor") &&
  //   !decoded.roles.includes("admin")
  // ) {
  //   return NextResponse.redirect(new URL("/unauthorized", request.url));
  // }
}
