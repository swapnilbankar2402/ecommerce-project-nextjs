'use client';
import CategoryForm from '@/components/categories/category-form';
import { useRouter } from 'next/navigation';

export default function NewCategoryPage() {
    const router = useRouter();

    const handleSuccess = (category: any) => {
        // Redirect to category details page
        router.push(`/admin/categories/${category._id}`);
    };

    const handleCancel = () => {
        // Navigate back to categories list
        router.push('/admin/categories');
    };

    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <CategoryForm
                onSuccess={handleSuccess}
                onCancel={handleCancel}
            />
        </div>
    );
}