export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
}