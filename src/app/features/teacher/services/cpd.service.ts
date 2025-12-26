import { Injectable, signal, computed } from '@angular/core';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { Teacher_API_ENDPOINTS } from '../../../config/TeacherConfig/TeacherEndpoint';
import { CpdHoursSummary } from '../../student/models/learning-hours.model';
import { CPDModule, CPDProgress } from '../models/cpd.model';
import { Observable, tap } from 'rxjs';
 
// CPD Stats interface (for compatibility with existing components)
export interface CPDStats {
  completedModules: number;
  totalHours: number;
  badgesEarned: number;
  currentLevel: string;
  activeStudents?: number; // Optional for backward compatibility
}

@Injectable({
  providedIn: 'root',
})
export class CpdService extends BaseHttpService {
  // State management
  private modules = signal<CPDModule[]>([]);
  private progress = signal<CPDProgress | null>(null);
  private stats = signal<CPDStats | null>(null);
  private cpdHours = signal<CpdHoursSummary | null>(null);
  private isLoading = signal(false);

  constructor() {
    super();
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  init(): void {
    this.loadModules();
    this.loadProgress();
    this.loadStats();
    this.loadCpdHours();
  }

  // ============================================
  // CPD MODULES MANAGEMENT
  // ============================================

  loadModules(): void {
    this.isLoading.set(true);
    // BaseHttpService.transformResponse unwraps ApiResponse and returns Data directly
    this.get<CPDModule[]>(Teacher_API_ENDPOINTS.CPD.MODULES).subscribe({
      next: (modules) => {
        if (modules && Array.isArray(modules)) {
          // Map backend DTOs to frontend models
          const mappedModules = modules.map((m: any) => ({
            id: m.Id.toString(),
            title: m.Title,
            duration: m.Duration,
            status: m.Status || 'not-started',
            icon: m.Icon || 'fas fa-book',
            color: m.Color || '#6366f1',
            bgColor: m.BgColor || 'rgba(99, 102, 241, 0.1)',
            videoUrl: m.VideoUrl || '',
            videoProvider: (m.VideoProvider || 'youtube') as 'youtube' | 'vimeo' | 'self-hosted',
            guideContent: m.GuideContent || '',
            formUrl: m.FormUrl || '',
            evidenceFiles: m.EvidenceFiles || [],
            completedAt: m.CompletedAt ? new Date(m.CompletedAt) : undefined,
            startedAt: m.StartedAt ? new Date(m.StartedAt) : undefined,
            lastAccessedAt: m.LastAccessedAt ? new Date(m.LastAccessedAt) : undefined,
          }));
          this.modules.set(mappedModules);
        } else {
          console.error('Failed to load CPD modules: Invalid response format');
          this.modules.set(this.getMockModules());
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load CPD modules:', err);
        // Fallback to mock data on error for development
        this.modules.set(this.getMockModules());
        this.isLoading.set(false);
      }
    });
  }

  getModule(moduleId: string): CPDModule | undefined {
    return this.modules().find(m => m.id === moduleId);
  }

  /**
   * Load a single module detail from the API
   * This ensures fresh data is loaded even on page refresh
   */
  loadModuleDetail(moduleId: string): Observable<CPDModule> {
    // BaseHttpService.transformResponse unwraps ApiResponse and returns Data directly
    return this.get<CPDModule>(Teacher_API_ENDPOINTS.CPD.MODULE_DETAIL(moduleId)).pipe(
      tap((moduleData) => {
        if (moduleData) {
          const mappedModule = this.mapModuleDto(moduleData);
          // Update the module in the modules array
          this.modules.update(modules => {
            const index = modules.findIndex(m => m.id === moduleId);
            if (index !== -1) {
              const updated = [...modules];
              updated[index] = mappedModule;
              return updated;
            } else {
              // If module not in list, add it
              return [...modules, mappedModule];
            }
          });
        }
      })
    );
  }

  markModuleInProgress(moduleId: string): Observable<CPDModule> {
    // BaseHttpService.transformResponse unwraps ApiResponse and returns Data directly
    return this.post<{ Status: string }, CPDModule>(
      Teacher_API_ENDPOINTS.CPD.UPDATE_STATUS(moduleId),
      { Status: 'in-progress' }
    ).pipe(
      tap((moduleData) => {
        if (moduleData) {
          const updatedModule = this.mapModuleDto(moduleData);
          this.modules.update(modules => 
            modules.map(m => m.id === moduleId ? updatedModule : m)
          );
        }
      })
    );
  }

  markModuleComplete(moduleId: string): Observable<CPDModule> {
    // BaseHttpService.transformResponse unwraps ApiResponse and returns Data directly
    return this.post<{ Status: string }, CPDModule>(
      Teacher_API_ENDPOINTS.CPD.UPDATE_STATUS(moduleId),
      { Status: 'completed' }
    ).pipe(
      tap((moduleData) => {
        if (moduleData) {
          const updatedModule = this.mapModuleDto(moduleData);
          this.modules.update(modules => 
            modules.map(m => m.id === moduleId ? updatedModule : m)
          );
          
          // Reload progress and stats
          this.loadProgress();
          this.loadStats();
          this.loadCpdHours();
        }
      })
    );
  }

  private mapModuleDto(dto: any): CPDModule {
    return {
      id: dto.Id.toString(),
      title: dto.Title,
      duration: dto.Duration,
      status: dto.Status || 'not-started',
      icon: dto.Icon || 'fas fa-book',
      color: dto.Color || '#6366f1',
      bgColor: dto.BgColor || 'rgba(99, 102, 241, 0.1)',
      videoUrl: dto.VideoUrl || '',
      videoProvider: (dto.VideoProvider || 'youtube') as 'youtube' | 'vimeo' | 'self-hosted',
      guideContent: dto.GuideContent || '',
      formUrl: dto.FormUrl || '',
      evidenceFiles: dto.EvidenceFiles || [],
      completedAt: dto.CompletedAt ? new Date(dto.CompletedAt) : undefined,
      startedAt: dto.StartedAt ? new Date(dto.StartedAt) : undefined,
      lastAccessedAt: dto.LastAccessedAt ? new Date(dto.LastAccessedAt) : undefined,
    };
  }

  uploadEvidence(moduleId: string, fileList: FileList): Observable<CPDModule> {
    const formData = new FormData();
    
    // Add files to FormData
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList.item(i);
      if (file) {
        formData.append('Files', file);
      }
    }

    // BaseHttpService.transformResponse unwraps ApiResponse and returns Data directly
    return this.post<FormData, CPDModule>(
      Teacher_API_ENDPOINTS.CPD.UPLOAD_EVIDENCE(moduleId),
      formData,
      {} // No additional options needed for FormData
    ).pipe(
      tap((moduleData) => {
        if (moduleData) {
          const updatedModule = this.mapModuleDto(moduleData);
          this.modules.update(modules => 
            modules.map(m => m.id === moduleId ? updatedModule : m)
          );
        }
      })
    );
  }

  // ============================================
  // PROGRESS & STATS
  // ============================================

  loadProgress(): void {
    // BaseHttpService.transformResponse unwraps ApiResponse and returns Data directly
    this.get<CPDProgress>(Teacher_API_ENDPOINTS.CPD.PROGRESS).subscribe({
      next: (data) => {
        if (data) {
          const progressData = data as any;
          this.progress.set({
            hoursCompleted: progressData.HoursCompleted || 0,
            targetHours: progressData.TargetHours || 20,
            completedModules: progressData.CompletedModules || 0,
            totalModules: progressData.TotalModules || 0,
            lastActivityDate: progressData.LastActivityDate ? new Date(progressData.LastActivityDate) : new Date(),
            streak: progressData.Streak || 0
          });
        } else {
          console.error('Failed to load CPD progress: Invalid response format');
          this.calculateProgressFromModules();
        }
      },
      error: (err) => {
        console.error('Failed to load CPD progress:', err);
        // Fallback: calculate from modules
        this.calculateProgressFromModules();
      }
    });
  }

  private calculateProgressFromModules(): void {
    const modules = this.modules();
    const completedModules = modules.filter(m => m.status === 'completed').length;
    const hoursCompleted = modules
      .filter(m => m.status === 'completed')
      .reduce((sum, m) => sum + (m.duration / 60), 0);
    
    const lastActivityDate = modules
      .filter(m => m.completedAt || m.startedAt)
      .sort((a, b) => {
        const dateA = a.completedAt || a.startedAt || new Date(0);
        const dateB = b.completedAt || b.startedAt || new Date(0);
        return dateB.getTime() - dateA.getTime();
      })[0]?.completedAt || modules[0]?.startedAt || new Date();

    this.progress.set({
      hoursCompleted,
      targetHours: 20,
      completedModules,
      totalModules: modules.length,
      lastActivityDate,
      streak: this.calculateStreak(modules)
    });
  }

  private calculateStreak(modules: CPDModule[]): number {
    // TODO: Implement proper streak calculation based on consecutive days
    // For now, return a mock streak
    const completedModules = modules.filter(m => m.status === 'completed');
    return Math.min(completedModules.length, 7); // Mock: max 7 day streak
  }

  loadStats(): void {
    // TODO: Replace with actual API call
    const modules = this.modules();
    const completedModules = modules.filter(m => m.status === 'completed').length;
    const totalHours = modules
      .filter(m => m.status === 'completed')
      .reduce((sum, m) => sum + (m.duration / 60), 0); // Convert minutes to hours

    this.stats.set({
      completedModules,
      totalHours,
      badgesEarned: Math.floor(completedModules / 3), // Mock: 1 badge per 3 modules
      currentLevel: this.calculateLevel(totalHours)
    });
  }

  private calculateLevel(hours: number): string {
    if (hours >= 20) return 'Master Educator';
    if (hours >= 10) return 'Digital Mentor';
    if (hours >= 5) return 'Tech Innovator';
    return 'Beginner';
  }

  // ============================================
  // HOURS TRACKING (NEW FEATURE)
  // ============================================

  getCpdHoursSummary(): Observable<CpdHoursSummary> {
    // BaseHttpService.transformResponse unwraps ApiResponse and returns Data directly
    return this.get<CpdHoursSummary>(Teacher_API_ENDPOINTS.CPD.HOURS);
  }

  loadCpdHours(): void {
    this.getCpdHoursSummary().subscribe({
      next: (data) => {
        if (data) {
          this.cpdHours.set(data);
        } else {
          console.error('Failed to load CPD hours: Invalid response format');
          // Set mock data on error
          this.cpdHours.set({
            totalHours: 15,
            thisYearHours: 12,
            annualGoal: 20,
            progressPercentage: 60,
            recentActivities: []
          });
        }
      },
      error: (err) => {
        console.error('Failed to load CPD hours:', err);
        // Set mock data on error
        this.cpdHours.set({
          totalHours: 15,
          thisYearHours: 12,
          annualGoal: 20,
          progressPercentage: 60,
          recentActivities: []
        });
      },
    });
  }

  exportCpdCertificate(): Observable<Blob> {
    // TODO: Implement certificate export endpoint
    const url = `${this.baseUrl}/Teacher/CPD/ExportCertificate`;
    return this.http.get(url, { responseType: 'blob' });
  }

  // ============================================
  // GETTERS (SIGNALS)
  // ============================================

  getModules() {
    return this.modules.asReadonly();
  }

  getProgress() {
    return this.progress.asReadonly();
  }

  getStats() {
    return this.stats.asReadonly();
  }

  getCpdHoursData() {
    return this.cpdHours();
  }

  isLoadingData() {
    return this.isLoading();
  }

  // ============================================
  // MOCK DATA (Temporary - until API is ready)
  // ============================================

  private getMockModules(): CPDModule[] {
    return [
      {
        id: '1',
        title: 'AI Tools for Teachers',
        duration: 120, // in minutes
        status: 'completed',
        icon: 'fas fa-robot',
        color: '#667eea',
        bgColor: 'rgba(102, 126, 234, 0.1)',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videoProvider: 'youtube',
        guideContent: '<h3>AI Tools for Modern Teaching</h3><p>Explore how AI can enhance your teaching practice...</p>',
        formUrl: 'https://forms.office.com/Pages/ResponsePage.aspx',
        evidenceFiles: [],
        completedAt: new Date('2024-12-01'),
        startedAt: new Date('2024-11-28')
      },
      {
        id: '2',
        title: 'Microsoft 365 for Education',
        duration: 180,
        status: 'in-progress',
        icon: 'fas fa-microsoft',
        color: '#f77f00',
        bgColor: 'rgba(247, 127, 0, 0.1)',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videoProvider: 'youtube',
        guideContent: '<h3>Microsoft 365 Mastery</h3><p>Master the essential tools for modern classrooms...</p>',
        formUrl: 'https://forms.office.com/Pages/ResponsePage.aspx',
        evidenceFiles: [],
        startedAt: new Date('2024-12-10')
      },
      {
        id: '3',
        title: 'Digital Citizenship',
        duration: 120,
        status: 'not-started',
        icon: 'fas fa-shield-alt',
        color: '#06d6a0',
        bgColor: 'rgba(6, 214, 160, 0.1)',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videoProvider: 'youtube',
        guideContent: '<h3>Teaching Digital Citizenship</h3><p>Help students navigate the digital world safely...</p>',
        formUrl: 'https://forms.office.com/Pages/ResponsePage.aspx',
        evidenceFiles: []
      },
      {
        id: '4',
        title: 'Gamification in Education',
        duration: 150,
        status: 'not-started',
        icon: 'fas fa-gamepad',
        color: '#ef476f',
        bgColor: 'rgba(239, 71, 111, 0.1)',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videoProvider: 'youtube',
        guideContent: '<h3>Gamification Strategies</h3><p>Engage students through game mechanics...</p>',
        formUrl: 'https://forms.office.com/Pages/ResponsePage.aspx',
        evidenceFiles: []
      },
      {
        id: '5',
        title: 'Data-Driven Teaching',
        duration: 120,
        status: 'completed',
        icon: 'fas fa-chart-line',
        color: '#118ab2',
        bgColor: 'rgba(17, 138, 178, 0.1)',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videoProvider: 'youtube',
        guideContent: '<h3>Using Data to Improve Teaching</h3><p>Leverage analytics for better outcomes...</p>',
        formUrl: 'https://forms.office.com/Pages/ResponsePage.aspx',
        evidenceFiles: ['analytics-report.pdf'],
        completedAt: new Date('2024-11-15'),
        startedAt: new Date('2024-11-10')
      }
    ];
  }
}
