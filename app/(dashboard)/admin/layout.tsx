// "use client";
// import { PropsWithChildren } from "react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Separator } from "@/components/ui/separator";
// import { Bell, Search, Store } from "lucide-react";


// export default function AdminLayout({ children }: PropsWithChildren) {
//     return (
//         <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
//             {/* Top bar */}
//             <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//                 <div className="mx-auto flex h-14 max-w-screen-2xl items-center gap-3 px-4 sm:px-6">
//                     <div className="flex items-center gap-2">
//                         <div className="h-7 w-7 rounded-xl bg-primary/10 flex items-center justify-center">
//                             <Store className="h-4 w-4 text-primary" />
//                         </div>
//                         <span className="text-sm font-semibold">Admin</span>
//                         <Separator orientation="vertical" className="mx-3 hidden sm:block" />
//                         <div className="relative hidden md:block">
//                             <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//                             <Input className="pl-8 w-[320px]" placeholder="Search…" />
//                         </div>
//                     </div>
//                     <div className="ml-auto flex items-center gap-2">
//                         <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
//                     </div>
//                 </div>
//             </header>


//             <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr]">
//                 {/* Sidebar */}
//                 <aside className="hidden rounded-2xl border bg-card p-4 lg:block">
//                     <nav className="space-y-1">
//                         {[
//                             { label: "Overview", href: "/admin" },
//                             { label: "Orders", href: "/admin/orders" },
//                             { label: "Products", href: "/admin/products" },
//                             { label: "Vendors", href: "/admin/vendors" },
//                             { label: "Customers", href: "/admin/customers" },
//                             { label: "Payouts", href: "/admin/payouts" },
//                             { label: "Settings", href: "/admin/settings" },
//                         ].map((i) => (
//                             <Link key={i.href} href={i.href} className="block rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground hover:bg-muted">{i.label}</Link>
//                         ))}
//                     </nav>
//                 </aside>
//                 {/* Content */}
//                 <main className="space-y-6">{children}</main>
//             </div>
//         </div>
//     );
// }


// app/admin/layout.tsx
'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Store, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Bell,
  Search,
  User,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Vendors', href: '/admin/vendors', icon: Store },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div 
        className={cn(
          "bg-card border-r border-border transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {sidebarOpen && (
              <h1 className="text-xl font-bold">VendorHub</h1>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 p-2">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center p-3 rounded-lg text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {sidebarOpen && <span className="ml-3">{item.name}</span>}
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          {/* User Profile */}
          {sidebarOpen && (
            <div className="p-4 border-t border-border">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Admin User</p>
                  <p className="text-xs text-muted-foreground truncate">admin@example.com</p>
                </div>
              </div>
              <Button variant="ghost" className="w-full justify-start mt-3">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border p-4 flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                <User className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">Admin User</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}