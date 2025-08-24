import mongoose, { Schema, InferSchemaType, models } from "mongoose";
import { toJSONPlugin } from "./plugins/toJSON";

const NotificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", index: true },   // recipient
  vendor: { type: Schema.Types.ObjectId, ref: "Vendor", index: true },// or for vendor teams
  type: { type: String, enum: ["order_update","payout_update","system"], required: true, index: true },
  title: String,
  message: String,
  readAt: Date,
  meta: Schema.Types.Mixed,
}, { timestamps: true });

NotificationSchema.index({ user: 1, createdAt: -1 });
toJSONPlugin(NotificationSchema);

export type NotificationDoc = InferSchemaType<typeof NotificationSchema>;
export default models.Notification || mongoose.model("Notification", NotificationSchema);
