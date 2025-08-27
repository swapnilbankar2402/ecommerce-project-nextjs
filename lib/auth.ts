import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

// Custom payload type
interface UserPayload extends JwtPayload {
  userId: string;
  roles: string[];
}

export function signAccessToken(payload: object) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" }); // short-lived
}

export function signRefreshToken(payload: object) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" }); // long-lived
}

export function verifyAccessToken(token: string): UserPayload | null {
  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    // Check if decoded has userId property
    if (
      typeof decoded === "object" &&
      decoded !== null &&
      "userId" in decoded
    ) {
      return decoded as UserPayload;
    }
    return null;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return { name: "TokenExpiredError", message: error.message } as any;
    }
    return null;
    // return null;
  }
}

export function verifyRefreshToken(token: string): UserPayload | null {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET);
    // Check if decoded has userId property
    if (
      typeof decoded === "object" &&
      decoded !== null &&
      "userId" in decoded
    ) {
      return decoded as UserPayload;
    }
    return null;
  } catch (error) {
    return null;
  }
}

// ✅ Set HttpOnly cookie
export function setAuthCookies(accessToken: string, refreshToken: string) {
  const res = NextResponse.next();

  // Set access token cookie
  res.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    path: "/",
    maxAge: 15 * 60, // 15 minutes
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  // Set refresh token cookie
  res.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}

// ✅ Clear cookie
export function clearAuthCookies() {
  const res = NextResponse.next();
  res.cookies.set("accessToken", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.cookies.set("refreshToken", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
