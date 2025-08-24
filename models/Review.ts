import mongoose, { Schema, InferSchemaType, models } from "mongoose";
import { toJSONPlugin } from "./plugins/toJSON";

const ReviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
  vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: true, index: true },
  rating: { type: Number, min: 1, max: 5, required: true, index: true },
  title: String,
  body: String,
  isVerifiedPurchase: { type: Boolean, default: false },
}, { timestamps: true });

ReviewSchema.index({ product: 1, user: 1 }, { unique: true }); // one review per user per product
toJSONPlugin(ReviewSchema);

export type ReviewDoc = InferSchemaType<typeof ReviewSchema>;
export default models.Review || mongoose.model("Review", ReviewSchema);
