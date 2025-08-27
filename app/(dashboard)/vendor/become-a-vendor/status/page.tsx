// app/vendor/status/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    CheckCircle,
    Clock,
    XCircle,
    FileText,
    Store,
    ArrowLeft,
    Mail,
    Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import { VendorDoc } from '@/models/Vendor';
import api from '@/lib/api';

export default function ApplicationStatusPage() {
    const [vendor, setVendor] = useState<VendorDoc | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVendor = async () => {
            try {
                setLoading(true);
                const response = await api.get('/api/vendors/me');

                if (response.data.success) {
                    setVendor(response.data.data);
                } else {
                    setError(response.data.error || 'Failed to fetch vendor data');
                }
            } catch (err: any) {
                setError(err.response?.data?.error || 'Failed to fetch vendor data');
            } finally {
                setLoading(false);
            }
        };

        fetchVendor();
    }, []);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle className="h-10 w-10 text-green-500" />;
            case 'rejected':
                return <XCircle className="h-10 w-10 text-red-500" />;
            case 'suspended':
                return <XCircle className="h-10 w-10 text-yellow-500" />;
            default:
                return <Clock className="h-10 w-10 text-blue-500" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'approved':
                return 'Your application has been approved!';
            case 'rejected':
                return 'Your application has been rejected.';
            case 'suspended':
                return 'Your vendor account has been suspended.';
            default:
                return 'Your application is under review.';
        }
    };

    const getStatusDescription = (status: string) => {
        switch (status) {
            case 'approved':
                return 'Congratulations! You can now start selling on our marketplace.';
            case 'rejected':
                return 'Unfortunately, your application did not meet our requirements.';
            case 'suspended':
                return 'Your vendor account has been suspended due to policy violations.';
            default:
                return 'Our team is reviewing your application. This usually takes 1-3 business days.';
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto py-10 px-4 max-w-4xl">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (error || !vendor) {
        return (
            <div className="container mx-auto py-10 px-4 max-w-4xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Vendor Application Not Found</CardTitle>
                        <CardDescription>
                            {error || "We couldn't find your vendor application. Please submit a new application."}
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

    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <div className="mb-6">
                <Button variant="ghost" asChild>
                    <Link href="/products">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Homepage
                    </Link>
                </Button>
            </div>
            <Card className="border-none shadow-lg">
                <CardHeader className="text-center pb-8">
                    <div className="flex justify-center mb-4">
                        {getStatusIcon(vendor.status)}
                    </div>
                    <CardTitle className="text-2xl">
                        {getStatusText(vendor.status)}
                    </CardTitle>
                    <CardDescription className="text-base max-w-md mx-auto">
                        {getStatusDescription(vendor.status)}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex justify-center">
                        <Badge
                            variant={
                                vendor.status === 'approved' ? 'default' :
                                    vendor.status === 'rejected' ? 'destructive' :
                                        vendor.status === 'suspended' ? 'secondary' : 'outline'
                            }
                            className="text-sm px-4 py-2"
                        >
                            {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                        </Badge>
                    </div>

                    {/* Store Information */}
                    <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="font-medium mb-3 flex items-center">
                            <Store className="mr-2 h-4 w-4" />
                            Store Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Store Name</p>
                                <p className="font-medium">{vendor.storeName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-medium">{vendor.email}</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-sm text-muted-foreground">Description</p>
                                <p className="mt-1">{vendor.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Branding */}
                    <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="font-medium mb-3 flex items-center">
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Branding
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-muted-foreground mb-2">Store Logo</p>
                                {vendor.logoUrl ? (
                                    <img
                                        src={vendor.logoUrl}
                                        alt="Store logo"
                                        className="w-32 h-32 object-contain border rounded-md"
                                    />
                                ) : (
                                    <div className="w-32 h-32 flex items-center justify-center border border-dashed border-muted-foreground/25 rounded-md">
                                        <span className="text-sm text-muted-foreground">No logo</span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-2">Store Banner</p>
                                {vendor.bannerUrl ? (
                                    <img
                                        src={vendor.bannerUrl}
                                        alt="Store banner"
                                        className="w-full h-32 object-cover rounded-md"
                                    />
                                ) : (
                                    <div className="w-full h-32 flex items-center justify-center border border-dashed border-muted-foreground/25 rounded-md">
                                        <span className="text-sm text-muted-foreground">No banner</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Policies */}
                    <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="font-medium mb-3 flex items-center">
                            <FileText className="mr-2 h-4 w-4" />
                            Store Policies
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-muted-foreground">Shipping Policy</p>
                                <p className="mt-1">{vendor?.settings?.shippingPolicy}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Return Policy</p>
                                <p className="mt-1">{vendor?.settings?.returnPolicy}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground flex items-center">
                                    <Mail className="mr-2 h-4 w-4" />
                                    Support Email
                                </p>
                                <p className="mt-1">{vendor.settings?.supportEmail}</p>
                            </div>
                        </div>
                    </div>

                    {/* Timestamps */}
                    <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Submitted At</p>
                                <p>{new Date(vendor.createdAt).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                                <p>{new Date(vendor.updatedAt).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {vendor.status === 'rejected' && (
                        <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                            <p className="text-sm font-medium text-destructive mb-1">Rejection Reason</p>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                        {vendor.status === 'approved' && (
                            <Button asChild>
                                <Link href="/vendor">
                                    <Store className="mr-2 h-4 w-4" />
                                    Go to Vendor Dashboard
                                </Link>
                            </Button>
                        )}
                        {(vendor.status === 'rejected' || vendor.status === 'suspended') && (
                            <Button variant="outline" asChild>
                                <Link href="/vendor/apply">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Submit New Application
                                </Link>
                            </Button>
                        )}
                        <Button variant="ghost" asChild>
                            <Link href="/products">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Homepage
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}