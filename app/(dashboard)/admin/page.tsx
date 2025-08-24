"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Menu,
  Search,
  Bell,
  Package,
  Users,
  Store,
  DollarSign,
  Settings,
  ChevronDown,
  Plus,
} from "lucide-react";

/**
 * Drop this file at: src/app/(dashboard)/admin/page.tsx
 * Make sure shadcn/ui components above are added. See chat for setup commands.
 */
export default function AdminDashboardPage() {
  const kpis = [
    {
      title: "Total Revenue",
      value: "$128,420",
      change: "+12.4%",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      title: "Orders",
      value: "3,249",
      change: "+4.1%",
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: "Active Vendors",
      value: "312",
      change: "+2.3%",
      icon: <Store className="h-5 w-5" />,
    },
    {
      title: "Customers",
      value: "18,902",
      change: "+6.0%",
      icon: <Users className="h-5 w-5" />,
    },
  ];

  const revenueData = [
    { month: "Jan", revenue: 12000 },
    { month: "Feb", revenue: 18000 },
    { month: "Mar", revenue: 16000 },
    { month: "Apr", revenue: 22000 },
    { month: "May", revenue: 24500 },
    { month: "Jun", revenue: 28000 },
  ];

  const ordersData = [
    { day: "Mon", orders: 420 },
    { day: "Tue", orders: 380 },
    { day: "Wed", orders: 520 },
    { day: "Thu", orders: 610 },
    { day: "Fri", orders: 720 },
    { day: "Sat", orders: 480 },
    { day: "Sun", orders: 360 },
  ];

  const recentOrders = [
    {
      id: "ORD-89341",
      customer: "Arjun Kumar",
      vendor: "Urban Threads",
      total: 184.2,
      status: "Shipped",
      date: "2025-08-18",
    },
    {
      id: "ORD-89322",
      customer: "Meera Shah",
      vendor: "Gadget Hub",
      total: 92.5,
      status: "Processing",
      date: "2025-08-18",
    },
    {
      id: "ORD-89288",
      customer: "Vikas Patel",
      vendor: "HomeCraft",
      total: 421.0,
      status: "Delivered",
      date: "2025-08-17",
    },
    {
      id: "ORD-89270",
      customer: "Sara Khan",
      vendor: "FitGear",
      total: 65.0,
      status: "Cancelled",
      date: "2025-08-16",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-screen-2xl items-center gap-3 px-4 sm:px-6">
          <Button variant="ghost" size="icon" className="sm:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl bg-primary/10 flex items-center justify-center">
              <Store className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-semibold tracking-tight">Admin</span>
            <Separator orientation="vertical" className="mx-1 hidden sm:block" />
            <span className="hidden text-sm text-muted-foreground sm:block">
              Multi‑Vendor Platform
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search orders, vendors, products..." className="pl-8 w-[320px]" />
            </div>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/avatar.png" alt="Admin" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  Admin
                  <ChevronDown className="h-4 w-4 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="#">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="#">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="hidden rounded-2xl border bg-card p-4 lg:block">
          <nav className="space-y-1">
            {[
              { label: "Overview", href: "#" },
              { label: "Orders", href: "#" },
              { label: "Products", href: "#" },
              { label: "Vendors", href: "#" },
              { label: "Customers", href: "#" },
              { label: "Payouts", href: "#" },
              { label: "Settings", href: "#" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Separator className="my-4" />
          <div className="rounded-xl bg-muted p-4">
            <p className="text-sm font-medium">Need more insights?</p>
            <p className="text-xs text-muted-foreground">Upgrade to Pro analytics.</p>
            <Button className="mt-3 w-full" size="sm">
              <Plus className="mr-2 h-4 w-4" /> Upgrade
            </Button>
          </div>
        </aside>

        {/* Main area */}
        <main className="space-y-6">
          {/* KPI Cards */}
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {kpis.map((k) => (
              <Card key={k.title} className="rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {k.title}
                  </CardTitle>
                  <div className="rounded-xl bg-primary/10 p-2 text-primary">{k.icon}</div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{k.value}</div>
                  <p className="text-xs text-emerald-600 dark:text-emerald-500">{k.change} this month</p>
                </CardContent>
              </Card>
            ))}
          </section>

          {/* Charts */}
          <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <Card className="rounded-2xl xl:col-span-2">
              <CardHeader>
                <CardTitle>Revenue (Last 6 months)</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData} margin={{ left: 8, right: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Daily Orders</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ordersData} margin={{ left: 8, right: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Tabs: Orders / Vendors */}
          <section>
            <Tabs defaultValue="orders" className="space-y-4">
              <TabsList>
                <TabsTrigger value="orders">Recent Orders</TabsTrigger>
                <TabsTrigger value="vendors">Top Vendors</TabsTrigger>
              </TabsList>

              <TabsContent value="orders" className="space-y-4">
                <Card className="rounded-2xl">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Orders</CardTitle>
                    <div className="flex items-center gap-2">
                      <Input placeholder="Filter by customer or vendor" className="w-72" />
                      <Button variant="outline">Export CSV</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Vendor</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentOrders.map((o) => (
                          <TableRow key={o.id}>
                            <TableCell className="font-medium">{o.id}</TableCell>
                            <TableCell>{o.customer}</TableCell>
                            <TableCell>{o.vendor}</TableCell>
                            <TableCell className="text-right">${o.total.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  o.status === "Delivered"
                                    ? "default"
                                    : o.status === "Shipped"
                                    ? "secondary"
                                    : o.status === "Processing"
                                    ? "outline"
                                    : "destructive"
                                }
                                className="rounded-full"
                              >
                                {o.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{o.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableCaption>Showing latest 20 orders</TableCaption>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="vendors">
                <Card className="rounded-2xl">
                  <CardHeader>
                    <CardTitle>Top Vendors by Revenue</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {["Urban Threads", "Gadget Hub", "HomeCraft", "FitGear"].map(
                      (v, i) => (
                        <div key={v} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{v.slice(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{v}</p>
                                <p className="text-xs text-muted-foreground">{Math.round(
                                  (0.32 - i * 0.06) * 100
                                )}% of total</p>
                              </div>
                            </div>
                            <span className="text-sm font-semibold">${
                              54000 - i * 8000
                            }</span>
                          </div>
                          <Progress value={80 - i * 15} className="h-2" />
                        </div>
                      )
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>
        </main>
      </div>
    </div>
  );
}
