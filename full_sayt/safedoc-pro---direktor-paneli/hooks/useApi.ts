import { useState, useEffect, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

// Generic hook for API calls
export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions = {}
): UseApiState<T> & { refetch: () => Promise<void> } {
  const { immediate = true, onSuccess, onError } = options;
  
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiCall();
      setState({ data: result, loading: false, error: null });
      onSuccess?.(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Xatolik yuz berdi';
      setState({ data: null, loading: false, error: errorMessage });
      onError?.(errorMessage);
    }
  }, [apiCall, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    refetch: execute,
  };
}

// Hook for mutations (POST, PUT, DELETE operations)
export function useMutation<T, P = any>(
  apiCall: (params: P) => Promise<T>,
  options: UseApiOptions = {}
): {
  mutate: (params: P) => Promise<void>;
  loading: boolean;
  error: string | null;
  data: T | null;
} {
  const { onSuccess, onError } = options;
  
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(async (params: P) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiCall(params);
      setState({ data: result, loading: false, error: null });
      onSuccess?.(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Xatolik yuz berdi';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      onError?.(errorMessage);
      throw error; // Re-throw so caller can handle if needed
    }
  }, [apiCall, onSuccess, onError]);

  return {
    mutate,
    ...state,
  };
}

// Hook for paginated data
export function usePaginatedApi<T>(
  apiCall: (params: { page: number; limit: number; [key: string]: any }) => Promise<{
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>,
  initialParams: { page?: number; limit?: number; [key: string]: any } = {}
) {
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    ...initialParams,
  });

  const { data, loading, error, refetch } = useApi(
    () => apiCall(params),
    { immediate: true }
  );

  const updateParams = useCallback((newParams: Partial<typeof params>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);

  const nextPage = useCallback(() => {
    if (data && params.page < data.totalPages) {
      updateParams({ page: params.page + 1 });
    }
  }, [data, params.page, updateParams]);

  const prevPage = useCallback(() => {
    if (params.page > 1) {
      updateParams({ page: params.page - 1 });
    }
  }, [params.page, updateParams]);

  const goToPage = useCallback((page: number) => {
    updateParams({ page });
  }, [updateParams]);

  return {
    data: data?.data || [],
    pagination: {
      total: data?.total || 0,
      page: data?.page || 1,
      limit: data?.limit || 10,
      totalPages: data?.totalPages || 0,
    },
    loading,
    error,
    refetch,
    updateParams,
    nextPage,
    prevPage,
    goToPage,
    params,
  };
}

// Hook for real-time data (polling)
export function usePolling<T>(
  apiCall: () => Promise<T>,
  interval: number = 5000,
  options: UseApiOptions & { enabled?: boolean } = {}
) {
  const { enabled = true, ...apiOptions } = options;
  
  const { data, loading, error, refetch } = useApi(apiCall, {
    ...apiOptions,
    immediate: enabled,
  });

  useEffect(() => {
    if (!enabled) return;

    const intervalId = setInterval(() => {
      refetch();
    }, interval);

    return () => clearInterval(intervalId);
  }, [enabled, interval, refetch]);

  return { data, loading, error, refetch };
}