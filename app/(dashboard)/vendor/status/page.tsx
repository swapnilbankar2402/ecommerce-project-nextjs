// app/vendor/status/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    FileText,
    User,
    Building,
    Store,
    CreditCard,
    Mail,
    Phone,
    Calendar,
    RefreshCw
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type ApplicationStatus = 'pending' | 'approved' | 'rejected';

interface VendorData {
    _id: string;
    email: string;
    businessName: string;
    businessType: string;
    taxId: string;
    contact: {
        name: string;
        phone: string;
        email: string;
    };
    currentApplication: {
        storeName: string;
        storeDescription: string;
        logo?: string;
        banner?: string;
        policies: {
            shipping: string;
            returns: string;
            warranty: string;
        };
        verification: {
            status: ApplicationStatus;
            notes?: string;
            submittedAt: string;
            reviewedAt?: string;
        };
    };
    payoutInfo: {
        method: string;
        accountDetails: any;
    };
    createdAt: string;
    updatedAt: string;
}

export default function VendorApplicationStatus() {
    const [vendor, setVendor] = useState<VendorData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const searchParams = useSearchParams();
    const vendorId = searchParams.get('id');
    const router = useRouter();
    const { isAuthenticated } = useSelector((state: RootState) => state.vendorAuth);

    const fetchVendorStatus = async () => {
        try {
            setIsLoading(true);
            setError(null);

            let response;

            if (vendorId) {
                // Fetch by ID from URL parameter
                response = await api.get(`/api/vendors/${vendorId}`);
            } else if (isAuthenticated) {
                // Fetch current logged-in vendor
                response = await api.get('/api/vendors/me');
            } else {
                // No ID and not authenticated
                setError('You must be logged in to view your application status');
                return;
            }

            if (response.data.success) {
                setVendor(response.data.data);
            } else {
                setError(response.data.message || 'Failed to fetch vendor information');
            }
        } catch (err: any) {
            console.error('Error fetching vendor status:', err);
            setError(err.response?.data?.message || 'An error occurred while fetching your application status');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVendorStatus();
    }, [vendorId, isAuthenticated]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchVendorStatus();
        setIsRefreshing(false);
    };

    const handleReapply = async () => {
        try {
            const response = await api.post('/api/vendor/reapply');
            if (response.data.success) {
                toast.success('Application reset successfully. Please update your information.');
                fetchVendorStatus();
            } else {
                toast.error(response.data.error || 'Failed to reset application');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'An error occurred during reapplication');
        }
    };

    const getStatusIcon = (status: ApplicationStatus) => {
        switch (status) {
            case 'approved':
                return <CheckCircle className="h-6 w-6 text-green-500" />;
            case 'rejected':
                return <XCircle className="h-6 w-6 text-red-500" />;
            case 'pending':
            default:
                return <Clock className="h-6 w-6 text-yellow-500" />;
        }
    };

    const getStatusColor = (status: ApplicationStatus) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'pending':
            default:
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    const getStatusText = (status: ApplicationStatus) => {
        switch (status) {
            case 'approved':
                return 'Approved';
            case 'rejected':
                return 'Rejected';
            case 'pending':
            default:
                return 'Pending Review';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-20 px-4 max-w-4xl flex justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading application status...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-20 px-4 max-w-4xl">
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6">
                        <div className="flex items-start space-x-4">
                            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-red-800">Error</h3>
                                <p className="text-red-700 mt-1">{error}</p>
                                <Button
                                    onClick={() => router.push('/vendor/login')}
                                    className="mt-3 bg-red-600 hover:bg-red-700"
                                >
                                    Go to Login
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!vendor) {
        return (
            <div className="container mx-auto py-20 px-4 max-w-4xl">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">No Application Found</h3>
                            <p className="text-muted-foreground mb-4">
                                You don't have an active vendor application.
                            </p>
                            <Button onClick={() => router.push('/vendor/become-a-vendor')}>
                                Start Application
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const status = vendor.currentApplication.verification.status;

    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold mb-2">Vendor Application Status</h1>
                <p className="text-muted-foreground">
                    Track the progress of your vendor application
                </p>
            </div>

            {/* Status Card */}
            <Card className="mb-8">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">Application Status</CardTitle>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                        >
                            {isRefreshing ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <RefreshCw className="h-4 w-4" />
                            )}
                            <span className="ml-2 hidden sm:inline">Refresh</span>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-lg border bg-muted/50">
                        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                            {getStatusIcon(status)}
                            <div>
                                <h3 className="text-lg font-medium">Application {getStatusText(status)}</h3>
                                <p className="text-sm text-muted-foreground">
                                    Submitted on {formatDate(vendor.currentApplication.verification.submittedAt)}
                                </p>
                            </div>
                        </div>
                        <Badge className={getStatusColor(status)}>
                            {getStatusText(status)}
                        </Badge>
                    </div>

                    {status === 'rejected' && vendor.currentApplication.verification.notes && (
                        <Alert className="mt-6 border-red-200 bg-red-50">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <AlertDescription className="text-red-700">
                                <strong>Reason for rejection:</strong> {vendor.currentApplication.verification.notes}
                            </AlertDescription>
                        </Alert>
                    )}

                    {status === 'rejected' && (
                        <div className="mt-6 flex justify-end">
                            <Button onClick={handleReapply}>
                                Reapply Now
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Vendor Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Business Information */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center text-lg">
                            <Building className="h-5 w-5 mr-2" />
                            Business Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Business Name:</span>
                            <span className="font-medium">{vendor.businessName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Business Type:</span>
                            <span className="font-medium capitalize">{vendor.businessType}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Tax ID:</span>
                            <span className="font-medium">{vendor.taxId}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center text-lg">
                            <User className="h-5 w-5 mr-2" />
                            Contact Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Contact Name:</span>
                            <span className="font-medium">{vendor.contact.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Email:</span>
                            <span className="font-medium">{vendor.contact.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Phone:</span>
                            <span className="font-medium">{vendor.contact.phone}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Store Information */}
            <Card className="mb-8">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                        <Store className="h-5 w-5 mr-2" />
                        Store Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Store Name:</span>
                        <span className="font-medium">{vendor.currentApplication.storeName}</span>
                    </div>
                    <div>
                        <p className="text-muted-foreground mb-1">Store Description:</p>
                        <p className="font-medium">{vendor.currentApplication.storeDescription}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {vendor.currentApplication.logo && (
                            <div>
                                <p className="text-muted-foreground mb-1">Logo:</p>
                                <img
                                    src={vendor.currentApplication.logo}
                                    alt="Store logo"
                                    className="w-16 h-16 object-contain rounded border"
                                />
                            </div>
                        )}
                        {vendor.currentApplication.banner && (
                            <div>
                                <p className="text-muted-foreground mb-1">Banner:</p>
                                <img
                                    src={vendor.currentApplication.banner}
                                    alt="Store banner"
                                    className="w-full h-16 object-cover rounded border"
                                />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Payout Information */}
            <Card className="mb-8">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                        <CreditCard className="h-5 w-5 mr-2" />
                        Payout Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Payout Method:</span>
                        <span className="font-medium capitalize">{vendor.payoutInfo.method}</span>
                    </div>

                    {vendor.payoutInfo.method === 'bank' && (
                        <>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Account Holder:</span>
                                <span className="font-medium">{vendor.payoutInfo.accountDetails.accountHolderName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Bank Name:</span>
                                <span className="font-medium">{vendor.payoutInfo.accountDetails.bankName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Account Number:</span>
                                <span className="font-medium">•••• {vendor.payoutInfo.accountDetails.accountNumber?.slice(-4)}</span>
                            </div>
                        </>
                    )}

                    {vendor.payoutInfo.method === 'paypal' && (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">PayPal Email:</span>
                            <span className="font-medium">{vendor.payoutInfo.accountDetails.paypalEmail}</span>
                        </div>
                    )}

                    {vendor.payoutInfo.method === 'stripe' && (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Stripe Email:</span>
                            <span className="font-medium">{vendor.payoutInfo.accountDetails.stripeEmail}</span>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                        <Calendar className="h-5 w-5 mr-2" />
                        Application Timeline
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <div className="mt-1">
                                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                            </div>
                            <div>
                                <p className="font-medium">Application Submitted</p>
                                <p className="text-sm text-muted-foreground">
                                    {formatDate(vendor.currentApplication.verification.submittedAt)}
                                </p>
                            </div>
                        </div>

                        {vendor.currentApplication.verification.reviewedAt && (
                            <div className="flex items-start space-x-3">
                                <div className="mt-1">
                                    <div className={`h-3 w-3 rounded-full ${status === 'approved' ? 'bg-green-500' :
                                            status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                                        }`}></div>
                                </div>
                                <div>
                                    <p className="font-medium">
                                        Application {status === 'approved' ? 'Approved' : status === 'rejected' ? 'Rejected' : 'Reviewed'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(vendor.currentApplication.verification.reviewedAt)}
                                    </p>
                                </div>
                            </div>
                        )}

                        {status === 'pending' && (
                            <div className="flex items-start space-x-3">
                                <div className="mt-1">
                                    <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                                </div>
                                <div>
                                    <p className="font-medium text-muted-foreground">Under Review</p>
                                    <p className="text-sm text-muted-foreground">
                                        Your application is currently being reviewed by our team
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button
                    variant="outline"
                    onClick={() => router.push('/vendor/dashboard')}
                    className="flex-1"
                >
                    Go to Dashboard
                </Button>
                {status === 'approved' && (
                    <Button
                        onClick={() => router.push('/vendor/dashboard')}
                        className="flex-1"
                    >
                        Start Selling
                    </Button>
                )}
                {status === 'rejected' && (
                    <Button
                        onClick={handleReapply}
                        className="flex-1"
                    >
                        Reapply Now
                    </Button>
                )}
            </div>
        </div>
    );
}