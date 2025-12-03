import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User, UserRole, UserStatus } from '../../models/admin.models';

@Component({
  selector: 'app-admin-users',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css',
})
export class AdminUsersComponent {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);

  // State
  users = this.userService.getUsers();
  searchQuery = signal('');
  roleFilter = signal<UserRole | ''>('');
  statusFilter = signal<UserStatus | ''>('');
  currentPage = signal(1);
  itemsPerPage = signal(50);

  // Modals
  showAddUserModal = signal(false);
  showEditUserModal = signal(false);
  showBulkImportModal = signal(false);
  showDeleteConfirm = signal(false);
  selectedUser = signal<User | null>(null);

  // Form
  userForm: FormGroup;

  // Computed filtered users
  filteredUsers = computed(() => {
    return this.userService.searchUsers(
      this.searchQuery(),
      this.roleFilter() || undefined,
      this.statusFilter() || undefined
    );
  });

  // Paginated users
  paginatedUsers = computed(() => {
    const filtered = this.filteredUsers();
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return filtered.slice(start, end);
  });

  totalPages = computed(() => Math.ceil(this.filteredUsers().length / this.itemsPerPage()));

  // Available options
  roles: UserRole[] = ['Admin', 'Teacher', 'Student', 'Badge Manager'];
  statuses: UserStatus[] = ['Active', 'Inactive'];
  classes = ['6A', '6B', '6C', '6D', '6E', '7A', '7B', '7C', '7D', '7E'];
  itemsPerPageOptions = [25, 50, 100];
  Math = Math; // Make Math available in template

  constructor() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      status: ['Active', Validators.required],
      class: [''],
      notes: [''],
    });
  }

  // Search and filter methods
  onSearch(query: string) {
    this.searchQuery.set(query);
    this.currentPage.set(1);
  }

  onRoleFilter(role: string) {
    this.roleFilter.set(role as UserRole | '');
    this.currentPage.set(1);
  }

  onStatusFilter(status: string) {
    this.statusFilter.set(status as UserStatus | '');
    this.currentPage.set(1);
  }

  onItemsPerPageChange(items: number) {
    this.itemsPerPage.set(items);
    this.currentPage.set(1);
  }

  // Pagination
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current <= 4) {
        pages.push(1, 2, 3, 4, 5, -1, total);
      } else if (current >= total - 3) {
        pages.push(1, -1, total - 4, total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, -1, current - 1, current, current + 1, -1, total);
      }
    }
    return pages;
  }

  // User actions
  openAddUserModal() {
    this.userForm.reset({ status: 'Active' });
    this.selectedUser.set(null);
    this.showAddUserModal.set(true);
  }

  openEditUserModal(user: User) {
    this.selectedUser.set(user);
    this.userForm.patchValue(user);
    this.showEditUserModal.set(true);
  }

  closeUserModal() {
    this.showAddUserModal.set(false);
    this.showEditUserModal.set(false);
    this.userForm.reset();
    this.selectedUser.set(null);
  }

  saveUser() {
    if (this.userForm.invalid) return;

    const formValue = this.userForm.value;

    if (this.selectedUser()) {
      // Update existing user
      this.userService.updateUser(this.selectedUser()!.id, formValue);
    } else {
      // Add new user
      this.userService.addUser({
        ...formValue,
        lastLogin: new Date(),
      });
    }

    this.closeUserModal();
  }

  openDeleteConfirm(user: User) {
    this.selectedUser.set(user);
    this.showDeleteConfirm.set(true);
  }

  confirmDelete() {
    if (this.selectedUser()) {
      this.userService.deleteUser(this.selectedUser()!.id);
      this.showDeleteConfirm.set(false);
      this.selectedUser.set(null);
    }
  }

  cancelDelete() {
    this.showDeleteConfirm.set(false);
    this.selectedUser.set(null);
  }

  // Bulk import
  openBulkImportModal() {
    this.showBulkImportModal.set(true);
  }

  closeBulkImportModal() {
    this.showBulkImportModal.set(false);
  }

  // Export users
  exportUsers() {
    const users = this.filteredUsers();
    const csv = this.convertToCSV(users);
    this.downloadCSV(csv, 'users-export.csv');
  }

  private convertToCSV(users: User[]): string {
    const headers = ['Name', 'Email', 'Role', 'Status', 'Class', 'Badge Count', 'Last Login'];
    const rows = users.map((u) => [
      u.name,
      u.email,
      u.role,
      u.status,
      u.class || '',
      u.badgeCount.toString(),
      new Date(u.lastLogin).toLocaleString(),
    ]);

    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  }

  private downloadCSV(csv: string, filename: string) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // Helper methods
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  getRoleBadgeClass(role: string): string {
    const classes: Record<string, string> = {
      Admin: 'badge-admin',
      Teacher: 'badge-teacher',
      Student: 'badge-student',
      'Badge Manager': 'badge-manager',
    };
    return classes[role] || '';
  }
}
