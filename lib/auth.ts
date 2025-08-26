import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export function signAccessToken(payload: object) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" }); // short-lived
}

export function signRefreshToken(payload: object) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" }); // long-lived
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, ACCESS_SECRET);
  } catch (error) {
    return null;
  }
}

export function verifyRefreshToken(token: string) {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch (error) {
    return null;
  }
}

// ✅ Set HttpOnly cookie
export function setRefreshCookie(token: string) {
  const res = NextResponse.next();
  res.cookies.set("refreshToken", token, {
    httpOnly: true,
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}

// ✅ Clear cookie
export function clearRefreshCookie() {
  const res = NextResponse.next();
  res.cookies.set("refreshToken", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
