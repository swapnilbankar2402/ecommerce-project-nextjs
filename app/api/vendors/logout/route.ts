import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Create response and clear cookies
    const response = NextResponse.json(
      { success: true, message: "Logout successful" },
      { status: 200 }
    );

    // Clear vendor cookies
    response.cookies.set("vendorAccessToken", "", {
      httpOnly: false,
      path: "/",
      maxAge: 0,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    response.cookies.set("vendorRefreshToken", "", {
      httpOnly: true,
      path: "/",
      maxAge: 0,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
