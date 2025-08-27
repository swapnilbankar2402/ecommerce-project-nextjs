import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Vendor from "@/models/Vendor";
import { jsonResponse } from "@/lib/helper-functions";

// ✅ Get all vendors (admin)
// export async function GET() {
//   try {
//     await connectDB();
//     const vendors = await Vendor.find({}).populate("ownerUser", "name email");
//     // const vendors = await Vendor.find({}).populate("ownerUser");
//     return jsonResponse({
//       success: true,
//       data: vendors,
//       message: "Vendor application submitted successfully",
//     });
//   } catch (err) {
//     console.error("Error fetching vendors", err);
//     return jsonResponse({ success: false, error: "Server error" }, 500);
//   }
// }

// export async function GET() {
//   try {
//     await connectDB();

//     const vendors = await Vendor.aggregate([
//       {
//         $lookup: {
//           from: "products", // must match MongoDB collection name
//           localField: "_id", // Vendor._id
//           foreignField: "vendor", // Product.vendor (your ref)
//           as: "products",
//         },
//       },
//       {
//         $addFields: {
//           productCount: { $size: "$products" },
//         },
//       },
//       {
//         $project: {
//           products: 0, // don’t return full product array, only count
//         },
//       },
//     ]);

//     return jsonResponse({
//       success: true,
//       data: vendors,
//       message: "Vendors fetched successfully",
//     });
//   } catch (err) {
//     console.error("Error fetching vendors", err);
//     return jsonResponse({ success: false, error: "Server error" }, 500);
//   }
// }

export async function GET() {
  try {
    await connectDB();

    const vendors = await Vendor.aggregate([
      {
        $lookup: {
          from: "products",           // MongoDB collection name
          localField: "_id",          // Vendor._id
          foreignField: "vendor",     // Product.vendor (ref)
          as: "products",
        },
      },
      {
        $lookup: {
          from: "users",              // populate ownerUser
          localField: "ownerUser",
          foreignField: "_id",
          as: "ownerUser",
        },
      },
      { $unwind: "$ownerUser" },       // convert ownerUser array -> object
      {
        $project: {
          "ownerUser.password": 0,    // exclude sensitive fields
          "ownerUser.__v": 0,
          "__v": 0,
        },
      },
    ]);

    return jsonResponse({
      success: true,
      data: vendors,
      message: "Vendors with products fetched successfully",
    });
  } catch (err) {
    console.error("Error fetching vendors", err);
    return jsonResponse({ success: false, error: "Server error" }, 500);
  }
}

// ✅ Create new vendor request (customer applying to become vendor)
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    console.log("body :", body);
    const { owner, storeName, description, logo } = body;

    // Prevent duplicate vendor request
    const existing = await Vendor.findOne({ owner });
    if (existing) {
      return NextResponse.json(
        { error: "Vendor already exists for this user" },
        { status: 400 }
      );
    }

    const vendor = await Vendor.create({
      owner,
      storeName,
      description,
      logo,
      status: "pending",
    });

    // return NextResponse.json(vendor, { status: 201 });
  } catch (err) {
    console.error("Error creating vendor", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
