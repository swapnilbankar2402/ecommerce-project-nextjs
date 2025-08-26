// app/vendor/layout.tsx
'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Star,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  User,
  LogOut,
  Store,
  CreditCard,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/vendor', icon: LayoutDashboard },
  { name: 'Products', href: '/vendor/products', icon: Package },
  { name: 'Orders', href: '/vendor/orders', icon: ShoppingCart },
  { name: 'Reviews', href: '/vendor/reviews', icon: Star },
  { name: 'Analytics', href: '/vendor/analytics', icon: BarChart3 },
  { name: 'Payments', href: '/vendor/payments', icon: CreditCard },
  { name: 'Messages', href: '/vendor/messages', icon: MessageSquare },
  { name: 'Settings', href: '/vendor/settings', icon: Settings },
];

interface VendorLayoutProps {
  children: React.ReactNode;
}

export default function VendorLayout({ children }: VendorLayoutProps) {
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
              <div className="flex items-center space-x-2">
                <Store className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">VendorHub</h1>
              </div>
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
                  <p className="text-sm font-medium truncate">TechGadgets</p>
                  <p className="text-xs text-muted-foreground truncate">vendor@techgadgets.com</p>
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
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                <User className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">TechGadgets</span>
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