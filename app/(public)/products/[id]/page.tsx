'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { products } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/lib/cart';
import { Star, Minus, Plus, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const product = products.find(p => p.id === params.id);

  if (!product) {
    notFound();
  }

  // Generate additional product images (for demo purposes)
  const productImages = [
    product.image,
    `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60`,
    `https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop&q=60`,
    `https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&auto=format&fit=crop&q=60`,
  ];

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-muted-foreground mb-6">
        <a href="/" className="hover:text-foreground">Home</a>
        <span className="mx-2">/</span>
        <a href="/products" className="hover:text-foreground">Products</a>
        <span className="mx-2">/</span>
        <a href={`/products?category=${product.category.toLowerCase()}`} className="hover:text-foreground">
          {product.category}
        </a>
        <span className="mx-2">/</span>
        <span className="text-foreground truncate max-w-xs">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square rounded-xl overflow-hidden border">
            <Image
              src={productImages[selectedImageIndex]}
              alt={product.name}
              fill
              className="object-cover"
            />
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Badge variant="destructive" className="text-lg px-4 py-2">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {productImages.map((image, index) => (
              <button
                key={index}
                className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${selectedImageIndex === index ? 'border-primary' : 'border-transparent'
                  }`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <Image
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="text-muted-foreground hover:text-red-500"
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>

            <div className="flex items-center flex-wrap gap-3 mb-4">
              <div className="flex items-center">
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
                  {product.rating} ({Math.floor(Math.random() * 100) + 10} reviews)
                </span>
              </div>

              <Badge variant="outline">{product.category}</Badge>

              {product.inStock ? (
                <Badge variant="secondary" className="text-green-600">In Stock</Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>
          </div>

          <div className="text-3xl font-bold">
            ${product.price.toFixed(2)}
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          {/* Quantity & Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 min-w-[40px] text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(q => q + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="flex-1"
                size="lg"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button variant="outline" size="lg" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Product Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="flex items-center space-x-2 text-sm">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <span>2 Year Warranty</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <RotateCcw className="h-5 w-5 text-muted-foreground" />
              <span>30 Day Returns</span>
            </div>
          </div>

          {/* Product Details Accordion (Mobile) */}
          <div className="lg:hidden pt-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="details">
                <AccordionTrigger>Product Details</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SKU:</span>
                      <span>{product.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span>{product.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Availability:</span>
                      <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Product Information Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Product Description</h3>
                <p className="text-muted-foreground mb-4">
                  {product.description}
                </p>
                <p className="text-muted-foreground">
                  This premium product is designed with the highest quality materials and craftsmanship.
                  It features innovative technology that enhances performance and durability.
                  Perfect for both everyday use and special occasions, this product combines style with functionality.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Brand</span>
                      <span>PremiumBrand</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Model</span>
                      <span>PRO-{product.id}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Dimensions</span>
                      <span>10" x 8" x 3"</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Weight</span>
                      <span>1.5 lbs</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Material</span>
                      <span>Premium Materials</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Color</span>
                      <span>Multiple Options</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Warranty</span>
                      <span>2 Years</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Origin</span>
                      <span>Made in USA</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
                <div className="space-y-6">
                  {/* Sample Reviews */}
                  <div className="border-b pb-6">
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 text-yellow-400 fill-current"
                            />
                          ))}
                        </div>
                        <span className="ml-2 font-medium">John D.</span>
                      </div>
                      <span className="text-sm text-muted-foreground">2 days ago</span>
                    </div>
                    <p className="text-muted-foreground">
                      This product exceeded my expectations! The quality is outstanding and it works exactly as described.
                      Highly recommend to anyone looking for a reliable solution.
                    </p>
                  </div>

                  <div className="border-b pb-6">
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 font-medium">Sarah M.</span>
                      </div>
                      <span className="text-sm text-muted-foreground">1 week ago</span>
                    </div>
                    <p className="text-muted-foreground">
                      Great product overall. The design is sleek and modern. Only minor issue was the packaging,
                      but the product itself is fantastic.
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < 5 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 font-medium">Mike T.</span>
                      </div>
                      <span className="text-sm text-muted-foreground">2 weeks ago</span>
                    </div>
                    <p className="text-muted-foreground">
                      Absolutely love this! It's become an essential part of my daily routine.
                      The build quality is exceptional and it's very user-friendly.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Details Sidebar (Desktop) */}
      <div className="hidden lg:block mt-12">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Product Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">SKU:</span>
                <span>{product.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <span>{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Availability:</span>
                <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Brand:</span>
                <span>PremiumBrand</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Warranty:</span>
                <span>2 Years</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}