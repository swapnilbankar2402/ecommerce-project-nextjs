'use client';
import { useState, useEffect } from 'react';
import { useForm, useFieldArray, FieldPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Store,
    Building,
    User,
    Image as ImageIcon,
    FileText,
    CreditCard,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Upload,
    X,
    AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';

// Define form schema with Zod based on updated vendor schema
// const vendorFormSchema = z.object({
//     businessName: z.string().min(2, 'Business name must be at least 2 characters'),
//     businessType: z.enum(['individual', 'company']),
//     taxId: z.string().min(1, 'Tax ID is required'),
//     contact: z.object({
//         name: z.string().min(2, 'Contact name is required'),
//         phone: z.string().min(10, 'Phone number must be at least 10 characters'),
//         email: z.string().email('Please enter a valid email'),
//     }),
//     storeName: z.string().min(2, 'Store name must be at least 2 characters'),
//     storeDescription: z.string().min(10, 'Description must be at least 10 characters'),
//     logo: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
//     banner: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
//     policies: z.object({
//         shipping: z.string().min(10, 'Shipping policy must be at least 10 characters'),
//         returns: z.string().min(10, 'Return policy must be at least 10 characters'),
//         warranty: z.string().min(10, 'Warranty policy must be at least 10 characters'),
//     }),
//     payoutInfo: z.object({
//         method: z.enum(['bank', 'paypal', 'stripe']),
//         accountDetails: z.object({
//             // Bank details
//             accountNumber: z.string().optional(),
//             routingNumber: z.string().optional(),
//             accountHolderName: z.string().optional(),
//             bankName: z.string().optional(),
//             // PayPal details
//             paypalEmail: z.string().email().optional(),
//             // Stripe details
//             stripeEmail: z.string().email().optional(),
//         }).refine(data => {
//             if (data.paypalEmail) return true;
//             if (data.stripeEmail) return true;
//             if (data.accountNumber && data.routingNumber && data.accountHolderName && data.bankName) return true;
//             return false;
//         }, 'Please provide complete payout information')
//     })
// });


const vendorFormSchema = z.object({
    businessName: z.string().min(2, 'Business name must be at least 2 characters'),
    businessType: z.enum(['individual', 'company']),
    taxId: z.string().min(1, 'Tax ID is required'),
    contact: z.object({
        name: z.string().min(2, 'Contact name is required'),
        phone: z.string().min(10, 'Phone number must be at least 10 characters'),
        email: z.string().email('Please enter a valid email'),
    }),
    storeName: z.string().min(2, 'Store name must be at least 2 characters'),
    storeDescription: z.string().min(10, 'Description must be at least 10 characters'),
    logo: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    banner: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    policies: z.object({
        shipping: z.string().min(10, 'Shipping policy must be at least 10 characters'),
        returns: z.string().min(10, 'Return policy must be at least 10 characters'),
        warranty: z.string().min(10, 'Warranty policy must be at least 10 characters'),
    }),
    payoutInfo: z.discriminatedUnion('method', [
        z.object({
            method: z.literal('bank'),
            accountDetails: z.object({
                accountNumber: z.string().min(1, 'Account number is required'),
                routingNumber: z.string().min(1, 'Routing number is required'),
                accountHolderName: z.string().min(1, 'Account holder name is required'),
                bankName: z.string().min(1, 'Bank name is required'),
                paypalEmail: z.string().optional(),
                stripeEmail: z.string().optional(),
            })
        }),
        z.object({
            method: z.literal('paypal'),
            accountDetails: z.object({
                accountNumber: z.string().optional(),
                routingNumber: z.string().optional(),
                accountHolderName: z.string().optional(),
                bankName: z.string().optional(),
                paypalEmail: z.string().email('Please enter a valid PayPal email'),
                stripeEmail: z.string().optional(),
            })
        }),
        z.object({
            method: z.literal('stripe'),
            accountDetails: z.object({
                accountNumber: z.string().optional(),
                routingNumber: z.string().optional(),
                accountHolderName: z.string().optional(),
                bankName: z.string().optional(),
                paypalEmail: z.string().optional(),
                stripeEmail: z.string().email('Please enter a valid Stripe email'),
            })
        })
    ])
});

type VendorFormValues = z.infer<typeof vendorFormSchema>;

const steps = [
    {
        id: 'business',
        title: 'Business Information',
        description: 'Enter your business details',
        icon: Building,
    },
    {
        id: 'contact',
        title: 'Contact Information',
        description: 'Enter your contact details',
        icon: User,
    },
    {
        id: 'store',
        title: 'Store Information',
        description: 'Enter your store details',
        icon: Store,
    },
    {
        id: 'branding',
        title: 'Branding',
        description: 'Upload your logo and banner',
        icon: ImageIcon,
    },
    {
        id: 'policies',
        title: 'Policies',
        description: 'Set your store policies',
        icon: FileText,
    },
    {
        id: 'payout',
        title: 'Payout Information',
        description: 'Set your payout details',
        icon: CreditCard,
    },
    {
        id: 'review',
        title: 'Review',
        description: 'Review your application',
        icon: CheckCircle,
    },
];

const PAYOUT_FIELDS = {
    method: "payoutInfo.method" as FieldPath<VendorFormValues>,
    bankAccountNumber: "payoutInfo.accountDetails.accountNumber" as FieldPath<VendorFormValues>,
    bankRoutingNumber: "payoutInfo.accountDetails.routingNumber" as FieldPath<VendorFormValues>,
    bankAccountHolderName: "payoutInfo.accountDetails.accountHolderName" as FieldPath<VendorFormValues>,
    bankName: "payoutInfo.accountDetails.bankName" as FieldPath<VendorFormValues>,
    paypalEmail: "payoutInfo.accountDetails.paypalEmail" as FieldPath<VendorFormValues>,
    stripeEmail: "payoutInfo.accountDetails.stripeEmail" as FieldPath<VendorFormValues>,
};

export default function VendorApplicationForm() {
    const { user, isAuthenticated } = useSelector(
        (state: RootState) => state.auth
    );
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const form = useForm<VendorFormValues>({
        resolver: zodResolver(vendorFormSchema),
        defaultValues: {
            businessName: '',
            businessType: 'individual',
            taxId: '',
            contact: {
                name: '',
                phone: '',
                email: '',
            },
            storeName: '',
            storeDescription: '',
            logo: '',
            banner: '',
            policies: {
                shipping: '',
                returns: '',
                warranty: '',
            },
            payoutInfo: {
                method: 'bank',
                accountDetails: {
                    accountNumber: '',
                    routingNumber: '',
                    accountHolderName: '',
                    bankName: '',
                    paypalEmail: '',
                    stripeEmail: '',
                }
            }
        },
        mode: 'onChange',
    });

    const { watch, trigger, formState: { isValid, dirtyFields }, setValue } = form;
    const watchedValues = watch();
    const payoutMethod = watch('payoutInfo.method');

    // Check if user already has a vendor application
    useEffect(() => {
        const checkExistingApplication = async () => {
            if (!isAuthenticated) {
                setIsLoading(false);
                return;
            }
            try {
                const response = await api.get('/api/vendors/me');
                if (response.data.success) {
                    const vendor = response.data.data;
                    setApplicationStatus(vendor.currentApplication.verification.status);

                    if (vendor.currentApplication.verification.notes) {
                        setRejectionReason(vendor.currentApplication.verification.notes);
                    }

                    // Pre-fill form with existing data
                    setValue('businessName', vendor.businessName);
                    setValue('businessType', vendor.businessType);
                    setValue('taxId', vendor.taxId);
                    setValue('contact.name', vendor.contact.name);
                    setValue('contact.phone', vendor.contact.phone);
                    setValue('contact.email', vendor.contact.email);
                    setValue('storeName', vendor.currentApplication.storeName);
                    setValue('storeDescription', vendor.currentApplication.storeDescription);
                    setValue('logo', vendor.currentApplication.logo || '');
                    setValue('banner', vendor.currentApplication.banner || '');
                    setValue('policies.shipping', vendor.currentApplication.policies.shipping);
                    setValue('policies.returns', vendor.currentApplication.policies.returns);
                    setValue('policies.warranty', vendor.currentApplication.policies.warranty);

                    if (vendor.payoutInfo) {
                        setValue('payoutInfo.method', vendor.payoutInfo.method);
                        if (vendor.payoutInfo.method === 'bank') {
                            setValue('payoutInfo.accountDetails.accountNumber', vendor.payoutInfo.accountDetails.accountNumber || '');
                            setValue('payoutInfo.accountDetails.routingNumber', vendor.payoutInfo.accountDetails.routingNumber || '');
                            setValue('payoutInfo.accountDetails.accountHolderName', vendor.payoutInfo.accountDetails.accountHolderName || '');
                            setValue('payoutInfo.accountDetails.bankName', vendor.payoutInfo.accountDetails.bankName || '');
                        } else if (vendor.payoutInfo.method === 'paypal') {
                            setValue('payoutInfo.accountDetails.paypalEmail', vendor.payoutInfo.accountDetails.paypalEmail || '');
                        } else if (vendor.payoutInfo.method === 'stripe') {
                            setValue('payoutInfo.accountDetails.stripeEmail', vendor.payoutInfo.accountDetails.stripeEmail || '');
                        }
                    }

                    // If application is rejected, allow editing
                    if (vendor.currentApplication.verification.status === 'rejected') {
                        setIsEditing(true);
                    } else {
                        // Redirect to status page if not rejected
                        router.push('/vendor/become-a-vendor/status');
                    }
                }
            } catch (error: any) {
                // // If 404, no application exists, so continue
                // if (error.response?.status !== 404) {
                //     console.error('Error checking vendor application:', error);
                //     toast.error('Failed to check application status');
                // }
            } finally {
                setIsLoading(false);
            }
        };
        checkExistingApplication();
    }, [isAuthenticated, router, setValue]);

    const handleReapply = async () => {
        try {
            setIsLoading(true);
            const response = await api.post('/api/vendor/reapply');
            if (response.data.success) {
                toast.success('Application reset successfully. Please update your information.');
                setIsEditing(true);
                setApplicationStatus('pending');
                setRejectionReason(null);
            } else {
                toast.error(response.data.error || 'Failed to reset application');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'An error occurred during reapplication');
        } finally {
            setIsLoading(false);
        }
    };

    const nextStep = async () => {
        if (currentStep === steps.length - 1) return;

        const fieldsToValidate = getFieldsForStep(currentStep);
        const isStepValid = await trigger(fieldsToValidate);

        if (isStepValid) {
            setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
        }
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const getFieldsForStep = (step: number): FieldPath<VendorFormValues>[] => {
        switch (step) {
            case 0: return ["businessName", "businessType", "taxId"];
            case 1: return ["contact.name", "contact.phone", "contact.email"];
            case 2: return ["storeName", "storeDescription"];
            case 3: return ["logo", "banner"];
            case 4: return ["policies.shipping", "policies.returns", "policies.warranty"];
            case 5: {
                const baseFields = [PAYOUT_FIELDS.method];
                if (payoutMethod === 'bank') {
                    return [
                        ...baseFields,
                        PAYOUT_FIELDS.bankAccountNumber,
                        PAYOUT_FIELDS.bankRoutingNumber,
                        PAYOUT_FIELDS.bankAccountHolderName,
                        PAYOUT_FIELDS.bankName
                    ];
                } else if (payoutMethod === 'paypal') {
                    return [
                        ...baseFields,
                        PAYOUT_FIELDS.paypalEmail
                    ];
                } else if (payoutMethod === 'stripe') {
                    return [
                        ...baseFields,
                        PAYOUT_FIELDS.stripeEmail
                    ];
                }
                return baseFields;
            }
            default: return [];
        }
    };

    const onSubmit = async (data: VendorFormValues) => {
        console.log("data is here :", data)
        setIsSubmitting(true);
        try {
            const vendorData = {
                businessName: data.businessName,
                businessType: data.businessType,
                taxId: data.taxId,
                contact: data.contact,
                currentApplication: {
                    storeName: data.storeName,
                    storeDescription: data.storeDescription,
                    logo: data.logo,
                    banner: data.banner,
                    policies: {
                        shipping: data.policies.shipping,
                        returns: data.policies.returns,
                        warranty: data.policies.warranty,
                    },
                },
                payoutInfo: {
                    method: data.payoutInfo.method,
                    accountDetails: data.payoutInfo.accountDetails
                }
            };

            const endpoint = isEditing ? '/api/vendors/update-application' : '/api/vendors/register';
            const method = isEditing ? 'PUT' : 'POST';

            const res = await api({
                method,
                url: endpoint,
                data: vendorData
            });

            if (res.data.success) {
                toast.success(res.data.message || "Application submitted successfully!");
                setTimeout(() => {
                    router.push('/vendor/status');
                }, 1500);
            } else {
                toast.error(res.data.error || "Failed to submit application.");
            }
        } catch (err: any) {
            toast.error(err.response?.data?.error || err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // const handleSubmitApplication = async () => {
    //     const isValid = await trigger();
    //     if (isValid) {
    //         form.handleSubmit(onSubmit)();
    //     } else {

    //         // Get all form errors
    //         const errors = form.formState.errors;
    //         const errorMessages = Object.values(errors).map(error => error.message);

    //         console.log("errors :", errors)
    //         console.log("errorMessages :", errorMessages)

    //         // // Create a user-friendly error message
    //         // if (errorMessages.length > 0) {
    //         //     // Join the first few error messages
    //         //     const errorMessage = errorMessages.slice(0, 3).join('. ');
    //         //     toast.error(`Please fix the following errors: ${errorMessage}`);
    //         // } else {
    //         //     toast.error('Please fix all errors before submitting');
    //         // }
    //         // return;
    //     }
    // };


    const handleSubmitApplication = async () => {
        // First, validate all fields except the payout details
        const nonPayoutFields = [
            "businessName", "businessType", "taxId",
            "contact.name", "contact.phone", "contact.email",
            "storeName", "storeDescription",
            "logo", "banner",
            "policies.shipping", "policies.returns", "policies.warranty"
        ];

        const areNonPayoutFieldsValid = await trigger(nonPayoutFields as FieldPath<VendorFormValues>[]);

        if (!areNonPayoutFieldsValid) {
            toast.error('Please fix all errors before submitting');
            return;
        }

        // Then validate only the relevant payout fields based on the selected method
        const payoutFields = getFieldsForStep(5);
        const arePayoutFieldsValid = await trigger(payoutFields);

        if (arePayoutFieldsValid) {
            form.handleSubmit(onSubmit)();
        } else {
            toast.error('Please fix payout information errors');
        }
    };

    const progress = ((currentStep + 1) / steps.length) * 100;

    if (isLoading) {
        return (
            <div className="container mx-auto py-20 px-4 max-w-4xl flex justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Checking application status...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 px-4 ">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold mb-2">Become a Vendor</h1>
                <p className="text-muted-foreground">Join our marketplace and start selling your products</p>
            </div>

            {/* Rejection Notice */}
            {applicationStatus === 'rejected' && !isEditing && (
                <Card className="mb-6 border-red-200 bg-red-50">
                    <CardContent className="pt-6">
                        <div className="flex items-start space-x-4">
                            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-red-800">Application Rejected</h3>
                                <p className="text-red-700 mt-1">
                                    {rejectionReason || 'Your application was rejected. Please review the feedback and reapply.'}
                                </p>
                                <Button
                                    onClick={handleReapply}
                                    className="mt-3 bg-red-600 hover:bg-red-700"
                                >
                                    Reapply Now
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* User Info Card */}
            {user && (
                <Card className="mb-6 border-none shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-medium">Applying as: {user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card className="border-none shadow-lg">
                <CardHeader className="pb-6">
                    <div className="flex items-center justify-between mb-2">
                        <CardTitle className="text-xl">Vendor Application</CardTitle>
                        <Badge variant="outline">Step {currentStep + 1} of {steps.length}</Badge>
                    </div>
                    <Progress value={progress} className="h-2" />
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
                            {/* Step Indicator */}
                            <div className="flex justify-between mb-8 overflow-x-auto">
                                {steps.map((step, index) => (
                                    <div key={step.id} className="flex flex-col items-center min-w-[100px]">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${index <= currentStep
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted text-muted-foreground'
                                                }`}
                                        >
                                            <step.icon className="h-5 w-5" />
                                        </div>
                                        <span className={`text-sm font-medium ${index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                                            }`}>
                                            {step.title}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Step Content */}
                            <div className="min-h-[400px]">
                                {currentStep === 0 && (
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-xl font-semibold mb-4">Business Information</h2>
                                            <p className="text-muted-foreground mb-6">
                                                Please provide details about your business
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="businessName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Business Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Your business name" {...field} />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Legal name of your business
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="businessType"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Business Type</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select business type" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="individual">Individual</SelectItem>
                                                                <SelectItem value="company">Company</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormDescription>
                                                            Select your business structure
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="taxId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Tax ID</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Your tax ID number" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Your business tax identification number
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )}

                                {currentStep === 1 && (
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                                            <p className="text-muted-foreground mb-6">
                                                Please provide your contact details
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="contact.name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Contact Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Full name" {...field} />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Primary contact person
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="contact.phone"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Phone Number</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Your phone number" {...field} />
                                                        </FormControl>
                                                        <FormDescription>
                                                            For customer support and notifications
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="contact.email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Contact Email</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="contact@example.com" type="email" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        For customer support and notifications
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-xl font-semibold mb-4">Store Information</h2>
                                            <p className="text-muted-foreground mb-6">
                                                Please provide details about your store
                                            </p>
                                        </div>
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
                                            name="storeDescription"
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
                                                        Describe what your store offers
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )}

                                {currentStep === 3 && (
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-xl font-semibold mb-4">Branding</h2>
                                            <p className="text-muted-foreground mb-6">
                                                Upload your store logo and banner
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="logo"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Store Logo</FormLabel>
                                                        <FormControl>
                                                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                                                                {field.value ? (
                                                                    <div className="relative">
                                                                        <img
                                                                            src={field.value}
                                                                            alt="Store logo"
                                                                            className="w-32 h-32 object-contain"
                                                                        />
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6"
                                                                            onClick={() => field.onChange('')}
                                                                        >
                                                                            <X className="h-3 w-3" />
                                                                        </Button>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                                                                        <p className="text-sm text-muted-foreground mb-2">
                                                                            Upload your logo
                                                                        </p>
                                                                        <Button
                                                                            type="button"
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() => {
                                                                                field.onChange('https://via.placeholder.com/150');
                                                                            }}
                                                                        >
                                                                            <Upload className="mr-2 h-4 w-4" />
                                                                            Upload
                                                                        </Button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Recommended size: 200x200px
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="banner"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Store Banner</FormLabel>
                                                        <FormControl>
                                                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                                                                {field.value ? (
                                                                    <div className="relative">
                                                                        <img
                                                                            src={field.value}
                                                                            alt="Store banner"
                                                                            className="w-full h-32 object-cover rounded-md"
                                                                        />
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6"
                                                                            onClick={() => field.onChange('')}
                                                                        >
                                                                            <X className="h-3 w-3" />
                                                                        </Button>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                                                                        <p className="text-sm text-muted-foreground mb-2">
                                                                            Upload your banner
                                                                        </p>
                                                                        <Button
                                                                            type="button"
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() => {
                                                                                field.onChange('https://via.placeholder.com/800x200');
                                                                            }}
                                                                        >
                                                                            <Upload className="mr-2 h-4 w-4" />
                                                                            Upload
                                                                        </Button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Recommended size: 1200x300px
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                )}

                                {currentStep === 4 && (
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-xl font-semibold mb-4">Store Policies</h2>
                                            <p className="text-muted-foreground mb-6">
                                                Set your store policies
                                            </p>
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="policies.shipping"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Shipping Policy</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Describe your shipping policy"
                                                            className="min-h-[120px]"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Explain how you handle shipping
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="policies.returns"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Return Policy</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Describe your return policy"
                                                            className="min-h-[120px]"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Explain your return and refund process
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="policies.warranty"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Warranty Policy</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Describe your warranty policy"
                                                            className="min-h-[120px]"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Explain your product warranty terms
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )}

                                {currentStep === 5 && (
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-xl font-semibold mb-4">Payout Information</h2>
                                            <p className="text-muted-foreground mb-6">
                                                Set your payout details
                                            </p>
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="payoutInfo.method"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Payout Method</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select payout method" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="bank">Bank Transfer</SelectItem>
                                                            <SelectItem value="paypal">PayPal</SelectItem>
                                                            <SelectItem value="stripe">Stripe</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormDescription>
                                                        How you'd like to receive payments
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {payoutMethod === 'bank' && (
                                            <div className="space-y-4">
                                                <FormField
                                                    control={form.control}
                                                    name="payoutInfo.accountDetails.accountHolderName"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Account Holder Name</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Name on bank account" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="payoutInfo.accountDetails.bankName"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Bank Name</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Your bank name" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="payoutInfo.accountDetails.accountNumber"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Account Number</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Your account number" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <FormField
                                                    control={form.control}
                                                    name="payoutInfo.accountDetails.routingNumber"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Routing Number</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Your routing number" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        )}

                                        {payoutMethod === 'paypal' && (
                                            <FormField
                                                control={form.control}
                                                name="payoutInfo.accountDetails.paypalEmail"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>PayPal Email</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="your-paypal-email@example.com" type="email" {...field} />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Your PayPal account email
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )}

                                        {payoutMethod === 'stripe' && (
                                            <FormField
                                                control={form.control}
                                                name="payoutInfo.accountDetails.stripeEmail"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Stripe Email</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="your-stripe-email@example.com" type="email" {...field} />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Your Stripe account email
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )}
                                    </div>
                                )}

                                {currentStep === 6 && (
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-xl font-semibold mb-4">Review Your Application</h2>
                                            <p className="text-muted-foreground mb-6">
                                                Please review all information before submitting
                                            </p>
                                        </div>
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-lg font-medium mb-2">Business Information</h3>
                                                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="font-medium">Business Name:</span>
                                                        <span>{watchedValues.businessName}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="font-medium">Business Type:</span>
                                                        <span className="capitalize">{watchedValues.businessType}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="font-medium">Tax ID:</span>
                                                        <span>{watchedValues.taxId}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Separator />
                                            <div>
                                                <h3 className="text-lg font-medium mb-2">Contact Information</h3>
                                                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="font-medium">Contact Name:</span>
                                                        <span>{watchedValues.contact.name}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="font-medium">Phone:</span>
                                                        <span>{watchedValues.contact.phone}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="font-medium">Email:</span>
                                                        <span>{watchedValues.contact.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Separator />
                                            <div>
                                                <h3 className="text-lg font-medium mb-2">Store Information</h3>
                                                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="font-medium">Store Name:</span>
                                                        <span>{watchedValues.storeName}</span>
                                                    </div>
                                                    <div className="mt-2">
                                                        <span className="font-medium">Description:</span>
                                                        <p className="mt-1">{watchedValues.storeDescription}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <Separator />
                                            <div>
                                                <h3 className="text-lg font-medium mb-2">Branding</h3>
                                                <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                                                    <div className="flex items-center space-x-4">
                                                        <span className="font-medium">Logo:</span>
                                                        {watchedValues.logo ? (
                                                            <img
                                                                src={watchedValues.logo}
                                                                alt="Store logo"
                                                                className="w-16 h-16 object-contain"
                                                            />
                                                        ) : (
                                                            <span className="text-muted-foreground">No logo uploaded</span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center space-x-4">
                                                        <span className="font-medium">Banner:</span>
                                                        {watchedValues.banner ? (
                                                            <img
                                                                src={watchedValues.banner}
                                                                alt="Store banner"
                                                                className="w-32 h-16 object-cover rounded"
                                                            />
                                                        ) : (
                                                            <span className="text-muted-foreground">No banner uploaded</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <Separator />
                                            <div>
                                                <h3 className="text-lg font-medium mb-2">Policies</h3>
                                                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                                                    <div className="mt-2">
                                                        <span className="font-medium">Shipping Policy:</span>
                                                        <p className="mt-1">{watchedValues.policies.shipping}</p>
                                                    </div>
                                                    <div className="mt-2">
                                                        <span className="font-medium">Return Policy:</span>
                                                        <p className="mt-1">{watchedValues.policies.returns}</p>
                                                    </div>
                                                    <div className="mt-2">
                                                        <span className="font-medium">Warranty Policy:</span>
                                                        <p className="mt-1">{watchedValues.policies.warranty}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <Separator />
                                            <div>
                                                <h3 className="text-lg font-medium mb-2">Payout Information</h3>
                                                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="font-medium">Method:</span>
                                                        <span className="capitalize">{watchedValues.payoutInfo.method}</span>
                                                    </div>
                                                    {watchedValues.payoutInfo.method === 'bank' && (
                                                        <>
                                                            <div className="flex justify-between">
                                                                <span className="font-medium">Account Holder:</span>
                                                                <span>{watchedValues.payoutInfo.accountDetails.accountHolderName}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="font-medium">Bank Name:</span>
                                                                <span>{watchedValues.payoutInfo.accountDetails.bankName}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="font-medium">Account Number:</span>
                                                                <span>•••• {watchedValues.payoutInfo.accountDetails.accountNumber?.slice(-4)}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="font-medium">Routing Number:</span>
                                                                <span>{watchedValues.payoutInfo.accountDetails.routingNumber}</span>
                                                            </div>
                                                        </>
                                                    )}
                                                    {watchedValues.payoutInfo.method === 'paypal' && (
                                                        <div className="flex justify-between">
                                                            <span className="font-medium">PayPal Email:</span>
                                                            <span>{watchedValues.payoutInfo.accountDetails.paypalEmail}</span>
                                                        </div>
                                                    )}
                                                    {watchedValues.payoutInfo.method === 'stripe' && (
                                                        <div className="flex justify-between">
                                                            <span className="font-medium">Stripe Email:</span>
                                                            <span>{watchedValues.payoutInfo.accountDetails.stripeEmail}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation Buttons */}
                                <div className="flex justify-between pt-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={prevStep}
                                        disabled={currentStep === 0}
                                    >
                                        <ChevronLeft className="mr-2 h-4 w-4" />
                                        Previous
                                    </Button>
                                    {currentStep < steps.length - 1 ? (
                                        <Button type="button" onClick={nextStep}>
                                            Next
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    ) : (
                                        <Button
                                            type="button"
                                            onClick={handleSubmitApplication}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Submit Application'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}