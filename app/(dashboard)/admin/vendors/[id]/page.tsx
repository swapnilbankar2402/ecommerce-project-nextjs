// app/admin/vendors/[id]/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Store,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Package,
  DollarSign,
  TrendingUp,
  FileText,
  Image as ImageIcon,
  ChevronLeft,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { VendorType } from '@/types/types';

export default function VendorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [vendor, setVendor] = useState<VendorType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("params.id :", params.id);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/vendors/${params.id}`);
        
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
  }, [params.id]);

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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'suspended':
        return 'Suspended';
      default: // pending
        return 'Pending';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
            <Link href="/admin/vendors">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Vendors
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Vendor Details</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/vendors/${vendor._id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      {/* Vendor Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Store className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">{vendor.storeName}</CardTitle>
                  <CardDescription>{vendor.email}</CardDescription>
                </div>
              </div>
              <Badge 
                variant="outline" 
                className={`${getStatusColor(vendor.status)} text-white border-none`}
              >
                <div className="flex items-center space-x-1">
                  {getStatusIcon(vendor.status)}
                  <span>{getStatusText(vendor.status)}</span>
                </div>
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
              <p>{vendor.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Support Email</h3>
                {/* <p>{vendor.settings.supportEmail}</p> */}
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Store Slug</h3>
                <p className="font-mono text-sm">{vendor.slug}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vendor Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Products</span>
              </div>
              <span className="font-medium">42</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Revenue</span>
              </div>
              <span className="font-medium">$12,450</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Orders</span>
              </div>
              <span className="font-medium">324</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Branding */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <ImageIcon className="mr-2 h-5 w-5" />
            Branding
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Store Logo</h3>
              {vendor.logoUrl ? (
                <div className="border rounded-md p-2 inline-block">
                  <img 
                    src={vendor.logoUrl} 
                    alt="Store logo" 
                    className="w-32 h-32 object-contain"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 flex items-center justify-center border border-dashed border-muted-foreground/25 rounded-md">
                  <span className="text-sm text-muted-foreground">No logo</span>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Store Banner</h3>
              {vendor.bannerUrl ? (
                <div className="border rounded-md overflow-hidden">
                  <img 
                    src={vendor.bannerUrl} 
                    alt="Store banner" 
                    className="w-full h-32 object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-32 flex items-center justify-center border border-dashed border-muted-foreground/25 rounded-md">
                  <span className="text-sm text-muted-foreground">No banner</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Policies */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Store Policies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Shipping Policy</h3>
            {/* <p>{vendor.settings.shippingPolicy}</p> */}
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Return Policy</h3>
            {/* <p>{vendor.settings.returnPolicy}</p> */}
          </div>
        </CardContent>
      </Card>

      {/* Owner Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Owner Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              {vendor.ownerUser?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="font-medium">{vendor.ownerUser?.name || 'Unknown'}</p>
              <p className="text-sm text-muted-foreground">{vendor.ownerUser?.email || 'No email'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timestamps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Timestamps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Created At</h3>
              {/* <p>{new Date(vendor?.createdAt).toLocaleString()}</p> */}
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
              {/* <p>{new Date(vendor?.updatedAt).toLocaleString()}</p> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}