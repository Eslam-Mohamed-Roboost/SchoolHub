import { Injectable, signal } from '@angular/core';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { Student_API_ENDPOINTS } from '../../../config/StudentConfig/StudentEndpoints';
import {
  ApiResponse,
  ChallengeDto,
  SubmitChallengeRequest,
  ChallengeSubmissionResponse,
} from '../models/student-api.models';

@Injectable({
  providedIn: 'root',
})
export class StudentChallengesService extends BaseHttpService {
  private activeChallenges = signal<ChallengeDto[]>([]);
  private isLoading = signal(false);

  constructor() {
    super();
  }

  // ============================================
  // API CALLS
  // ============================================

  loadActiveChallenges(): void {
    this.isLoading.set(true);
    this.get<ChallengeDto[]>(Student_API_ENDPOINTS.Challenges.GET_ACTIVE).subscribe({
      next: (data) => {
        this.activeChallenges.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load active challenges:', err);
        this.isLoading.set(false);
      },
    });
  }

  joinChallenge(challengeId: number): void {
    this.isLoading.set(true);
    this.post<null, void>(Student_API_ENDPOINTS.Challenges.JOIN(challengeId), null).subscribe({
      next: () => {
        // Reload challenges to update participant count
        this.loadActiveChallenges();
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to join challenge:', err);
        this.isLoading.set(false);
      },
    });
  }

  submitChallenge(challengeId: number, answer: string, attachments?: File[]): void {
    const formData = new FormData();
    formData.append('ChallengeId', challengeId.toString());
    formData.append('Answer', answer);

    if (attachments) {
      attachments.forEach((file, index) => {
        formData.append(`Attachments[${index}]`, file);
      });
    }

    this.isLoading.set(true);
    this.post<FormData, ChallengeSubmissionResponse>(
      Student_API_ENDPOINTS.Challenges.SUBMIT(challengeId),
      formData
    ).subscribe({
      next: (result) => {
        // Update challenge completion status
        this.activeChallenges.update((challenges) =>
          challenges.map((c) => (c.Id === challengeId ? { ...c, Completed: result.Success } : c))
        );

        // Show success notification
        console.log('Challenge submitted:', result);
        // TODO: Show toast with points earned and feedback

        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to submit challenge:', err);
        this.isLoading.set(false);
      },
    });
  }

  // ============================================
  // GETTERS
  // ============================================

  getActiveChallenges() {
    return this.activeChallenges();
  }

  isLoadingData() {
    return this.isLoading();
  }
}
