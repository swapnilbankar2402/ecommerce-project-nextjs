import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Vendor from "@/models/Vendor";

// ✅ Get orders (role-based: customer/vendor/admin)
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("user");   // customer or vendor or admin id
    const role = searchParams.get("role");     // "customer" | "vendor" | "admin"

    let filter: any = {};

    if (role === "customer") filter.customer = userId;
    if (role === "vendor") filter.vendor = userId;
    // admin sees all

    const orders = await Order.find(filter)
      .populate("products.product", "title price images")
      .populate("vendor", "storeName")
      .populate("customer", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(orders, { status: 200 });
  } catch (err) {
    console.error("Error fetching orders", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ Place new order (customer)
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { customer, items, vendor, totalAmount, paymentMethod } = body;

    // Validate vendor
    const vendorExists = await Vendor.findById(vendor);
    if (!vendorExists || vendorExists.status !== "approved") {
      return NextResponse.json({ error: "Vendor not found or not approved" }, { status: 400 });
    }

    // Check stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || product.stock < item.quantity) {
        return NextResponse.json({ error: `Out of stock: ${product?.title || "Product"}` }, { status: 400 });
      }
    }

    // Create order
    const order = await Order.create({
      customer,
      vendor,
      products: items,
      totalAmount,
      paymentMethod,
      status: "pending",
    });

    // Deduct stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // TODO: Emit real-time event via Socket.io → notify vendor & customer

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error("Error placing order", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
