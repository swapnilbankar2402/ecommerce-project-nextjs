import mongoose, { Schema, InferSchemaType, models } from "mongoose";
import { toJSONPlugin } from "./plugins/toJSON";

export const AddressSchema = new Schema(
  {
    fullName: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },
    phone: { type: String },
  },
  { _id: false }
);

const AddressModelSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", index: true },
    ...AddressSchema.obj,
  },
  { timestamps: true }
);

toJSONPlugin(AddressModelSchema);

export type AddressDoc = InferSchemaType<typeof AddressModelSchema>;
export default models.Address || mongoose.model("Address", AddressModelSchema);
