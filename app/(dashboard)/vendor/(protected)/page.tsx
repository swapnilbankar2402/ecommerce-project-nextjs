'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Star,
  BarChart3,
  Settings,
  Store,
  AlertCircle,
  CheckCircle,
  FileText,
  Plus
} from 'lucide-react';
import Link from 'next/link';

interface VendorData {
  storeName: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  slug: string;
}

export default function VendorDashboardPage() {
  const [vendorData, setVendorData] = useState<VendorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch the vendor data from your API
    const fetchVendorData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data - in a real app, this would come from your API
        setVendorData({
          storeName: 'TechGadgets',
          email: 'contact@techgadgets.com',
          status: 'approved',
          slug: 'techgadgets',
        });
      } catch (error) {
        console.error('Failed to fetch vendor data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-6xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!vendorData) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-6xl">
        <Card>
          <CardHeader>
            <CardTitle>Vendor Account Not Found</CardTitle>
            <CardDescription>
              You don't have a vendor account yet. Please apply to become a vendor.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/vendor/apply">
                <FileText className="mr-2 h-4 w-4" />
                Apply to Become a Vendor
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (vendorData.status !== 'approved') {
    return (
      <div className="container mx-auto py-10 px-4 max-w-6xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-yellow-500" />
              Vendor Account {vendorData.status}
            </CardTitle>
            <CardDescription>
              Your vendor account is currently {vendorData.status}.
              {vendorData.status === 'pending' && ' Please wait for approval.'}
              {vendorData.status === 'rejected' && ' You may submit a new application.'}
              {vendorData.status === 'suspended' && ' Please contact support for more information.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <Link href="/vendor/apply/status">
                  View Application Status
                </Link>
              </Button>
              {(vendorData.status === 'rejected' || vendorData.status === 'suspended') && (
                <Button variant="outline" asChild>
                  <Link href="/vendor/apply">
                    <FileText className="mr-2 h-4 w-4" />
                    Submit New Application
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendor Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {vendorData.storeName}!</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="default" className="flex items-center">
            <CheckCircle className="mr-1 h-3 w-3" />
            Approved
          </Badge>
          <Button asChild>
            <Link href={`/store/${vendorData.slug}`} target="_blank">
              <Store className="mr-2 h-4 w-4" />
              View Store
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <div className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,450.75</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">342</div>
                <p className="text-xs text-muted-foreground">
                  +12.5% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">124</div>
                <p className="text-xs text-muted-foreground">
                  +8.2% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.7</div>
                <p className="text-xs text-muted-foreground">
                  +0.3 from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest orders from your store</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: 'ORD-001', customer: 'John Doe', amount: '$125.99', status: 'Delivered', date: '2023-06-15' },
                    { id: 'ORD-002', customer: 'Jane Smith', amount: '$89.50', status: 'Processing', date: '2023-06-14' },
                    { id: 'ORD-003', customer: 'Robert Johnson', amount: '$210.00', status: 'Shipped', date: '2023-06-13' },
                  ].map((order) => (
                    <div key={order.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.customer}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{order.amount}</p>
                        <Badge variant={order.status === 'Delivered' ? 'default' : order.status === 'Processing' ? 'secondary' : 'outline'}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-4">
                    View All Orders
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Best performing products this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Wireless Headphones', sales: 124, revenue: '$12,450' },
                    { name: 'Smart Watch', sales: 89, revenue: '$8,900' },
                    { name: 'Bluetooth Speaker', sales: 67, revenue: '$4,020' },
                  ].map((product, index) => (
                    <div key={product.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.sales} sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{product.revenue}</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-4">
                    View All Products
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Products</h2>
              <p className="text-muted-foreground">Manage your product catalog</p>
            </div>
            <Button asChild>
              <Link href="/vendor/products/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Products</CardTitle>
              <CardDescription>A list of all your products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Wireless Headphones', category: 'Electronics', price: '$99.99', stock: 45, status: 'Active' },
                  { name: 'Smart Watch', category: 'Electronics', price: '$149.99', stock: 32, status: 'Active' },
                  { name: 'Bluetooth Speaker', category: 'Electronics', price: '$59.99', stock: 5, status: 'Active' },
                ].map((product) => (
                  <div key={product.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{product.price}</p>
                      <div className="flex items-center justify-end space-x-2">
                        <Badge variant={product.stock > 10 ? 'default' : 'secondary'}>
                          {product.stock} in stock
                        </Badge>
                        <Badge variant={product.status === 'Active' ? 'default' : 'secondary'}>
                          {product.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Orders</h2>
            <p className="text-muted-foreground">Manage customer orders</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>A list of recent orders from your store</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 'ORD-001', customer: 'John Doe', amount: '$125.99', status: 'Delivered', date: '2023-06-15' },
                  { id: 'ORD-002', customer: 'Jane Smith', amount: '$89.50', status: 'Processing', date: '2023-06-14' },
                  { id: 'ORD-003', customer: 'Robert Johnson', amount: '$210.00', status: 'Shipped', date: '2023-06-13' },
                ].map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{order.amount}</p>
                      <Badge variant={
                        order.status === 'Delivered' ? 'default' :
                          order.status === 'Processing' ? 'secondary' : 'outline'
                      }>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Settings</h2>
            <p className="text-muted-foreground">Manage your store settings</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>Update your store details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Store Name</p>
                    <p>{vendorData.storeName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p>{vendorData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge variant="default" className="flex items-center w-fit">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Approved
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Store URL</p>
                    <p className="text-sm truncate">/store/{vendorData.slug}</p>
                  </div>
                </div>
                <div className="pt-4">
                  <Button>Edit Store Information</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}