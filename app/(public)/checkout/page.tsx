import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <form className="space-y-4 max-w-lg">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" placeholder="John Doe" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Shipping Address</Label>
          <Input id="address" placeholder="123 Main St" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="card">Card Information</Label>
          <Input id="card" placeholder="**** **** **** 4242" />
        </div>
        <Button type="submit" className="w-full">Pay Now</Button>
      </form>
    </div>
  )
}
