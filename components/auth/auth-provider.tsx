import { useEffect } from 'react';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { refreshUserToken } from '@/store/slices/authSlice';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, accessToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Set up token refresh interval
    let refreshInterval: NodeJS.Timeout;
    
    if (isAuthenticated) {
      // Refresh token every 14 minutes (before 15min expiry)
      refreshInterval = setInterval(() => {
        dispatch(refreshUserToken());
      }, 14 * 60 * 1000);
    }

    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [isAuthenticated, dispatch]);

  // Check for existing auth state on app load
  useEffect(() => {
    if (isAuthenticated && !accessToken) {
      dispatch(refreshUserToken());
    }
  }, [isAuthenticated, accessToken, dispatch]);

  return <>{children}</>;
}