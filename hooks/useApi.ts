import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

interface UseApiOptions {
  headers?: Record<string, string>;
}

export function useApi() {
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const apiRequest = async <T = any>(
    url: string,
    options: RequestInit = {},
    apiOptions: UseApiOptions = {}
  ): Promise<T> => {
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...apiOptions.headers,
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  return { apiRequest };
}