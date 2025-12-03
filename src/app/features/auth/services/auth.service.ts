import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../config/environment';
import { API_ENDPOINTS, ROUTES } from '../../../config/constants';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // Signals for reactive state
  private userSignal = signal<User | null>(null);
  private tokenSignal = signal<string | null>(null);

  // Computed signals
  currentUser = computed(() => this.userSignal());
  isAuthenticated = computed(() => !!this.tokenSignal());

  constructor() {
    // Initialize from localStorage
    this.loadStoredAuth();
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}${API_ENDPOINTS.AUTH.LOGIN}`, credentials)
      .pipe(
        tap((response: AuthResponse) => {
          this.setAuth(response);
        }),
        catchError((error) => {
          console.error('Login failed:', error);
          throw error;
        })
      );
  }

  logout(): void {
    this.http
      .post(`${environment.apiUrl}${API_ENDPOINTS.AUTH.LOGOUT}`, {})
      .pipe(
        catchError(() => of(null)) // Continue logout even if API call fails
      )
      .subscribe(() => {
        this.clearAuth();
        this.router.navigate([ROUTES.AUTH.LOGIN]);
      });
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem(environment.refreshTokenKey);

    return this.http
      .post<AuthResponse>(`${environment.apiUrl}${API_ENDPOINTS.AUTH.REFRESH}`, {
        refreshToken,
      })
      .pipe(
        tap((response: AuthResponse) => {
          this.setAuth(response);
        })
      );
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}${API_ENDPOINTS.AUTH.ME}`).pipe(
      tap((user) => {
        this.userSignal.set(user);
      })
    );
  }

  private setAuth(response: AuthResponse): void {
    localStorage.setItem(environment.tokenKey, response.token);
    localStorage.setItem(environment.refreshTokenKey, response.refreshToken);
    this.tokenSignal.set(response.token);
    this.userSignal.set(response.user);
  }

  private clearAuth(): void {
    localStorage.removeItem(environment.tokenKey);
    localStorage.removeItem(environment.refreshTokenKey);
    this.tokenSignal.set(null);
    this.userSignal.set(null);
  }

  private loadStoredAuth(): void {
    const token = localStorage.getItem(environment.tokenKey);
    if (token) {
      this.tokenSignal.set(token);
      // Optionally fetch current user
      this.getCurrentUser().subscribe();
    }
  }
}
