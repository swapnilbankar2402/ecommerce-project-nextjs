'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { products } from '@/data/products';
import { Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Filter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ProductFilters } from '@/components/product-filters';
import { ProductCard } from '@/components/product-card';
import NavigationTabs from '@/components/navigation-tabs';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categoryParam || null
  );
  const [sortOption, setSortOption] = useState('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = products.map(p => p.category);
    return Array.from(new Set(cats));
  }, []);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filter by price range
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

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
      case 'newest':
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
      default:
        // Featured - no specific sorting
        break;
    }

    setFilteredProducts(result);
  }, [selectedCategory, sortOption, priceRange]);

  const clearAllFilters = () => {
    setSelectedCategory(null);
    setSortOption('featured');
    setPriceRange([0, 500]);
  };

  const hasActiveFilters = selectedCategory || priceRange[0] > 0 || priceRange[1] < 500;

  return (
    <>

      <NavigationTabs />


      <div className="container mx-auto md:p-2">
        {/* Page Header */}
        {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        </div> */}

        {/* Mobile Filter Button */}
        <div className="sm:hidden flex justify-between items-center gap-2 w-full">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 w-1/2">
                <Filter className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1">Active</Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFilterOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <ProductFilters
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                onSortChange={setSortOption}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                sortOption={sortOption}
              />

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={clearAllFilters}
                >
                  Clear All Filters
                </Button>
              )}
            </SheetContent>
          </Sheet>

          {/* Sort Dropdown (Mobile) */}
          <div className='w-1/2' >
            <select
              className="p-2 border rounded-md"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>


        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedCategory && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {selectedCategory}
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="ml-1 rounded-full hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {(priceRange[0] > 0 || priceRange[1] < 500) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                ${priceRange[0]} - ${priceRange[1]}
                <button
                  onClick={() => setPriceRange([0, 500])}
                  className="ml-1 rounded-full hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-6 px-2 text-xs"
            >
              Clear All
            </Button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Filters Sidebar (Desktop) */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
            {/* <div className=""> */}
              <ProductFilters
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                onSortChange={setSortOption}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                sortOption={sortOption}
              />

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={clearAllFilters}
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-grow">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or browse all products
                </p>
                <Button onClick={clearAllFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>

  );
}