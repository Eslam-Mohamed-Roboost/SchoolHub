import { Injectable, signal, computed } from '@angular/core';
import { Observable, tap, map, catchError, of } from 'rxjs';
import { User, UserStatus, CreateUserRequest } from '../models/admin.models';
import { ApplicationRole } from '../../../core/enums/application-role.enum';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { User_API_ENDPOINTS } from '../../../config/UserConfig/UserEndpoints';

// API Response interfaces
interface UserApiResponse {
  ID: number;
  Name: string;
  Email: string;
  Role: number;
  IsActive: boolean;
  CreatedAt: string;
  PhoneNumber: string;
}

interface PaginatedResponse<T> {
  PageSize: number;
  PageIndex: number;
  Records: number;
  Pages: number;
  Items: T[];
}

interface BulkImportRequest {
  Users: {
    Name: string;
    Email: string;
    RoleID: number;
    ClassName?: string;
  }[];
}

interface BulkImportResponse {
  success: number;
  failed: {
    row: number;
    name: string;
    email: string;
    error: string;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseHttpService {
  private users = signal<User[]>([]);
  private totalRecords = signal(0);
  private currentPage = signal(1);
  private pageSize = signal(50);
  private isLoading = signal(false);

  constructor() {
    super();
    this.loadUsers();
  }

  // ============================================
  // LOAD DATA FROM API
  // ============================================

  loadUsers(params?: {
    pageIndex?: number;
    pageSize?: number;
    search?: string;
    role?: number;
    status?: string;
  }): void {
    this.isLoading.set(true);

    const queryParams: string[] = [];
    queryParams.push(`page=${params?.pageIndex ?? this.currentPage()}`);
    queryParams.push(`pageSize=${params?.pageSize ?? this.pageSize()}`);
    if (params?.search) queryParams.push(`Search=${encodeURIComponent(params.search)}`);
    if (params?.role) queryParams.push(`Role=${params.role}`);
    if (params?.status) queryParams.push(`Status=${params.status}`);

    const url = `${User_API_ENDPOINTS.GET_ALL}?${queryParams.join('&')}`;

    this.get<PaginatedResponse<UserApiResponse>>(url).subscribe({
      next: (response) => {
        const mappedUsers = (response.Items || []).map((u) => this.mapApiResponseToUser(u));
        this.users.set(mappedUsers);
        this.totalRecords.set(response.Records);
        this.currentPage.set(response.PageIndex);
        this.pageSize.set(response.PageSize);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load users, using mock data', err);
        this.users.set(this.generateMockUsers());
        this.totalRecords.set(856);
        this.isLoading.set(false);
      },
    });
  }

  // ============================================
  // GETTERS
  // ============================================

  getUsers() {
    return this.users.asReadonly();
  }

  getTotalRecords() {
    return this.totalRecords.asReadonly();
  }

  getCurrentPage() {
    return this.currentPage.asReadonly();
  }

  getPageSize() {
    return this.pageSize.asReadonly();
  }

  getIsLoading() {
    return this.isLoading.asReadonly();
  }

  // ============================================
  // SEARCH & FILTER (Local for component compatibility)
  // ============================================

  searchUsers(query: string, role?: ApplicationRole, status?: UserStatus): User[] {
    let filtered = this.users();

    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(lowerQuery) || u.email.toLowerCase().includes(lowerQuery)
      );
    }

    if (role !== undefined) {
      filtered = filtered.filter((u) => u.role === role);
    }

    if (status) {
      filtered = filtered.filter((u) => u.status === status);
    }

    return filtered;
  }

  // ============================================
  // CRUD OPERATIONS
  // ============================================

  getUserById(id: string): Observable<User> {
    return this.get<UserApiResponse>(User_API_ENDPOINTS.GET_BY_ID(id)).pipe(
      map((response) => this.mapApiResponseToUser(response))
    );
  }

  addUser(request: CreateUserRequest): Observable<User> {
    return this.post<CreateUserRequest, UserApiResponse>(User_API_ENDPOINTS.CREATE, request).pipe(
      map((response) => this.mapApiResponseToUser(response)),
      tap((newUser) => {
        this.users.update((users) => [newUser, ...users]);
        this.totalRecords.update((t) => t + 1);
      })
    );
  }

