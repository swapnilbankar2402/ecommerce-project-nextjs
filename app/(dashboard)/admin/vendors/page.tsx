// app/admin/vendors/page.tsx
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
    Plus,
    Store,
    Mail,
    Phone,
    MapPin,
    Calendar
} from 'lucide-react';
import Link from 'next/link';

export default function AdminVendorsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Vendors</h1>
                    <p className="text-muted-foreground">Manage vendors in your marketplace</p>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Search vendors..."
                            className="pl-10"
                        />
                    </div>
                    <Button asChild>
                        <Link href="/admin/vendors/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Vendor
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
                        <Store className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">342</div>
                        <p className="text-xs text-muted-foreground">
                            +5.7% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
                        <Store className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">298</div>
                        <p className="text-xs text-muted-foreground">
                            87% of total vendors
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                        <Store className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">
                            Require review
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Vendors Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Vendors</CardTitle>
                    <CardDescription>A list of all vendors in your marketplace</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Vendor</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Products</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[
                                {
                                    id: 1,
                                    name: 'TechGadgets',
                                    email: 'contact@techgadgets.com',
                                    phone: '+1 (555) 123-4567',
                                    location: 'New York, USA',
                                    products: 124,
                                    status: 'Active',
                                    joined: '2023-01-15'
                                },
                                {
                                    id: 2,
                                    name: 'FashionHub',
                                    email: 'info@fashionhub.com',
                                    phone: '+1 (555) 987-6543',
                                    location: 'Los Angeles, USA',
                                    products: 89,
                                    status: 'Active',
                                    joined: '2023-02-20'
                                },
                                {
                                    id: 3,
                                    name: 'HomeEssentials',
                                    email: 'hello@homeessentials.com',
                                    phone: '+1 (555) 456-7890',
                                    location: 'Chicago, USA',
                                    products: 67,
                                    status: 'Pending',
                                    joined: '2023-05-10'
                                },
                                {
                                    id: 4,
                                    name: 'BookWorld',
                                    email: 'contact@bookworld.com',
                                    phone: '+1 (555) 234-5678',
                                    location: 'Miami, USA',
                                    products: 156,
                                    status: 'Active',
                                    joined: '2023-03-05'
                                },
                                {
                                    id: 5,
                                    name: 'SportsGear',
                                    email: 'info@sportsgear.com',
                                    phone: '+1 (555) 876-5432',
                                    location: 'Seattle, USA',
                                    products: 43,
                                    status: 'Inactive',
                                    joined: '2022-11-12'
                                },
                            ].map((vendor) => (
                                <TableRow key={vendor.id}>
                                    <TableCell className="font-medium">{vendor.name}</TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <div className="flex items-center">
                                                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                                                {vendor.email}
                                            </div>
                                            <div className="flex items-center mt-1">
                                                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                                                {vendor.phone}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                                            {vendor.location}
                                        </div>
                                    </TableCell>
                                    <TableCell>{vendor.products}</TableCell>
                                    <TableCell>
                                        <Badge variant={vendor.status === 'Active' ? 'default' : vendor.status === 'Pending' ? 'secondary' : 'outline'}>
                                            {vendor.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                            {vendor.joined}
                                        </div>
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
                                                    <Link href={`/admin/vendors/${vendor.id}`}>View details</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/vendors/${vendor.id}/edit`}>Edit vendor</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>Approve vendor</DropdownMenuItem>
                                                <DropdownMenuItem>Suspend vendor</DropdownMenuItem>
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