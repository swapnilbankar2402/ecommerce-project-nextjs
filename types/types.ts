export interface CategoryType {
  _id: string;
  name: string;
}

export interface VariantType {
  sku: string;
  title: string;
  options: any;
  compareAtPrice: number;
  stock: number;
  barcode: string;
  weight: number;
  images: string[];
  _id: string;
}
export interface ProductType {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  category: CategoryType;
  tags: string[];
  status: string;
  basePrice: number;
  currency: string;
  variants: VariantType[];
  ratingAverage: number;
  ratingCount: number;
  seo: {
    title: string;
    description: string;
  };
}

export interface UserType {
  _id: string;
  name: string;
  email: string;
  roles: string[];
  isActive: boolean;
}

export interface VendorType {
  _id: string;
  phone: string;
  location: string;
  ownerUser: UserType;
  storeName: string;
  slug: string;
  email: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  status: string;
  products?: ProductType[];
  // Payments & banking
  stripeAccountId: string;
  paypalMerchantId: string;
  // Preferences
  settings: {
    shippingPolicy: string;
    returnPolicy: string;
    supportEmail: string;
  };
  createdAt: string;
  updatedAt: string;
}
