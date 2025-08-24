import mongoose, { Schema, InferSchemaType, models } from "mongoose";
import { toJSONPlugin } from "./plugins/toJSON";

const PayoutSchema = new Schema({
  vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: true, index: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "USD" },
  status: { type: String, enum: ["scheduled","paid","failed"], default: "scheduled", index: true },
  provider: { type: String, enum: ["stripe","paypal"], required: true },
  providerPayoutId: { type: String, index: true },
  notes: String,
  settlementAt: Date,
}, { timestamps: true });

toJSONPlugin(PayoutSchema);
export type PayoutDoc = InferSchemaType<typeof PayoutSchema>;
export default models.Payout || mongoose.model("Payout", PayoutSchema);
