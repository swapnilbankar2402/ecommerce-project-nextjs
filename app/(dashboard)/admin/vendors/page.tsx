"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Vendor {
    id: string
    name: string
    email: string
    storeName: string
    status: "pending" | "approved" | "suspended"
}

export default function AdminVendorsPage() {
    const [vendors] = useState<Vendor[]>([
        { id: "v1", name: "Alice", email: "alice@example.com", storeName: "Alice Fashion", status: "approved" },
        { id: "v2", name: "Bob", email: "bob@example.com", storeName: "Bob Gadgets", status: "pending" },
        { id: "v3", name: "Charlie", email: "charlie@example.com", storeName: "Charlie Decor", status: "suspended" },
    ])

    const getStatusBadge = (status: Vendor["status"]) => {
        switch (status) {
            case "approved":
                return <Badge variant="secondary">Approved</Badge>
            case "pending":
                return <Badge variant="secondary">Pending</Badge>
            case "suspended":
                return <Badge variant="destructive">Suspended</Badge>
            default:
                return <Badge>Unknown</Badge>
        }
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Vendors Management</h1>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>All Vendors</CardTitle>
                        <Input placeholder="Search vendors..." className="max-w-sm" />
                    </div>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Store</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {vendors.map((vendor) => (
                                <TableRow key={vendor.id}>
                                    <TableCell className="font-medium">{vendor.name}</TableCell>
                                    <TableCell>{vendor.email}</TableCell>
                                    <TableCell>{vendor.storeName}</TableCell>
                                    <TableCell>{getStatusBadge(vendor.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => alert(`Viewing ${vendor.name}`)}>View</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => alert(`Approving ${vendor.name}`)}>Approve</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => alert(`Suspending ${vendor.name}`)}>Suspend</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => alert(`Deleting ${vendor.name}`)}>Delete</DropdownMenuItem>
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
    )
}
