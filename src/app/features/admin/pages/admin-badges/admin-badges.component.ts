import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BadgeService } from '../../services/badge.service';
import { Badge } from '../../models/admin.models';
import { ApplicationRole } from '../../../../core/enums/application-role.enum';
import { ValidationErrorException } from '../../../../core/models/validation-error.model';
import { ErrorHandlerUtil } from '../../../../core/utils/error-handler.util';
import { ToastService } from '../../../../shared/services/toast.service';

interface Mission {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface CreateBadgeRequest {
  Name: string;
  Description: string;
  Icon: string;
  Color: string;
  Category: number;
  TargetRole: number;
  CpdHours?: number;
  MissionId?: string;
  IsActive?: boolean;
}

@Component({
  selector: 'app-admin-badges',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-badges.component.html',
  styleUrl: './admin-badges.component.css',
})
export class AdminBadgesComponent implements OnInit {
  private badgeService = inject(BadgeService);
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  // State
  badges = this.badgeService.getBadges();
  isLoading = signal(false);
  isSubmitting = signal(false);
  
  // Modals
  showAddBadgeModal = signal(false);
  showEditBadgeModal = signal(false);
  showDeleteConfirm = signal(false);
  selectedBadge = signal<Badge | null>(null);

  // Form
  badgeForm: FormGroup;

  // Error handling
  generalError = signal('');
  nameError = signal('');
  descriptionError = signal('');
  iconError = signal('');
  colorError = signal('');
  categoryError = signal('');
  targetRoleError = signal('');
  cpdHoursError = signal('');
  missionError = signal('');

  // Options
  roles: ApplicationRole[] = [
    ApplicationRole.Admin,
    ApplicationRole.Teacher,
    ApplicationRole.Student,
  ];

  badgeCategories = [
    { id: 2, name: 'AITools' },
    { id: 3, name: 'Microsoft365' },
    { id: 9, name: 'Portfolio' },
    { id: 10, name: 'Cpd' },
    { id: 11, name: 'Mission' },
    { id: 12, name: 'Engagement' },
  ];

  badgeIcons = [
    '🏆', '🎖️', '⭐', '🌟', '💎', '👑', '🎯', '🔥', '💪', '🚀',
    '🎨', '📚', '🤖', '💼', '✨', '🎓', '🏅', '🥇', '🥈', '🥉'
  ];

  badgeColors = [
    { value: '#FFD700', name: 'Gold' },
    { value: '#C0C0C0', name: 'Silver' },
    { value: '#CD7F32', name: 'Bronze' },
    { value: '#FF6B6B', name: 'Red' },
    { value: '#4ECDC4', name: 'Teal' },
    { value: '#45B7D1', name: 'Blue' },
    { value: '#FFA07A', name: 'Orange' },
    { value: '#98D8C8', name: 'Mint' },
    { value: '#F7DC6F', name: 'Yellow' },
    { value: '#BB8FCE', name: 'Purple' },
  ];

  missions = signal<Mission[]>([]);
  selectedMission = signal<Mission | null>(null);

