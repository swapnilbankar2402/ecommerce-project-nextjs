import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyRefreshToken, signAccessToken } from "@/lib/auth";

export async function POST() {
  const cookieStore = cookies() as any;
  const token = cookieStore.get("refreshToken")?.value;

  if (!token)
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });

  try {
    const payload = verifyRefreshToken(token) as any;
    const newAccessToken = signAccessToken({
      userId: payload.userId,
      role: payload.role,
    });

    return NextResponse.json({ accessToken: newAccessToken });
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 403 }
    );
  }
}
