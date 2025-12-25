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
  private httpService = inject(BaseHttpService);
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  // State
  users = this.userService.getUsers();
  searchQuery = signal('');
  roleFilter = signal<ApplicationRole | ''>('');
  statusFilter = signal<UserStatus | ''>('');
  classFilter = signal<number | ''>('');

  // Modals
  showAddUserModal = signal(false);
  showEditUserModal = signal(false);
  showBulkImportModal = signal(false);
  showDeleteConfirm = signal(false);
  showQuickClassAssign = signal(false);
  showTeacherAssignmentsModal = signal(false);
  selectedUser = signal<User | null>(null);
  updatingUsers = signal<Set<string>>(new Set());

  // Teacher assignments
  teacherAssignments = signal<TeacherAssignmentInfo[]>([]);
  subjects = signal<Array<{ Id: string; Name: string; Icon?: string }>>([]);
  newAssignment = signal<{ classId: string; subjectId: string }>({ classId: '', subjectId: '' });
  isLoadingAssignments = signal(false);

  // Form
  userForm: FormGroup;

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

    // Effect to reload users when filters or page size change (Server-side filtering)
    // Note: This effect does NOT watch currentPage to avoid double calls with goToPage()
    effect(
      () => {
        const query = this.searchQuery();
        const role = this.roleFilter();
        const status = this.statusFilter();
        const classId = this.classFilter();
        const pageSize = this.pageSize();

        // Map status to isActive boolean
        let isActive: boolean | undefined;
        if (status === 'Active') isActive = true;
        else if (status === 'Inactive') isActive = false;

        // Determine if query is email or general search
        const isEmail = query.includes('@');

        // Use current page from service (filters already reset page to 1 via resetToFirstPage)
        this.userService.loadUsers({
          pageIndex: this.currentPage(),
          pageSize: pageSize,
          search: isEmail ? undefined : query,
          email: isEmail ? query : undefined,
          role: role ? Number(role) : undefined,
          isActive: isActive,
          status: status || undefined, // Keep status for legacy if needed
          classId: classId ? Number(classId) : undefined,
        });
      },
      { allowSignalWrites: true }
    );
  }

  // Search and filter methods
  onSearch(query: string) {
    // Update search query immediately for UI feedback
    this.searchQuery.set(query);
    // Reset to page 1 when search changes (effect will handle the load)
    this.userService.resetToFirstPage();
  }

  onRoleFilter(role: string) {
    // Reset to page 1 when role filter changes (effect will handle the load)
    this.userService.resetToFirstPage();
    this.roleFilter.set(role as ApplicationRole | '');
  }

  onStatusFilter(status: string) {
    // Reset to page 1 when status filter changes (effect will handle the load)
    this.userService.resetToFirstPage();
    this.statusFilter.set(status as UserStatus | '');
  }

  onClassFilter(classId: string) {
    // Reset to page 1 when class filter changes (effect will handle the load)
    this.userService.resetToFirstPage();
    this.classFilter.set(classId ? Number(classId) : '');
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
          const selectedClass = this.classes().find(c => c.id === Number(classValue));
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
  formatDate(date: Date): string {
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

  quickAssignClass(classId: number): void {
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
    if (!userId) return;

    this.isLoadingAssignments.set(true);
    this.teacherAssignmentService.getTeacherAssignments(userId).subscribe({
      next: (assignments) => {
        this.teacherAssignments.set(assignments);
        this.isLoadingAssignments.set(false);
      },
      error: (err) => {
        console.error('Failed to load teacher assignments', err);
        this.toastService.showErrorMessage('Failed to load teacher assignments');
        this.isLoadingAssignments.set(false);
      },
    });
  }

  loadSubjects(): void {
    this.httpService.get<any>(Admin_API_ENDPOINTS.Subjects.GET_ALL).subscribe({
      next: (response) => {
        let subjectsData: any[] = [];
        if (Array.isArray(response)) {
          subjectsData = response;
        } else if (response?.Data && Array.isArray(response.Data)) {
          subjectsData = response.Data;
        }

        this.subjects.set(
          subjectsData.map((s) => ({
            Id: String(s.Id || s.id || ''),
            Name: s.Name || s.name || '',
            Icon: s.Icon || s.icon,
          }))
        );
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
}
