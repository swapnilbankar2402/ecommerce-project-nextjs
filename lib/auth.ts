import { SignJWT, jwtVerify } from "jose";
import type { JWTPayload } from "jose";

const ACCESS_SECRET = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);
const REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET!
);

interface UserPayload extends JWTPayload {
  userId: string;
  role?: string;
}

export async function signAccessToken(payload: UserPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(ACCESS_SECRET);
}

export async function signRefreshToken(payload: UserPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(REFRESH_SECRET);
}

export async function verifyAccessToken(
  token: string
): Promise<UserPayload | { name: string; message: string } | null> {
  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET);
    // Check if payload has userId
    if (payload && typeof payload === "object" && "userId" in payload) {
      return payload as UserPayload;
    }
    return null;
  } catch (error: any) {
    if (error.code === "ERR_JWT_EXPIRED") {
      return { name: "TokenExpiredError", message: error.message };
    }
    return null;
  }
}

export async function verifyRefreshToken(
  token: string
): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET);
    if (payload && typeof payload === "object" && "userId" in payload) {
      return payload as UserPayload;
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Error: The edge runtime does not support Node.js 'crypto' module.(This error was coming when using jsonwebtoken, when using verifyAccessToken in middleware.js file, so therefore switched to another package)

// This happens because Next.js middleware runs on the Edge Runtime (V8 isolates), which doesn’t support Node.js core modules like crypto. And jsonwebtoken internally uses crypto, so it throws that error.
