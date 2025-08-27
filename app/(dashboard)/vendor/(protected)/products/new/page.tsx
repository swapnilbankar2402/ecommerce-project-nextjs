'use client';

import { useRouter } from 'next/navigation';
import { ProductType } from '@/types/types';
import ProductForm from '@/components/products/product-form';

export default function VendorCreateProductsPage() {
    const router = useRouter();

    const handleSuccess = (product: ProductType) => {
        // Redirect to product details page
        router.push(`/products/${product._id}`);
    };

    const handleCancel = () => {
        // Navigate back to products list
        router.push('/products');
    };

    return (
        <div className="container mx-auto py-10 px-4 max-w-6xl">
            <ProductForm
                onSuccess={handleSuccess}
                onCancel={handleCancel}
            />
        </div>
    );
}