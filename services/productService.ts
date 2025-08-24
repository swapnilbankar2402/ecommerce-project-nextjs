import Product from "@/models/Product";

export const productService = {
  async getProducts(filters = {}) {
    return await Product.find(filters).limit(50).lean();
  },

  async createProduct(data: any) {
    const product = new Product(data);
    return await product.save();
  },

  async updateProduct(id: string, data: any) {
    return await Product.findByIdAndUpdate(id, data, { new: true });
  },
};
