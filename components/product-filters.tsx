// // 'use client';

// // import { useState } from 'react';
// // import { Button } from '@/components/ui/button';
// // import {
// //   Accordion,
// //   AccordionContent,
// //   AccordionItem,
// //   AccordionTrigger,
// // } from '@/components/ui/accordion';
// // import { Badge } from '@/components/ui/badge';
// // import { X } from 'lucide-react';

// // interface ProductFiltersProps {
// //   categories: string[];
// //   selectedCategory: string | null;
// //   onCategoryChange: (category: string | null) => void;
// //   onSortChange: (sort: string) => void;
// // }

// // export function ProductFilters({
// //   categories,
// //   selectedCategory,
// //   onCategoryChange,
// //   onSortChange,
// // }: ProductFiltersProps) {
// //   const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);

// //   const sortOptions = [
// //     { value: 'featured', label: 'Featured' },
// //     { value: 'price-asc', label: 'Price: Low to High' },
// //     { value: 'price-desc', label: 'Price: High to Low' },
// //     { value: 'rating', label: 'Highest Rated' },
// //   ];

// //   return (
// //     <div className="space-y-6">
// //       <div>
// //         <h3 className="text-lg font-semibold mb-4">Sort By</h3>
// //         <div className="space-y-2">
// //           {sortOptions.map((option) => (
// //             <Button
// //               key={option.value}
// //               variant="ghost"
// //               className="w-full justify-start"
// //               onClick={() => onSortChange(option.value)}
// //             >
// //               {option.label}
// //             </Button>
// //           ))}
// //         </div>
// //       </div>

// //       <Accordion type="single" collapsible>
// //         <AccordionItem value="categories">
// //           <AccordionTrigger className="text-lg font-semibold">
// //             Categories
// //           </AccordionTrigger>
// //           <AccordionContent>
// //             <div className="space-y-2">
// //               {categories.map((category) => (
// //                 <Button
// //                   key={category}
// //                   variant={selectedCategory === category ? "default" : "ghost"}
// //                   className="w-full justify-start"
// //                   onClick={() => onCategoryChange(
// //                     selectedCategory === category ? null : category
// //                   )}
// //                 >
// //                   {category}
// //                 </Button>
// //               ))}
// //             </div>
// //           </AccordionContent>
// //         </AccordionItem>

// //         <AccordionItem value="price">
// //           <AccordionTrigger className="text-lg font-semibold">
// //             Price Range
// //           </AccordionTrigger>
// //           <AccordionContent>
// //             <div className="space-y-4">
// //               <div className="flex items-center justify-between">
// //                 <span>${priceRange[0]}</span>
// //                 <span>${priceRange[1]}</span>
// //               </div>
// //               <input
// //                 type="range"
// //                 min="0"
// //                 max="500"
// //                 value={priceRange[1]}
// //                 onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
// //                 className="w-full"
// //               />
// //             </div>
// //           </AccordionContent>
// //         </AccordionItem>
// //       </Accordion>

// //       {selectedCategory && (
// //         <div className="flex items-center">
// //           <Badge variant="secondary" className="mr-2">
// //             {selectedCategory}
// //           </Badge>
// //           <Button
// //             variant="ghost"
// //             size="sm"
// //             onClick={() => onCategoryChange(null)}
// //           >
// //             <X className="h-4 w-4" />
// //           </Button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }


// // components/ProductFilters.tsx

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
// import { Label } from '@/components/ui/label';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// interface ProductFiltersProps {
//   categories: string[];
//   selectedCategory: string | null;
//   onCategoryChange: (category: string | null) => void;
//   onSortChange: (sort: string) => void;
//   priceRange: [number, number];
//   onPriceRangeChange: (range: [number, number]) => void;
//   sortOption: string;
// }

// export function ProductFilters({
//   categories,
//   selectedCategory,
//   onCategoryChange,
//   onSortChange,
//   priceRange,
//   onPriceRangeChange,
//   sortOption,
// }: ProductFiltersProps) {
//   const sortOptions = [
//     { value: 'featured', label: 'Featured' },
//     { value: 'price-asc', label: 'Price: Low to High' },
//     { value: 'price-desc', label: 'Price: High to Low' },
//     { value: 'rating', label: 'Highest Rated' },
//     { value: 'newest', label: 'Newest' },
//   ];

//   const handlePriceChange = (index: number, value: number) => {
//     const newRange: [number, number] = [...priceRange];
//     newRange[index] = value;
//     onPriceRangeChange(newRange);
//   };

//   return (
//     <div className="space-y-6">
//       {/* Sort By */}
//       <div>
//         <h3 className="text-lg font-semibold mb-4">Sort By</h3>
//         <RadioGroup value={sortOption} onValueChange={onSortChange}>
//           {sortOptions.map((option) => (
//             <div key={option.value} className="flex items-center space-x-2">
//               <RadioGroupItem value={option.value} id={option.value} />
//               <Label htmlFor={option.value}>{option.label}</Label>
//             </div>
//           ))}
//         </RadioGroup>
//       </div>

