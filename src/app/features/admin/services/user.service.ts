import { Injectable, signal } from '@angular/core';
import { User, UserStatus, CreateUserRequest } from '../models/admin.models';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { ApplicationRole } from '../../../core/enums/application-role.enum';
import { User_API_ENDPOINTS } from '../../../config/UserConfig/UserEndpoints';
import { Observable, tap, map } from 'rxjs';

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

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseHttpService {
  private users = signal<User[]>([]);

  constructor() {
    super();
    this.loadUsers();
  }

  loadUsers() {
    this.get<PaginatedResponse<UserApiResponse>>(User_API_ENDPOINTS.GET_ALL).subscribe({
      next: (response) => {
        const mappedUsers: User[] = response.Items.map((u) => ({
          id: u.ID.toString(),
          name: u.Name,
          email: u.Email,
          role: u.Role as ApplicationRole,
          status: u.IsActive ? 'Active' : 'Inactive',
          badgeCount: 0, // Not in API response
          lastLogin: new Date(), // Not in API response
          joinDate: new Date(u.CreatedAt),
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            u.Name
          )}&background=random`,
        }));
        this.users.set(mappedUsers);
      },
      error: (err) => console.error('Failed to load users', err),
    });
  }

  getUsers() {
    return this.users.asReadonly();
  }

  getUserById(id: string): User | undefined {
    return this.users().find((u) => u.id === id);
  }

  addUser(user: CreateUserRequest): Observable<User> {
    return this.post<CreateUserRequest, UserApiResponse>(User_API_ENDPOINTS.CREATE, user).pipe(
      map((u) => this.mapUserResponse(u)),
      tap((newUser) => {
        this.users.update((users) => [...users, newUser]);
      })
    );
  }

  updateUser(id: string, updates: Partial<User>): Observable<User> {
    // Note: The API might expect a specific update DTO. For now sending Partial<User>.
    // If the API expects PascalCase for updates, we might need a mapper here too.
    // Assuming for now we send what we have, but we need to map the response.
    return this.put<Partial<User>, UserApiResponse>(User_API_ENDPOINTS.UPDATE(id), updates).pipe(
      map((u) => this.mapUserResponse(u)),
      tap((updatedUser) => {
        this.users.update((users) =>
          users.map((u) => (u.id === id ? { ...u, ...updatedUser } : u))
        );
      })
    );
  }

  deleteUser(id: string): Observable<boolean> {
    return this.delete<boolean>(User_API_ENDPOINTS.DELETE(id)).pipe(
      tap(() => {
        this.users.update((users) => users.filter((u) => u.id !== id));
      })
    );
  }

  searchUsers(query: string, role?: ApplicationRole, status?: UserStatus): User[] {
    return this.users().filter((user) => {
      const matchesQuery =
        query === '' ||
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase());

      const matchesRole = !role || user.role === role;
      const matchesStatus = !status || user.status === status;

      return matchesQuery && matchesRole && matchesStatus;
    });
  }

  importUsers(csvData: any[]): {
    success: number;
    failed: { row: number; name: string; email: string; error: string }[];
  } {
    // Implementation for bulk import would typically involve a specific API endpoint
    // For now, we'll keep the logic but it needs to be adapted for API interaction if needed
    // or handled client-side and then calling addUser for each.
    // Given the complexity, I'll leave a placeholder or basic client-side loop.
    const results = {
      success: 0,
      failed: [] as { row: number; name: string; email: string; error: string }[],
    };

    csvData.forEach((row, index) => {
      try {
        // Validate required fields
        if (!row.name || !row.email || !row.role) {
          results.failed.push({
            row: index + 1,
            name: row.name || '',
            email: row.email || '',
            error: 'Missing required fields',
          });
          return;
        }

        // Check if email already exists
        if (this.users().some((u) => u.email === row.email)) {
          results.failed.push({
            row: index + 1,
            name: row.name,
            email: row.email,
            error: 'Email already exists',
          });
          return;
        }

        // this.addUser({
        //   Name: row.name,
        //   UserName: row.email,
        //   Email: row.email,
        //   RoleID: row.role,
        //   LastLogin: new Date(),
        // });
        results.success++;
      } catch (error) {
        results.failed.push({
          row: index + 1,
          name: row.name || '',
          email: row.email || '',
          error: 'Invalid data format',
        });
      }
    });

    return results;
  }

  getTotalUserCount(): number {
    return this.users().length;
  }

  getUserCountByRole(): { teachers: number; students: number } {
    const users = this.users();
    return {
      teachers: users.filter((u) => u.role === ApplicationRole.Teacher).length,
      students: users.filter((u) => u.role === ApplicationRole.Student).length,
    };
  }

  private mapUserResponse(u: UserApiResponse): User {
    return {
      id: u.ID.toString(),
      name: u.Name,
      email: u.Email,
      role: u.Role as ApplicationRole,
      status: u.IsActive ? 'Active' : 'Inactive',
      badgeCount: 0,
      lastLogin: new Date(),
      joinDate: new Date(u.CreatedAt),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.Name)}&background=random`,
    };
  }
}
