'use client';
import { useState } from 'react';
import { useForm, useFieldArray, FieldPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Store,
  Image as ImageIcon,
  FileText,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Upload,
  X
} from 'lucide-react';
import { toast } from 'sonner';

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
});

type VendorFormValues = z.infer<typeof vendorFormSchema>;

const steps = [
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
    id: 'review',
    title: 'Review',
    description: 'Review your application',
    icon: CheckCircle,
  },
];

export default function VendorApplicationPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    },
    mode: 'onChange',
  });

  const { watch, trigger, formState: { isValid, dirtyFields } } = form;
  const watchedValues = watch();

  const nextStep = async () => {
    // If we're at the last step, don't do anything
    if (currentStep === steps.length - 1) {
      return;
    }

    // Validate fields for the current step
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isStepValid = await trigger(fieldsToValidate);

    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const getFieldsForStep = (
    step: number
  ): FieldPath<VendorFormValues>[] => {
    switch (step) {
      case 0:
        return ["storeName", "email", "description"];
      case 1:
        return ["logoUrl", "bannerUrl"];
      case 2:
        return ["shippingPolicy", "returnPolicy", "supportEmail"];
      default:
        return [];
    }
  };

  const onSubmit = async (data: VendorFormValues) => {
    setIsSubmitting(true);
    try {
      const slug = data.storeName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const vendorData = {
        ...data,
        slug,
      };

      const response = await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendorData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        form.reset();
        setCurrentStep(0);
      } else {
        toast.error(result.message || 'Failed to submit application');
      }
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitApplication = async () => {
    // Validate all fields before submission
    const isValid = await trigger();

    if (isValid) {
      // If valid, submit the form
      form.handleSubmit(onSubmit)();
    } else {
      toast.error('Please fix all errors before submitting');
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-2">Become a Vendor</h1>
        <p className="text-muted-foreground">Join our marketplace and start selling your products</p>
      </div>

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
            <form onSubmit={(e) => {
              e.preventDefault(); // Prevent default form submission
            }} className="space-y-8">
              {/* Step Indicator */}
              <div className="flex justify-between mb-8">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex flex-col items-center">
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
                      <h2 className="text-xl font-semibold mb-4">Store Information</h2>
                      <p className="text-muted-foreground mb-6">
                        Please provide details about your store
                      </p>
                    </div>
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
                            Describe what your store offers
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
                      <h2 className="text-xl font-semibold mb-4">Branding</h2>
                      <p className="text-muted-foreground mb-6">
                        Upload your store logo and banner
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="logoUrl"
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
                                        // In a real app, this would open a file picker
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
                        name="bannerUrl"
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
                                        // In a real app, this would open a file picker
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
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Store Policies</h2>
                      <p className="text-muted-foreground mb-6">
                        Set your shipping and return policies
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="shippingPolicy"
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
                      name="returnPolicy"
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
                      name="supportEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Support Email</FormLabel>
                          <FormControl>
                            <Input placeholder="support@example.com" type="email" {...field} />
                          </FormControl>
                          <FormDescription>
                            Customers will use this to contact you
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
                      <h2 className="text-xl font-semibold mb-4">Review Your Application</h2>
                      <p className="text-muted-foreground mb-6">
                        Please review all information before submitting
                      </p>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Store Information</h3>
                        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">Store Name:</span>
                            <span>{watchedValues.storeName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Email:</span>
                            <span>{watchedValues.email}</span>
                          </div>
                          <div className="mt-2">
                            <span className="font-medium">Description:</span>
                            <p className="mt-1">{watchedValues.description}</p>
                          </div>
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <h3 className="text-lg font-medium mb-2">Branding</h3>
                        <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                          <div className="flex items-center space-x-4">
                            <span className="font-medium">Logo:</span>
                            {watchedValues.logoUrl ? (
                              <img
                                src={watchedValues.logoUrl}
                                alt="Store logo"
                                className="w-16 h-16 object-contain"
                              />
                            ) : (
                              <span className="text-muted-foreground">No logo uploaded</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="font-medium">Banner:</span>
                            {watchedValues.bannerUrl ? (
                              <img
                                src={watchedValues.bannerUrl}
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
                            <p className="mt-1">{watchedValues.shippingPolicy}</p>
                          </div>
                          <div className="mt-2">
                            <span className="font-medium">Return Policy:</span>
                            <p className="mt-1">{watchedValues.returnPolicy}</p>
                          </div>
                          <div className="flex justify-between mt-2">
                            <span className="font-medium">Support Email:</span>
                            <span>{watchedValues.supportEmail}</span>
                          </div>
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