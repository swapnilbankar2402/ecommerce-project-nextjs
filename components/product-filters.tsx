// 'use client';

// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from '@/components/ui/accordion';
// import { Badge } from '@/components/ui/badge';
// import { X } from 'lucide-react';

// interface ProductFiltersProps {
//   categories: string[];
//   selectedCategory: string | null;
//   onCategoryChange: (category: string | null) => void;
//   onSortChange: (sort: string) => void;
// }

// export function ProductFilters({
//   categories,
//   selectedCategory,
//   onCategoryChange,
//   onSortChange,
// }: ProductFiltersProps) {
//   const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);

//   const sortOptions = [
//     { value: 'featured', label: 'Featured' },
//     { value: 'price-asc', label: 'Price: Low to High' },
//     { value: 'price-desc', label: 'Price: High to Low' },
//     { value: 'rating', label: 'Highest Rated' },
//   ];

//   return (
//     <div className="space-y-6">
//       <div>
//         <h3 className="text-lg font-semibold mb-4">Sort By</h3>
//         <div className="space-y-2">
//           {sortOptions.map((option) => (
//             <Button
//               key={option.value}
//               variant="ghost"
//               className="w-full justify-start"
//               onClick={() => onSortChange(option.value)}
//             >
//               {option.label}
//             </Button>
//           ))}
//         </div>
//       </div>

//       <Accordion type="single" collapsible>
//         <AccordionItem value="categories">
//           <AccordionTrigger className="text-lg font-semibold">
//             Categories
//           </AccordionTrigger>
//           <AccordionContent>
//             <div className="space-y-2">
//               {categories.map((category) => (
//                 <Button
//                   key={category}
//                   variant={selectedCategory === category ? "default" : "ghost"}
//                   className="w-full justify-start"
//                   onClick={() => onCategoryChange(
//                     selectedCategory === category ? null : category
//                   )}
//                 >
//                   {category}
//                 </Button>
//               ))}
//             </div>
//           </AccordionContent>
//         </AccordionItem>

//         <AccordionItem value="price">
//           <AccordionTrigger className="text-lg font-semibold">
//             Price Range
//           </AccordionTrigger>
//           <AccordionContent>
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <span>${priceRange[0]}</span>
//                 <span>${priceRange[1]}</span>
//               </div>
//               <input
//                 type="range"
//                 min="0"
//                 max="500"
//                 value={priceRange[1]}
//                 onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
//                 className="w-full"
//               />
//             </div>
//           </AccordionContent>
//         </AccordionItem>
//       </Accordion>

//       {selectedCategory && (
//         <div className="flex items-center">
//           <Badge variant="secondary" className="mr-2">
//             {selectedCategory}
//           </Badge>
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => onCategoryChange(null)}
//           >
//             <X className="h-4 w-4" />
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }


// components/ProductFilters.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ProductFiltersProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  onSortChange: (sort: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  sortOption: string;
}

export function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  onSortChange,
  priceRange,
  onPriceRangeChange,
  sortOption,
}: ProductFiltersProps) {
  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest' },
  ];

  const handlePriceChange = (index: number, value: number) => {
    const newRange: [number, number] = [...priceRange];
    newRange[index] = value;
    onPriceRangeChange(newRange);
  };

  return (
    <div className="space-y-6">
      {/* Sort By */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Sort By</h3>
        <RadioGroup value={sortOption} onValueChange={onSortChange}>
          {sortOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Categories */}
      <Accordion type="single" collapsible defaultValue="categories">
        <AccordionItem value="categories">
          <AccordionTrigger className="text-lg font-semibold">
            Categories
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => onCategoryChange(
                    selectedCategory === category ? null : category
                  )}
                >
                  {category}
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-lg font-semibold">
            Price Range
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="min-price">Min Price</Label>
                  <input
                    id="min-price"
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(0, parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Label htmlFor="max-price">Max Price</Label>
                  <input
                    id="max-price"
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(1, parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}