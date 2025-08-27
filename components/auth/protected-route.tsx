"use client"

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { RootState } from '@/store/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requiredRoles = [],
  redirectTo = '/auth/sign-in'
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useSelector((state: RootState) => state.auth);
  // console.log("isAuthenticated in protected route :", isAuthenticated);
  // console.log("user in protected route :", user);
  // console.log("isLoading in protected route :", isLoading);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo);
      } else if (requiredRoles.length > 0 && user) {
        const hasRequiredRole = requiredRoles.some(role => user.roles.includes(role as any));
        if (!hasRequiredRole) {
          router.push('/unauthorized');
        }
      }
    }
  }, [isAuthenticated, user, isLoading, requiredRoles, redirectTo, router]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.some(role => user.roles.includes(role as any));
    if (!hasRequiredRole) {
      return null;
    }
  }

  return <>{children}</>;
}