import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Vendor from "@/models/Vendor";
import { jsonResponse } from "@/lib/helper-functions";

// Get all products
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    const vendor = searchParams.get("vendor");
    const category = searchParams.get("category");
    const search = searchParams.get("q");

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const query: any = {};
    if (vendor) query.vendor = vendor;
    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: "i" };

    const products = await Product.find(query)
      .populate("vendor", "storeName status", "category", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    // .limit(50)
    // .lean();

    const total = await Product.countDocuments();

    return jsonResponse(
      {
        success: true,
        data: products,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      200
    );
  } catch (err) {
    console.error("Error fetching products", err);
    return jsonResponse({ success: false, error: "Server error" }, 500);
  }
}

// Create new product
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const product = new Product(body);
    await product.save();

    return jsonResponse(
      {
        success: true,
        data: product,
        message: "Product created successfully",
      },
      201
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return jsonResponse({ success: false, error: "Server error" }, 500);
  }
}
