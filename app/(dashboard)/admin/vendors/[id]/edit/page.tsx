'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Store,
    Mail,
    Image as ImageIcon,
    FileText,
    Save,
    ChevronLeft,
    CheckCircle,
    XCircle,
    AlertCircle,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { VendorDoc } from '@/models/Vendor';
import { VendorType } from '@/types/types';

// Define form schema with Zod
const vendorFormSchema = z.object({
    storeName: z.string().min(2, 'Store name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    logoUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    bannerUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    shippingPolicy: z.string().min(10, 'Shipping policy must be at least 10 characters'),
    returnPolicy: z.string().min(10, 'Return policy must be at least 10 characters'),
    supportEmail: z.string().email('Please enter a valid email'),
    status: z.enum(['pending', 'approved', 'rejected', 'suspended']),
});

type VendorFormValues = z.infer<typeof vendorFormSchema>;

export default function VendorEditPage() {
    const params = useParams();
    const router = useRouter();
    const [vendor, setVendor] = useState<VendorType | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<VendorFormValues>({
        resolver: zodResolver(vendorFormSchema),
        defaultValues: {
            storeName: '',
            email: '',
            description: '',
            logoUrl: '',
            bannerUrl: '',
            shippingPolicy: '',
            returnPolicy: '',
            supportEmail: '',
            status: 'pending',
        },
    });

      const getStatusIcon = (status: string) => {
        switch (status) {
          case 'approved':
            return <CheckCircle className="h-4 w-4" />;
          case 'rejected':
            return <XCircle className="h-4 w-4" />;
          case 'suspended':
            return <AlertCircle className="h-4 w-4" />;
          default: // pending
            return <FileText className="h-4 w-4" />;
        }
      };
    
      const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      case 'suspended':
        return 'bg-yellow-500';
      default: // pending
        return 'bg-blue-500';
    }
  };

    useEffect(() => {
        const fetchVendor = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/api/vendors/${params.id}`);

                if (response.data.success) {
                    const vendorData = response.data.data;
                    setVendor(vendorData);

                    // Set form values with vendor data
                    form.reset({
                        storeName: vendorData.storeName,
                        email: vendorData.email,
                        description: vendorData.description,
                        logoUrl: vendorData.logoUrl || '',
                        bannerUrl: vendorData.bannerUrl || '',
                        shippingPolicy: vendorData.settings.shippingPolicy,
                        returnPolicy: vendorData.settings.returnPolicy,
                        supportEmail: vendorData.settings.supportEmail,
                        status: vendorData.status,
                    });
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
    }, [params.id, form]);

    const onSubmit = async (data: VendorFormValues) => {
        setIsSubmitting(true);
        try {
            const vendorData = {
                ...data,
                settings: {
                    shippingPolicy: data.shippingPolicy,
                    returnPolicy: data.returnPolicy,
                    supportEmail: data.supportEmail,
                }
            };

            const res = await api.put(`/api/vendors/${params.id}`, vendorData);

            if (res.data.success) {
                // Redirect to vendor details page
                router.push(`/admin/vendors/${params.id}`);
            } else {
                setError(res.data.error || "Failed to update vendor.");
            }
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to update vendor.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !vendor) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <h2 className="text-xl font-semibold mb-2">Vendor Not Found</h2>
                <p className="text-muted-foreground mb-4">{error || "The vendor you're looking for doesn't exist."}</p>
                <Button asChild>
                    <Link href="/admin/vendors">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Vendors
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" asChild>
                        <Link href={`/admin/vendors/${vendor._id}`}>
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Back to Vendor
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Vendor</h1>
                </div>
                <Badge
                    variant="outline"
                    className={`${getStatusColor(vendor.status)} text-white border-none`}
                >
                    <div className="flex items-center space-x-1">
                        {getStatusIcon(vendor.status)}
                        <span>{vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}</span>
                    </div>
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {/* Store Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Store className="mr-2 h-5 w-5" />
                                        Store Information
                                    </CardTitle>
                                    <CardDescription>Update the basic information for this vendor</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="storeName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Store Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Your store name" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        This will be displayed to customers
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email Address</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="store@example.com" type="email" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        For notifications and support
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Store Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Tell customers about your store"
                                                        className="min-h-[120px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Describe what this store offers
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            {/* Branding */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <ImageIcon className="mr-2 h-5 w-5" />
                                        Branding
                                    </CardTitle>
                                    <CardDescription>Update the store's visual branding</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="logoUrl"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Store Logo</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="https://example.com/logo.png" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        URL to the store's logo image
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="bannerUrl"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Store Banner</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="https://example.com/banner.png" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        URL to the store's banner image
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Policies */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <FileText className="mr-2 h-5 w-5" />
                                        Store Policies
                                    </CardTitle>
                                    <CardDescription>Update the store's policies</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="shippingPolicy"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Shipping Policy</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Describe the shipping policy"
                                                        className="min-h-[120px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Explain how this vendor handles shipping
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="returnPolicy"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Return Policy</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Describe the return policy"
                                                        className="min-h-[120px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Explain the return and refund process
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="supportEmail"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Support Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="support@example.com" type="email" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Customers will use this to contact the vendor
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            {/* Status */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Vendor Status</CardTitle>
                                    <CardDescription>Update the vendor's account status</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Status</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                        <SelectItem value="approved">Approved</SelectItem>
                                                        <SelectItem value="rejected">Rejected</SelectItem>
                                                        <SelectItem value="suspended">Suspended</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    {form.watch('status') === 'pending' && 'Vendor is waiting for approval'}
                                                    {form.watch('status') === 'approved' && 'Vendor is active and can sell products'}
                                                    {form.watch('status') === 'rejected' && 'Vendor application was rejected'}
                                                    {form.watch('status') === 'suspended' && 'Vendor account is temporarily suspended'}
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>

                {/* Preview Panel */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Current Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Status</span>
                                    <Badge
                                        variant="outline"
                                        className={`${getStatusColor(vendor.status)} text-white border-none`}
                                    >
                                        <div className="flex items-center space-x-1">
                                            {getStatusIcon(vendor.status)}
                                            <span>{vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}</span>
                                        </div>
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Created</span>
                                    <span className="text-sm">{new Date(vendor.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Last Updated</span>
                                    <span className="text-sm">{new Date(vendor.updatedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                asChild
                            >
                                <Link href={`/admin/vendors/${vendor._id}`}>
                                    View Vendor Details
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                asChild
                            >
                                <Link href="/admin/vendors">
                                    Back to Vendors List
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}