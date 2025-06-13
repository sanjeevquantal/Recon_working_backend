
import { useState, useCallback } from 'react';
import { handleException, showErrorToast } from '@/utils/exceptionHandler';
import { useToast } from '@/hooks/use-toast';

type ErrorType = 'validation' | 'api' | 'network' | 'auth' | 'permission' | 'unknown';

interface ErrorState {
  hasError: boolean;
  message: string;
  type: ErrorType;
  code?: string;
}

interface UseExceptionHandlerReturn {
  error: ErrorState;
  showError: (error: unknown, message?: string) => void;
  clearError: () => void;
  withErrorHandling: <T extends (...args: any[]) => Promise<any>>(
    fn: T,
    errorMessage?: string
  ) => (...args: Parameters<T>) => Promise<ReturnType<T>>;
}

export function useExceptionHandler(): UseExceptionHandlerReturn {
  const [error, setError] = useState<ErrorState>({
    hasError: false,
    message: '',
    type: 'unknown',
  });
  
  const { toast } = useToast();

  const showError = useCallback((err: unknown, fallbackMessage?: string) => {
    const errorDetails = handleException(err, fallbackMessage);
    
    setError({
      hasError: true,
      message: errorDetails.message,
      type: errorDetails.type,
      code: errorDetails.code,
    });
    
    // Also show a toast for immediate feedback
    let title: string;
    
    switch (errorDetails.type) {
      case 'validation':
        title = 'Validation Error';
        break;
      case 'api':
        title = 'API Error';
        break;
      case 'network':
        title = 'Network Error';
        break;
      case 'auth':
        title = 'Authentication Error';
        break;
      case 'permission':
        title = 'Permission Error';
        break;
      default:
        title = 'Error';
    }
    
    toast({
      title,
      description: errorDetails.message,
      variant: 'destructive',
    });
  }, [toast]);

  const clearError = useCallback(() => {
    setError({
      hasError: false,
      message: '',
      type: 'unknown',
    });
  }, []);

  const withErrorHandling = useCallback(<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    errorMessage?: string
  ): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
    return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
      try {
        return await fn(...args);
      } catch (err) {
        showError(err, errorMessage);
        throw err;
      }
    };
  }, [showError]);

  return {
    error,
    showError,
    clearError,
    withErrorHandling,
  };
}
