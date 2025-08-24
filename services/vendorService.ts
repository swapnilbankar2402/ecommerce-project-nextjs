import Vendor from "@/models/Vendor";

export const vendorService = {
  async createVendor(data: any) {
    const vendor = new Vendor(data);
    return await vendor.save();
  },
};
