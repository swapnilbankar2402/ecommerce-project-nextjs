'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { products } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/lib/cart';
import { Star, Minus, Plus } from 'lucide-react';
import { useState } from 'react';

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === params.id);

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Product Image */}
      <div className="relative h-96 md:h-full rounded-xl overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="space-y-6">
        <div>
          <div className="flex items-start justify-between">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <Badge variant="outline">{product.category}</Badge>
          </div>
          <div className="flex items-center mt-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                    }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground ml-2">
              {product.rating} (24 reviews)
            </span>
          </div>
        </div>

        <div className="text-3xl font-bold">
          ${product.price.toFixed(2)}
        </div>

        <p className="text-muted-foreground">{product.description}</p>

        <div className="flex items-center space-x-4">
          <span className="font-medium">Quantity:</span>
          <div className="flex items-center border rounded">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="px-4 py-2">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setQuantity(q => q + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            className="w-full"
            size="lg"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
          <Button variant="outline" className="w-full" size="lg">
            Add to Wishlist
          </Button>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-2">Product Details</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>Category: {product.category}</li>
            <li>In Stock: {product.inStock ? 'Yes' : 'No'}</li>
            <li>SKU: {product.id}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}