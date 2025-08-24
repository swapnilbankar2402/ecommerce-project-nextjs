import mongoose, { Schema, InferSchemaType, models } from "mongoose";
import { toJSONPlugin } from "./plugins/toJSON";

const VariantSchema = new Schema(
  {
    sku: { type: String, required: true, index: true },
    title: { type: String }, // e.g., "Red / M"
    options: { type: Map, of: String }, // { color: 'Red', size: 'M' }
    price: { type: Number, required: true },
    compareAtPrice: Number,
    stock: { type: Number, default: 0, index: true },
    barcode: String,
    weight: Number,
    images: [String],
  },
  { _id: true }
);

const ProductSchema = new Schema(
  {
    vendor: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },
    title: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: String,
    images: [String], // S3 URLs
    category: { type: Schema.Types.ObjectId, ref: "Category", index: true },
    tags: [{ type: String, index: true }],
    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "draft",
      index: true,
    },
    basePrice: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    variants: [VariantSchema], // optional for non-variant products
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    // SEO
    seo: {
      title: String,
      description: String,
    },
  },
  { timestamps: true }
);

ProductSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

ProductSchema.index({ title: "text", description: "text", tags: "text" });
toJSONPlugin(ProductSchema);

export type ProductDoc = InferSchemaType<typeof ProductSchema>;
export default models.Product || mongoose.model("Product", ProductSchema);
