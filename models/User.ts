import mongoose, { Schema, InferSchemaType, models } from "mongoose";
import bcrypt from "bcryptjs";
import { toJSONPlugin } from "./plugins/toJSON";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true }, // 🔐 store hashed password only
    avatarUrl: String,

    // Roles: user can be multiple things at once
    roles: {
      type: [String],
      enum: ["customer", "vendor", "admin"],
      default: ["customer"], // everyone starts as customer
    },
    // Security
    isActive: { type: Boolean, default: true },
    lastLogin: Date,
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};


toJSONPlugin(UserSchema);

export type UserDoc = InferSchemaType<typeof UserSchema>;
export default models.User || mongoose.model("User", UserSchema);
