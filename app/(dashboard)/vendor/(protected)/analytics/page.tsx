// app/vendor/analytics/page.tsx
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    Users,
    Eye,
    Star,
    Download
} from 'lucide-react';

export default function VendorAnalyticsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                    <p className="text-muted-foreground">Detailed insights into your store performance</p>
                </div>
                <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
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
                        <CardTitle className="text-sm font-medium">Customers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">286</div>
                        <p className="text-xs text-muted-foreground">
                            +8.3% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4.8%</div>
                        <p className="text-xs text-muted-foreground">
                            +0.7% from last month
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Sales Overview */}
            <Card>
                <CardHeader>
                    <CardTitle>Sales Overview</CardTitle>
                    <CardDescription>Your store sales over time</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="revenue" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="revenue">Revenue</TabsTrigger>
                            <TabsTrigger value="orders">Orders</TabsTrigger>
                            <TabsTrigger value="customers">Customers</TabsTrigger>
                            <TabsTrigger value="conversion">Conversion</TabsTrigger>
                        </TabsList>
                        <TabsContent value="revenue" className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                                    <p className="text-2xl font-bold">$12,450.75</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Avg. Order Value</p>
                                    <p className="text-2xl font-bold">$36.40</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Growth</p>
                                    <p className="text-2xl font-bold text-green-500">+20.1%</p>
                                </div>
                            </div>
                            <div className="h-64 bg-muted rounded-md flex items-center justify-center">
                                <div className="text-center">
                                    <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground" />
                                    <p className="text-muted-foreground mt-2">Revenue Chart Placeholder</p>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="orders">
                            <div className="h-64 bg-muted rounded-md flex items-center justify-center">
                                <div className="text-center">
                                    <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground" />
                                    <p className="text-muted-foreground mt-2">Orders Chart Placeholder</p>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="customers">
                            <div className="h-64 bg-muted rounded-md flex items-center justify-center">
                                <div className="text-center">
                                    <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground" />
                                    <p className="text-muted-foreground mt-2">Customers Chart Placeholder</p>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="conversion">
                            <div className="h-64 bg-muted rounded-md flex items-center justify-center">
                                <div className="text-center">
                                    <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground" />
                                    <p className="text-muted-foreground mt-2">Conversion Chart Placeholder</p>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Product Performance */}
            <Card>
                <CardHeader>
                    <CardTitle>Product Performance</CardTitle>
                    <CardDescription>How your products are performing</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            { name: 'Wireless Headphones', views: 1240, sales: 124, conversion: '10.0%', revenue: '$12,450' },
                            { name: 'Smart Watch', views: 980, sales: 89, conversion: '9.1%', revenue: '$8,900' },
                            { name: 'Bluetooth Speaker', views: 750, sales: 67, conversion: '8.9%', revenue: '$4,020' },
                            { name: 'Phone Case', views: 2100, sales: 156, conversion: '7.4%', revenue: '$3,120' },
                            { name: 'USB Cable', views: 3200, sales: 120, conversion: '3.8%', revenue: '$1,200' },
                        ].map((product, index) => (
                            <div key={product.name} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-sm font-medium">{index + 1}</span>
                                    </div>
                                    <div>
                                        <p className="font-medium">{product.name}</p>
                                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                            <div className="flex items-center">
                                                <Eye className="mr-1 h-3 w-3" />
                                                {product.views} views
                                            </div>
                                            <div className="flex items-center">
                                                <ShoppingCart className="mr-1 h-3 w-3" />
                                                {product.sales} sales
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center space-x-4">
                                        <div>
                                            <p className="text-sm font-medium">{product.conversion}</p>
                                            <p className="text-xs text-muted-foreground">Conversion</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{product.revenue}</p>
                                            <p className="text-xs text-muted-foreground">Revenue</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Customer Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Customer Demographics</CardTitle>
                        <CardDescription>Information about your customers</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">18-24</span>
                                    <span className="text-sm font-medium">24%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full" style={{ width: '24%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">25-34</span>
                                    <span className="text-sm font-medium">42%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full" style={{ width: '42%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">35-44</span>
                                    <span className="text-sm font-medium">22%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full" style={{ width: '22%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">45+</span>
                                    <span className="text-sm font-medium">12%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full" style={{ width: '12%' }}></div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top Locations</CardTitle>
                        <CardDescription>Where your customers are from</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { location: 'New York', customers: 86, percentage: '30%' },
                                { location: 'Los Angeles', customers: 64, percentage: '22%' },
                                { location: 'Chicago', customers: 43, percentage: '15%' },
                                { location: 'Houston', customers: 37, percentage: '13%' },
                                { location: 'Phoenix', customers: 28, percentage: '10%' },
                            ].map((item, index) => (
                                <div key={item.location} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-sm font-medium">{index + 1}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium">{item.location}</p>
                                            <p className="text-sm text-muted-foreground">{item.customers} customers</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">{item.percentage}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}