// // 'use client';

// // import Image from 'next/image';
// // import { Product } from '@/data/products';
// // import { Button } from '@/components/ui/button';
// // import { Card, CardContent, CardFooter } from '@/components/ui/card';
// // import { Badge } from '@/components/ui/badge';
// // import { useCart } from '@/lib/cart';
// // import { Star } from 'lucide-react';

// // interface ProductCardProps {
// //     product: Product;
// // }

// // export function ProductCard({ product }: ProductCardProps) {
// //     const { addItem } = useCart();

// //     return (
// //         <Card className="overflow-hidden h-full flex flex-col">
// //             <div className="relative h-48 overflow-hidden">
// //                 <Image
// //                     src={product.image}
// //                     alt={product.name}
// //                     fill
// //                     className="object-cover"
// //                 />
// //                 {!product.inStock && (
// //                     <Badge variant="destructive" className="absolute top-2 right-2">
// //                         Out of Stock
// //                     </Badge>
// //                 )}
// //             </div>
// //             <CardContent className="p-4 flex-grow">
// //                 <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
// //                 <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
// //                     {product.description}
// //                 </p>
// //                 <div className="flex items-center mb-2">
// //                     <div className="flex">
// //                         {[...Array(5)].map((_, i) => (
// //                             <Star
// //                                 key={i}
// //                                 className={`h-4 w-4 ${i < Math.floor(product.rating)
// //                                         ? 'text-yellow-400 fill-current'
// //                                         : 'text-gray-300'
// //                                     }`}
// //                             />
// //                         ))}
// //                     </div>
// //                     <span className="text-sm text-muted-foreground ml-2">
// //                         {product.rating}
// //                     </span>
// //                 </div>
// //                 <div className="flex items-center justify-between">
// //                     <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
// //                     <Badge variant="outline">{product.category}</Badge>
// //                 </div>
// //             </CardContent>
// //             <CardFooter className="p-4 pt-0">
// //                 <Button
// //                     className="w-full"
// //                     onClick={() => addItem(product)}
// //                     disabled={!product.inStock}
// //                 >
// //                     {product.inStock ? 'Add to Cart' : 'Out of Stock'}
// //                 </Button>
// //             </CardFooter>
// //         </Card>
// //     );
// // }


// // components/ProductCard.tsx

// 'use client';

// import Image from 'next/image';
// import { Product } from '@/data/products';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardFooter } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { useCart } from '@/lib/cart';
// import { Star, Heart } from 'lucide-react';
// import { useState } from 'react';

// interface ProductCardProps {
//   product: Product;
// }

// export function ProductCard({ product }: ProductCardProps) {
//   const { addItem } = useCart();
//   const [isWishlisted, setIsWishlisted] = useState(false);

//   return (
//     <Card className="overflow-hidden h-full flex flex-col group hover:shadow-lg transition-shadow">
//       <div className="relative h-48 overflow-hidden">
//         <Image
//           src={product.image}
//           alt={product.name}
//           fill
//           className="object-cover group-hover:scale-105 transition-transform duration-300"
//         />
        
//         {/* Product Badges */}
//         <div className="absolute top-2 left-2 flex flex-col gap-1">
//           {!product.inStock && (
//             <Badge variant="destructive">Out of Stock</Badge>
//           )}
//           {product.rating >= 4.5 && (
//             <Badge variant="secondary">Best Seller</Badge>
//           )}
//         </div>
        
//         {/* Wishlist Button */}
//         <Button
//           variant="ghost"
//           size="icon"
//           className="absolute top-2 right-2 bg-white/80 hover:bg-white"
//           onClick={() => setIsWishlisted(!isWishlisted)}
//         >
//           <Heart 
//             className={`h-4 w-4 ${isWishlisted ? 'text-red-500 fill-current' : ''}`} 
//           />
//         </Button>
//       </div>
      
//       <CardContent className="p-4 flex-grow">
//         <div className="flex justify-between items-start mb-2">
//           <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
//           <Badge variant="outline" className="text-xs">{product.category}</Badge>
//         </div>
        
//         <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
//           {product.description}
//         </p>
        
//         {/* Rating */}
//         <div className="flex items-center mb-3">
//           <div className="flex">
//             {[...Array(5)].map((_, i) => (
//               <Star
//                 key={i}
//                 className={`h-4 w-4 ${
//                   i < Math.floor(product.rating)
//                     ? 'text-yellow-400 fill-current'
//                     : 'text-gray-300'
//                 }`}
//               />
//             ))}
//           </div>
//           <span className="text-sm text-muted-foreground ml-2">
//             {product.rating} ({Math.floor(Math.random() * 100) + 10})
//           </span>
//         </div>
        
//         <div className="flex items-center justify-between">
//           <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
//           {product.inStock ? (
//             <span className="text-green-600 text-sm font-medium">In Stock</span>
//           ) : (
//             <span className="text-red-600 text-sm font-medium">Out of Stock</span>
//           )}
//         </div>
//       </CardContent>
      
//       <CardFooter className="p-4 pt-0">
//         <Button 
//           className="w-full" 
//           onClick={() => addItem(product)}
//           disabled={!product.inStock}
//         >
//           {product.inStock ? 'Add to Cart' : 'Out of Stock'}
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// }



'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/lib/cart';
import { Star, Heart } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <Card className="overflow-hidden h-full flex flex-col group hover:shadow-lg transition-shadow">
      {/* Wrap only the image + content with Link */}
      <Link href={`/products/${product.id}`} className="flex flex-col flex-grow">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Product Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {!product.inStock && <Badge variant="destructive">Out of Stock</Badge>}
            {product.rating >= 4.5 && <Badge variant="secondary">Best Seller</Badge>}
          </div>
        </div>

        <CardContent className="p-4 flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
            <Badge variant="outline" className="text-xs">{product.category}</Badge>
          </div>

          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground ml-2">
              {product.rating} ({Math.floor(Math.random() * 100) + 10})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
            {product.inStock ? (
              <span className="text-green-600 text-sm font-medium">In Stock</span>
            ) : (
              <span className="text-red-600 text-sm font-medium">Out of Stock</span>
            )}
          </div>
        </CardContent>
      </Link>

      {/* Actions (outside the link so they don’t trigger navigation) */}
      <div className="absolute top-2 right-2">
        <Button
          variant="ghost"
          size="icon"
          className="bg-white/80 hover:bg-white"
          onClick={(e) => {
            e.preventDefault(); // stop navigation
            setIsWishlisted(!isWishlisted);
          }}
        >
          <Heart
            className={`h-4 w-4 ${isWishlisted ? 'text-red-500 fill-current' : ''}`}
          />
        </Button>
      </div>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={(e) => {
            e.preventDefault(); // stop navigation
            addItem(product);
          }}
          disabled={!product.inStock}
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardFooter>
    </Card>
  );
}
