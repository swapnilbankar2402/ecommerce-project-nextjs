'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
// import { ProductCard } from '@/components/ProductCard';
// import { ProductFilters } from '@/components/ProductFilters';
import { products } from '@/data/products';
import { Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import { ProductFilters } from '@/components/product-filters';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categoryParam || null
  );
  const [sortOption, setSortOption] = useState('featured');

  // Get unique categories
  const categories = useMemo(() => {
    const cats = products.map(p => p.category);
    return Array.from(new Set(cats));
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    // Filter by category
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    // Sort products
    switch (sortOption) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Featured - no specific sorting
        break;
    }
    
    return result;
  }, [selectedCategory, sortOption]);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Filters Sidebar */}
      <aside className="md:w-64 flex-shrink-0">
        <ProductFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onSortChange={setSortOption}
        />
      </aside>

      {/* Products Grid */}
      <div className="flex-grow">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            {selectedCategory ? `${selectedCategory} Products` : 'All Products'}
          </h1>
          <p className="text-muted-foreground">
            {filteredProducts.length} products found
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or browse all products
            </p>
            <Button onClick={() => setSelectedCategory(null)}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}