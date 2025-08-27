// import { NextRequest, NextResponse } from "next/server";
// import { signAccessToken, verifyAccessToken, verifyRefreshToken } from "./lib/auth";

// function isUserPayload(payload: any): payload is { userId: string } {
//   return payload && typeof payload === "object" && "userId" in payload;
// }

// export async function middleware(request: NextRequest) {
//   // Get token from cookie
//   const token = request.cookies.get("accessToken")?.value;
//   console.log("Token from cookie:", token ? "Present" : "Missing");

//   // Protected routes
//   const protectedPaths = ["/vendor", "/admin"];
//   const isProtectedPath = protectedPaths.some((path) =>
//     request.nextUrl.pathname.startsWith(path)
//   );

//   if (isProtectedPath) {
//     if (!token) {
//       console.log("No token found, redirecting to login");
//       return NextResponse.redirect(new URL("/auth/sign-in", request.url));
//     }

//     const decoded = await verifyAccessToken(token);

//     if (
//       !decoded ||
//       (typeof decoded === "object" &&
//         "name" in decoded &&
//         decoded.name === "TokenExpiredError")
//     ) {
//       console.log("Token expired, attempting refresh");
//       // For page routes, try to refresh the token
//       const refreshToken = request.cookies.get("refreshToken")?.value;

//       if (!refreshToken) {
//         console.log("No refresh token found, redirecting to login");
//         return NextResponse.redirect(new URL("/auth/sign-in", request.url));
//       }

//       const refreshDecoded = await verifyRefreshToken(refreshToken);

//       // Check if refresh token is valid and has userId
//       if (!refreshDecoded || !isUserPayload(refreshDecoded)) {
//         console.log("Invalid refresh token, redirecting to login");
//         return NextResponse.redirect(new URL("/auth/sign-in", request.url));
//       }

//       // Create new access token
//       const newAccessToken = await signAccessToken({
//         userId: refreshDecoded.userId,
//       });

//       // Create response and set new token in cookie
//       const response = NextResponse.next();
//       response.cookies.set("accessToken", newAccessToken, {
//         httpOnly: false,
//         path: "/",
//         maxAge: 15 * 60, // 15 minutes
//         sameSite: "lax", // Changed from "strict" to "lax"
//         secure: process.env.NODE_ENV === "production",
//       });

//       console.log("New access token set in cookie");
//       return response;
//     }
//   }

//   return NextResponse.next();
// }

import { NextRequest, NextResponse } from "next/server";
import {
  signAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "./lib/auth";

function isUserPayload(payload: any): payload is { userId: string } {
  return payload && typeof payload === "object" && "userId" in payload;
}

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // console.log("Access token:", accessToken ? "Present" : "Missing");
  // console.log("Refresh token:", refreshToken ? "Present" : "Missing");

  const protectedPaths = ["/vendor", "/admin"];
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  // CASE 1: No access token (cookie expired/vanished)
  if (!accessToken) {
    if (!refreshToken) {
      console.log("No access or refresh token → redirect login");
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    const refreshDecoded = await verifyRefreshToken(refreshToken);
    if (!refreshDecoded || !isUserPayload(refreshDecoded)) {
      console.log("Invalid refresh token → redirect login");
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    // Mint a new access token
    const newAccessToken = await signAccessToken({
      userId: refreshDecoded.userId,
    });

    const response = NextResponse.next();
    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: false,
      path: "/",
      maxAge: 15 * 60,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    console.log("New access token created because cookie was missing");
    return response;
  }

  // CASE 2: Access token exists → verify
  const decoded = await verifyAccessToken(accessToken);

  if (
    !decoded ||
    (typeof decoded === "object" &&
      "name" in decoded &&
      decoded.name === "TokenExpiredError")
  ) {
    console.log("Access token expired → trying refresh");

    if (!refreshToken) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    const refreshDecoded = await verifyRefreshToken(refreshToken);
    if (!refreshDecoded || !isUserPayload(refreshDecoded)) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    const newAccessToken = await signAccessToken({
      userId: refreshDecoded.userId,
    });

    const response = NextResponse.next();
    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: false,
      path: "/",
      maxAge: 15 * 60,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    console.log("New access token created because old one was expired");
    return response;
  }

  // CASE 3: Access token valid → continue
  return NextResponse.next();
}
