import { Button } from "@/components/ui/button"

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Your Cart</h1>

      <div className="space-y-4">
        <div className="flex justify-between border p-4 rounded-xl">
          <span>Product 1</span>
          <span>$49.00</span>
        </div>
      </div>

      <div className="flex justify-between items-center border-t pt-4">
        <span className="font-semibold">Total: $49.00</span>
        <Button asChild>
          <a href="/checkout">Checkout</a>
        </Button>
      </div>
    </div>
  )
}
