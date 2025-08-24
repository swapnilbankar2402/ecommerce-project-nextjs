// import { Button } from "@/components/ui/button";
// import { Product } from "@/types/types";
// import Image from "next/image";
// import Link from "next/link";

// export default async function Home() {

//   let featuredProducts: Product[] = [];
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products?limit=4`);
//     if (res.ok) {
//       featuredProducts = await res.json();
//     } else {
//       console.error("Failed to fetch featured products");
//     }
//   } catch (error) {
//     console.error("Error fetching featured products:", error);
//   }


//   return (
//     <main>
//       <section className="relative min-h-[500px] w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
//         <Image
//           src="/hero-banner.jpg"
//           alt="Hero Banner"
//           fill
//           priority
//           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//           className="absolute inset-0 z-0 object-cover opacity-70"
//         />
//         <div className="relative z-10 text-center p-4">
//           <Link href={'/vendor/become-a-vendor'} >Become A Vendor</Link>
//           <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">Discover Your Next Favorite Item</h1>
//           <p className="text-lg sm:text-xl mb-8">Shop the latest trends and exclusive collections.</p>
//           <Button asChild size="lg">
//             <Link href="/products">Shop Now</Link>
//           </Button>
//         </div>
//       </section>

//       <section className="py-12 px-4 md:px-6 lg:px-8">
//         <div className="container mx-auto">
//           <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Featured Products</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//             {featuredProducts.length > 0 ? (
//               featuredProducts.map((product) => (
//                 // <ProductCard key={product._id} product={product} />
//                 <span>Product</span>
//               ))
//             ) : (
//               <p className="col-span-full text-center text-gray-600 dark:text-gray-400">No featured products found.</p>
//             )}
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }



import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { products } from '@/data/products';
import { ProductCard } from '@/components/product-card';

export default function HomePage() {
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative rounded-xl overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Summer Sale Up to 50% Off
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Discover our latest collection of premium products at unbeatable prices
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/products">Shop Now</Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/categories">Browse Categories</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Button variant="outline" asChild>
            <Link href="/products">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-muted rounded-xl p-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Electronics', 'Clothing', 'Home', 'Footwear'].map((category) => (
            <Link
              key={category}
              href={`/products?category=${category.toLowerCase()}`}
              className="bg-background rounded-lg p-6 text-center hover:shadow-md transition-shadow"
            >
              <div className="h-16 w-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🛍️</span>
              </div>
              <h3 className="font-semibold">{category}</h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
