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
