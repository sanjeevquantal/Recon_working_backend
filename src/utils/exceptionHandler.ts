import { toast } from '@/hooks/use-toast';

type ErrorType = 'validation' | 'api' | 'network' | 'auth' | 'permission' | 'unknown';

interface ErrorDetails {
  message: string;
  type: ErrorType;
  code?: string;
  context?: Record<string, any>;
}

/**
 * Handles application exceptions in a standardized way
 * @param error The error object
 * @param fallbackMessage Optional fallback message if error doesn't contain one
 * @returns The processed error details
 */
export function handleException(error: unknown, fallbackMessage = 'An unexpected error occurred'): ErrorDetails {
  console.error("Error occurred:", error);
  
  // Default error details
  const errorDetails: ErrorDetails = {
    message: fallbackMessage,
    type: 'unknown'
  };

  try {
    // Handle standard Error objects
    if (error instanceof Error) {
      errorDetails.message = error.message;
      
      // Check for network errors
      if (error.name === 'NetworkError' || error.message.includes('network') || error.message.includes('fetch')) {
        errorDetails.type = 'network';
      }
      
      // Check for validation errors (often from form submissions)
      else if (error.name === 'ValidationError' || error.message.includes('validation')) {
        errorDetails.type = 'validation';
      }

      // If error has a custom code property (often for API errors)
      if ('code' in error && typeof error.code === 'string') {
        errorDetails.code = error.code;
        
        // API errors often have specific codes
        if (error.code.startsWith('api/')) {
          errorDetails.type = 'api';
        }
        // Auth errors
        else if (error.code.startsWith('auth/')) {
          errorDetails.type = 'auth';
        }
        // Permission errors
        else if (error.code.includes('permission') || error.code.includes('forbidden')) {
          errorDetails.type = 'permission';
        }
      }
    }
    // Handle plain object errors (often from APIs)
    else if (typeof error === 'object' && error !== null) {
      const errorObj = error as Record<string, any>;
      
      // Try to extract message and code
      if ('message' in errorObj && typeof errorObj.message === 'string') {
        errorDetails.message = errorObj.message;
      }
      
      if ('code' in errorObj && typeof errorObj.code === 'string') {
        errorDetails.code = errorObj.code;
      }
      
      // Try to determine error type
      if ('type' in errorObj && typeof errorObj.type === 'string') {
        switch (errorObj.type) {
          case 'validation':
          case 'api':
          case 'network':
          case 'auth':
          case 'permission':
            errorDetails.type = errorObj.type as ErrorType;
            break;
          default:
            // Keep as unknown
            break;
        }
      }
      
      // Add context if available
      if ('context' in errorObj && typeof errorObj.context === 'object') {
        errorDetails.context = errorObj.context;
      }
    }
    // Handle string errors
    else if (typeof error === 'string') {
      errorDetails.message = error;
    }
  } catch (e) {
    // If error during error handling, keep original fallback
    console.error("Error while processing exception:", e);
  }
  
  return errorDetails;
}

/**
 * Shows a toast notification for the given error
 * @param error The error object
 * @param fallbackMessage Optional fallback message
 */
export function showErrorToast(error: unknown, fallbackMessage = 'An unexpected error occurred'): void {
  const errorDetails = handleException(error, fallbackMessage);
  
  let title: string;
  
  // Set title based on error type
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
}

/**
 * Wraps an async function with standardized error handling
 * @param fn The async function to wrap
 * @param errorMessage Optional fallback error message
 * @returns A wrapped function that handles errors
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorMessage?: string
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return await fn(...args);
    } catch (error) {
      showErrorToast(error, errorMessage);
      throw error;
    }
  };
}
