"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ProductsPage() {
  const [search, setSearch] = useState("")

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold mb-4">All Products</h1>

      {/* Search + Filters */}
      <div className="flex items-center gap-4 mb-6">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button>Filter</Button>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="border p-4 rounded-xl shadow">Product</div>
        <div className="border p-4 rounded-xl shadow">Product</div>
        <div className="border p-4 rounded-xl shadow">Product</div>
        <div className="border p-4 rounded-xl shadow">Product</div>
      </div>
    </div>
  )
}
