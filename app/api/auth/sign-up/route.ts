import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import {
  setRefreshCookie,
  signAccessToken,
  signRefreshToken,
} from "@/lib/auth";

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
    const accessToken = signAccessToken({
      userId: savedUser._id.toString(),
      roles: savedUser.roles,
    });
    const refreshToken = signRefreshToken({ userId: savedUser._id.toString() });

    // Set HttpOnly cookie for refresh token
    setRefreshCookie(refreshToken);

    return NextResponse.json(
      {
        success: true,
        accessToken,
        user: { ...savedUser },
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
