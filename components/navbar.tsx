'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/lib/cart';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from './ui/input';

export function Navbar() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">


      <div className='flex justify-between items-center h-16' >
        <Link href={'/'} className='flex items-center space-x-2' ><span className='text-xl font-bold' >ShopHub</span></Link>
        <div className="hidden md:flex w-100">
          <Input placeholder='Search for products, brands and more' />
        </div>
        <div className="flex items-center space-x-2 border-red-400">
          <Button variant={'secondary'} asChild>
            <Link href="/checkout" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {totalItems}
                </Badge>)}
              Cart
            </Link>
          </Button>
          <Button variant={'secondary'} asChild>
            <Link href="/vendor/become-a-vendor" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Become a vendor
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}