//       {/* Categories */}
//       <Accordion type="single" collapsible defaultValue="categories">
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

//         {/* Price Range */}
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

//               <div className="space-y-4">
//                 <div>
//                   <Label htmlFor="min-price">Min Price</Label>
//                   <input
//                     id="min-price"
//                     type="range"
//                     min="0"
//                     max="500"
//                     value={priceRange[0]}
//                     onChange={(e) => handlePriceChange(0, parseInt(e.target.value))}
//                     className="w-full"
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="max-price">Max Price</Label>
//                   <input
//                     id="max-price"
//                     type="range"
//                     min="0"
//                     max="500"
//                     value={priceRange[1]}
//                     onChange={(e) => handlePriceChange(1, parseInt(e.target.value))}
//                     className="w-full"
//                   />
//                 </div>
//               </div>
//             </div>
//           </AccordionContent>
//         </AccordionItem>
//       </Accordion>
//     </div>
//   );
// }



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
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { X, RotateCcw } from 'lucide-react';

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
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>(priceRange);

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest' },
  ];

  const handlePriceChange = (index: number, value: number) => {
    const newRange: [number, number] = [...tempPriceRange];
    newRange[index] = value;
    setTempPriceRange(newRange);
  };

  const applyPriceFilter = () => {
    onPriceRangeChange(tempPriceRange);
  };

  const resetAllFilters = () => {
    onCategoryChange(null);
    onSortChange('featured');
    onPriceRangeChange([0, 500]);
    setTempPriceRange([0, 500]);
  };

  return (
    <Card className="shadow-sm rounded-xl bg-card/50 backdrop-blur-sm p-0">
      <CardContent className="p-2 space-y-2">
        {/* Header with reset button */}
        <div className="flex items-center justify-between">
          <h2 className="text-md font-bold ">Filters</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-2 w-2" />
            Reset
          </Button>
        </div>

        <Separator />

        {/* Sort By Section */}
        <div className="space-y-2">
          <h3 className="text-md font-semibold">Sort By</h3>
          <RadioGroup value={sortOption} onValueChange={onSortChange} className="space-y-1">
            {sortOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value}
                  id={option.value}
                  className="border-primary text-primary"
                />
                <Label
                  htmlFor={option.value}
                  className="font-normal cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator />

        {/* Categories Accordion */}
        <Accordion type="single" collapsible defaultValue="categories" className="w-full">
          <AccordionItem value="categories" className="border-none">
            <AccordionTrigger className="text-md font-semibold py-3 hover:no-underline">
              Categories
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-3">
              <div className="grid grid-cols-1 gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "ghost"}
                    className={`justify-start h-10 px-4 ${selectedCategory === category
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "hover:bg-muted"
                      }`}
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

          {/* Price Range Accordion */}
          <AccordionItem value="price" className="border-none">
            <AccordionTrigger className="text-md font-semibold py-3 hover:no-underline">
              Price Range
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-3 space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">${tempPriceRange[0]}</span>
                  <span className="text-sm font-medium">${tempPriceRange[1]}</span>
                </div>

                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label htmlFor="min-price" className="text-sm font-medium">Min Price</Label>
                      <span className="text-sm text-muted-foreground">${tempPriceRange[0]}</span>
                    </div>
                    <input
                      id="min-price"
                      type="range"
                      min="0"
                      max="500"
                      value={tempPriceRange[0]}
                      onChange={(e) => handlePriceChange(0, parseInt(e.target.value))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <Label htmlFor="max-price" className="text-sm font-medium">Max Price</Label>
                      <span className="text-sm text-muted-foreground">${tempPriceRange[1]}</span>
                    </div>
                    <input
                      id="max-price"
                      type="range"
                      min="0"
                      max="500"
                      value={tempPriceRange[1]}
                      onChange={(e) => handlePriceChange(1, parseInt(e.target.value))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                </div>

                <Button
                  onClick={applyPriceFilter}
                  className="w-full mt-2"
                  disabled={tempPriceRange[0] === priceRange[0] && tempPriceRange[1] === priceRange[1]}
                >
                  Apply Price Filter
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Active Filters Display */}
        {(selectedCategory || priceRange[0] > 0 || priceRange[1] < 500) && (
          <>
            <Separator />
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Active Filters</h3>
              <div className="flex flex-wrap gap-2">
                {selectedCategory && (
                  <Badge variant="secondary" className="gap-1 px-3 py-1.5">
                    {selectedCategory}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1 hover:bg-transparent"
                      onClick={() => onCategoryChange(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {(priceRange[0] > 0 || priceRange[1] < 500) && (
                  <Badge variant="secondary" className="gap-1 px-3 py-1.5">
                    ${priceRange[0]} - ${priceRange[1]}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1 hover:bg-transparent"
                      onClick={() => {
                        onPriceRangeChange([0, 500]);
                        setTempPriceRange([0, 500]);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}