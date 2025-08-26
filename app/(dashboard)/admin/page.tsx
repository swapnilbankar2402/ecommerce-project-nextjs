
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ShoppingCart,
  Package,
  Users,
  Store,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity
} from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your multi-vendor marketplace</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
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
            <div className="text-2xl font-bold">1,234</div>
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
            <div className="text-2xl font-bold">5,678</div>
            <p className="text-xs text-muted-foreground">
              +8.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">
              +5.7% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders from your marketplace</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: 'ORD-001', customer: 'John Doe', amount: '$125.99', status: 'Delivered', date: '2023-06-15' },
                { id: 'ORD-002', customer: 'Jane Smith', amount: '$89.50', status: 'Processing', date: '2023-06-14' },
                { id: 'ORD-003', customer: 'Robert Johnson', amount: '$210.00', status: 'Shipped', date: '2023-06-13' },
                { id: 'ORD-004', customer: 'Emily Davis', amount: '$45.75', status: 'Pending', date: '2023-06-12' },
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

        {/* Top Vendors */}
        <Card>
          <CardHeader>
            <CardTitle>Top Vendors</CardTitle>
            <CardDescription>Highest performing vendors this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'TechGadgets', sales: '$12,450', products: 124, change: '+12.5%' },
                { name: 'FashionHub', sales: '$10,230', products: 89, change: '+8.3%' },
                { name: 'HomeEssentials', sales: '$8,760', products: 67, change: '+5.2%' },
                { name: 'BookWorld', sales: '$7,890', products: 156, change: '+3.7%' },
              ].map((vendor, index) => (
                <div key={vendor.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{vendor.name}</p>
                      <p className="text-sm text-muted-foreground">{vendor.products} products</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{vendor.sales}</p>
                    <p className={`text-sm flex items-center justify-end ${vendor.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {vendor.change.startsWith('+') ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {vendor.change}
                    </p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4">
                View All Vendors
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Overview</CardTitle>
          <CardDescription>Recent activity across your marketplace</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="daily" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
            <TabsContent value="daily" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Orders</p>
                  <p className="text-2xl font-bold">124</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">$8,450.75</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Conversion</p>
                  <p className="text-2xl font-bold">4.8%</p>
                </div>
              </div>
              <div className="h-64 bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Chart Placeholder</p>
              </div>
            </TabsContent>
            <TabsContent value="weekly">
              <div className="h-64 bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Weekly Chart Placeholder</p>
              </div>
            </TabsContent>
            <TabsContent value="monthly">
              <div className="h-64 bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Monthly Chart Placeholder</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}