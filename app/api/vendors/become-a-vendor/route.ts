import { verifyAccessToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Vendor from "@/models/Vendor";
import { vendorService } from "@/services/vendorService";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: Request) {
//   await connectDB();
//   const body = await req.json();
//   const vendor = await vendorService.createVendor(body);
//   return NextResponse.json(vendor, { status: 201 });
// }

interface VendorRequestBody {
  storeName: string;
  email: string;
  description: string;
  logoUrl?: string;
  bannerUrl?: string;
  shippingPolicy: string;
  returnPolicy: string;
  supportEmail: string;
  slug: string;
  ownerUser: string;
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization");
    // console.log("authHeader :", authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);

    console.log("decoded first :::", decoded);

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    await connectDB();

    const body: VendorRequestBody = await request.json();

    console.log("decoded :::", decoded);

    // Check if user exists
    // const user = await User.findById(decoded.userId);
    // if (!user) {
    //   return NextResponse.json(
    //     { success: false, error: "User not found" },
    //     { status: 404 }
    //   );
    // }

    // // Check if user already has a vendor application
    // const existingVendor = await Vendor.findOne({ ownerUser: user._id });
    // if (existingVendor) {
    //   return NextResponse.json(
    //     { success: false, error: "You already have a vendor application" },
    //     { status: 409 }
    //   );
    // }

    // // Create new vendor
    // const newVendor = new Vendor({
    //   ...body,
    //   ownerUser: user._id,
    //   email: body.email || user.email,
    // });

    // await newVendor.save();

    // return NextResponse.json(
    //   {
    //     success: true,
    //     message: "Vendor application submitted successfully",
    //     vendor: {
    //       id: newVendor._id.toString(),
    //       storeName: newVendor.storeName,
    //       slug: newVendor.slug,
    //       status: newVendor.status,
    //     },
    //   },
    //   { status: 201 }
    // );
  } catch (error) {
    console.error("Vendor application error:", error);

    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { success: false, error: "Invalid data provided" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
