import mongoose, { Schema, InferSchemaType, models } from "mongoose";
import { toJSONPlugin } from "./plugins/toJSON";

const PaymentSchema = new Schema(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
      index: true,
    },
    provider: {
      type: String,
      enum: ["stripe", "paypal"],
      required: true,
      index: true,
    },
    providerPaymentId: { type: String, index: true },
    clientSecret: String, // Stripe
    status: {
      type: String,
      enum: ["requires_payment", "succeeded", "failed", "refunded", "void"],
      default: "requires_payment",
      index: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    raw: Schema.Types.Mixed, // provider payload snapshot
  },
  { timestamps: true }
);

toJSONPlugin(PaymentSchema);
export type PaymentDoc = InferSchemaType<typeof PaymentSchema>;
export default models.Payment || mongoose.model("Payment", PaymentSchema);
