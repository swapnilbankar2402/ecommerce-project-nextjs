import mongoose, { Schema, Document, InferSchemaType, models } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: String,
    parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    image: String,
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

CategorySchema.pre("validate", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

export type CategoryDoc = InferSchemaType<typeof CategorySchema>;
export default models.Category || mongoose.model("Category", CategorySchema);