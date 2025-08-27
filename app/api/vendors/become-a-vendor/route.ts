import { verifyAccessToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { getTokenFromRequest, jsonResponse } from "@/lib/helper-functions";
import User from "@/models/User";
import Vendor from "@/models/Vendor";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

interface VendorRequestBody {
  storeName: string;
  email: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  shippingPolicy?: string;
  returnPolicy?: string;
  supportEmail?: string;
  slug?: string;
  ownerUser?: string;
}

export async function POST(request: NextRequest) {
  try {
    const token = await getTokenFromRequest(request);
    if (!token) {
      return jsonResponse(
        { success: false, error: "Authentication required" },
        401
      );
    }

    const decoded = await verifyAccessToken(token);
    if (!decoded || typeof decoded !== "object" || !("userId" in decoded)) {
      return jsonResponse({ success: false, error: "Invalid token" }, 401);
    }

    await connectDB();
    const body: VendorRequestBody = await request.json();

    if (!body.storeName || !body.email) {
      return jsonResponse(
        { success: false, error: "Store name and email are required" },
        400
      );
    }

    const user = await User.findById(decoded.userId).lean();
    if (!user) {
      return jsonResponse({ success: false, error: "User not found" }, 404);
    }

    const existingVendor = await Vendor.findOne({
      ownerUser: decoded.userId,
    }).lean();
    if (existingVendor) {
      return jsonResponse(
        { success: false, error: "You already have a vendor application" },
        409
      );
    }

    const vendor = await Vendor.create({
      ownerUser: decoded.userId,
      storeName: body.storeName,
      email: body.email,
      description: body.description || "",
      logoUrl: body.logoUrl || "",
      bannerUrl: body.bannerUrl || "",
      settings: {
        shippingPolicy: body.shippingPolicy || "",
        returnPolicy: body.returnPolicy || "",
        supportEmail: body.supportEmail || body.email,
      },
    });

    return jsonResponse(
      {
        success: true,
        data: vendor,
        message: "Vendor application submitted successfully",
      },
      201
    );
  } catch (error) {
    console.error("Vendor application error:", error);

    if (error instanceof mongoose.Error.ValidationError) {
      return jsonResponse(
        { success: false, error: "Invalid data provided" },
        400
      );
    }

    return jsonResponse({ success: false, error: "Server error" }, 500);
  }
}
