// 'use client';

// import Link from 'next/link';
// import { ShoppingCart, Menu, Store } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { useCart } from '@/lib/cart';
// import { Input } from './ui/input';

// export function Navbar() {
//   const { totalItems } = useCart();

//   return (
//     <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-2 md:px-4">
//       <div className='flex justify-between items-center h-16' >
//         {/* <Link href={'/'} className='flex items-center space-x-2' ><span className='text-xl font-bold' >ShopHub</span></Link> */}
//         <Link href={'/'} className='flex items-center space-x-2' >
//           <div className="bg-primary rounded-lg p-2">
//             <span className="text-xl font-bold text-white">S</span>
//           </div>
//           <span className="text-xl font-bold">hopHub</span>
//         </Link>
//         <div className="hidden md:flex w-100">
//           <Input placeholder='Search for products, brands and more' />
//         </div>
//         <div className="flex items-center space-x-2 border-red-400">
//           <Button variant={'secondary'} asChild>
//             <Link href="/checkout" className="relative flex items-center gap-2">
//               <ShoppingCart className="h-4 w-4" />
//               {totalItems > 0 && (
//                 <Badge
//                   variant="destructive"
//                   className="absolute -top-1 -right-3 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
//                 >
//                   {totalItems}
//                 </Badge>)}
//               Cart
//             </Link>
//           </Button>
//           <Button variant={'secondary'} asChild>
//             <Link href="/vendor/become-a-vendor" className="flex items-center gap-2">
//               <Store className="h-4 w-4" />
//               Become a vendor
//             </Link>
//           </Button>
//         </div>
//       </div>
//     </header>
//   );
// }



'use client';
import Link from 'next/link';
import { ShoppingCart, Menu, Store, User, LogOut, Settings, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/lib/cart';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSelector, useDispatch } from 'react-redux';

import { useRouter } from 'next/navigation';
import { clearAuth, logoutUser } from '@/store/slices/authSlice';
import { AppDispatch, RootState } from '@/store/store';
import { toast } from 'sonner';

export function Navbar() {
  const { totalItems } = useCart();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    try {
      // Dispatch logoutUser thunk
      const result = await dispatch(logoutUser())

      if (logoutUser.fulfilled.match(result)) {
        toast.success("Logeed out successfully!");
        // Redirect to home page
        router.push('/');
      } else {
        // Handle error case
        const errorMessage = result.payload as string;
        toast.error(errorMessage || "Log out failed");
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-2 md:px-4">
      <div className='flex justify-between items-center h-16' >
        <Link href={'/'} className='flex items-center space-x-2' >
          <div className="bg-primary rounded-lg p-2">
            <span className="text-xl font-bold text-white">S</span>
          </div>
          <span className="text-xl font-bold">hopHub</span>
        </Link>

        <div className="hidden md:flex w-100">
          <Input placeholder='Search for products, brands and more' />
        </div>

        <div className="flex items-center space-x-2">
          <Button variant={'secondary'} asChild>
            <Link href="/checkout" className="relative flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-3 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {totalItems}
                </Badge>
              )}
              Cart
            </Link>
          </Button>

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="flex items-center">
                    <Package className="mr-2 h-4 w-4" />
                    <span>My Orders</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                {user.roles.includes('vendor') && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/vendor/dashboard" className="flex items-center">
                        <Store className="mr-2 h-4 w-4" />
                        <span>Vendor Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant={'secondary'} asChild>
              <Link href="/auth/sign-in" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Sign In
              </Link>
            </Button>
          )}

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