import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signAccessToken, signRefreshToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUserDoc = await newUser.save();
    const { password: savedUserHashedPassword, ...savedUser } =
      savedUserDoc.toObject();

    // console.log("savedUserHashedPassword :", savedUserHashedPassword);
    // console.log("savedUser :", savedUser);

    // Create tokens
    const accessToken = await signAccessToken({
      userId: savedUser._id.toString(),
      roles: savedUser.roles,
    });
    const refreshToken = await signRefreshToken({
      userId: savedUser._id.toString(),
    });

    // Set HttpOnly cookie
    // setAuthCookies(accessToken, refreshToken);

    // Create response and set cookies
    const response = NextResponse.json(
      {
        success: true,
        accessToken,
        user: { ...savedUser },
      },
      { status: 201 }
    );

    // Set access token cookie (non-HttpOnly so client can read it)
    // response.cookies.set("accessToken", accessToken, {
    //   httpOnly: false, // Allow JavaScript access
    //   path: "/",
    //   maxAge: 15 * 60, // 15 minutes
    //   sameSite: "strict",
    //   secure: process.env.NODE_ENV === "production",
    // });

    // Set access token cookie (HttpOnly for security)
    response.cookies.set("accessToken", accessToken, {
      httpOnly: false, // Allow JavaScript access
      path: "/",
      maxAge: 15 * 60, // 15 minutes
      sameSite: "lax",
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
