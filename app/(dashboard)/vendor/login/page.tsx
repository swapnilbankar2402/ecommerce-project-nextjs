// app/vendor/login/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { clearVendorError, loginVendor } from '@/store/slices/vendorAuthSlice';
import { toast } from 'sonner';
import Link from 'next/link';

export default function VendorLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { vendor, isAuthenticated, isLoading, error } = useSelector((state: RootState) => state.vendorAuth)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await dispatch(loginVendor({ email, password }));
      if (loginVendor.fulfilled.match(response)) {
        // Login successful - redirect will happen in useEffect
        console.log("Login successful", response);
        toast.success(response.payload.message || 'Login success')
      } else if (loginVendor.rejected.match(response)) {
        // Login failed - error is already in Redux state
        console.log("Login failed:", response.payload);
        toast.error(response.payload || 'Login failed')
      }
    } catch (error) {
      console.log("error at vendor login :", error)
    }
  };


  // Clear errors when component mounts or when user starts typing
  useEffect(() => {
    if (error) {
      dispatch(clearVendorError());
    }
  }, [email, password, dispatch, error]);


  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated && vendor) {
      router.push('/vendor/dashboard');
    }
  }, [isAuthenticated, vendor, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Vendor Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your vendor account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/vendor/become-a-vendor" className="underline underline-offset-4">
                Create an vendor account 
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}