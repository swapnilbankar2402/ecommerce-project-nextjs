import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { jsonResponse } from "@/lib/helper-functions";
import Vendor from "@/models/Vendor";

// ✅ Get single product (public)
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;

    const product = await Product.findById(id);
    if (!product) {
      return jsonResponse(
        {
          error: "Product not found",
        },
        404
      );
    }

    // Manually populate ownerUser
    const venderInfo = await Vendor.findById(product.vendor).select(
      "storeName"
    );

    // Combine the data
    const productData = {
      ...product.toObject(),
      venderInfo,
    };

    return jsonResponse(
      {
        success: true,
        data: productData,
        message: "Products fetched successfully",
      },
      200
    );
  } catch (err) {
    console.error("Error fetching product", err);
    return jsonResponse({ success: false, error: "Server error" }, 500);
  }
}

// ✅ Update product (vendor who owns it OR admin)
export async function PUT(
  req: Request,
  // { params }: { params: { id: string } }
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;

    const body = await req.json();

    const product = await Product.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!product) {
      return jsonResponse(
        {
          error: "Product not found",
        },
        404
      );
    }

    return jsonResponse(
      {
        success: true,
        data: product,
        message: "Product updated successfully",
      },
      200
    );
  } catch (err) {
    console.error("Error updating product", err);
    return jsonResponse({ success: false, error: "Server error" }, 500);
  }
}

// Delete product (vendor who owns it OR admin)
export async function DELETE(
  req: Request,
  // { params }: { params: { id: string } }
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return jsonResponse(
        {
          error: "Product not found",
        },
        404
      );
    }

    return jsonResponse(
      {
        success: true,
        message: "Product deleted successfully",
      },
      200
    );
  } catch (err) {
    console.error("Error deleting product", err);
    return jsonResponse({ success: false, error: "Server error" }, 500);

    // return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
