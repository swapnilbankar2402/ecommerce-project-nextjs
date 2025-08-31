import mongoose, { Schema, InferSchemaType, models } from "mongoose";
import { toJSONPlugin } from "./plugins/toJSON";

// const VendorSchema = new Schema(
//   {
//     email: { type: String, unique: true, required: true, index: true },
//     // Basic vendor info
//     businessName: { type: String },
//     businessType: { type: String, enum: ["individual", "company"] },
//     taxId: String,
//     contact: {
//       name: String,
//       phone: String,
//       email: String,
//     },
//     // Current application data
//     currentApplication: {
//       storeName: { type: String, required: true, index: true },
//       slug: { type: String, required: true, unique: true, index: true },
//       logoUrl: String,
//       bannerUrl: String,
//       phone: { type: String },
//       location: { type: String },
//       description: String,
//       settings: {
//         shippingPolicy: String,
//         returnPolicy: String,
//         supportEmail: String,
//       },
//       verification: {
//         status: { type: String, enum: ["pending", "approved", "rejected"] },
//         documents: [String],
//         notes: String,
//         submittedAt: Date,
//         reviewedAt: Date,
//       },
//       // Payments & banking
//       stripeAccountId: { type: String, index: true },
//       paypalMerchantId: { type: String, index: true },
//     },
//     // Previous applications
//     applicationHistory: [
//       {
//         storeName: { type: String, required: true, index: true },
//         slug: { type: String, required: true, unique: true, index: true },
//         logoUrl: String,
//         bannerUrl: String,
//         phone: { type: String },
//         location: { type: String },
//         description: String,
//         settings: {
//           shippingPolicy: String,
//           returnPolicy: String,
//           supportEmail: String,
//         },
//         verification: {
//           status: { type: String, enum: ["pending", "approved", "rejected"] },
//           documents: [String],
//           notes: String,
//           submittedAt: Date,
//           reviewedAt: Date,
//         },
//         // Payments & banking
//         stripeAccountId: { type: String, index: true },
//         paypalMerchantId: { type: String, index: true },
//       },
//     ],
//     commission: Number,
//     payoutInfo: {
//       method: { type: String, enum: ["bank", "paypal", "stripe"] },
//       accountDetails: Object,
//     },
//   },
//   { timestamps: true }
// );

const VendorSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    businessName: { type: String, required: true },
    businessType: {
      type: String,
      enum: ["individual", "company"],
      required: true,
    },
    taxId: { type: String, required: true },
    contact: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
    currentApplication: {
      storeName: { type: String, required: true },
      storeDescription: { type: String },
      logo: { type: String },
      banner: { type: String },
      policies: {
        shipping: { type: String },
        returns: { type: String },
        warranty: { type: String },
      },
      verification: {
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
        documents: [{ type: String }],
        notes: { type: String },
        submittedAt: { type: Date, default: Date.now },
        reviewedAt: { type: Date },
        reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
      },
    },
    applicationHistory: [
      {
        storeName: { type: String },
        storeDescription: { type: String },
        logo: { type: String },
        banner: { type: String },
        policies: {
          shipping: { type: String },
          returns: { type: String },
          warranty: { type: String },
        },
        verification: {
          status: { type: String, enum: ["pending", "approved", "rejected"] },
          documents: [{ type: String }],
          notes: { type: String },
          submittedAt: { type: Date },
          reviewedAt: { type: Date },
          reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
        },
      },
    ],
    commission: { type: Number, default: 10 },
    payoutInfo: {
      method: { type: String, enum: ["bank", "paypal", "stripe"] },
      accountDetails: { type: mongoose.Schema.Types.Mixed },
    },
  },
  { timestamps: true }
);

toJSONPlugin(VendorSchema);
VendorSchema.index({ storeName: "text", description: "text" });

export type VendorDoc = InferSchemaType<typeof VendorSchema>;
export default models.Vendor || mongoose.model("Vendor", VendorSchema);
