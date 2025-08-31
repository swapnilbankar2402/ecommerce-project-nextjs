'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Folder,
  Edit,
  Trash2,
  ArrowLeft,
  Image as ImageIcon,
  Package,
  Calendar,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(true);
      const response = await api.delete(`/api/categories/${params.id}`);
      
      if (response.data.success) {
        alert('Category deleted successfully');
        router.push('/admin/categories');
      }
    } catch (error: any) {
      console.error('Failed to delete category:', error);
      alert(error.response?.data?.error || 'Failed to delete category');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-xl font-semibold mb-2">Category Not Found</h2>
        <p className="text-muted-foreground mb-4">The category you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/admin/categories">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
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
            <Link href="/admin/categories">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Category Details</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/categories/${category._id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Category Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {category.image ? (
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Folder className="h-8 w-8 text-primary" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-xl">{category.name}</CardTitle>
                    <CardDescription>{category.slug}</CardDescription>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={category.isActive ? "bg-green-500 text-white border-none" : "bg-gray-500 text-white border-none"}
                >
                  {category.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {category.description && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                  <p>{category.description}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Created At</h3>
                  <p>{new Date(category.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h3>
                  <p>{new Date(category.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Image */}
          {category.image && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ImageIcon className="mr-2 h-5 w-5" />
                  Category Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Products in Category */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Products in this Category
              </CardTitle>
              <CardDescription>
                List of products belonging to this category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2">No products found</p>
                <p className="text-muted-foreground text-sm">
                  Products assigned to this category will appear here
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Quick Actions */}
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
                <Link href={`/admin/categories/${category._id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Category
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                asChild
              >
                <Link href="/admin/categories">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Categories List
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Category Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Category Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Status</span>
                <Badge 
                  variant="outline" 
                  className={category.isActive ? "bg-green-500 text-white border-none" : "bg-gray-500 text-white border-none"}
                >
                  {category.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Products</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Created</span>
                <span className="font-medium">{new Date(category.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}