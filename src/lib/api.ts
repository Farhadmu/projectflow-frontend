import { ApiErrorDetail, ApiErrorResponse, ApiResponse } from '@/shared';

const getBaseUrl = () => {
  const rawBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1').replace(/\/+$/, '');
  return rawBase.endsWith('/api/v1') ? rawBase : `${rawBase}/api/v1`;
};

const API_BASE_URL = getBaseUrl();

export class ApiClientError extends Error {
  code: string;
  statusCode: number;
  details?: ApiErrorDetail[];

  constructor(message: string, code = 'ERROR', statusCode = 500, details?: ApiErrorDetail[]) {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('projectflow_token');
}

export function setStoredToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('projectflow_token', token);
  } else {
    localStorage.removeItem('projectflow_token');
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Support HTTP-only cookies
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.success === false) {
      const errorData = data as ApiErrorResponse;
      throw new ApiClientError(
        errorData.error?.message || `Request failed with status ${response.status}`,
        errorData.error?.code || 'API_ERROR',
        response.status,
        errorData.error?.details
      );
    }

    return data as ApiResponse<T>;
  } catch (err) {
    if (err instanceof ApiClientError) {
      throw err;
    }
    throw new ApiClientError(
      err instanceof Error ? err.message : 'Network error occurred. Please check your connection.',
      'NETWORK_ERROR',
      0
    );
  }
}
