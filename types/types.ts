export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
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
  products?: Product[];
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
