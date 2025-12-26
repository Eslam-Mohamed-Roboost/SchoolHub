import { Component, inject, signal, computed, effect, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ClassService } from '../../services/class.service';
import { TeacherAssignmentService } from '../../services/teacher-assignment.service';
import { User, UserStatus, CreateUserRequest } from '../../models/admin.models';
import { Class } from '../../models/class.model';
import { ApplicationRole } from '../../../../core/enums/application-role.enum';
import { ToastService } from '../../../../shared/services/toast.service';
import { TeacherAssignmentInfo, ClassSubjectAssignment } from '../../models/teacher-assignment.model';
import { BaseHttpService } from '../../../../core/services/base-http.service';
import { Admin_API_ENDPOINTS } from '../../../../config/AdminConfig/AdminEndpoint';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../config/environment';

@Component({
  selector: 'app-admin-users',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css',
})
export class AdminUsersComponent implements OnInit {
  private userService = inject(UserService);
  private classService = inject(ClassService);
  private teacherAssignmentService = inject(TeacherAssignmentService);
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  // State
  users = this.userService.getUsers();
  searchQuery = signal(''); // Applied search query
  tempSearchQuery = signal(''); // Temporary search input (before clicking search)
  roleFilter = signal<ApplicationRole | ''>(''); // Applied role filter
  tempRoleFilter = signal<ApplicationRole | ''>(''); // Temporary role filter
  statusFilter = signal<UserStatus | ''>(''); // Applied status filter
  tempStatusFilter = signal<UserStatus | ''>(''); // Temporary status filter
  classFilter = signal<string | ''>(''); // Applied class filter (string ID)
  tempClassFilter = signal<string | ''>(''); // Temporary class filter (string ID)

  // Modals
  showAddUserModal = signal(false);
  showEditUserModal = signal(false);
  showBulkImportModal = signal(false);
  showDeleteConfirm = signal(false);
  showChangePasswordModal = signal(false);
  showQuickClassAssign = signal(false);
  showTeacherAssignmentsModal = signal(false);
  selectedUser = signal<User | null>(null);
  updatingUsers = signal<Set<string>>(new Set());
  isChangingPassword = signal(false);

  // Teacher assignments
  teacherAssignments = signal<TeacherAssignmentInfo[]>([]);
  subjects = signal<Array<{ Id: string; Name: string; Icon?: string }>>([]);
  newAssignment = signal<{ classId: string; subjectId: string }>({ classId: '', subjectId: '' });
  isLoadingAssignments = signal(false);

  // Form
  userForm: FormGroup;
  passwordForm: FormGroup;

  // Computed filtered users - REMOVED in favor of server-side filtering
  // filteredUsers = ...

  // Display users from service (already paginated by API)
  paginatedUsers = this.users;

  // Available options
  roles: ApplicationRole[] = [
    ApplicationRole.Admin,
    ApplicationRole.Teacher,
    ApplicationRole.Student,
  ];
  statuses: UserStatus[] = ['Active', 'Inactive'];
  classes = signal<Class[]>([]); // Dropdown classes loaded from lightweight endpoint
  itemsPerPageOptions = [25, 50, 100];
  Math = Math; // Make Math available in template
  ApplicationRole = ApplicationRole; // Make ApplicationRole available in template
  String = String; // Make String available in template

  // Helper to check if class dropdown should be shown
  shouldShowClassDropdown(): boolean {
    // If editing, check selected user's role first
    if (this.showEditUserModal()) {
      const selectedUser = this.selectedUser();
      if (selectedUser) {
        const userRole = Number(selectedUser.Role || selectedUser.role);
        // Student role is 4
        if (userRole === 4 || userRole === ApplicationRole.Student) {
          return true;
        }
      }
    }
    
    // Check form role value (for new users or when role is changed)
    const formRole = this.userForm.get('role')?.value;
    if (formRole !== null && formRole !== undefined) {
      const formRoleNum = Number(formRole);
      // Student role is 4
      return formRoleNum === 4 || formRole === ApplicationRole.Student;
    }
    
    return false;
  }

  ngOnInit(): void {
    this.loadClassesForDropdown(); // Load lightweight classes for dropdowns
    // Initialize temp filters with current applied values
    this.tempSearchQuery.set(this.searchQuery());
    this.tempRoleFilter.set(this.roleFilter());
    this.tempStatusFilter.set(this.statusFilter());
    this.tempClassFilter.set(this.classFilter());
  }

