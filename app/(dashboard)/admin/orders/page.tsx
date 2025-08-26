// app/admin/orders/page.tsx
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    MoreHorizontal,
    Search,
    Eye,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    Package
} from 'lucide-react';
import Link from 'next/link';

export default function AdminOrdersPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                    <p className="text-muted-foreground">Manage customer orders in your marketplace</p>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Search orders..."
                            className="pl-10"
                        />
                    </div>
                    <Button variant="outline">Export</Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
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
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">86</div>
                        <p className="text-xs text-muted-foreground">
                            Require processing
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Processing</CardTitle>
                        <Truck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">142</div>
                        <p className="text-xs text-muted-foreground">
                            Being prepared
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">987</div>
                        <p className="text-xs text-muted-foreground">
                            Successfully delivered
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Orders Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>A list of recent orders in your marketplace</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Vendor</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[
                                {
                                    id: 'ORD-001',
                                    customer: 'John Doe',
                                    vendor: 'TechGadgets',
                                    date: '2023-06-15',
                                    amount: '$125.99',
                                    status: 'Delivered'
                                },
                                {
                                    id: 'ORD-002',
                                    customer: 'Jane Smith',
                                    vendor: 'FashionHub',
                                    date: '2023-06-14',
                                    amount: '$89.50',
                                    status: 'Processing'
                                },
                                {
                                    id: 'ORD-003',
                                    customer: 'Robert Johnson',
                                    vendor: 'HomeEssentials',
                                    date: '2023-06-13',
                                    amount: '$210.00',
                                    status: 'Shipped'
                                },
                                {
                                    id: 'ORD-004',
                                    customer: 'Emily Davis',
                                    vendor: 'BookWorld',
                                    date: '2023-06-12',
                                    amount: '$45.75',
                                    status: 'Pending'
                                },
                                {
                                    id: 'ORD-005',
                                    customer: 'Michael Wilson',
                                    vendor: 'SportsGear',
                                    date: '2023-06-11',
                                    amount: '$78.25',
                                    status: 'Cancelled'
                                },
                            ].map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">{order.id}</TableCell>
                                    <TableCell>{order.customer}</TableCell>
                                    <TableCell>{order.vendor}</TableCell>
                                    <TableCell>{order.date}</TableCell>
                                    <TableCell>{order.amount}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            order.status === 'Delivered' ? 'default' :
                                                order.status === 'Processing' ? 'secondary' :
                                                    order.status === 'Shipped' ? 'outline' :
                                                        order.status === 'Pending' ? 'secondary' : 'destructive'
                                        }>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/orders/${order.id}`}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View details
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                {order.status === 'Pending' && (
                                                    <>
                                                        <DropdownMenuItem>
                                                            <CheckCircle className="mr-2 h-4 w-4" />
                                                            Mark as Processing
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <XCircle className="mr-2 h-4 w-4" />
                                                            Cancel Order
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                                {order.status === 'Processing' && (
                                                    <DropdownMenuItem>
                                                        <Truck className="mr-2 h-4 w-4" />
                                                        Mark as Shipped
                                                    </DropdownMenuItem>
                                                )}
                                                {order.status === 'Shipped' && (
                                                    <DropdownMenuItem>
                                                        <CheckCircle className="mr-2 h-4 w-4" />
                                                        Mark as Delivered
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}