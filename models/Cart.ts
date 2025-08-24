import mongoose, { Schema, InferSchemaType, models } from "mongoose";
import { toJSONPlugin } from "./plugins/toJSON";

const CartItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
  variantId: { type: Schema.Types.ObjectId }, // matches Product.variants._id
  quantity: { type: Number, required: true, min: 1 },
  priceSnapshot: { type: Number, required: true }, // capture price at add time
}, { _id: true });

const CartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
  items: [CartItemSchema],
}, { timestamps: true });

toJSONPlugin(CartSchema);
export type CartDoc = InferSchemaType<typeof CartSchema>;
export default models.Cart || mongoose.model("Cart", CartSchema);
