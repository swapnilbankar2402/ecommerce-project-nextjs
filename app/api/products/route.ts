// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import { productService } from "@/services/productService";

// export async function GET() {
//   await connectDB();
//   const products = await productService.getProducts({});
//   return NextResponse.json(products);
// }

// export async function POST(req: Request) {
//   await connectDB();
//   const body = await req.json();
//   const product = await productService.createProduct(body);
//   return NextResponse.json(product, { status: 201 });
// }


import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Vendor from "@/models/Vendor";

// ✅ Get all products (public, with filters)
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const vendor = searchParams.get("vendor");
    const category = searchParams.get("category");
    const search = searchParams.get("q");

    const query: any = {};
    if (vendor) query.vendor = vendor;
    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: "i" };

    const products = await Product.find(query)
      .populate("vendor", "storeName status")
      .limit(50)
      .lean();

    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.error("Error fetching products", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ Create new product (vendor only)
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { vendor, title, description, price, images, category, stock } = body;

    // Ensure vendor exists & is approved
    const vendorExists = await Vendor.findById(vendor);
    if (!vendorExists || vendorExists.status !== "approved") {
      return NextResponse.json({ error: "Vendor not approved or not found" }, { status: 400 });
    }

    const product = await Product.create({
      vendor,
      title,
      description,
      price,
      images,
      category,
      stock,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error("Error creating product", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
