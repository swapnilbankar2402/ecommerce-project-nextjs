import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Get the current refresh token cookie (for logging purposes)
    const refreshToken = request.cookies.get("refreshToken")?.value;
    console.log(
      "Logging out user with refresh token:",
      refreshToken ? "exists" : "not found"
    );

    // Create a JSON response
    const response = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );

    // Clear the refresh token cookie with multiple attributes
    response.cookies.set({
      name: "refreshToken",
      value: "",
      expires: new Date(0), // Immediately expire the cookie
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only secure in production
      sameSite: "strict",
      path: "/",
      domain:
        process.env.NODE_ENV === "production" ? ".yourdomain.com" : undefined, // Set domain if needed
    });

    console.log(
      "Logging out user with refresh token:",
      refreshToken ? "exists" : "not found"
    );

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
