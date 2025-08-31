import { signVendorAccessToken, signVendorRefreshToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { jsonResponse } from "@/lib/helper-functions";
import Vendor from "@/models/Vendor";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface VendorLoginRequestBody {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    console.log("1");
    const body: VendorLoginRequestBody = await request.json();

    if (!body.email || !body.password) {
      return jsonResponse(
        { success: false, error: "Email and passowrd are required" },
        400
      );
    }

    // Find vendor by email
    const vendor = await Vendor.findOne({ email: body.email });
    if (!vendor) {
      return jsonResponse(
        { success: false, message: "Invalid credentials" },
        400
      );
    }

    // Check password
    const isMatch = await bcrypt.compare(body.password, vendor.password);
    if (!isMatch) {
      return jsonResponse(
        { success: false, message: "Invalid credentials" },
        400
      );
    }

    const { password, ...restVendorData } = vendor.toObject();

    // Create tokens
    const accessToken = await signVendorAccessToken({
      vendorId: vendor._id.toString(),
      email: vendor.email,
    });

    const refreshToken = await signVendorRefreshToken({
      vendorId: vendor._id.toString(),
      email: vendor.email,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successfull",
        data: {
          vendor: restVendorData,
        },
      },
      { status: 200 }
    );

    // Set vendor-specific cookies
    response.cookies.set("vendorAccessToken", accessToken, {
      httpOnly: false,
      path: "/",
      maxAge: 15 * 60, // 15 minutes
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    response.cookies.set("vendorRefreshToken", refreshToken, {
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Vendor application error:", error);
    return jsonResponse({ success: false, message: "Server error" }, 500);
  }
}
