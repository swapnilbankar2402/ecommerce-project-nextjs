'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import api from '@/lib/api';
import CategoryForm from '@/components/categories/category-form';

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/categories/${params.id}`);
        
        if (response.data.success) {
          setCategory(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch category:', error);
        router.push('/admin/categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [params.id, router]);

  const handleSuccess = (category: any) => {
    // Redirect to category details page
    router.push(`/admin/categories/${category._id}`);
  };

  const handleCancel = () => {
    // Navigate back to category details page
    router.push(`/admin/categories/${params.id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <CategoryForm 
        category={category || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}