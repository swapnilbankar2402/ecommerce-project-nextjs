import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

// ✅ Get single order
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const order = await Order.findById(params.id)
      .populate("products.product", "title price images")
      .populate("vendor", "storeName")
      .populate("customer", "name email");
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    return NextResponse.json(order, { status: 200 });
  } catch (err) {
    console.error("Error fetching order", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ Update order status (vendor or admin)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    const { status } = body;

    const order = await Order.findByIdAndUpdate(params.id, { status }, { new: true });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // TODO: Emit real-time update via Socket.io (notify customer & vendor)

    return NextResponse.json(order, { status: 200 });
  } catch (err) {
    console.error("Error updating order", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ Cancel order (customer before shipped)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const order = await Order.findByIdAndDelete(params.id);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // TODO: Refund logic (if payment was captured)
    // TODO: Emit real-time cancellation event

    return NextResponse.json({ message: "Order cancelled" }, { status: 200 });
  } catch (err) {
    console.error("Error cancelling order", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
