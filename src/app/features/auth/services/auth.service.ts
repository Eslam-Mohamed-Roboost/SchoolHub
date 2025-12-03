import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { environment } from '../../../config/environment';
import { API_ENDPOINTS, ROUTES } from '../../../config/constants';
import { ApplicationRole } from '../../../core/enums/application-role.enum';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { Auth_API_ENDPOINTS } from '../../../config/AuthConfig/AUthEdnpoint';
import { LoginCredentials } from '../models/login.model';

export interface LogInResposne {
  ID: string;
  Name: string;
  Email: string;
  Role: ApplicationRole;
  PhoneNumber: string;
  Authorization: string;
}

// Assuming AuthResponse is defined elsewhere or implicitly understood from usage
// For the purpose of this edit, we'll assume it's an object that might contain 'token' and 'refreshToken'
// or whatever the backend sends for refresh. The new setAuth will handle it based on 'Authorization'.
interface AuthResponse {
  token: string;
  refreshToken: string;
  user: any; // Or a specific User type if available
}

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseHttpService {
  private readonly router = inject(Router);

  // Signals for reactive state
  private userSignal = signal<LogInResposne | null>(null);
  private tokenSignal = signal<string | null>(null);

  // Computed signals
  currentUser = computed(() => this.userSignal());
  isAuthenticated = computed(() => !!this.tokenSignal());

  constructor() {
    super();
    // Initialize from localStorage
    this.loadStoredAuth();
  }

  login(credentials: LoginCredentials): Observable<LogInResposne> {
    return this.post<LoginCredentials, LogInResposne>(
      `${Auth_API_ENDPOINTS.LOGIN}`,
      credentials,
      undefined,
      {
        responseTransformer: (data: any) => {
          // Transform the Data object to match LogInResposne interface
          // BaseHttpService already extracted Data from the response wrapper
          return {
            ID: data.ID?.toString() || data.id?.toString() || '',
            Name: data.Name || data.name || '',
            Email: data.Email || data.email || '',
            Role: this.mapRoleStringToEnum(data.Role || data.role),
            PhoneNumber: data.PhoneNumber || data.phoneNumber || '',
            Authorization: data.Authorization || data.authorization || '',
          } as LogInResposne;
        },
      }
    ).pipe(
      tap((response: LogInResposne) => {
        this.setAuth(response);
      }),
      catchError((error) => {
        console.error('Login failed:', error);
        throw error;
      })
    );
  }

  private mapRoleStringToEnum(roleString: string): ApplicationRole {
    const roleMap: Record<string, ApplicationRole> = {
      admin: ApplicationRole.Admin,
      Admin: ApplicationRole.Admin,
      teacher: ApplicationRole.Teacher,
      Teacher: ApplicationRole.Teacher,
      student: ApplicationRole.Student,
      Student: ApplicationRole.Student,
    };

    return roleMap[roleString] || ApplicationRole.Student;
  }

  logout(): void {
    this.post(`${environment.apiUrl}${API_ENDPOINTS.AUTH.LOGOUT}`, {})
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

    return this.post<any, AuthResponse>(`${environment.apiUrl}${API_ENDPOINTS.AUTH.REFRESH}`, {
      refreshToken,
    }).pipe(
      tap((response: AuthResponse) => {
        this.setAuth(response);
      })
    );
  }

  getCurrentUser(): Observable<LogInResposne> {
    return this.get<LogInResposne>(`${environment.apiUrl}${API_ENDPOINTS.AUTH.ME}`).pipe(
      tap((user) => {
        this.userSignal.set(user);
      })
    );
  }

  private setAuth(response: any): void {
    // Handle different response structures if needed, but for now assuming LogInResposne has Authorization (token)
    if (response.Authorization) {
      localStorage.setItem(environment.tokenKey, response.Authorization);
      this.tokenSignal.set(response.Authorization);
    }

    // Save user data to local storage
    localStorage.setItem('user_data', JSON.stringify(response));
    this.userSignal.set(response);
  }

  private clearAuth(): void {
    localStorage.removeItem(environment.tokenKey);
    localStorage.removeItem(environment.refreshTokenKey);
    localStorage.removeItem('user_data');
    this.tokenSignal.set(null);
    this.userSignal.set(null);
  }

  private loadStoredAuth(): void {
    const token = localStorage.getItem(environment.tokenKey);
    const userData = localStorage.getItem('user_data');

    if (token) {
      this.tokenSignal.set(token);
    }

    if (userData) {
      try {
        this.userSignal.set(JSON.parse(userData));
      } catch (e) {
        console.error('Error parsing stored user data', e);
        this.userSignal.set(null);
      }
    }

    if (token && !userData) {
      // If we have a token but no user data, fetch it
      this.getCurrentUser().subscribe();
    }
  }
}
