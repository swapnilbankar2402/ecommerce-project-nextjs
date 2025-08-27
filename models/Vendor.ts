import mongoose, { Schema, InferSchemaType, models } from "mongoose";
import { toJSONPlugin } from "./plugins/toJSON";

const VendorSchema = new Schema(
  {
    ownerUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    storeName: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, index: true },
    description: String,
    logoUrl: String,
    bannerUrl: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "pending",
      index: true,
    },
    // Payments & banking
    stripeAccountId: { type: String, index: true },
    paypalMerchantId: { type: String, index: true },
    // Preferences
    settings: {
      shippingPolicy: String,
      returnPolicy: String,
      supportEmail: String,
    },
  },
  { timestamps: true }
);

VendorSchema.pre("validate", function (next) {
  if (!this.slug && this.storeName) {
    this.slug = this.storeName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

toJSONPlugin(VendorSchema);
VendorSchema.index({ storeName: "text", description: "text" });

export type VendorDoc = InferSchemaType<typeof VendorSchema>;
export default models.Vendor || mongoose.model("Vendor", VendorSchema);
