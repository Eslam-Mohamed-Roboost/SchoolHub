import { Injectable, signal } from '@angular/core';
import { User, UserRole, UserStatus } from '../models/admin.models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users = signal<User[]>(this.generateMockUsers());

  getUsers() {
    return this.users.asReadonly();
  }

  getUserById(id: string): User | undefined {
    return this.users().find((u) => u.id === id);
  }

  addUser(user: Omit<User, 'id' | 'badgeCount' | 'joinDate'>): User {
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}`,
      badgeCount: 0,
      joinDate: new Date(),
    };
    this.users.update((users) => [...users, newUser]);
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const userIndex = this.users().findIndex((u) => u.id === id);
    if (userIndex === -1) return null;

    const updatedUsers = [...this.users()];
    updatedUsers[userIndex] = { ...updatedUsers[userIndex], ...updates };
    this.users.set(updatedUsers);
    return updatedUsers[userIndex];
  }

  deleteUser(id: string): boolean {
    const initialLength = this.users().length;
    this.users.update((users) => users.filter((u) => u.id !== id));
    return this.users().length < initialLength;
  }

  searchUsers(query: string, role?: UserRole, status?: UserStatus): User[] {
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

        this.addUser({
          name: row.name,
          email: row.email,
          role: row.role,
          status: row.status || 'Active',
          class: row.class,
          lastLogin: new Date(),
        });
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
      teachers: users.filter((u) => u.role === 'Teacher').length,
      students: users.filter((u) => u.role === 'Student').length,
    };
  }

  private generateMockUsers(): User[] {
    const users: User[] = [];

    // Generate mock teachers
    for (let i = 1; i <= 40; i++) {
      users.push({
        id: `teacher-${i}`,
        name: `Teacher ${i}`,
        email: `teacher${i}@school.ae`,
        role: 'Teacher',
        status: i > 38 ? 'Inactive' : 'Active',
        badgeCount: Math.floor(Math.random() * 10),
        lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        joinDate: new Date(2024, 0, 1),
        avatar: `https://ui-avatars.com/api/?name=Teacher+${i}&background=random`,
      });
    }

    // Generate mock students
    const classes = ['6A', '6B', '6C', '6D', '6E', '7A', '7B', '7C', '7D', '7E'];
    for (let i = 1; i <= 800; i++) {
      users.push({
        id: `student-${i}`,
        name: `Student ${i}`,
        email: `student${i}@school.ae`,
        role: 'Student',
        status: i > 720 ? 'Inactive' : 'Active',
        class: classes[Math.floor((i - 1) / 80)],
        badgeCount: Math.floor(Math.random() * 5),
        lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        joinDate: new Date(2024, 8, 1),
        avatar: `https://ui-avatars.com/api/?name=Student+${i}&background=random`,
      });
    }

    // Add admin user
    users.push({
      id: 'admin-1',
      name: 'Rahmah',
      email: 'rahmah@school.ae',
      role: 'Admin',
      status: 'Active',
      badgeCount: 15,
      lastLogin: new Date(),
      joinDate: new Date(2023, 8, 1),
      avatar: 'https://ui-avatars.com/api/?name=Rahmah&background=4F46E5',
    });

    return users;
  }
}
