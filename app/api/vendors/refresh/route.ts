import { signVendorAccessToken, verifyVendorRefreshToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Vendor from "@/models/Vendor";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookie
    const refreshToken = request.cookies.get("vendorRefreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: "Refresh token not found" },
        { status: 401 }
      );
    }

    // Verify refresh token
    const decoded = await verifyVendorRefreshToken(refreshToken);

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // Find vendor
    await connectDB();
    const vendor = await Vendor.findById(decoded.vendorId);

    if (!vendor) {
      return NextResponse.json(
        { success: false, error: "Vendor not found" },
        { status: 401 }
      );
    }

    // Generate new access token
    const newAccessToken = await signVendorAccessToken({
      vendorId: vendor._id.toString(),
      email: vendor.email,
    });

    // Create response and set new access token cookie
    const response = NextResponse.json(
      {
        success: true,
        accessToken: newAccessToken,
      },
      { status: 200 }
    );

    response.cookies.set("vendorAccessToken", newAccessToken, {
      httpOnly: false,
      path: "/",
      maxAge: 15 * 60, // 15 minutes
      sameSite: "lax",
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
