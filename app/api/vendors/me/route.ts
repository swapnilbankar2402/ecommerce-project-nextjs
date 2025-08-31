import { verifyAccessToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { getTokenFromRequest, jsonResponse } from "@/lib/helper-functions";
import Vendor from "@/models/Vendor";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    console.log("api working start :");
    const token = await getTokenFromRequest(request);
    console.log("token :", token);

    if (!token) {
      return jsonResponse(
        { success: false, error: "Authentication required" },
        401
      );
    }

    const decoded = await verifyAccessToken(token);
    console.log("decoded :", decoded);

    if (!decoded || typeof decoded !== "object" || !("userId" in decoded)) {
      return jsonResponse({ success: false, error: "Invalid token" }, 401);
    }

    await connectDB();

    // Find vendor by owner user ID
    const vendor = await Vendor.findOne({ ownerUser: decoded.userId })
      // .populate("ownerUser", "name email") // Optional: populate user details
      .exec();

    console.log("vendor ::", vendor);

    if (!vendor) {
      return jsonResponse({ success: false, error: "Vendor not found" }, 404);
    }

    return jsonResponse({ success: true, data: vendor });
  } catch (error) {
    // if (error instanceof mongoose.Error.ValidationError) {
    //   return jsonResponse(
    //     { success: false, error: "Invalid data provided" },
    //     400
    //   );
    // }

    return jsonResponse({ success: false, error: "Server error" }, 500);
  }
}
