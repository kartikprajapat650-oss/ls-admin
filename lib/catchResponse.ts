import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

export interface ApiError {
  message?: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

export function catchResponse(error: unknown): ApiError {
  let message = 'Something went wrong';
  let statusCode: number | undefined;
  let errors: Record<string, string[]> | undefined;

  if (error instanceof AxiosError) {
    statusCode = error.response?.status;
    const data = error.response?.data as any;
    message = data?.message || error.message || message;
    errors = data?.errors;

    if (statusCode === 400 || statusCode === 422) {
      message = message || 'Validation error';
    } else if (statusCode === 401) {
      message = 'Unauthorized. Please log in again.';
    } else if (statusCode === 403) {
      message = 'Forbidden. You do not have access.';
    } else if (statusCode === 404) {
      message = 'Resource not found';
    } else if (statusCode && statusCode >= 500) {
      message = 'Server error';
    }
  } else if (error instanceof Error) {
    message = error.message || message;
  }

  toast.error(message);
  return { message, errors, statusCode };
}
