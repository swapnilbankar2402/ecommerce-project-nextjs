import { Button } from "@/components/ui/button"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  // Later: fetch product from API using params.id
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-200 h-96 rounded-xl" /> {/* Product Image */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Product Name</h1>
          <p className="text-gray-600">This is the product description with details about size, material, etc.</p>
          <p className="text-xl font-semibold">$99.00</p>
          <Button>Add to Cart</Button>
        </div>
      </div>
    </div>
  )
}
