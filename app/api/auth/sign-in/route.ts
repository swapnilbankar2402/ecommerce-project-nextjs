import { setAuthCookies, signAccessToken, signRefreshToken } from "@/lib/auth";
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

    // console.log("user :::", user);

    // Create tokens
    const accessToken = signAccessToken({
      userId: user._id.toString(),
      role: user.role,
    });
    const refreshToken = signRefreshToken({ userId: user._id.toString() });

    // Set HttpOnly cookie
    setAuthCookies(accessToken, refreshToken);

    const userObj = user.toObject();

    const { password: hashedUserPassword, ...restUserData } = userObj;

    // console.log("hashedUserPassword :", hashedUserPassword)
    // console.log("restUserData :", restUserData)

    return NextResponse.json(
      {
        success: true,
        accessToken,
        user: { ...restUserData },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
