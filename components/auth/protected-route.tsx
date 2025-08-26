// components/ProtectedRoute.tsx
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { RootState } from '@/store/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: ("customer" | "vendor" | "admin")[];
  requireAllRoles?: boolean; // If true, user must have ALL roles; if false, ANY role is sufficient
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requiredRoles = [],
  requireAllRoles = false,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo);
      } else if (requiredRoles.length > 0 && user) {
        const hasRequiredRole = requireAllRoles
          ? requiredRoles.every(role => user.roles.includes(role))
          : requiredRoles.some(role => user.roles.includes(role));
        
        if (!hasRequiredRole) {
          router.push('/unauthorized');
        }
      }
    }
  }, [isAuthenticated, user, isLoading, requiredRoles, requireAllRoles, redirectTo, router]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requireAllRoles
      ? requiredRoles.every(role => user.roles.includes(role))
      : requiredRoles.some(role => user.roles.includes(role));
    
    if (!hasRequiredRole) {
      return null;
    }
  }

  return <>{children}</>;
}