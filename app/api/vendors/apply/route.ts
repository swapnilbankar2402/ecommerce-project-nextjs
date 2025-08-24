import { connectDB } from "@/lib/db";
import { vendorService } from "@/services/vendorService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const vendor = await vendorService.createVendor(body);
  return NextResponse.json(vendor, { status: 201 });
}
