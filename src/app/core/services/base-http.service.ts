import { inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpContext } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../config/environment';

export interface HttpOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] };
  context?: HttpContext;
  observe?: 'body';
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
}

export interface RequestTransformer<T = any> {
  (data: T): any;
}

export interface ResponseTransformer<T = any> {
  (data: any): T;
}

export interface ApiConfig<TRequest = any, TResponse = any> {
  requestTransformer?: RequestTransformer<TRequest>;
  responseTransformer?: ResponseTransformer<TResponse>;
  errorHandler?: (error: any) => Observable<never>;
}

/**
 * Generic HTTP Service for making API calls with customizable transformations
 *
 * Features:
 * - Automatic base URL injection
 * - Request/Response transformers
 * - Custom error handling
 * - Type-safe operations
 *
 * @example
 * ```typescript
 * export class MyService extends BaseHttpService {
 *   getItems() {
 *     return this.get<Item[]>('/items', {
 *       responseTransformer: (data) => data.map(item => ({ ...item, processed: true }))
 *     });
 *   }
 * }
 * ```
 */
export abstract class BaseHttpService {
  protected readonly http = inject(HttpClient);
  protected readonly baseUrl = environment.apiUrl;

  /**
   * Generic GET request
   */
  protected get<TResponse = any>(
    endpoint: string,
    options?: HttpOptions,
    config?: ApiConfig<never, TResponse>
  ): Observable<TResponse> {
    const url = this.buildUrl(endpoint);

    return this.http.get<any>(url, options).pipe(
      map((response) => this.transformResponse<TResponse>(response, config?.responseTransformer)),
      catchError((error) => this.handleError(error, config?.errorHandler))
    );
  }

  /**
   * Generic POST request
   */
  protected post<TRequest = any, TResponse = any>(
    endpoint: string,
    data: TRequest,
    options?: HttpOptions,
    config?: ApiConfig<TRequest, TResponse>
  ): Observable<TResponse> {
    const url = this.buildUrl(endpoint);
    const transformedData = this.transformRequest(data, config?.requestTransformer);

    return this.http.post<any>(url, transformedData, options).pipe(
      map((response) => this.transformResponse<TResponse>(response, config?.responseTransformer)),
      catchError((error) => this.handleError(error, config?.errorHandler))
    );
  }

  /**
   * Generic PUT request
   */
  protected put<TRequest = any, TResponse = any>(
    endpoint: string,
    data: TRequest,
    options?: HttpOptions,
    config?: ApiConfig<TRequest, TResponse>
  ): Observable<TResponse> {
    const url = this.buildUrl(endpoint);
    const transformedData = this.transformRequest(data, config?.requestTransformer);

    return this.http.put<any>(url, transformedData, options).pipe(
      map((response) => this.transformResponse<TResponse>(response, config?.responseTransformer)),
      catchError((error) => this.handleError(error, config?.errorHandler))
    );
  }

  /**
   * Generic PATCH request
   */
  protected patch<TRequest = any, TResponse = any>(
    endpoint: string,
    data: TRequest,
    options?: HttpOptions,
    config?: ApiConfig<TRequest, TResponse>
  ): Observable<TResponse> {
    const url = this.buildUrl(endpoint);
    const transformedData = this.transformRequest(data, config?.requestTransformer);

    return this.http.patch<any>(url, transformedData, options).pipe(
      map((response) => this.transformResponse<TResponse>(response, config?.responseTransformer)),
      catchError((error) => this.handleError(error, config?.errorHandler))
    );
  }

  /**
   * Generic DELETE request
   */
  protected delete<TResponse = any>(
    endpoint: string,
    options?: HttpOptions,
    config?: ApiConfig<never, TResponse>
  ): Observable<TResponse> {
    const url = this.buildUrl(endpoint);

    return this.http.delete<any>(url, options).pipe(
      map((response) => this.transformResponse<TResponse>(response, config?.responseTransformer)),
      catchError((error) => this.handleError(error, config?.errorHandler))
    );
  }

  /**
   * Build full URL from endpoint
   */
  private buildUrl(endpoint: string): string {
    // If endpoint is already a full URL, return it
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }

    // Remove leading slash if present to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

    // Ensure baseUrl doesn't end with slash
    const cleanBaseUrl = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;

    return `${cleanBaseUrl}/${cleanEndpoint}`;
  }

  /**
   * Transform request data before sending
   */
  private transformRequest<T>(data: T, transformer?: RequestTransformer<T>): any {
    if (transformer) {
      return transformer(data);
    }
    return data;
  }

  /**
   * Transform response data after receiving
   */
  private transformResponse<T>(data: any, transformer?: ResponseTransformer<T>): T {
    if (transformer) {
      return transformer(data);
    }
    return data as T;
  }

  /**
   * Handle errors with custom error handler or default behavior
   */
  private handleError(
    error: any,
    customHandler?: (error: any) => Observable<never>
  ): Observable<never> {
    if (customHandler) {
      return customHandler(error);
    }

    // Default error handling
    console.error('HTTP Error:', error);
    return throwError(() => error);
  }
}
