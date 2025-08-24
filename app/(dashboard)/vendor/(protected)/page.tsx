import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function VendorDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Vendor Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">24</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">57</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">$1,240</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 space-x-4">
        <Link href="/vendor/products" className="underline">Manage Products</Link>
        <Link href="/vendor/orders" className="underline">View Orders</Link>
        <Link href="/vendor/settings" className="underline">Store Settings</Link>
      </div>
    </div>
  )
}
