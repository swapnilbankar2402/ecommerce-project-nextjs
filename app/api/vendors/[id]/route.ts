import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Vendor from "@/models/Vendor";
import User from "@/models/User"; // 👈 important import
import { jsonResponse } from "@/lib/helper-functions";

// Get vendor by ID
export async function GET(
  req: Request,
  // { params }: { params: { id: string } }
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;

    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return jsonResponse(
        {
          error: "Vendor not found",
        },
        404
      );
    }

    // Manually populate ownerUser
    const ownerUser = await User.findById(vendor.ownerUser).select(
      "name email"
    );

    // Combine the data
    const vendorData = {
      ...vendor.toObject(),
      ownerUser,
    };

    return jsonResponse(
      {
        success: true,
        data: vendorData,
        message: "Vendor fetched successfully",
      },
      200
    );
  } catch (err) {
    console.error("Error fetching vendor", err);
    return jsonResponse({ success: false, error: "Server error" }, 500);
  }
}

// Update vendor (admin approves/rejects or vendor updates store details)
export async function PUT(
  req: Request,
  // { params }: { params: { id: string } }
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;

    const body = await req.json();

    const vendor = await Vendor.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!vendor) {
      return jsonResponse(
        {
          error: "Vendor not found",
        },
        404
      );
    }

    return jsonResponse(
      {
        success: true,
        data: vendor,
        message: "Vendor updated successfully",
      },
      200
    );
  } catch (err) {
    console.error("Error updating vendor", err);
    return jsonResponse({ success: false, error: "Server error" }, 500);
  }
}

// Delete vendor (admin only)
export async function DELETE(
  req: Request,
  // { params }: { params: { id: string } }
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const vendor = await Vendor.findByIdAndDelete(id);

    if (!vendor) {
      return jsonResponse(
        {
          error: "Vendor not found",
        },
        404
      );
    }

    return jsonResponse(
      {
        success: true,
        message: "Vendor deleted successfully",
      },
      200
    );
  } catch (err) {
    console.error("Error deleting vendor", err);
    return jsonResponse({ success: false, error: "Server error" }, 500);
  }
}
