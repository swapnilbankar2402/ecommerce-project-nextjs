"use client"

import Link from "next/link"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Home, Package, ShoppingCart, Settings } from "lucide-react"

const navItems = [
  { label: "Overview", href: "/vendor", icon: Home },
  { label: "Products", href: "/vendor/products", icon: Package },
  { label: "Orders", href: "/vendor/orders", icon: ShoppingCart },
  { label: "Settings", href: "/vendor/settings", icon: Settings },
]

export default function VendorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 dark:bg-gray-900 border-r">
        <div className="p-4 text-xl font-bold">Vendor Dashboard</div>
        <nav className="space-y-2 p-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
