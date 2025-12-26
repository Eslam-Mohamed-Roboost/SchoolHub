import { Injectable, signal, computed } from '@angular/core';
import { Observable, tap, map, catchError, of } from 'rxjs';
import { User, UserStatus, CreateUserRequest } from '../models/admin.models';
import { ApplicationRole } from '../../../core/enums/application-role.enum';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { User_API_ENDPOINTS } from '../../../config/UserConfig/UserEndpoints';
import { Admin_API_ENDPOINTS } from '../../../config/AdminConfig/AdminEndpoint';

// API Response interfaces
interface UserApiResponse {
  Id: string; // Backend sends as string (LongAsStringConverter)
  Name: string;
  Email: string;
  Role: number | string; // Can be number (enum) or string (e.g., "student")
  RoleName?: string; // Optional role name from backend
  Status: string;
  CreatedAt?: string;
  PhoneNumber?: string;
  BadgeCount: number;
  LastLogin?: Date | string | null;
  ClassId?: string; // Backend sends as string (LongAsStringConverter)
  ClassName?: string;
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
    // Don't load users here - let components control when to load
    // Components will call loadUsers() via effects or lifecycle hooks
  }

  // ============================================
  // LOAD DATA FROM API
  // ============================================

  loadUsers(params?: {
    pageIndex?: number;
    pageSize?: number;
    search?: string;
    email?: string;
    role?: number;
    status?: string;
    isActive?: boolean;
    classId?: string;
  }): void {
    this.isLoading.set(true);

    const queryParams: string[] = [];
    queryParams.push(`page=${params?.pageIndex ?? this.currentPage()}`);
    queryParams.push(`pageSize=${params?.pageSize ?? this.pageSize()}`);
    if (params?.search) queryParams.push(`Search=${encodeURIComponent(params.search)}`);
    if (params?.email) queryParams.push(`email=${encodeURIComponent(params.email)}`);
    if (params?.role) queryParams.push(`role=${params.role}`);
    if (params?.isActive !== undefined) queryParams.push(`IsActve=${params.isActive}`);
    if (params?.classId) queryParams.push(`classId=${params.classId}`);

    // Legacy status mapping if needed, or remove if replaced by isActive
    if (params?.status && params.isActive === undefined) {
      // If status is passed but isActive isn't, try to map it
      const isActive = params.status === 'Active';
      queryParams.push(`IsActve=${isActive}`);
    }

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
          (u.Name || u.name || '').toLowerCase().includes(lowerQuery) || 
          (u.Email || u.email || '').toLowerCase().includes(lowerQuery)
      );
    }

    if (role !== undefined) {
      filtered = filtered.filter((u) => (u.Role || u.role) === role);
    }

    if (status) {
      filtered = filtered.filter((u) => u.Status === status);
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
    // Validate id
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error('Invalid user ID provided for update');
    }

    // Map frontend properties to backend PascalCase format
    // Backend expects: Name, Email, Role, IsActive, PhoneNumber, ClassID (long? -> string)
    const apiRequest: any = {
      Name: userData.Name || userData.name,
      Email: userData.Email || userData.email,
      Role: userData.Role || userData.role,
      IsActive: (userData.Status || userData.Status) === 'Active',
      PhoneNumber: (userData.Notes || (userData as any).notes || '') as string,
    };

    // Always include ClassID if it's present in userData (even if null to remove assignment)
    // Backend expects long? but we send as string or null
    if ('ClassId' in userData || 'classId' in userData) {
      const classId = userData.ClassId !== undefined ? userData.ClassId : userData.classId;
      if (classId !== undefined && classId !== null && classId !== '') {
        apiRequest.ClassID = String(classId); // Convert to string for backend long type
      } else {
        // Send null to explicitly remove class assignment
        apiRequest.ClassID = null;
      }
    }

    // Use Admin endpoint for user updates
    return this.put<typeof apiRequest, UserApiResponse>(
      Admin_API_ENDPOINTS.Users.UPDATE(id),
      apiRequest
    ).pipe(
      map((response) => {
        // Reload users to get updated data
        this.loadUsers();
        // Return updated user from current list
        return this.users().find(u => u.id === id) || this.mapApiResponseToUser(response as any);
      }),
      tap((updatedUser) => {
        this.users.update((users) => users.map((u) => (u.id === id ? updatedUser : u)));
      })
    );
  }

  changePassword(id: string, newPassword: string): Observable<{ success: boolean; message: string }> {
    // Validate id
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error('Invalid user ID provided for password change');
    }

    // Validate password
    if (!newPassword || newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // BaseHttpService.put() extracts Data when IsSuccess is true, so response will be boolean (true)
    // If IsSuccess is false, transformResponse throws an error, which we catch
    return this.put<{ NewPassword: string }, boolean>(
      Admin_API_ENDPOINTS.Users.CHANGE_PASSWORD(id),
      { NewPassword: newPassword }
    ).pipe(
      map(() => ({
        success: true,
        message: 'Password changed successfully',
      })),
      catchError((error) => {
        // Handle error response - error might contain the full response structure
        const errorMessage = error.error?.Message || error.error?.message || error.message || 'Failed to change password';
        return of({
          success: false,
          message: errorMessage,
        });
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

    const endpoint =
      queryParams.length > 0
        ? `${User_API_ENDPOINTS.EXPORT}?${queryParams.join('&')}`
        : User_API_ENDPOINTS.EXPORT;

    // Construct full URL with base URL
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const cleanBaseUrl = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
    const url = `${cleanBaseUrl}/${cleanEndpoint}`;

    return this.http.get(url, { responseType: 'blob' });
  }

  // ============================================
  // PAGINATION
  // ============================================

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadUsers({ pageIndex: page });
  }

  resetToFirstPage(): void {
    this.currentPage.set(1);
  }

  setPageSize(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
    // Don't call loadUsers() here - let component effects handle it when pageSize signal changes
  }

  // ============================================
  // FILTERING (LOCAL)
  // ============================================

  getUsersByRole(roleId: ApplicationRole): User[] {
    return this.users().filter((u) => u.role === roleId);
  }

  getActiveUsers(): User[] {
    return this.users().filter((u) => u.Status === 'Active');
  }

  getInactiveUsers(): User[] {
    return this.users().filter((u) => u.Status === 'Inactive');
  }

  // ============================================
  // MAPPERS
  // ============================================

  private mapApiResponseToUser(response: UserApiResponse): User {
    // Map backend PascalCase to frontend (matching backend property names)
    // All long types are already strings from backend (LongAsStringConverter)
    const id = response.Id || '';
    const name = response.Name || '';
    const email = response.Email || '';
    
    // Convert Role to ApplicationRole enum
    // Role can come as number (4) or string ("student", "4")
    let role: ApplicationRole;
    if (typeof response.Role === 'number') {
      role = response.Role as ApplicationRole;
    } else if (typeof response.Role === 'string') {
      // Convert string role to enum
      const roleStr = response.Role.toLowerCase();
      if (roleStr === 'admin' || roleStr === '1') {
        role = ApplicationRole.Admin;
      } else if (roleStr === 'teacher' || roleStr === '3') {
        role = ApplicationRole.Teacher;
      } else if (roleStr === 'student' || roleStr === '4') {
        role = ApplicationRole.Student;
      } else {
        // Try to parse as number
        const roleNum = parseInt(response.Role, 10);
        role = isNaN(roleNum) ? ApplicationRole.Student : roleNum as ApplicationRole;
      }
    } else {
      role = ApplicationRole.Student; // Default fallback
    }
    
    // Handle LastLogin - can be Date, string, or null
    let lastLogin: Date | undefined;
    if (response.LastLogin) {
      if (response.LastLogin instanceof Date) {
        lastLogin = response.LastLogin;
      } else if (typeof response.LastLogin === 'string') {
        lastLogin = new Date(response.LastLogin);
      }
    }
    
    // Handle CreatedAt/JoinDate
    let joinDate: Date | undefined;
    if (response.CreatedAt) {
      joinDate = new Date(response.CreatedAt);
    }
    
    return {
      Id: id,
      Name: name,
      Email: email,
      Role: role,
      Status: response.Status as UserStatus,
      BadgeCount: response.BadgeCount || 0,
      LastLogin: lastLogin,
      JoinDate: joinDate,
      ClassId: response.ClassId, // Already string from backend
      ClassName: response.ClassName,
      // Legacy camelCase for backward compatibility
      id: id,
      name: name,
      email: email,
      role: role,
      classId: response.ClassId,
      className: response.ClassName,
      class: response.ClassName,
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
        Id: String(i),
        Name: `${roleLabel} ${i}`,
        Email: `${roleLabel.toLowerCase()}${i}@school.ae`,
        Role: role,
        Status: Math.random() > 0.1 ? 'Active' : 'Inactive',
        BadgeCount: Math.floor(Math.random() * 10),
        LastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        JoinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        ClassId: undefined,
        ClassName: '',
        Notes: '',
        Avatar: '',
      });
    }

    return users;
  }
}
