import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Vendor from "@/models/Vendor";

// ✅ Get vendor by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const vendor = await Vendor.findById(params.id).populate("owner", "name email");
    if (!vendor) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });

    return NextResponse.json(vendor, { status: 200 });
  } catch (err) {
    console.error("Error fetching vendor", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ Update vendor (admin approves/rejects or vendor updates store details)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();

    const vendor = await Vendor.findByIdAndUpdate(params.id, body, { new: true });
    if (!vendor) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });

    return NextResponse.json(vendor, { status: 200 });
  } catch (err) {
    console.error("Error updating vendor", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ Delete vendor (admin only)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const vendor = await Vendor.findByIdAndDelete(params.id);
    if (!vendor) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });

    return NextResponse.json({ message: "Vendor deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error deleting vendor", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
