import {
  signAccessToken,
  signVendorAccessToken,
  signVendorRefreshToken,
} from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { jsonResponse } from "@/lib/helper-functions";
import Vendor from "@/models/Vendor";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface VendorApplicationRequestBody {
  email: string;
  password: string;
  businessName: string;
  businessType: string;
  taxId: string;
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  currentApplication: {
    storeName: string;
    storeDescription: string;
    logo: string;
    banner: string;
    policies: {
      shipping: string;
      returns: string;
      warranty: string;
    };
  };
  payoutInfo: {
    method: string;
    accountDetails: any;
  };
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password, ...restFormData }: VendorApplicationRequestBody =
      await request.json();

    // Check if vendor already exists
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return jsonResponse(
        { success: false, message: "Vendor with this email already exists" },
        400
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newVendor = new Vendor({
      email,
      password: hashedPassword,
      businessName: restFormData.businessName,
      businessType: restFormData.businessType,
      taxId: restFormData.taxId,
      contact: restFormData.contact,
      currentApplication: {
        storeName: restFormData.currentApplication.storeName,
        storeDescription: restFormData.currentApplication.storeDescription,
        logo: restFormData.currentApplication.logo,
        banner: restFormData.currentApplication.banner,
        policies: restFormData.currentApplication.policies,
        verification: {
          status: "pending",
          submittedAt: new Date(),
        },
      },
      payoutInfo: restFormData.payoutInfo,
    });

    const savedVendorDoc = await newVendor.save();
    const { password: savedVendorHashedPassword, ...savedVendor } =
      savedVendorDoc.toObject();

    // Create tokens with vendor-specific payload
    const accessToken = await signVendorAccessToken({
      vendorId: savedVendor._id.toString(),
      email: savedVendor.email,
    });

    const refreshToken = await signVendorRefreshToken({
      vendorId: savedVendor._id.toString(),
      email: savedVendor.email,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Vendor account created successfully",
        data: {
          vendor: savedVendor,
        },
      },
      { status: 201 }
    );

    // // Set vendor-specific cookies
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
    if (error instanceof mongoose.Error.ValidationError) {
      return jsonResponse(
        { success: false, error: "Invalid data provided" },
        400
      );
    }

    return jsonResponse({ success: false, message: "Server error" }, 500);
  }
}
