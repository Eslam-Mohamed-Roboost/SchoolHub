import { Component, inject, signal, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';
import { MissionChallengeService } from '../../services/mission-challenge.service';
import {
  Mission,
  WeeklyChallenge,
  CreateMissionRequest,
  MissionResource,
  CreateMissionResourceRequest,
  UpdateMissionResourceRequest,
} from '../../models/admin.models';
import { BadgeService } from '../../services/badge.service';
import { ValidationErrorException } from '../../../../core/models/validation-error.model';
import { ErrorHandlerUtil } from '../../../../core/utils/error-handler.util';
import { ToastService } from '../../../../shared/services/toast.service';

type TabType = 'missions' | 'challenges';

@Component({
  selector: 'app-admin-missions',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-missions.component.html',
  styleUrl: './admin-missions.component.css',
})
export class AdminMissionsComponent implements OnInit {
  public missionChallengeService = inject(MissionChallengeService);
  private badgeService = inject(BadgeService);
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  // State
  activeTab = signal<TabType>('missions');
  missions = this.missionChallengeService.getMissions();
  challenges = this.missionChallengeService.getChallenges();
  badges = this.badgeService.getBadges();
  isLoading = signal(false);
  isSubmitting = signal(false);

  // Modals
  showAddMissionModal = signal(false);
  showEditMissionModal = signal(false);
  showDeleteMissionConfirm = signal(false);
  selectedMission = signal<Mission | null>(null);

  showAddChallengeModal = signal(false);
  showEditChallengeModal = signal(false);
  showDeleteChallengeConfirm = signal(false);
  selectedChallenge = signal<WeeklyChallenge | null>(null);

  // Resource Management
  showResourceModal = signal(false);
  showDeleteResourceConfirm = signal(false);
  selectedResource = signal<MissionResource | null>(null);
  editingResource = signal(false);
  resourceUploadMode = signal<'url' | 'file'>('url');
  selectedResourceFile = signal<File | null>(null);
  resourceForm: FormGroup;

  // Forms
  missionForm: FormGroup;
  challengeForm: FormGroup;

  // Error handling
  generalError = signal('');
  missionTitleError = signal('');
  missionDescriptionError = signal('');
  missionIconError = signal('');
  missionOrderError = signal('');

  challengeTitleError = signal('');
  challengeDescriptionError = signal('');
  challengeWeekNumberError = signal('');

  // Options
  missionIcons = [
    '🎯',
    '🚀',
    '📚',
    '🎓',
    '🏆',
    '⭐',
    '🌟',
    '💎',
    '👑',
    '🔥',
    '💪',
    '🎨',
    '🤖',
    '💼',
    '✨',
    '🎪',
    '🎬',
    '🎮',
    '🎲',
    '🎭',
  ];

  challengeStatuses: Array<'Draft' | 'Published' | 'Scheduled'> = [
    'Draft',
    'Published',
    'Scheduled',
  ];

  constructor() {
    // Mission Form
    this.missionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      icon: ['🎯', Validators.required],
      order: [1, [Validators.required, Validators.min(1)]],
      enabled: [true],
      badgeId: [''],
      duration: [''],
    });

    // Challenge Form
    this.challengeForm = this.fb.group({
      weekNumber: [1, [Validators.required, Validators.min(1)]],
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      resourceLinks: this.fb.array([]),
      tutorialVideo: [''],
      submissionFormLink: [''],
      status: ['Draft', Validators.required],
      autoNotify: [true],
    });

    // Resource Form
    this.resourceForm = this.fb.group({
      type: ['video', [Validators.required]],
      title: ['', [Validators.required, Validators.minLength(3)]],
      url: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
      description: [''],
      order: [0, [Validators.required, Validators.min(0)]],
      isRequired: [false],
    });
  }

  ngOnInit(): void {
    this.missionChallengeService.init();
    this.badgeService.init();
  }

  // Tab Management
  setActiveTab(tab: TabType): void {
    this.activeTab.set(tab);
  }

  // Mission Management
  openAddMissionModal(): void {
    this.missionForm.reset({
      icon: '🎯',
      order: this.missions().length + 1,
      enabled: true,
    });
    this.selectedMission.set(null);
    this.clearMissionErrors();
    this.showAddMissionModal.set(true);
  }

  openEditMissionModal(mission: Mission): void {
    this.selectedMission.set(mission);
    this.missionChallengeService.loadMissionResources(mission.id);
    this.missionForm.patchValue({
      title: mission.title,
      description: mission.description,
      icon: mission.icon,
      order: mission.order,
      enabled: mission.enabled,
      badgeId: mission.badgeId || '',
      duration: mission.duration || '',
    });
    this.clearMissionErrors();
    this.showEditMissionModal.set(true);
  }

  closeMissionModal(): void {
    this.showAddMissionModal.set(false);
    this.showEditMissionModal.set(false);
    this.missionForm.reset({
      icon: '🎯',
      order: 1,
      enabled: true,
    });
    this.selectedMission.set(null);
    this.clearMissionErrors();
  }

  openDeleteMissionConfirm(mission: Mission): void {
    this.selectedMission.set(mission);
    this.showDeleteMissionConfirm.set(true);
  }

  cancelDeleteMission(): void {
    this.showDeleteMissionConfirm.set(false);
    this.selectedMission.set(null);
  }

  confirmDeleteMission(): void {
    const mission = this.selectedMission();
    if (!mission) return;

    this.missionChallengeService.deleteMission(mission.id).subscribe({
      next: (result) => {
        this.showDeleteMissionConfirm.set(false);
        this.selectedMission.set(null);
        this.toastService.showSuccessMessage(result.message || 'Mission deleted successfully!');
      },
      error: (error) => {
        console.error('Failed to delete mission', error);
        this.toastService.showErrorMessage('Failed to delete mission. Please try again.');
      },
    });
  }

  onSubmitMission(): void {
    if (this.missionForm.invalid) {
      Object.keys(this.missionForm.controls).forEach((key) => {
        this.missionForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.clearMissionErrors();
    this.isSubmitting.set(true);

    const formValue = this.missionForm.value;
    const request: CreateMissionRequest = {
      Title: formValue.title,
      Description: formValue.description,
      Icon: formValue.icon,
      Order: Number(formValue.order),
      Enabled: formValue.enabled !== false,
      BadgeId: formValue.badgeId || undefined,
      Duration: formValue.duration || undefined,
    };

    const mission = this.selectedMission();
    const operation = mission
      ? this.missionChallengeService.updateMission(mission.id, request)
      : this.missionChallengeService.createMission(request);

    operation.subscribe({
      next: (result) => {
        this.isSubmitting.set(false);
        this.clearMissionErrors();
        this.closeMissionModal();
        this.toastService.showSuccessMessage(result.message || 'Operation successful!');
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.handleMissionError(error);
      },
    });
  }

  // Challenge Management
  openAddChallengeModal(): void {
    this.challengeForm.reset({
      weekNumber: 1,
      status: 'Draft',
      autoNotify: true,
      resourceLinks: this.fb.array([]),
    });
    this.selectedChallenge.set(null);
    this.clearChallengeErrors();
    this.showAddChallengeModal.set(true);
  }

  openEditChallengeModal(challenge: WeeklyChallenge): void {
    this.selectedChallenge.set(challenge);

    // Clear existing resource links array
    const resourceLinksArray = this.challengeForm.get('resourceLinks') as FormArray;
    while (resourceLinksArray.length !== 0) {
      resourceLinksArray.removeAt(0);
    }

    // Add existing resource links
    challenge.resourceLinks.forEach((link) => {
      resourceLinksArray.push(this.fb.control(link, Validators.required));
    });

    this.challengeForm.patchValue({
      weekNumber: challenge.weekNumber,
      title: challenge.title,
      description: challenge.description,
      tutorialVideo: challenge.tutorialVideo || '',
      submissionFormLink: challenge.submissionFormLink || '',
      status: challenge.status,
      autoNotify: challenge.autoNotify,
    });
    this.clearChallengeErrors();
    this.showEditChallengeModal.set(true);
  }

  closeChallengeModal(): void {
    this.showAddChallengeModal.set(false);
    this.showEditChallengeModal.set(false);
    this.challengeForm.reset({
      weekNumber: 1,
      status: 'Draft',
      autoNotify: true,
    });
    const resourceLinksArray = this.challengeForm.get('resourceLinks') as FormArray;
    while (resourceLinksArray.length !== 0) {
      resourceLinksArray.removeAt(0);
    }
    this.selectedChallenge.set(null);
    this.clearChallengeErrors();
  }

  openDeleteChallengeConfirm(challenge: WeeklyChallenge): void {
    this.selectedChallenge.set(challenge);
    this.showDeleteChallengeConfirm.set(true);
  }

  cancelDeleteChallenge(): void {
    this.showDeleteChallengeConfirm.set(false);
    this.selectedChallenge.set(null);
  }

  confirmDeleteChallenge(): void {
    const challenge = this.selectedChallenge();
    if (!challenge) return;

    this.missionChallengeService.deleteChallenge(challenge.id).subscribe({
      next: (result) => {
        this.showDeleteChallengeConfirm.set(false);
        this.selectedChallenge.set(null);
        this.toastService.showSuccessMessage(result.message || 'Challenge deleted successfully!');
      },
      error: (error) => {
        console.error('Failed to delete challenge', error);
        this.toastService.showErrorMessage('Failed to delete challenge. Please try again.');
      },
    });
  }

  publishChallenge(id: string): void {
    this.missionChallengeService.publishChallenge(id).subscribe({
      next: (result) => {
        this.toastService.showSuccessMessage(result.message || 'Challenge published successfully!');
      },
      error: (error) => {
        console.error('Failed to publish challenge', error);
        this.toastService.showErrorMessage('Failed to publish challenge. Please try again.');
      },
    });
  }

  onSubmitChallenge(): void {
    if (this.challengeForm.invalid) {
      Object.keys(this.challengeForm.controls).forEach((key) => {
        if (key !== 'resourceLinks') {
          this.challengeForm.get(key)?.markAsTouched();
        }
      });
      return;
    }

    this.clearChallengeErrors();
    this.isSubmitting.set(true);

    const formValue = this.challengeForm.value;
    const resourceLinksArray = this.challengeForm.get('resourceLinks') as FormArray;
    const resourceLinks = resourceLinksArray.controls
      .map((control) => control.value)
      .filter((link) => link && link.trim() !== '');

    const request = {
      WeekNumber: Number(formValue.weekNumber),
      Title: formValue.title,
      Description: formValue.description,
      ResourceLinks: resourceLinks,
      TutorialVideo: formValue.tutorialVideo || undefined,
      SubmissionFormLink: formValue.submissionFormLink || undefined,
      Status: formValue.status,
      AutoNotify: formValue.autoNotify !== false,
    };

    const challenge = this.selectedChallenge();
    const operation = challenge
      ? this.missionChallengeService.updateChallenge(challenge.id, request)
      : this.missionChallengeService.createChallenge(request);

    operation.subscribe({
      next: (result) => {
        this.isSubmitting.set(false);
        this.clearChallengeErrors();
        this.closeChallengeModal();
        this.toastService.showSuccessMessage(result.message || 'Operation successful!');
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.handleChallengeError(error);
      },
    });
  }

  // Resource Links Management
  getResourceLinksArray(): FormArray {
    return this.challengeForm.get('resourceLinks') as FormArray;
  }

  getResourceLinkControl(index: number): FormControl {
    return this.getResourceLinksArray().at(index) as FormControl;
  }

  addResourceLink(): void {
    const resourceLinksArray = this.getResourceLinksArray();
    resourceLinksArray.push(this.fb.control('', Validators.required));
  }

  removeResourceLink(index: number): void {
    const resourceLinksArray = this.getResourceLinksArray();
    resourceLinksArray.removeAt(index);
  }

  // Error Handling
  private handleMissionError(error: any): void {
    if (error instanceof ValidationErrorException) {
      this.missionTitleError.set(ErrorHandlerUtil.getFieldError(error, 'Title'));
      this.missionDescriptionError.set(ErrorHandlerUtil.getFieldError(error, 'Description'));
      this.missionIconError.set(ErrorHandlerUtil.getFieldError(error, 'Icon'));
      this.missionOrderError.set(ErrorHandlerUtil.getFieldError(error, 'Order'));

      const otherErrors = error.validationErrors.filter(
        (err) => !['Title', 'Description', 'Icon', 'Order'].includes(err.PropertyName)
      );
      if (otherErrors.length > 0) {
        this.generalError.set(otherErrors.map((err) => err.ErrorMessage).join(', '));
      }
    } else {
      this.generalError.set(ErrorHandlerUtil.getGeneralError(error));
    }
  }

  private handleChallengeError(error: any): void {
    if (error instanceof ValidationErrorException) {
      this.challengeTitleError.set(ErrorHandlerUtil.getFieldError(error, 'Title'));
      this.challengeDescriptionError.set(ErrorHandlerUtil.getFieldError(error, 'Description'));
      this.challengeWeekNumberError.set(ErrorHandlerUtil.getFieldError(error, 'WeekNumber'));

      const otherErrors = error.validationErrors.filter(
        (err) => !['Title', 'Description', 'WeekNumber'].includes(err.PropertyName)
      );
      if (otherErrors.length > 0) {
        this.generalError.set(otherErrors.map((err) => err.ErrorMessage).join(', '));
      }
    } else {
      this.generalError.set(ErrorHandlerUtil.getGeneralError(error));
    }
  }

  private clearMissionErrors(): void {
    this.generalError.set('');
    this.missionTitleError.set('');
    this.missionDescriptionError.set('');
    this.missionIconError.set('');
    this.missionOrderError.set('');
  }

  private clearChallengeErrors(): void {
    this.generalError.set('');
    this.challengeTitleError.set('');
    this.challengeDescriptionError.set('');
    this.challengeWeekNumberError.set('');
  }

  // Resource Management
  getMissionResources(missionId: string): MissionResource[] {
    return this.missionChallengeService.getMissionResources(missionId);
  }

  openAddResourceModal(missionId: string): void {
    this.selectedMission.set(this.missions().find((m) => m.id === missionId) || null);
    this.resourceUploadMode.set('url');
    this.resourceForm
      .get('url')
      ?.setValidators([Validators.required, Validators.pattern(/^https?:\/\/.+/)]);
    this.resourceForm.reset({
      type: 'video',
      title: '',
      url: '',
      description: '',
      order: this.getMissionResources(missionId).length,
      isRequired: false,
    });
    this.editingResource.set(false);
    this.selectedResource.set(null);
    this.resourceForm.get('url')?.updateValueAndValidity();
    this.showResourceModal.set(true);
  }

  openEditResourceModal(resource: MissionResource, missionId: string): void {
    this.selectedMission.set(this.missions().find((m) => m.id === missionId) || null);
    this.selectedResource.set(resource);

    // Determine mode based on URL
    const isFile = resource.url.startsWith('/uploads/');
    this.resourceUploadMode.set(isFile ? 'file' : 'url');

    const urlControl = this.resourceForm.get('url');
    if (isFile) {
      urlControl?.clearValidators();
    } else {
      urlControl?.setValidators([Validators.required, Validators.pattern(/^https?:\/\/.+/)]);
    }

    this.resourceForm.patchValue({
      type: resource.type,
      title: resource.title,
      url: resource.url,
      description: resource.description || '',
      order: resource.order,
      isRequired: resource.isRequired,
    });

    urlControl?.updateValueAndValidity();
    this.editingResource.set(true);
    this.showResourceModal.set(true);
  }

  closeResourceModal(): void {
    this.showResourceModal.set(false);
    this.editingResource.set(false);
    this.selectedResource.set(null);
    this.selectedResourceFile.set(null);
    this.resourceUploadMode.set('url');

    // Reset validators to default (url mode)
    this.resourceForm
      .get('url')
      ?.setValidators([Validators.required, Validators.pattern(/^https?:\/\/.+/)]);

    this.resourceForm.reset({
      type: 'video',
      title: '',
      url: '',
      description: '',
      order: 0,
      isRequired: false,
    });

    this.resourceForm.get('url')?.updateValueAndValidity();
  }

  setResourceUploadMode(mode: 'url' | 'file'): void {
    this.resourceUploadMode.set(mode);
    const urlControl = this.resourceForm.get('url');

    if (mode === 'file') {
      urlControl?.setValue('');
      urlControl?.clearValidators();
    } else {
      urlControl?.setValidators([Validators.required, Validators.pattern(/^https?:\/\/.+/)]);
    }

    urlControl?.updateValueAndValidity();
  }

  onResourceFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedResourceFile.set(file);
    }
  }

  clearResourceFile(): void {
    this.selectedResourceFile.set(null);
    const fileInput = document.getElementById('resourceFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  getFileAcceptTypes(): string {
    const type = this.resourceForm.get('type')?.value || 'video';
    switch (type) {
      case 'video':
        return '.mp4,.webm,.ogg,.mov,.avi,.mkv,.m4v';
      case 'pdf':
        return '.pdf';
      case 'article':
        return '.pdf,.docx,.txt,.html';
      case 'interactive':
        return '.html,.htm,.zip';
      default:
        return '*';
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  onSubmitResource(): void {
    // Validate based on upload mode
    if (this.resourceUploadMode() === 'file') {
      // File upload mode - check if file is selected
      if (!this.selectedResourceFile()) {
        this.toastService.showErrorMessage('Please select a file to upload');
        return;
      }
    } else {
      // URL mode - validate form
      if (this.resourceForm.invalid) {
        Object.keys(this.resourceForm.controls).forEach((key) => {
          this.resourceForm.get(key)?.markAsTouched();
        });
        return;
      }
    }

    // Validate common required fields
    if (
      !this.resourceForm.get('title')?.value ||
      this.resourceForm.get('title')?.value.length < 3
    ) {
      this.resourceForm.get('title')?.markAsTouched();
      this.toastService.showErrorMessage('Title is required (min 3 characters)');
      return;
    }

    const mission = this.selectedMission();
    if (!mission) {
      this.toastService.showErrorMessage('No mission selected');
      return;
    }

    this.isSubmitting.set(true);
    const formValue = this.resourceForm.value;

    if (this.editingResource()) {
      const resource = this.selectedResource();
      if (!resource) return;

      const request: UpdateMissionResourceRequest = {
        Type: formValue.type,
        Title: formValue.title,
        Url: formValue.url,
        Description: formValue.description || undefined,
        Order: Number(formValue.order),
        IsRequired: formValue.isRequired,
      };

      this.missionChallengeService.updateResource(resource.id, request, mission.id).subscribe({
        next: (result: { success: boolean; message: string }) => {
          this.isSubmitting.set(false);
          this.closeResourceModal();
          this.missionChallengeService.loadMissionResources(mission.id);
          this.toastService.showSuccessMessage(result.message || 'Resource updated successfully!');
        },
        error: (error: any) => {
          this.isSubmitting.set(false);
          console.error('Failed to update resource', error);
          this.toastService.showErrorMessage('Failed to update resource. Please try again.');
        },
      });
    } else {
      // Creating new resource
      // Check if uploading file or using URL
      if (this.resourceUploadMode() === 'file') {
        // File upload mode
        if (!this.selectedResourceFile()) {
          this.isSubmitting.set(false);
          this.toastService.showErrorMessage('Please select a file to upload');
          return;
        }

        // Upload file
        this.missionChallengeService
          .uploadResource(mission.id, {
            Type: formValue.type,
            Title: formValue.title,
            File: this.selectedResourceFile()!,
            Description: formValue.description || undefined,
            Order: Number(formValue.order),
            IsRequired: formValue.isRequired,
          })
          .subscribe({
            next: (result: { success: boolean; message: string; resourceId?: string }) => {
              this.isSubmitting.set(false);
              this.closeResourceModal();
              this.missionChallengeService.loadMissionResources(mission.id);
              this.toastService.showSuccessMessage(
                result.message || 'Resource uploaded successfully!'
              );
            },
            error: (error: any) => {
              this.isSubmitting.set(false);
              console.error('Failed to upload resource', error);
              const errorMessage =
                error?.error?.message ||
                error?.message ||
                'Failed to upload resource. Please try again.';
              this.toastService.showErrorMessage(errorMessage);
            },
          });
      } else {
        // URL mode - validate URL is provided
        if (!formValue.url || !formValue.url.trim()) {
          this.isSubmitting.set(false);
          this.resourceForm.get('url')?.markAsTouched();
          this.toastService.showErrorMessage('Please provide a valid URL');
          return;
        }

        // Use URL
        const request: CreateMissionResourceRequest = {
          Type: formValue.type,
          Title: formValue.title,
          Url: formValue.url.trim(),
          Description: formValue.description || undefined,
          Order: Number(formValue.order),
          IsRequired: formValue.isRequired,
        };

        this.missionChallengeService.createResource(mission.id, request).subscribe({
          next: (result: { success: boolean; message: string; resourceId?: string }) => {
            this.isSubmitting.set(false);
            this.closeResourceModal();
            this.missionChallengeService.loadMissionResources(mission.id);
            this.toastService.showSuccessMessage(
              result.message || 'Resource created successfully!'
            );
          },
          error: (error: any) => {
            this.isSubmitting.set(false);
            console.error('Failed to create resource', error);
            const errorMessage =
              error?.error?.message ||
              error?.message ||
              'Failed to create resource. Please try again.';
            this.toastService.showErrorMessage(errorMessage);
          },
        });
      }
    }
  }

  openDeleteResourceConfirm(resource: MissionResource, missionId: string): void {
    this.selectedResource.set(resource);
    this.selectedMission.set(this.missions().find((m) => m.id === missionId) || null);
    this.showDeleteResourceConfirm.set(true);
  }

  cancelDeleteResource(): void {
    this.showDeleteResourceConfirm.set(false);
    this.selectedResource.set(null);
  }

  confirmDeleteResource(): void {
    const resource = this.selectedResource();
    const mission = this.selectedMission();
    if (!resource || !mission) return;

    this.missionChallengeService.deleteResource(resource.id, mission.id).subscribe({
      next: (result: { success: boolean; message: string }) => {
        this.showDeleteResourceConfirm.set(false);
        this.selectedResource.set(null);
        this.toastService.showSuccessMessage(result.message || 'Resource deleted successfully!');
      },
      error: (error: any) => {
        console.error('Failed to delete resource', error);
        this.toastService.showErrorMessage('Failed to delete resource. Please try again.');
      },
    });
  }

  getResourceTypeIcon(type: string): string {
    switch (type) {
      case 'video':
        return '📹';
      case 'article':
        return '📄';
      case 'interactive':
        return '🎮';
      case 'pdf':
        return '📕';
      default:
        return '🔗';
    }
  }
}
