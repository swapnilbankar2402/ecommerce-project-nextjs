import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Vendor from "@/models/Vendor";

// ✅ Get all vendors (admin)
export async function GET() {
  try {
    await connectDB();
    const vendors = await Vendor.find({}).populate("owner", "name email");
    return NextResponse.json(vendors, { status: 200 });
  } catch (err) {
    console.error("Error fetching vendors", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ Create new vendor request (customer applying to become vendor)
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    console.log("body :", body)
    const { owner, storeName, description, logo } = body;

    // Prevent duplicate vendor request
    const existing = await Vendor.findOne({ owner });
    if (existing) {
      return NextResponse.json({ error: "Vendor already exists for this user" }, { status: 400 });
    }

    const vendor = await Vendor.create({
      owner,
      storeName,
      description,
      logo,
      status: "pending"
    });

    // return NextResponse.json(vendor, { status: 201 });
  } catch (err) {
    console.error("Error creating vendor", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
