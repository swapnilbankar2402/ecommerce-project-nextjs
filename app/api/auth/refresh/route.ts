import { NextApiRequest, NextApiResponse } from "next";
import User from "@/models/User";
import { signAccessToken, verifyRefreshToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RefreshResponseBody {
  success: boolean;
  accessToken?: string;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookie
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: "Refresh token not found" },
        { status: 401 }
      );
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // Create new access token
    const newAccessToken = signAccessToken({ userId: decoded.userId });

    // Set new access token in cookie
    const response = NextResponse.json({
      success: true,
      accessToken: newAccessToken,
    });

    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      path: "/",
      maxAge: 15 * 60, // 15 minutes
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Refresh error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
