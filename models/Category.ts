import mongoose, { Schema, InferSchemaType, models } from "mongoose";
import { toJSONPlugin } from "./plugins/toJSON";

const CategorySchema = new Schema({
  name: { type: String, required: true, index: true },
  slug: { type: String, required: true, unique: true, index: true },
  parent: { type: Schema.Types.ObjectId, ref: "Category", index: true },
}, { timestamps: true });

CategorySchema.pre("validate", function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
  }
  next();
});

toJSONPlugin(CategorySchema);
export type CategoryDoc = InferSchemaType<typeof CategorySchema>;
export default models.Category || mongoose.model("Category", CategorySchema);
