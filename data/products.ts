export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  inStock: boolean;
  rating: number;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 99.99,
    description: "Premium noise-cancelling headphones with 30hr battery",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    inStock: true,
    rating: 4.5
  },
  {
    id: "2",
    name: "Running Shoes",
    price: 129.99,
    description: "Lightweight running shoes with extra cushioning",
    category: "Footwear",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
    inStock: true,
    rating: 4.2
  },
  {
    id: "3",
    name: "Coffee Maker",
    price: 79.99,
    description: "Programmable coffee maker with thermal carafe",
    category: "Home",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500",
    inStock: false,
    rating: 4.7
  },
  // Add more products as needed
];