  createUser(request: CreateUserRequest): Observable<User> {
    return this.addUser(request);
  }

  updateUser(id: string, userData: Partial<User>): Observable<User> {
    const apiRequest = {
      Name: userData.name,
      Email: userData.email,
      RoleID: userData.role,
      IsActive: userData.status === 'Active',
      PhoneNumber: '',
    };

    return this.put<typeof apiRequest, UserApiResponse>(
      User_API_ENDPOINTS.UPDATE(id),
      apiRequest
    ).pipe(
      map((response) => this.mapApiResponseToUser(response)),
      tap((updatedUser) => {
        this.users.update((users) => users.map((u) => (u.id === id ? updatedUser : u)));
      })
    );
  }

  deleteUser(id: string): Observable<{ success: boolean; message: string }> {
    return this.delete<{ success: boolean; message: string }>(User_API_ENDPOINTS.DELETE(id)).pipe(
      tap(() => {
        this.users.update((users) => users.filter((u) => u.id !== id));
        this.totalRecords.update((t) => t - 1);
      })
    );
  }

  // ============================================
  // BULK OPERATIONS
  // ============================================

  bulkImport(request: BulkImportRequest): Observable<BulkImportResponse> {
    return this.post<BulkImportRequest, BulkImportResponse>(
      User_API_ENDPOINTS.BULK_IMPORT,
      request
    ).pipe(
      tap((response) => {
        if (response.success > 0) {
          this.loadUsers();
        }
      })
    );
  }

  exportUsers(params?: { role?: number; status?: string }): Observable<Blob> {
    const queryParams: string[] = [];
    if (params?.role) queryParams.push(`Role=${params.role}`);
    if (params?.status) queryParams.push(`Status=${params.status}`);

    const url =
      queryParams.length > 0
        ? `${User_API_ENDPOINTS.EXPORT}?${queryParams.join('&')}`
        : User_API_ENDPOINTS.EXPORT;

    return this.http.get(url, { responseType: 'blob' });
  }

  // ============================================
  // PAGINATION
  // ============================================

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadUsers({ pageIndex: page });
  }

  setPageSize(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
    this.loadUsers({ pageSize: size, pageIndex: 1 });
  }

  // ============================================
  // FILTERING (LOCAL)
  // ============================================

  getUsersByRole(roleId: ApplicationRole): User[] {
    return this.users().filter((u) => u.role === roleId);
  }

  getActiveUsers(): User[] {
    return this.users().filter((u) => u.status === 'Active');
  }

  getInactiveUsers(): User[] {
    return this.users().filter((u) => u.status === 'Inactive');
  }

  // ============================================
  // MAPPERS
  // ============================================

  private mapApiResponseToUser(response: UserApiResponse): User {
    return {
      id: String(response.ID),
      name: response.Name,
      email: response.Email,
      role: response.Role as ApplicationRole,
      status: response.IsActive ? 'Active' : 'Inactive',
      badgeCount: 0,
      lastLogin: new Date(),
      joinDate: new Date(response.CreatedAt),
    };
  }

  // ============================================
  // MOCK DATA (Fallback)
  // ============================================

  private generateMockUsers(): User[] {
    const users: User[] = [];

    for (let i = 1; i <= 50; i++) {
      const role =
        i <= 5
          ? ApplicationRole.Admin
          : i <= 45
          ? ApplicationRole.Student
          : ApplicationRole.Teacher;
      const roleLabel =
        role === ApplicationRole.Student
          ? 'Student'
          : role === ApplicationRole.Teacher
          ? 'Teacher'
          : 'Admin';

      users.push({
        id: String(i),
        name: `${roleLabel} ${i}`,
        email: `${roleLabel.toLowerCase()}${i}@school.ae`,
        role: role,
        status: Math.random() > 0.1 ? 'Active' : 'Inactive',
        badgeCount: Math.floor(Math.random() * 10),
        lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      });
    }

    return users;
  }
}
