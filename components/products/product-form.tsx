// components/products/ProductForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray, Resolver } from 'react-hook-form';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Plus,
    Minus,
    Upload,
    X,
    Save,
    Package,
    DollarSign,
    Tag,
    FileText,
    Settings,
    Image as ImageIcon,
    AlertCircle
} from 'lucide-react';
import { ProductDoc } from '@/models/Product';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '../ui/alert';
import { ProductType } from '@/types/types';

// Define form schema with Zod
// const productFormSchema = z.object({
//   title: z.string().min(3, 'Title must be at least 3 characters'),
//   slug: z.string().min(3, 'Slug must be at least 3 characters'),
//   description: z.string().min(10, 'Description must be at least 10 characters'),
//   basePrice: z.number().min(0.01, 'Price must be greater than 0'),
//   currency: z.string().default('USD'),
//   category: z.string().min(1, 'Category is required'),
//   tags: z.array(z.string()).default([]),
//   status: z.enum(['draft', 'active', 'archived']).default('draft'),
//   seo: z.object({
//     title: z.string().optional(),
//     description: z.string().optional(),
//   }).optional(),
//   images: z.array(z.string()).default([]),
//   variants: z.array(z.object({
//     sku: z.string().min(1, 'SKU is required'),
//     title: z.string().min(1, 'Variant title is required'),
//     options: z.record(z.string()).optional(),
//     price: z.number().min(0.01, 'Price must be greater than 0'),
//     compareAtPrice: z.number().optional(),
//     stock: z.number().min(0, 'Stock must be 0 or greater'),
//     barcode: z.string().optional(),
//     weight: z.number().optional(),
//     images: z.array(z.string()).default([]),
//   })).default([]),
// });


// ✅ Fix: use coerce so input strings parse to numbers automatically
const productFormSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    slug: z.string().min(3, 'Slug must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    basePrice: z.coerce.number().min(0.01, 'Price must be greater than 0').default(0),
    currency: z.string().default('USD'),
    category: z.string().min(1, 'Category is required').default(''),
    tags: z.array(z.string()).default([]),
    status: z.enum(['draft', 'active', 'archived']).default('draft'),
    seo: z
        .object({
            title: z.string().optional(),
            description: z.string().optional(),
        })
        .default({}),
    images: z.array(z.string()).default([]),
    variants: z
        .array(
            z.object({
                sku: z.string().min(1, 'SKU is required'),
                title: z.string().min(1, 'Variant title is required'),
                // options: z.record(z.string()).optional(),
                price: z.coerce.number().min(0.01, 'Price must be greater than 0').default(0),
                compareAtPrice: z.coerce.number().optional(),
                stock: z.coerce.number().min(0, 'Stock must be 0 or greater').default(0),
                barcode: z.string().optional(),
                weight: z.coerce.number().optional(),
                images: z.array(z.string()).default([]),
            })
        )
        .default([]),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
    product?: ProductType;
    onSuccess?: (product: ProductType) => void;
    onCancel?: () => void;
}

interface Category {
    _id: string;
    name: string;
}

interface VariantOptions {
    [key: string]: string;
}

