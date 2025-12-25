import { Injectable, signal, computed } from '@angular/core';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { CpdHoursSummary } from '../../student/models/learning-hours.model';
import { CPDModule, CPDProgress } from '../models/cpd.model';
import { Observable } from 'rxjs';

// CPD Stats interface (for compatibility with existing components)
export interface CPDStats {
  completedModules: number;
  totalHours: number;
  badgesEarned: number;
  currentLevel: string;
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
    // TODO: Replace with actual API endpoint when available
    this.modules.set(this.getMockModules());
    this.isLoading.set(false);
  }

  getModule(moduleId: string): CPDModule | undefined {
    return this.modules().find(m => m.id === moduleId);
  }

  markModuleInProgress(moduleId: string): void {
    // TODO: Call actual API endpoint
    this.modules.update(modules => 
      modules.map(m => 
        m.id === moduleId ? { ...m, status: 'in-progress', startedAt: new Date() } : m
      )
    );
    console.log(`Module ${moduleId} marked as in progress`);
  }

  markModuleComplete(moduleId: string): void {
    // TODO: Call actual API endpoint
    this.modules.update(modules => 
      modules.map(m => 
        m.id === moduleId 
          ? { ...m, status: 'completed', completedAt: new Date() } 
          : m
      )
    );
    console.log(`Module ${moduleId} marked as complete`);
    
    // Reload progress and stats
    this.loadProgress();
    this.loadStats();
    this.loadCpdHours();
  }

  uploadEvidence(moduleId: string, fileList: FileList): void {
    // TODO: Implement actual file upload
    console.log(`Uploading evidence for module ${moduleId}`, fileList);
    
    // Mock implementation - mark module as complete after upload
    setTimeout(() => {
      this.markModuleComplete(moduleId);
    }, 1000);
  }

  // ============================================
  // PROGRESS & STATS
  // ============================================

  loadProgress(): void {
    // TODO: Replace with actual API call
    const modules = this.modules();
    const completedModules = modules.filter(m => m.status === 'completed').length;
    const hoursCompleted = modules
      .filter(m => m.status === 'completed')
      .reduce((sum, m) => sum + (m.duration / 60), 0); // Convert minutes to hours
    
    // Get last activity date from most recent completed or started module
    const lastActivityDate = modules
      .filter(m => m.completedAt || m.startedAt)
      .sort((a, b) => {
        const dateA = a.completedAt || a.startedAt || new Date(0);
        const dateB = b.completedAt || b.startedAt || new Date(0);
        return dateB.getTime() - dateA.getTime();
      })[0]?.completedAt || modules[0]?.startedAt || new Date();

    this.progress.set({
      hoursCompleted,
      targetHours: 20, // Default annual target
      completedModules,
      totalModules: modules.length,
      lastActivityDate,
      streak: this.calculateStreak(modules) // Calculate streak based on completion dates
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
    return this.get<CpdHoursSummary>('/Teacher/CPD/Hours');
  }

  loadCpdHours(): void {
    this.getCpdHoursSummary().subscribe({
      next: (data) => {
        this.cpdHours.set(data);
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
