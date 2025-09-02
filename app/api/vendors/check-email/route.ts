import { connectDB } from "@/lib/db";
import { jsonResponse } from "@/lib/helper-functions";
import Vendor from "@/models/Vendor";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return jsonResponse(
        { success: false, message: "Email parameter is required" },
        400
      );
    }

    // Find vendor by email
    const vendor = await Vendor.findOne({ email }).select("-password");

    if (vendor) {
      return jsonResponse({ success: true, exists: true, vendor });
    } else {
      return jsonResponse({ success: true, exists: false });
    }
  } catch (error) {
    console.error("Error checking vendor email:", error);
    return jsonResponse(
      { success: true, message: "Internal server error" },
      500
    );
  }
}
