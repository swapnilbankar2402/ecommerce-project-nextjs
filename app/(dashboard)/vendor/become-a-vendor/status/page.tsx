// app/vendor/apply/status/page.tsx
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
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

interface ApplicationStatus {
    status: 'pending' | 'approved' | 'rejected' | 'suspended';
    submittedAt: string;
    reviewedAt?: string;
    rejectionReason?: string;
}

export default function ApplicationStatusPage() {
    const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, you would fetch the application status from your API
        const fetchStatus = async () => {
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Mock data - in a real app, this would come from your API
                setApplicationStatus({
                    status: 'pending',
                    submittedAt: '2023-06-15T10:30:00Z',
                });
            } catch (error) {
                console.error('Failed to fetch application status:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
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

    if (!applicationStatus) {
        return (
            <div className="container mx-auto py-10 px-4 max-w-4xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Application Not Found</CardTitle>
                        <CardDescription>
                            We couldn't find your vendor application. Please submit a new application.
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
                    <Link href="/vendor">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </Button>
            </div>

            <Card className="border-none shadow-lg">
                <CardHeader className="text-center pb-8">
                    <div className="flex justify-center mb-4">
                        {getStatusIcon(applicationStatus.status)}
                    </div>
                    <CardTitle className="text-2xl">
                        {getStatusText(applicationStatus.status)}
                    </CardTitle>
                    <CardDescription className="text-base max-w-md mx-auto">
                        {getStatusDescription(applicationStatus.status)}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="flex justify-center">
                        <Badge
                            variant={
                                applicationStatus.status === 'approved' ? 'default' :
                                    applicationStatus.status === 'rejected' ? 'destructive' :
                                        applicationStatus.status === 'suspended' ? 'secondary' : 'outline'
                            }
                            className="text-sm px-4 py-2"
                        >
                            {applicationStatus.status.charAt(0).toUpperCase() + applicationStatus.status.slice(1)}
                        </Badge>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Submitted At</p>
                                <p>{new Date(applicationStatus.submittedAt).toLocaleString()}</p>
                            </div>
                            {applicationStatus.reviewedAt && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Reviewed At</p>
                                    <p>{new Date(applicationStatus.reviewedAt).toLocaleString()}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {applicationStatus.rejectionReason && (
                        <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                            <p className="text-sm font-medium text-destructive mb-1">Rejection Reason</p>
                            <p>{applicationStatus.rejectionReason}</p>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                        {applicationStatus.status === 'approved' && (
                            <Button asChild>
                                <Link href="/vendor">
                                    <Store className="mr-2 h-4 w-4" />
                                    Go to Vendor Dashboard
                                </Link>
                            </Button>
                        )}

                        {(applicationStatus.status === 'rejected' || applicationStatus.status === 'suspended') && (
                            <Button variant="outline" asChild>
                                <Link href="/vendor/apply">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Submit New Application
                                </Link>
                            </Button>
                        )}

                        <Button variant="ghost" asChild>
                            <Link href="/vendor">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Dashboard
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}