  constructor() {
    this.badgeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      icon: ['🏆', Validators.required],
      color: ['#FFD700', Validators.required],
      category: ['', Validators.required],
      targetRole: ['', Validators.required],
      cpdHours: [0, [Validators.min(0)]],
      missionId: [''],
      isActive: [true],
    });
  }

  ngOnInit(): void {
    this.badgeService.init();
    this.loadMissions();
  }

  loadMissions(): void {
    // TODO: Replace with actual API call when mission endpoint is available
    setTimeout(() => {
      this.missions.set([
        {
          id: '1',
          title: 'Eduaide Explorer',
          description: 'Master Eduaide AI tool',
          icon: '🤖',
        },
        {
          id: '2',
          title: 'Curipod Creator',
          description: 'Create interactive lessons with Curipod',
          icon: '🎨',
        },
        {
          id: '3',
          title: 'Diffit Designer',
          description: 'Differentiate content with Diffit',
          icon: '📚',
        },
        {
          id: '4',
          title: 'MagicSchool Wizard',
          description: 'Leverage MagicSchool AI',
          icon: '✨',
        },
        {
          id: '5',
          title: 'Teams Expert',
          description: 'Advanced Microsoft Teams skills',
          icon: '💼',
        },
      ]);
    }, 100);
  }

  // Modal Actions
  openAddBadgeModal(): void {
    this.badgeForm.reset({
      icon: '🏆',
      color: '#FFD700',
      cpdHours: 0,
      isActive: true,
    });
    this.selectedBadge.set(null);
    this.selectedMission.set(null);
    this.clearErrors();
    this.showAddBadgeModal.set(true);
  }

  openEditBadgeModal(badge: Badge): void {
    this.selectedBadge.set(badge);
    
    this.badgeForm.patchValue({
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      color: badge.color || '#FFD700',
      category: badge.categoryId || '',
      targetRole: badge.targetRole || ApplicationRole.Student,
      cpdHours: badge.cpdHours || 0,
      missionId: '',
      isActive: badge.isActive !== false,
    });
    this.clearErrors();
    this.showEditBadgeModal.set(true);
  }

  closeBadgeModal(): void {
    this.showAddBadgeModal.set(false);
    this.showEditBadgeModal.set(false);
    this.badgeForm.reset({
      icon: '🏆',
      color: '#FFD700',
      cpdHours: 0,
      isActive: true,
    });
    this.selectedBadge.set(null);
    this.selectedMission.set(null);
    this.clearErrors();
  }

  openDeleteConfirm(badge: Badge): void {
    this.selectedBadge.set(badge);
    this.showDeleteConfirm.set(true);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.selectedBadge.set(null);
  }

  confirmDelete(): void {
    const badge = this.selectedBadge();
    if (!badge) return;

    this.badgeService.deleteBadge(badge.id).subscribe({
      next: (result) => {
        this.showDeleteConfirm.set(false);
        this.selectedBadge.set(null);
        this.toastService.showSuccessMessage(result.message || 'Badge deleted successfully!');
      },
      error: (error) => {
        console.error('Failed to delete badge', error);
        this.toastService.showErrorMessage('Failed to delete badge. Please try again.');
      },
    });
  }

  onMissionSelect(missionId: string): void {
    const mission = this.missions().find((m) => m.id === missionId);
    this.selectedMission.set(mission || null);
    this.badgeForm.patchValue({ missionId: missionId || '' });
    this.missionError.set('');
  }

  onSubmit(): void {
    if (this.badgeForm.invalid) {
      Object.keys(this.badgeForm.controls).forEach((key) => {
        this.badgeForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.clearErrors();
    this.isSubmitting.set(true);

    const formValue = this.badgeForm.value;
    const request: CreateBadgeRequest = {
      Name: formValue.name,
      Description: formValue.description,
      Icon: formValue.icon,
      Color: formValue.color,
      Category: Number(formValue.category),
      TargetRole: Number(formValue.targetRole),
      CpdHours: formValue.cpdHours > 0 ? formValue.cpdHours : undefined,
      MissionId: formValue.missionId || undefined,
      IsActive: formValue.isActive !== false,
    };

    const badge = this.selectedBadge();
    const operation = badge
      ? this.badgeService.updateBadge(badge.id, request)
      : this.badgeService.createBadge(request);

    operation.subscribe({
      next: (result) => {
        this.isSubmitting.set(false);
        this.clearErrors();
        this.closeBadgeModal();
        this.toastService.showSuccessMessage(result.message || 'Operation successful!');
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.handleError(error);
      },
    });
  }

  private handleError(error: any): void {
    if (error instanceof ValidationErrorException) {
      this.nameError.set(ErrorHandlerUtil.getFieldError(error, 'Name'));
      this.descriptionError.set(ErrorHandlerUtil.getFieldError(error, 'Description'));
      this.iconError.set(ErrorHandlerUtil.getFieldError(error, 'Icon'));
      this.colorError.set(ErrorHandlerUtil.getFieldError(error, 'Color'));
      this.categoryError.set(ErrorHandlerUtil.getFieldError(error, 'Category'));
      this.targetRoleError.set(ErrorHandlerUtil.getFieldError(error, 'TargetRole'));
      this.cpdHoursError.set(ErrorHandlerUtil.getFieldError(error, 'CpdHours'));
      this.missionError.set(ErrorHandlerUtil.getFieldError(error, 'MissionId'));

      const otherErrors = error.validationErrors.filter(
        (err) =>
          !['Name', 'Description', 'Icon', 'Color', 'Category', 'TargetRole', 'CpdHours', 'MissionId'].includes(
            err.PropertyName
          )
      );
      if (otherErrors.length > 0) {
        this.generalError.set(
          otherErrors.map((err) => err.ErrorMessage).join(', ')
        );
      }
    } else {
      this.generalError.set(ErrorHandlerUtil.getGeneralError(error));
    }
  }

  private clearErrors(): void {
    this.generalError.set('');
    this.nameError.set('');
    this.descriptionError.set('');
    this.iconError.set('');
    this.colorError.set('');
    this.categoryError.set('');
    this.targetRoleError.set('');
    this.cpdHoursError.set('');
    this.missionError.set('');
  }

  getRoleName(role: ApplicationRole): string {
    return ApplicationRole[role];
  }

  getCategoryName(categoryId: number): string {
    return this.badgeCategories.find((c) => c.id === categoryId)?.name || 'Unknown';
  }
}