export default function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema) as Resolver<ProductFormValues>,
        defaultValues: {
            title: product?.title ?? '',
            slug: product?.slug ?? '',
            description: product?.description ?? '',
            basePrice: product?.basePrice ?? 0,
            currency: product?.currency ?? 'USD',
            category: product?.category?._id?.toString() ?? '',
            tags: product?.tags ?? [],
            // status: product?.status ?? 'draft',
            seo: {
                title: product?.seo?.title ?? '',
                description: product?.seo?.description ?? '',
            },
            images: product?.images ?? [],
            // variants: product?.variants ?? [],
        },
    });

    const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
        control: form.control,
        name: 'variants',
    });

    useEffect(() => {
        // Fetch categories
        const fetchCategories = async () => {
            try {
                const response = await api.get('/api/categories');
                if (response.data.success) {
                    setCategories(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
                toast.error('Failed to fetch categories');
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        // Initialize tags from form values
        const currentTags = form.getValues('tags');
        if (currentTags) {
            setTags(currentTags);
        }
    }, [form]);

    const onSubmit = async (data: ProductFormValues) => {
        setIsSubmitting(true);
        setError(null);

        try {
            // Add uploaded images to form data
            const formData = {
                ...data,
                images: [...data.images, ...uploadedImages]
            };

            console.log("formData :", formData)

            const url = product ? `/api/products/${product._id}` : '/api/products';
            const method = product ? 'put' : 'post';

            const response = await api[method](url, formData);

            if (response.data.success) {
                toast.success(product ? 'Product updated successfully!' : 'Product created successfully!');
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
            } else {
                const errorMessage = response.data.error || 'Failed to save product';
                setError(errorMessage);
                toast.error(errorMessage);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || error.message || 'Error saving product';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const addTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            const updatedTags = [...tags, newTag.trim()];
            setTags(updatedTags);
            form.setValue('tags', updatedTags);
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        const updatedTags = tags.filter(tag => tag !== tagToRemove);
        setTags(updatedTags);
        form.setValue('tags', updatedTags);
    };

    const addVariant = () => {
        appendVariant({
            sku: '',
            title: '',
            // options: {},
            price: 0,
            compareAtPrice: undefined,
            stock: 0,
            barcode: '',
            weight: undefined,
            images: [],
        });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            // In a real app, you would upload these files to your storage service
            // For now, we'll just create placeholder URLs
            const newImages = Array.from(files).map((file, index) =>
                `https://via.placeholder.com/300x300?text=Image+${uploadedImages.length + index + 1}`
            );

            setUploadedImages(prev => [...prev, ...newImages]);
            form.setValue('images', [...form.getValues('images'), ...newImages]);

            toast.success(`${files.length} image(s) uploaded successfully`);
        }
    };

    const removeImage = (index: number) => {
        const currentImages = form.getValues('images');
        const newImages = currentImages.filter((_, i) => i !== index);
        form.setValue('images', newImages);

        // Also update uploadedImages if needed
        if (index < uploadedImages.length) {
            const newUploadedImages = uploadedImages.filter((_, i) => i !== index);
            setUploadedImages(newUploadedImages);
        }

        toast.success('Image removed');
    };

    const addVariantOption = (variantIndex: number, key: string, value: string) => {
        // const currentOptions = form.getValues(`variants.${variantIndex}.options`) || {};
        // form.setValue(`variants.${variantIndex}.options`, {
        //     ...currentOptions,
        //     [key]: value
        // });
    };

    const removeVariantOption = (variantIndex: number, key: string) => {
        // const currentOptions = form.getValues(`variants.${variantIndex}.options`) || {};
        // const { [key]: _, ...rest } = currentOptions;
        // form.setValue(`variants.${variantIndex}.options`, rest);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">
                    {product ? 'Edit Product' : 'Create New Product'}
                </h1>
                <div className="flex space-x-2">
                    {onCancel && (
                        <Button variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                    )}
                    <Button
                        type="submit"
                        form="product-form"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Package className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                {product ? 'Update Product' : 'Create Product'}
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Form {...form}>
                <form id="product-form" onSubmit={form.handleSubmit(onSubmit)}>
                    <Tabs defaultValue="basic" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="basic">Basic Info</TabsTrigger>
                            <TabsTrigger value="variants">Variants</TabsTrigger>
                            <TabsTrigger value="images">Images</TabsTrigger>
                            <TabsTrigger value="seo">SEO</TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Package className="mr-2 h-5 w-5" />
                                        Basic Information
                                    </CardTitle>
                                    <CardDescription>
                                        Enter the basic information for your product
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Product Title</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Product name" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        This is the name that will be displayed to customers
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="slug"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Slug</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="product-slug" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        URL-friendly version of the product name
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
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Describe your product"
                                                        className="min-h-[120px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Detailed description of your product
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="basePrice"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Base Price</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            placeholder="0.00"
                                                            {...field}
                                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Default price for the product
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="currency"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Currency</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select currency" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="USD">USD ($)</SelectItem>
                                                            <SelectItem value="EUR">EUR (€)</SelectItem>
                                                            <SelectItem value="GBP">GBP (£)</SelectItem>
                                                            <SelectItem value="JPY">JPY (¥)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="status"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Status</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select status" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="draft">Draft</SelectItem>
                                                            <SelectItem value="active">Active</SelectItem>
                                                            <SelectItem value="archived">Archived</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Category</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a category" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {categories.map((category) => (
                                                            <SelectItem key={category._id} value={category._id}>
                                                                {category.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    Select the appropriate category for your product
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div>
                                        <FormLabel>Tags</FormLabel>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {tags.map((tag, index) => (
                                                <Badge key={index} variant="secondary" className="flex items-center">
                                                    {tag}
                                                    <X
                                                        className="h-3 w-3 ml-1 cursor-pointer"
                                                        onClick={() => removeTag(tag)}
                                                    />
                                                </Badge>
                                            ))}
                                        </div>
                                        <div className="flex">
                                            <Input
                                                placeholder="Add a tag"
                                                value={newTag}
                                                onChange={(e) => setNewTag(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        addTag();
                                                    }
                                                }}
                                            />
                                            <Button type="button" onClick={addTag} className="ml-2">
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <FormDescription>
                                            Add tags to help customers find your product
                                        </FormDescription>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="variants" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Package className="mr-2 h-5 w-5" />
                                            Product Variants
                                        </div>
                                        <Button type="button" variant="outline" onClick={addVariant}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Variant
                                        </Button>
                                    </CardTitle>
                                    <CardDescription>
                                        Add different versions of your product (e.g., different sizes, colors)
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {variantFields.length === 0 ? (
                                        <div className="text-center py-8">
                                            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                                            <h3 className="mt-2 text-lg font-medium">No variants</h3>
                                            <p className="text-muted-foreground">
                                                Add variants to offer different options like size, color, etc.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {variantFields.map((field, index) => (
                                                <Card key={field.id} className="p-4">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <h4 className="font-medium">Variant #{index + 1}</h4>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeVariant(index)}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <FormField
                                                            control={form.control}
                                                            name={`variants.${index}.sku`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>SKU</FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder="SKU-123" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name={`variants.${index}.title`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Variant Title</FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder="Red / Medium" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name={`variants.${index}.price`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Price</FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            type="number"
                                                                            step="0.01"
                                                                            placeholder="0.00"
                                                                            {...field}
                                                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name={`variants.${index}.compareAtPrice`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Compare At Price</FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            type="number"
                                                                            step="0.01"
                                                                            placeholder="0.00"
                                                                            {...field}
                                                                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                                                        />
                                                                    </FormControl>
                                                                    <FormDescription>
                                                                        Original price for comparison
                                                                    </FormDescription>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name={`variants.${index}.stock`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Stock</FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            type="number"
                                                                            placeholder="0"
                                                                            {...field}
                                                                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name={`variants.${index}.barcode`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Barcode</FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder="123456789" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>

                                                    {/* Variant Options */}
                                                    <div className="mt-4">
                                                        <FormLabel>Variant Options</FormLabel>
                                                        <div className="space-y-2">
                                                            {/* {Object.entries(form.watch(`variants.${index}.options`) || {}).map(([key, value]) => (
                                                                <div key={key} className="flex items-center space-x-2">
                                                                    <Input
                                                                        value={key}
                                                                        placeholder="Option name (e.g., color)"
                                                                        onChange={(e) => {
                                                                            const newOptions = { ...form.watch(`variants.${index}.options`) };
                                                                            delete newOptions[key];
                                                                            if (e.target.value) {
                                                                                newOptions[e.target.value] = value;
                                                                            }
                                                                            form.setValue(`variants.${index}.options`, newOptions);
                                                                        }}
                                                                    />
                                                                    <span>:</span>
                                                                    <Input
                                                                        value={value}
                                                                        placeholder="Option value (e.g., red)"
                                                                        onChange={(e) => addVariantOption(index, key, e.target.value)}
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => removeVariantOption(index, key)}
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            ))} */}

                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                // onClick={() => {
                                                                //     const currentOptions = form.watch(`variants.${index}.options`) || {};
                                                                //     form.setValue(`variants.${index}.options`, {
                                                                //         ...currentOptions,
                                                                //         'option': 'value'
                                                                //     });
                                                                // }}
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                                Add Option
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="images" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <ImageIcon className="mr-2 h-5 w-5" />
                                        Product Images
                                    </CardTitle>
                                    <CardDescription>
                                        Upload images for your product
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center mb-4">
                                        <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <div className="mt-4">
                                            <p className="text-lg font-medium">Upload Product Images</p>
                                            <p className="text-muted-foreground mt-1">
                                                Drag and drop images here or click to browse
                                            </p>
                                        </div>
                                        <div className="mt-4">
                                            <Input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                id="image-upload"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => document.getElementById('image-upload')?.click()}
                                            >
                                                <Upload className="mr-2 h-4 w-4" />
                                                Select Images
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Image Preview */}
                                    {form.watch('images') && form.watch('images').length > 0 && (
                                        <div className="mt-6">
                                            <h3 className="text-lg font-medium mb-4">Product Images</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {form.watch('images').map((image, index) => (
                                                    <div key={index} className="relative group">
                                                        <img
                                                            src={image}
                                                            alt={`Product image ${index + 1}`}
                                                            className="w-full h-32 object-cover rounded-md border"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            onClick={() => removeImage(index)}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <FormDescription className="mt-4">
                                        Recommended: Square images, at least 1000x1000px
                                    </FormDescription>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="seo" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Settings className="mr-2 h-5 w-5" />
                                        SEO Settings
                                    </CardTitle>
                                    <CardDescription>
                                        Optimize your product for search engines
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="seo.title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>SEO Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Product SEO title" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Title for search engines (max 60 characters)
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="seo.description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>SEO Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Product SEO description"
                                                        className="min-h-[120px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Description for search engines (max 160 characters)
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </form>
            </Form>
        </div>
    );
}