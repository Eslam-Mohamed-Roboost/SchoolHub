import { Component, inject, signal, OnInit } from '@angular/core';
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
import { Mission, WeeklyChallenge, CreateMissionRequest } from '../../models/admin.models';
import { BadgeService } from '../../services/badge.service';
import { ValidationErrorException } from '../../../../core/models/validation-error.model';
import { ErrorHandlerUtil } from '../../../../core/utils/error-handler.util';

type TabType = 'missions' | 'challenges';

@Component({
  selector: 'app-admin-missions',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-missions.component.html',
  styleUrl: './admin-missions.component.css',
})
export class AdminMissionsComponent implements OnInit {
  private missionChallengeService = inject(MissionChallengeService);
  private badgeService = inject(BadgeService);
  private fb = inject(FormBuilder);

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

  // Forms
  missionForm: FormGroup;
  challengeForm: FormGroup;

  // Error handling
  generalError = signal('');
  missionNameError = signal('');
  missionTitleError = signal('');
  missionDescriptionError = signal('');
  missionIconError = signal('');
  missionOrderError = signal('');

  challengeTitleError = signal('');
  challengeDescriptionError = signal('');
  challengeWeekNumberError = signal('');

  // Options
  missionIcons = [
    '🎯', '🚀', '📚', '🎓', '🏆', '⭐', '🌟', '💎', '👑', '🔥',
    '💪', '🎨', '🤖', '💼', '✨', '🎪', '🎬', '🎮', '🎲', '🎭'
  ];

  challengeStatuses: Array<'Draft' | 'Published' | 'Scheduled'> = [
    'Draft',
    'Published',
    'Scheduled',
  ];

  constructor() {
    // Mission Form
    this.missionForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
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
    this.missionForm.patchValue({
      name: mission.name,
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
        alert(result.message || 'Mission deleted successfully!');
      },
      error: (error) => {
        console.error('Failed to delete mission', error);
        alert('Failed to delete mission. Please try again.');
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
      Name: formValue.name,
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
        alert(result.message || 'Operation successful!');
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
        alert(result.message || 'Challenge deleted successfully!');
      },
      error: (error) => {
        console.error('Failed to delete challenge', error);
        alert('Failed to delete challenge. Please try again.');
      },
    });
  }

  publishChallenge(id: string): void {
    this.missionChallengeService.publishChallenge(id).subscribe({
      next: (result) => {
        alert(result.message || 'Challenge published successfully!');
      },
      error: (error) => {
        console.error('Failed to publish challenge', error);
        alert('Failed to publish challenge. Please try again.');
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
        alert(result.message || 'Operation successful!');
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
      this.missionNameError.set(ErrorHandlerUtil.getFieldError(error, 'Name'));
      this.missionTitleError.set(ErrorHandlerUtil.getFieldError(error, 'Title'));
      this.missionDescriptionError.set(ErrorHandlerUtil.getFieldError(error, 'Description'));
      this.missionIconError.set(ErrorHandlerUtil.getFieldError(error, 'Icon'));
      this.missionOrderError.set(ErrorHandlerUtil.getFieldError(error, 'Order'));

      const otherErrors = error.validationErrors.filter(
        (err) => !['Name', 'Title', 'Description', 'Icon', 'Order'].includes(err.PropertyName)
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

  private handleChallengeError(error: any): void {
    if (error instanceof ValidationErrorException) {
      this.challengeTitleError.set(ErrorHandlerUtil.getFieldError(error, 'Title'));
      this.challengeDescriptionError.set(ErrorHandlerUtil.getFieldError(error, 'Description'));
      this.challengeWeekNumberError.set(ErrorHandlerUtil.getFieldError(error, 'WeekNumber'));

      const otherErrors = error.validationErrors.filter(
        (err) => !['Title', 'Description', 'WeekNumber'].includes(err.PropertyName)
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

  private clearMissionErrors(): void {
    this.generalError.set('');
    this.missionNameError.set('');
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
}

