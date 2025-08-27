import { signAccessToken, signRefreshToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

interface LoginRequestBody {
  email: string;
  password: string;
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password }: LoginRequestBody = await req.json();

    // Find user
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create tokens
    const accessToken = await signAccessToken({
      userId: user._id.toString(),
      role: user.role,
    });
    const refreshToken = await signRefreshToken({
      userId: user._id.toString(),
    });

    // Set HttpOnly cookie
    // setAuthCookies(accessToken, refreshToken);

    const userObj = user.toObject();
    const { password: hashedUserPassword, ...restUserData } = userObj;

    // Create response and set cookies
    const response = NextResponse.json(
      {
        success: true,
        user: { ...restUserData },
      },
      { status: 201 }
    );

    // Set access token cookie (non-HttpOnly so client can read it)
    response.cookies.set("accessToken", accessToken, {
      httpOnly: false, // Allow JavaScript access
      path: "/",
      maxAge: 15 * 60, // 15 minutes
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    // Set refresh token cookie (HttpOnly for security)
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
