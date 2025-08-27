import { NextResponse } from "next/server";
import {
  signAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "@/lib/auth";
import type { NextRequest } from "next/server";

// Type guard for UserPayload
function isUserPayload(payload: any): payload is { userId: string } {
  return payload && typeof payload === "object" && "userId" in payload;
}

export async function middleware(request: NextRequest) {
  // Get token from cookie
  const token = request.cookies.get("accessToken")?.value;
  console.log("token is here :", token);

  // Protected routes
  const protectedPaths = ["/vendor", "/admin"];
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );
  // console.log("isProtectedPath :", isProtectedPath);

  if (isProtectedPath) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    const decoded = await verifyAccessToken(token);
    // console.log("decoded :", decoded);

    if (
      !decoded ||
      (typeof decoded === "object" &&
        "name" in decoded &&
        decoded.name === "TokenExpiredError")
    ) {
      // For page routes, try to refresh the token
      const refreshToken = request.cookies.get("refreshToken")?.value;
      // console.log("refreshToken :", refreshToken);

      if (!refreshToken) {
        return NextResponse.redirect(new URL("/auth/sign-in", request.url));
      }

      const refreshDecoded = await verifyRefreshToken(refreshToken);
      // console.log("refreshDecoded :", refreshDecoded);

      // Check if refresh token is valid and has userId
      if (!refreshDecoded || !isUserPayload(refreshDecoded)) {
        return NextResponse.redirect(new URL("/auth/sign-in", request.url));
      }

      // Create new access token
      const newAccessToken = await signAccessToken({
        userId: refreshDecoded.userId,
      });
      // console.log("newAccessToken :", newAccessToken);

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

  return NextResponse.next();
}

export const config = {
  matcher: ["/vendor/:path*", "/admin/:path*"],
};
