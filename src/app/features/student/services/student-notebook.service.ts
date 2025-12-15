import { Injectable, signal } from '@angular/core';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { Student_API_ENDPOINTS } from '../../../config/StudentConfig/StudentEndpoints';
import {
  ApiResponse,
  NotebookEntryDto,
  SaveNotebookEntryRequest,
  NotebookFilters,
} from '../models/student-api.models';

@Injectable({
  providedIn: 'root',
})
export class StudentNotebookService extends BaseHttpService {
  private entries = signal<NotebookEntryDto[]>([]);
  private isLoading = signal(false);

  constructor() {
    super();
  }

  // ============================================
  // API CALLS
  // ============================================

  loadEntries(filters?: NotebookFilters): void {
    this.isLoading.set(true);

    let endpoint = Student_API_ENDPOINTS.Notebook.GET_ALL;
    const params: string[] = [];

    if (filters?.subjectId) {
      params.push(`subjectId=${filters.subjectId}`);
    }
    if (filters?.dateFrom) {
      params.push(`dateFrom=${filters.dateFrom}`);
    }
    if (filters?.dateTo) {
      params.push(`dateTo=${filters.dateTo}`);
    }

    if (params.length > 0) {
      endpoint += `?${params.join('&')}`;
    }

    this.get<NotebookEntryDto[]>(endpoint).subscribe({
      next: (data) => {
        this.entries.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load notebook entries:', err);
        this.isLoading.set(false);
      },
    });
  }

  saveEntry(request: SaveNotebookEntryRequest): void {
    this.isLoading.set(true);
    this.post<SaveNotebookEntryRequest, NotebookEntryDto>(
      Student_API_ENDPOINTS.Notebook.SAVE,
      request
    ).subscribe({
      next: (savedEntry) => {
        this.entries.update((entries) => {
          if (request.Id) {
            // Update existing
            return entries.map((e) => (e.Id === request.Id ? savedEntry : e));
          }
          // Add new
          return [savedEntry, ...entries];
        });
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to save notebook entry:', err);
        this.isLoading.set(false);
      },
    });
  }

  deleteEntry(entryId: string): void {
    this.isLoading.set(true);
    this.delete(Student_API_ENDPOINTS.Notebook.DELETE(entryId)).subscribe({
      next: () => {
        this.entries.update((entries) => entries.filter((e) => e.Id !== entryId));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to delete notebook entry:', err);
        this.isLoading.set(false);
      },
    });
  }

  toggleFavorite(entryId: string): void {
    const entry = this.entries().find((e) => e.Id === entryId);
    if (!entry) return;

    const request: SaveNotebookEntryRequest = {
      Id: entry.Id,
      Title: entry.Title,
      Content: entry.Content,
      SubjectId: entry.SubjectId,
      Tags: entry.Tags,
      IsFavorite: !entry.IsFavorite,
    };

    this.saveEntry(request);
  }

  // ============================================
  // GETTERS
  // ============================================

  getEntries() {
    return this.entries();
  }

  isLoadingData() {
    return this.isLoading();
  }
}
