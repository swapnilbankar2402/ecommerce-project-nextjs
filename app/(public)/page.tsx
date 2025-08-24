import { Button } from "@/components/ui/button";
import { Product } from "@/types/types";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {

  let featuredProducts: Product[] = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products?limit=4`);
    if (res.ok) {
      featuredProducts = await res.json();
    } else {
      console.error("Failed to fetch featured products");
    }
  } catch (error) {
    console.error("Error fetching featured products:", error);
  }


  return (
    <main>
      <section className="relative min-h-[500px] w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <Image
          src="/hero-banner.jpg"
          alt="Hero Banner"
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="absolute inset-0 z-0 object-cover opacity-70"
        />
        <div className="relative z-10 text-center p-4">
          <Link href={'/vendor/become-a-vendor'} >Become A Vendor</Link>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">Discover Your Next Favorite Item</h1>
          <p className="text-lg sm:text-xl mb-8">Shop the latest trends and exclusive collections.</p>
          <Button asChild size="lg">
            <Link href="/products">Shop Now</Link>
          </Button>
        </div>
      </section>

      <section className="py-12 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                // <ProductCard key={product._id} product={product} />
                <span>Product</span>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-600 dark:text-gray-400">No featured products found.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
