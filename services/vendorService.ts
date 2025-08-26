import Vendor from "@/models/Vendor";

export const vendorService = {
  async createVendor(data: any) {
    try {
      const vendor = new Vendor(data);
      return {
        success: true,
        message: "Vendor application submitted successfully!",
        data: { vendor: await vendor.save() },
      };
    } catch (error) {
      return error;
    }
  },
};
