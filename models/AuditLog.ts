import mongoose, { Schema, InferSchemaType, models } from "mongoose";
import { toJSONPlugin } from "./plugins/toJSON";

const AuditLogSchema = new Schema({
  actorUser: { type: Schema.Types.ObjectId, ref: "User", index: true },
  action: { type: String, required: true, index: true }, // e.g., 'product.update'
  targetType: { type: String, required: true },          // 'Product' | 'Order' | 'Vendor'
  targetId: { type: Schema.Types.ObjectId, index: true },
  metadata: Schema.Types.Mixed,
  ip: String,
  userAgent: String,
}, { timestamps: true });

AuditLogSchema.index({ action: 1, createdAt: -1 });
toJSONPlugin(AuditLogSchema);

export type AuditLogDoc = InferSchemaType<typeof AuditLogSchema>;
export default models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);
