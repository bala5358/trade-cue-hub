// Base API client configuration
import { ApiErrorResponse } from '@/types/api.types';
import { auditService } from './audit.service';
import { logger } from '@/utils/logger';

// TODO: Update this with your actual Azure API endpoint
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:5001/api';
const REQUEST_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;
  private refreshing: Promise<string> | null = null;
  private userId: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.loadToken();
  }

  private loadToken(): void {
    // Load token from localStorage (temporary - will be replaced with Azure auth)
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  clearToken(): void {
    this.token = null;
    this.userId = null;
    localStorage.removeItem('auth_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async fetchWithTimeout(
    url: string,
    config: RequestInit,
    timeoutMs: number = REQUEST_TIMEOUT
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout - please try again');
      }
      throw error;
    }
  }

  private async handleUnauthorized(): Promise<void> {
    // Clear token and redirect to login
    this.clearToken();
    
    // Only redirect if not already on auth page
    if (window.location.pathname !== '/auth') {
      window.location.href = '/auth';
    }
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount: number = 0
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const startTime = performance.now();
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await this.fetchWithTimeout(url, config);
      const endTime = performance.now();
      const responseTime = endTime - startTime;

      // Log successful API call
      auditService.logApiCall(
        endpoint,
        options.method || 'GET',
        response.status,
        responseTime,
        this.userId || undefined
      );

      // Handle 401 Unauthorized
      if (response.status === 401) {
        auditService.logUnauthorizedAccess(endpoint, this.userId || undefined);
        await this.handleUnauthorized();
        throw new Error('Unauthorized - please log in again');
      }

      // Handle other error responses
      if (!response.ok) {
        let errorMessage = 'API request failed';
        
        try {
          const errorData: ApiErrorResponse = await response.json();
          errorMessage = errorData.error?.message || errorMessage;
        } catch {
          // If JSON parsing fails, use status text
          errorMessage = response.statusText || errorMessage;
        }

        // Log API error
        auditService.logApiError(
          endpoint,
          options.method || 'GET',
          errorMessage,
          this.userId || undefined
        );

        logger.error('API request failed', new Error(errorMessage), {
          endpoint,
          method: options.method,
          statusCode: response.status,
          responseTime,
        });

        // Retry on 5xx server errors
        if (response.status >= 500 && retryCount < MAX_RETRIES) {
          logger.warn(`Retrying API call (attempt ${retryCount + 1}/${MAX_RETRIES})`, {
            endpoint,
            method: options.method,
          });
          await this.delay(RETRY_DELAY * (retryCount + 1));
          return this.request<T>(endpoint, options, retryCount + 1);
        }

        throw new Error(errorMessage);
      }

      logger.debug('API request successful', {
        endpoint,
        method: options.method,
        statusCode: response.status,
        responseTime,
      });

      return await response.json();
    } catch (error) {
      const endTime = performance.now();
      const responseTime = endTime - startTime;

      // Log error
      if (error instanceof Error) {
        auditService.logApiError(
          endpoint,
          options.method || 'GET',
          error.message,
          this.userId || undefined
        );

        logger.error('API request exception', error, {
          endpoint,
          method: options.method,
          responseTime,
          retryCount,
        });
      }

      // Retry on network errors
      if (
        retryCount < MAX_RETRIES &&
        error instanceof Error &&
        (error.message.includes('network') || error.message.includes('fetch') || error.message.includes('timeout'))
      ) {
        logger.warn(`Retrying API call after error (attempt ${retryCount + 1}/${MAX_RETRIES})`, {
          endpoint,
          method: options.method,
          error: error.message,
        });
        await this.delay(RETRY_DELAY * (retryCount + 1));
        return this.request<T>(endpoint, options, retryCount + 1);
      }

      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
