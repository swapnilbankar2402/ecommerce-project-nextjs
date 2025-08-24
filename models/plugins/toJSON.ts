import { Schema } from "mongoose";

/** Clean _id/__v and include id virtual */
export function toJSONPlugin(schema: Schema) {
  schema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => {
      ret.id = ret._id?.toString();
      delete ret._id;
      return ret;
    },
  });
}
