import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

// ✅ Get single product (public)
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const product = await Product.findById(params.id).populate("vendor", "storeName");
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json(product, { status: 200 });
  } catch (err) {
    console.error("Error fetching product", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ Update product (vendor who owns it OR admin)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();

    const product = await Product.findByIdAndUpdate(params.id, body, { new: true });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json(product, { status: 200 });
  } catch (err) {
    console.error("Error updating product", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ Delete product (vendor who owns it OR admin)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const product = await Product.findByIdAndDelete(params.id);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error deleting product", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
