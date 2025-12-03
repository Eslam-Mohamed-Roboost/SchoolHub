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

export interface RequestResult<T> {
  data: T;
  isSuccess: boolean;
  message: string;
  errorCode: any;
}

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

    return this.http.get<RequestResult<TResponse> | TResponse>(url, options).pipe(
      map((response) => this.transformResponse<TResponse>(response, config?.responseTransformer)),
      catchError((error) => this.handleError(error, config?.errorHandler))
    );
  }

  /**
   * Generic POST request
   */
  public post<TRequest = any, TResponse = any>(
    endpoint: string,
    data: TRequest,
    options?: HttpOptions,
    config?: ApiConfig<TRequest, TResponse>
  ): Observable<TResponse> {
    const url = this.buildUrl(endpoint);
    const transformedData = this.transformRequest(data, config?.requestTransformer);

    return this.http.post<RequestResult<TResponse> | TResponse>(url, transformedData, options).pipe(
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

    return this.http.put<RequestResult<TResponse> | TResponse>(url, transformedData, options).pipe(
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

    return this.http
      .patch<RequestResult<TResponse> | TResponse>(url, transformedData, options)
      .pipe(
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

    return this.http.delete<RequestResult<TResponse> | TResponse>(url, options).pipe(
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
  private transformResponse<T>(response: any, transformer?: ResponseTransformer<T>): T {
    let data: T;

    // Check if response matches RequestResult structure (checking both camelCase and PascalCase just in case)
    if (response && typeof response === 'object') {
      if ('isSuccess' in response) {
        // CamelCase
        const result = response as RequestResult<T>;
        if (!result.isSuccess) {
          throw new Error(result.message || 'API Error');
        }
        data = result.data;
      } else if ('IsSuccess' in response) {
        // PascalCase
        if (!response.IsSuccess) {
          throw new Error(response.Message || 'API Error');
        }
        data = response.Data;
      } else {
        // Not a RequestResult, assume direct data
        data = response as T;
      }
    } else {
      data = response as T;
    }

    if (transformer) {
      return transformer(data);
    }
    return data;
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