  loadClassesForDropdown(): void {
    this.classService.getClassesForDropdown().subscribe({
      next: (dropdownClasses) => {
        this.classes.set(dropdownClasses);
      },
      error: (err) => {
        console.error('Failed to load classes for dropdown:', err);
        // Fallback to full classes if dropdown fails
        this.classService.init();
        // Use full classes as fallback
        const fullClassesSignal = this.classService.getClasses;
        // Set initial value
        this.classes.set(fullClassesSignal());
        // Watch for updates
        effect(() => {
          const fullClasses = fullClassesSignal();
          if (fullClasses.length > 0) {
            this.classes.set(fullClasses);
          }
        });
      },
    });
  }

  constructor() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      status: ['Active', Validators.required],
      class: [''], // For students - will store class ID
      phoneNumber: [''], // Add phone number field
      notes: [''],
    });

    // Password change form with custom validator for password match
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, {
      validators: (form: FormGroup) => this.passwordMatchValidator(form)
    });

    // Effect to reload users when applied filters or page size change (Server-side filtering)
    // Note: This effect does NOT watch currentPage to avoid double calls with goToPage()
    // Only triggers when applied filters change, not temp filters
    effect(
      () => {
        const query = this.searchQuery(); // Only watch applied search
        const role = this.roleFilter(); // Only watch applied role filter
        const status = this.statusFilter(); // Only watch applied status filter
        const classId = this.classFilter(); // Only watch applied class filter
        const pageSize = this.pageSize();

        // Map status to isActive boolean
        let isActive: boolean | undefined;
        if (status === 'Active') isActive = true;
        else if (status === 'Inactive') isActive = false;

        // Determine if query is email or general search
        const isEmail = query.includes('@');

        // Use current page from service
        this.userService.loadUsers({
          pageIndex: this.currentPage(),
          pageSize: pageSize,
          search: isEmail ? undefined : query,
          email: isEmail ? query : undefined,
          role: role ? Number(role) : undefined,
          isActive: isActive,
          status: status || undefined,
          classId: classId ? classId : undefined, // classId is already string
        });
      },
      { allowSignalWrites: true }
    );
  }

  // Search and filter methods
  onSearchInput(query: string) {
    // Update temporary search query (doesn't trigger search)
    this.tempSearchQuery.set(query);
  }

  onRoleFilterChange(role: string) {
    // Update temporary role filter (doesn't trigger search)
    this.tempRoleFilter.set(role as ApplicationRole | '');
  }

  onStatusFilterChange(status: string) {
    // Update temporary status filter (doesn't trigger search)
    this.tempStatusFilter.set(status as UserStatus | '');
  }

  onClassFilterChange(classId: string) {
    // Update temporary class filter (doesn't trigger search)
    this.tempClassFilter.set(classId || '');
  }

  applySearch() {
    // Apply all filters (search + role + status + class) and trigger API call
    this.searchQuery.set(this.tempSearchQuery());
    this.roleFilter.set(this.tempRoleFilter());
    this.statusFilter.set(this.tempStatusFilter());
    this.classFilter.set(this.tempClassFilter());
    this.userService.resetToFirstPage();
  }

  onSearchKeyPress(event: KeyboardEvent) {
    // Allow Enter key to trigger search
    if (event.key === 'Enter') {
      this.applySearch();
    }
  }

  clearFilters() {
    // Clear all filters and search (both temp and applied)
    this.tempSearchQuery.set('');
    this.searchQuery.set('');
    this.tempRoleFilter.set('');
    this.roleFilter.set('');
    this.tempStatusFilter.set('');
    this.statusFilter.set('');
    this.tempClassFilter.set('');
    this.classFilter.set('');
    this.userService.resetToFirstPage();
  }

  hasActiveFilters(): boolean {
    // Check if any filters are active (check applied filters)
    return !!(
      this.searchQuery() ||
      this.roleFilter() ||
      this.statusFilter() ||
      this.classFilter()
    );
  }

  onItemsPerPageChange(items: number) {
    this.userService.setPageSize(items);
  }

  // Pagination from service
  currentPage = this.userService.getCurrentPage();
  pageSize = this.userService.getPageSize();
  totalRecords = this.userService.getTotalRecords();

  totalPages = computed(() => Math.ceil(this.totalRecords() / this.pageSize()));

  // Pagination
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.userService.goToPage(page);
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
    // Enable password field for new users
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.selectedUser.set(null);
    this.showAddUserModal.set(true);
  }

  openEditUserModal(user: User) {
    this.selectedUser.set(user);
    // Use PascalCase properties (matching backend) with fallback to camelCase for compatibility
    this.userForm.patchValue({
      name: user.Name || user.name || '',
      email: user.Email || user.email || '',
      role: user.Role || user.role,
      status: user.Status || user.Status || 'Active',
      class: (user.ClassId || user.classId) ? String(user.ClassId || user.classId) : '',
      phoneNumber: (user.Notes || (user as any).notes || '') as string,
      notes: (user.Notes || (user as any).notes || '') as string,
    });
    // Disable password requirement for editing (optional field)
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.showEditUserModal.set(true);
  }

  closeUserModal() {
    this.showAddUserModal.set(false);
    this.showEditUserModal.set(false);
    this.userForm.reset({ status: 'Active' });
    this.selectedUser.set(null);
  }

  saveUser() {
    if (this.userForm.invalid) return;

    const formValue = this.userForm.value;

    if (this.selectedUser()) {
      // Update existing user
      const currentUser = this.selectedUser()!;
      const formRole = formValue.role ? Number(formValue.role) : undefined;
      const currentRole = Number(currentUser.Role || currentUser.role);
      
      // Check if user is a student (Student role = 4)
      const isStudent = formRole === ApplicationRole.Student || formRole === 4 || 
                       currentRole === ApplicationRole.Student || currentRole === 4;
      
      // Use PascalCase properties to match backend
      const updateData: Partial<User> = {
        Name: formValue.name,
        Email: formValue.email,
        Role: formRole ?? currentRole,
        Status: formValue.status as UserStatus,
        Notes: formValue.phoneNumber || formValue.notes || '',
      };

      // Always include class assignment for students (Backend expects ClassID as string for long type)
      if (isStudent) {
        // Check if class is selected in the form
        const classValue = formValue.class;
        
        if (classValue && classValue !== '' && classValue !== '0' && classValue !== null && classValue !== undefined) {
          // Assign class
          const selectedClass = this.classes().find(c => c.id === classValue);
          updateData.ClassId = String(classValue); // Backend long -> send as string
          updateData.ClassName = selectedClass?.name;
        } else {
          // Remove class assignment - send null explicitly
          updateData.ClassId = null as any; // Send null to remove class assignment
          updateData.ClassName = undefined;
        }
      }

      const userId = this.selectedUser()?.Id || this.selectedUser()?.id;
      if (!userId) {
        this.toastService.showErrorMessage('Invalid user ID. Please refresh and try again.');
        return;
      }

      this.userService.updateUser(userId, updateData).subscribe({
        next: () => {
          this.toastService.showSuccessMessage('User updated successfully');
          this.closeUserModal();
        },
        error: (err) => {
          console.error('Failed to update user', err);
          this.toastService.showErrorMessage('Failed to update user. Please try again.');
        },
      });
    } else {
      // Add new user - map form values to API request structure
      const createUserRequest: CreateUserRequest = {
        Name: formValue.name,
        UserName: formValue.email, // Using email as username
        Email: formValue.email,
        Password: formValue.password,
        PhoneNumber: formValue.phoneNumber || '1234567789',
        RoleID: formValue.role,
        ClassID: formValue.role === ApplicationRole.Student && formValue.class ? String(formValue.class) : undefined, // Backend long -> send as string
      };

      this.userService.addUser(createUserRequest).subscribe({
        next: () => {
          this.toastService.showSuccessMessage('User created successfully');
          this.closeUserModal();
        },
        error: (err) => {
          console.error('Failed to add user', err);
          this.toastService.showErrorMessage('Failed to create user. Please try again.');
        },
      });
    }
  }

  openDeleteConfirm(user: User) {
    this.selectedUser.set(user);
    this.showDeleteConfirm.set(true);
  }

  confirmDelete() {
    const user = this.selectedUser();
    if (user) {
      const userId = user.Id || user.id;
      if (!userId) {
        this.toastService.showErrorMessage('Invalid user ID.');
        return;
      }
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.showDeleteConfirm.set(false);
          this.selectedUser.set(null);
        },
        error: (err) => {
          console.error('Failed to delete user', err);
          // TODO: Show error notification to user
        },
      });
    }
  }

  cancelDelete() {
    this.showDeleteConfirm.set(false);
    this.selectedUser.set(null);
  }

  // Password change
  openChangePasswordModal(user: User) {
    this.selectedUser.set(user);
    this.passwordForm.reset();
    this.showChangePasswordModal.set(true);
  }

  cancelChangePassword() {
    this.showChangePasswordModal.set(false);
    this.selectedUser.set(null);
    this.passwordForm.reset();
  }

  confirmChangePassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const user = this.selectedUser();
    if (!user) {
      this.toastService.showErrorMessage('No user selected.');
      return;
    }

    const userId = user.Id || user.id;
    if (!userId) {
      this.toastService.showErrorMessage('Invalid user ID.');
      return;
    }

    const newPassword = this.passwordForm.get('newPassword')?.value;
    if (!newPassword) {
      this.toastService.showErrorMessage('Password is required.');
      return;
    }

    this.isChangingPassword.set(true);
    this.userService.changePassword(userId, newPassword).subscribe({
      next: (response) => {
        this.isChangingPassword.set(false);
        if (response.success) {
          this.toastService.showSuccessMessage(response.message || 'Password changed successfully');
          this.cancelChangePassword();
        } else {
          this.toastService.showErrorMessage(response.message || 'Failed to change password');
        }
      },
      error: (err) => {
        this.isChangingPassword.set(false);
        console.error('Failed to change password', err);
        this.toastService.showErrorMessage(err.error?.Message || err.message || 'Failed to change password');
      },
    });
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
    const roleFilter = this.roleFilter() || undefined;
    const statusFilter = this.statusFilter() || undefined;

    this.userService
      .exportUsers({
        role: roleFilter as number | undefined,
        status: statusFilter,
      })
      .subscribe({
        next: (blob) => {
          // Check if blob is valid
          if (blob && blob.size > 0) {
            // Check if it's actually a blob and not an error response
            if (blob.type === 'application/json') {
              console.error('Received JSON instead of CSV file - API may not be implemented');
              this.toastService.showWarningMessage(
                'Export API endpoint is not yet implemented on the backend. Please contact the administrator.'
              );
              return;
            }
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `users-export-${new Date().toISOString().split('T')[0]}.xlsx`;
            link.click();
            window.URL.revokeObjectURL(url);
          } else {
            console.error('Received empty blob');
            this.toastService.showErrorMessage('Export failed - received empty file. Please try again.');
          }
        },
        error: (err) => {
          console.error('Failed to export users:', err);
          this.toastService.showErrorMessage(
            `Failed to generate export: ${
              err.message || 'Unknown error'
            }. The API endpoint may not be implemented yet.`
          );
        },
      });
  }

  // Helper methods
  formatDate(date: Date | string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }

  getRoleBadgeClass(role: ApplicationRole | string): string {
    const classes: Record<string | number, string> = {
      [ApplicationRole.Admin]: 'badge-admin',
      [ApplicationRole.Teacher]: 'badge-teacher',
      [ApplicationRole.Student]: 'badge-student',
      Admin: 'badge-admin',
      Teacher: 'badge-teacher',
      Student: 'badge-student',
      BadgeManager: 'badge-manager',
    };
    return classes[role] || '';
  }

  getRoleName(role: ApplicationRole): string {
    return ApplicationRole[role];
  }

  getRoleDisplayName(role: ApplicationRole | string | number | undefined): string {
    if (role === undefined || role === null) return 'Unknown';
    
    // Handle string role names (e.g., "Admin", "Teacher", "Student")
    if (typeof role === 'string') {
      // Check if it's already a role name (capitalize first letter)
      const capitalized = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
      if (capitalized === 'Admin' || capitalized === 'Teacher' || capitalized === 'Student') {
        return capitalized;
      }
      // Try to convert string number to enum
      const numRole = Number(role);
      if (!isNaN(numRole)) {
        const enumValue = ApplicationRole[numRole as ApplicationRole];
        return enumValue || role;
      }
      return role;
    }
    
    // Handle number role (enum value)
    if (typeof role === 'number') {
      // Map enum values to names
      const roleMap: Record<number, string> = {
        [ApplicationRole.Admin]: 'Admin',
        [ApplicationRole.Teacher]: 'Teacher',
        [ApplicationRole.Student]: 'Student',
      };
      return roleMap[role] || `Role ${role}`;
    }
    
    return 'Unknown';
  }

  // Inline editing methods
  isUpdatingUser(userId: string): boolean {
    return this.updatingUsers().has(userId);
  }

  toggleUserStatus(user: User): void {
    const userId = user.Id || user.id;
    if (!userId || this.isUpdatingUser(userId)) return;

    this.updatingUsers.update(users => new Set(users).add(userId));

    const newStatus: UserStatus = (user.Status || user.Status) === 'Active' ? 'Inactive' : 'Active';
    const updateData: Partial<User> = { Status: newStatus };

    this.userService.updateUser(userId, updateData).subscribe({
      next: () => {
        this.toastService.showSuccessMessage(`User ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully`);
        this.updatingUsers.update(users => {
          const newSet = new Set(users);
          newSet.delete(userId);
          return newSet;
        });
      },
      error: (err) => {
        console.error('Failed to update user status', err);
        this.toastService.showErrorMessage('Failed to update user status. Please try again.');
        this.updatingUsers.update(users => {
          const newSet = new Set(users);
          newSet.delete(userId);
          return newSet;
        });
      },
    });
  }

  openQuickClassAssign(user: User): void {
    if (user.role !== ApplicationRole.Student) return;
    this.selectedUser.set(user);
    this.showQuickClassAssign.set(true);
  }

  closeQuickClassAssign(): void {
    this.showQuickClassAssign.set(false);
    this.selectedUser.set(null);
  }

  quickAssignClass(classId: string): void {
    const user = this.selectedUser();
    const userId = user?.Id || user?.id;
    if (!user || !userId || this.isUpdatingUser(userId)) return;

    this.updatingUsers.update(users => new Set(users).add(userId));

    const selectedClass = this.classes().find(c => c.id === classId);
    const updateData: Partial<User> = {
      ClassId: String(classId), // Backend long -> send as string
      ClassName: selectedClass?.name,
    };

    this.userService.updateUser(userId, updateData).subscribe({
      next: () => {
        this.toastService.showSuccessMessage(`User assigned to ${selectedClass?.name || 'class'} successfully`);
        this.closeQuickClassAssign();
        this.updatingUsers.update(users => {
          const newSet = new Set(users);
          newSet.delete(userId);
          return newSet;
        });
      },
      error: (err) => {
        console.error('Failed to assign class', err);
        this.toastService.showErrorMessage('Failed to assign class. Please try again.');
        this.updatingUsers.update(users => {
          const newSet = new Set(users);
          newSet.delete(userId);
          return newSet;
        });
      },
    });
  }

  // Teacher assignment management
  openTeacherAssignmentsModal(): void {
    const user = this.selectedUser();
    if (!user) return;

    const userRole = Number(user.Role || user.role);
    if (userRole !== ApplicationRole.Teacher && userRole !== 2) {
      this.toastService.showErrorMessage('This user is not a teacher');
      return;
    }

    this.showTeacherAssignmentsModal.set(true);
    this.loadTeacherAssignments();
    this.loadSubjects();
  }

  closeTeacherAssignmentsModal(): void {
    this.showTeacherAssignmentsModal.set(false);
    this.teacherAssignments.set([]);
    this.newAssignment.set({ classId: '', subjectId: '' });
  }

  loadTeacherAssignments(): void {
    const user = this.selectedUser();
    const userId = user?.Id || user?.id;
    if (!userId) {
      console.warn('Cannot load teacher assignments: no user selected');
      return;
    }

    console.log('Loading teacher assignments for user:', userId);
    this.isLoadingAssignments.set(true);
    
    // Clear previous assignments to show loading state
    this.teacherAssignments.set([]);
    
    this.teacherAssignmentService.getTeacherAssignments(userId).subscribe({
      next: (assignments) => {
        console.log('Received teacher assignments:', assignments);
        // Use update() to ensure signal change detection
        this.teacherAssignments.update(() => assignments);
        this.isLoadingAssignments.set(false);
        console.log('Teacher assignments signal updated:', this.teacherAssignments());
      },
      error: (err) => {
        console.error('Failed to load teacher assignments', err);
        this.toastService.showErrorMessage('Failed to load teacher assignments');
        this.isLoadingAssignments.set(false);
        // Clear assignments on error
        this.teacherAssignments.set([]);
      },
    });
  }

  onSubjectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.newAssignment.update(a => ({...a, subjectId: target.value}));
  }

  onClassChangeForAssignment(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.newAssignment.update(a => ({...a, classId: target.value}));
  }

  loadSubjects(): void {
    const url = `${environment.apiUrl}/${Admin_API_ENDPOINTS.Subjects.GET_ALL}`.replace(/\/+/g, '/').replace(':/', '://');
    this.http.get<any>(url).subscribe({
      next: (response) => {
        let subjectsData: any[] = [];
        // Handle API response wrapper
        if (response && typeof response === 'object') {
          if ('IsSuccess' in response && response.IsSuccess && response.Data) {
            subjectsData = Array.isArray(response.Data) ? response.Data : [];
          } else if ('isSuccess' in response && response.isSuccess && response.data) {
            subjectsData = Array.isArray(response.data) ? response.data : [];
          } else if (Array.isArray(response)) {
            subjectsData = response;
          } else if (response?.Data && Array.isArray(response.Data)) {
            subjectsData = response.Data;
          }
        }

        // Map and deduplicate subjects by Id
        const uniqueSubjectsMap = new Map<string, { Id: string; Name: string; Icon?: string }>();
        subjectsData.forEach((s) => {
          const id = String(s.Id || s.id || '');
          if (id && !uniqueSubjectsMap.has(id)) {
            uniqueSubjectsMap.set(id, {
              Id: id,
              Name: s.Name || s.name || '',
              Icon: s.Icon || s.icon,
            });
          }
        });
        this.subjects.set(Array.from(uniqueSubjectsMap.values()));
      },
      error: (err) => {
        console.error('Failed to load subjects', err);
        this.subjects.set([]);
      },
    });
  }

  addTeacherAssignment(): void {
    const assignment = this.newAssignment();
    if (!assignment.classId || !assignment.subjectId) {
      this.toastService.showErrorMessage('Please select both class and subject');
      return;
    }

    const user = this.selectedUser();
    const userId = user?.Id || user?.id;
    if (!userId) return;

    const newAssignments: ClassSubjectAssignment[] = [
      ...this.teacherAssignments().map((a) => ({
        ClassId: a.ClassId,
        SubjectId: a.SubjectId,
      })),
      {
        ClassId: assignment.classId,
        SubjectId: assignment.subjectId,
      },
    ];

    this.isLoadingAssignments.set(true);
    this.teacherAssignmentService.assignTeacherToClasses(userId, newAssignments).subscribe({
      next: (response) => {
        if (response.Errors && response.Errors.length > 0) {
          this.toastService.showErrorMessage(response.Errors.join(', '));
        } else {
          this.toastService.showSuccessMessage(
            `Successfully assigned ${response.AssignmentsCreated} class-subject combination(s)`
          );
          this.newAssignment.set({ classId: '', subjectId: '' });
          this.loadTeacherAssignments();
        }
        this.isLoadingAssignments.set(false);
      },
      error: (err) => {
        console.error('Failed to add assignment', err);
        this.toastService.showErrorMessage('Failed to add assignment. Please try again.');
        this.isLoadingAssignments.set(false);
      },
    });
  }

  removeTeacherAssignment(assignmentId: string): void {
    const user = this.selectedUser();
    const userId = user?.Id || user?.id;
    if (!userId) return;

    this.isLoadingAssignments.set(true);
    this.teacherAssignmentService.removeAssignment(userId, assignmentId).subscribe({
      next: () => {
        this.toastService.showSuccessMessage('Assignment removed successfully');
        this.loadTeacherAssignments();
        this.isLoadingAssignments.set(false);
      },
      error: (err) => {
        console.error('Failed to remove assignment', err);
        this.toastService.showErrorMessage('Failed to remove assignment. Please try again.');
        this.isLoadingAssignments.set(false);
      },
    });
  }

  isTeacher(user: User): boolean {
    const role = Number(user.Role || user.role);
    return role === ApplicationRole.Teacher || role === 2;
  }

  // Custom validator for password match
  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (!newPassword || !confirmPassword) {
      return null;
    }

    if (newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      if (confirmPassword.hasError('passwordMismatch')) {
        confirmPassword.setErrors(null);
      }
      return null;
    }
  }
}
