// app/api/categories/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import { jsonResponse } from "@/lib/helper-functions";

// Get category by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;

    const category = await Category.findById(id);

    if (!category) {
      return jsonResponse(
        {
          error: "Category not found",
        },
        404
      );
    }

    return jsonResponse(
      {
        success: true,
        data: category,
        message: "Category fetched successfully",
      },
      200
    );
  } catch (err) {
    console.error("Error fetching category", err);
    return jsonResponse({ success: false, error: "Server error" }, 500);
  }
}

// Update category
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await request.json();

    const category = await Category.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!category) {
      return jsonResponse(
        {
          error: "Category not found",
        },
        404
      );
    }

    return jsonResponse(
      {
        success: true,
        data: category,
        message: "Category updated successfully",
      },
      200
    );
  } catch (err) {
    console.error("Error updating category", err);
    return jsonResponse({ success: false, error: "Server error" }, 500);
  }
}

// Delete category
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return jsonResponse(
        {
          error: "Category not found",
        },
        404
      );
    }

    return jsonResponse(
      {
        success: true,
        message: "Category deleted successfully",
      },
      200
    );
  } catch (err) {
    console.error("Error deleting category", err);
    return jsonResponse({ success: false, error: "Server error" }, 500);
  }
}
