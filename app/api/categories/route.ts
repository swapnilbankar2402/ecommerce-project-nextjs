import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import { jsonResponse } from "@/lib/helper-functions";

// Get all categories
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    // Fetch categories with pagination
    const categories = await Category.find({ isActive: true })
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Category.countDocuments({ isActive: true });

    return jsonResponse(
      {
        success: true,
        data: categories,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      200
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return jsonResponse({ success: false, error: "Server error" }, 500);
  }
}

// Create new category
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const category = new Category(body);
    await category.save();

    return jsonResponse(
      {
        success: true,
        data: category,
        message: "Category created successfully",
      },
      201
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return jsonResponse({ success: false, error: "Server error" }, 500);
  }
}
