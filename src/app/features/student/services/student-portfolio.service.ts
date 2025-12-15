import { Injectable, signal } from '@angular/core';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { Student_API_ENDPOINTS } from '../../../config/StudentConfig/StudentEndpoints';
import {
  PortfolioFile,
  TeacherFeedback,
  Reflection,
  SubjectPortfolio,
  PortfolioOverview,
  PortfolioBadge,
} from '../models/student-portfolio.model';

// API Response interfaces
interface ApiResponse<T> {
  Data: T;
  IsSuccess: boolean;
  Message: string;
  ErrorCode: string;
  IsAuthorized: boolean;
}

interface SubjectPortfolioDto {
  SubjectId: string;
  SubjectName: string;
  SubjectIcon: string;
  Files: PortfolioFileDto[];
  Feedback: TeacherFeedbackDto[];
  Reflections: ReflectionDto[];
  Badges: PortfolioBadgeDto[];
  Stats: PortfolioStatsDto;
}

interface PortfolioFileDto {
  Id: string;
  FileName: string;
  FileType: string;
  FileSize: number;
  UploadDate: string;
  SubjectId: string;
  ThumbnailUrl?: string;
  PreviewUrl?: string;
  DownloadUrl: string;
}

interface TeacherFeedbackDto {
  Id: string;
  TeacherName: string;
  Date: string;
  Comment: string;
  RelatedFileId?: string;
}

interface ReflectionDto {
  Id: string;
  Content: string;
  Date: string;
  Prompt?: string;
  SubjectId: string;
  AutoSaved: boolean;
}

interface PortfolioBadgeDto {
  Id: string;
  Name: string;
  Description: string;
  Icon: string;
  Color: string;
  EarnedDate?: string;
  RelatedWorkId?: string;
  Category: string;
}

interface PortfolioStatsDto {
  FilesCount: number;
  LatestUploadDate?: string;
  FeedbackCount: number;
  BadgesCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class StudentPortfolioService extends BaseHttpService {
  private portfolios = signal<SubjectPortfolio[]>([]);
  private availableBadges = signal<PortfolioBadge[]>([]);
  private isLoading = signal(false);

  // Subjects configuration
  private subjects = [
    { id: 'math', name: 'Math Hub', icon: 'fas fa-calculator' },
    { id: 'science', name: 'Science Hub', icon: 'fas fa-flask' },
    { id: 'ela', name: 'ELA Hub', icon: 'fas fa-book' },
    { id: 'arabic', name: 'Arabic Hub', icon: 'fas fa-language' },
    { id: 'islamic', name: 'Islamic Studies Hub', icon: 'fas fa-mosque' },
    { id: 'social', name: 'Social Studies Hub', icon: 'fas fa-globe' },
    { id: 'pe', name: 'PE Hub', icon: 'fas fa-running' },
    { id: 'arts', name: 'Arts Hub', icon: 'fas fa-palette' },
  ];

  constructor() {
    super();
    // Load initial data
    this.loadPortfolioOverview();
    this.loadAvailableBadges();
  }

  // ============================================
  // API CALLS
  // ============================================

  loadPortfolioOverview(): void {
    this.isLoading.set(true);
    this.get<{
      TotalFiles: number;
      TotalFeedback: number;
      TotalBadges: number;
      SubjectPortfolios: SubjectPortfolioDto[];
      RecentUploads: PortfolioFileDto[];
    }>(Student_API_ENDPOINTS.Portfolio.OVERVIEW).subscribe({
      next: (data) => {
        const portfolios = data.SubjectPortfolios.map((dto) => this.mapSubjectPortfolioDto(dto));
        this.portfolios.set(portfolios);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load portfolio overview, using mock data:', err);
        this.portfolios.set(this.initializePortfolios());
        this.isLoading.set(false);
      },
    });
  }

  loadSubjectPortfolio(subjectId: string): void {
    this.isLoading.set(true);
    this.get<SubjectPortfolioDto>(Student_API_ENDPOINTS.Portfolio.SUBJECT(subjectId)).subscribe({
      next: (data) => {
        const portfolio = this.mapSubjectPortfolioDto(data);
        this.portfolios.update((portfolios) => {
          const index = portfolios.findIndex((p) => p.subjectId === subjectId);
          if (index !== -1) {
            portfolios[index] = portfolio;
          }
          return [...portfolios];
        });
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(`Failed to load subject portfolio for ${subjectId}:`, err);
        this.isLoading.set(false);
      },
    });
  }

  loadAvailableBadges(): void {
    // Note: This might be better fetched from a dedicated badges endpoint
    // For now, keeping the mock initialization
    this.availableBadges.set(this.initializeBadges());
  }

  getPortfolioOverview(): PortfolioOverview {
    const allPortfolios = this.portfolios();
    const allFiles = allPortfolios.flatMap((p) => p.files);
    const sortedFiles = allFiles.sort(
      (a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    );

    return {
      totalFiles: allFiles.length,
      totalFeedback: allPortfolios.reduce((sum, p) => sum + p.feedback.length, 0),
      totalBadges: allPortfolios.reduce((sum, p) => sum + p.badges.length, 0),
      subjectPortfolios: allPortfolios,
      recentUploads: sortedFiles.slice(0, 3),
    };
  }

  getSubjectPortfolio(subjectId: string): SubjectPortfolio | null {
    return this.portfolios().find((p) => p.subjectId === subjectId) || null;
  }

  uploadFile(subjectId: string, file: File): void {
    const formData = new FormData();
    formData.append('SubjectId', subjectId);
    formData.append('File', file);

    this.isLoading.set(true);
    this.post<FormData, PortfolioFileDto>(
      Student_API_ENDPOINTS.Portfolio.UPLOAD,
      formData
    ).subscribe({
      next: (data) => {
        const newFile = this.mapPortfolioFileDto(data);

        this.portfolios.update((portfolios) => {
          const portfolioIndex = portfolios.findIndex((p) => p.subjectId === subjectId);
          if (portfolioIndex !== -1) {
            portfolios[portfolioIndex].files.unshift(newFile);
            portfolios[portfolioIndex].stats.filesCount++;
            portfolios[portfolioIndex].stats.latestUploadDate = new Date();
          }
          return [...portfolios];
        });

        // Reload to get updated badges from backend
        this.loadSubjectPortfolio(subjectId);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to upload file:', err);
        alert('Failed to upload file. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  deleteFile(subjectId: string, fileId: string): void {
    this.isLoading.set(true);
    this.delete(Student_API_ENDPOINTS.Portfolio.DELETE_FILE(fileId)).subscribe({
      next: () => {
        this.portfolios.update((portfolios) => {
          const portfolioIndex = portfolios.findIndex((p) => p.subjectId === subjectId);
          if (portfolioIndex !== -1) {
            portfolios[portfolioIndex].files = portfolios[portfolioIndex].files.filter(
              (f) => f.id !== fileId
            );
            portfolios[portfolioIndex].stats.filesCount = portfolios[portfolioIndex].files.length;
          }
          return [...portfolios];
        });
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to delete file:', err);
        alert('Failed to delete file. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  saveReflection(subjectId: string, content: string, prompt?: string): void {
    const requestBody = {
      SubjectId: subjectId,
      Content: content,
      Prompt: prompt,
    };

    this.post<typeof requestBody, ReflectionDto>(
      Student_API_ENDPOINTS.Portfolio.SAVE_REFLECTION,
      requestBody
    ).subscribe({
      next: (data) => {
        const reflection = this.mapReflectionDto(data);

        this.portfolios.update((portfolios) => {
          const portfolioIndex = portfolios.findIndex((p) => p.subjectId === subjectId);
          if (portfolioIndex !== -1) {
            const existingIndex = portfolios[portfolioIndex].reflections.findIndex(
              (r) => r.prompt === prompt
            );
            if (existingIndex !== -1) {
              portfolios[portfolioIndex].reflections[existingIndex] = reflection;
            } else {
              portfolios[portfolioIndex].reflections.push(reflection);
            }
          }
          return [...portfolios];
        });
      },
      error: (err) => {
        console.error('Failed to save reflection:', err);
      },
    });
  }

  awardBadge(subjectId: string, badgeId: string): void {
    const portfolios = this.portfolios();
    const portfolioIndex = portfolios.findIndex((p) => p.subjectId === subjectId);

    if (portfolioIndex === -1) return;

    // Check if badge already awarded
    if (portfolios[portfolioIndex].badges.some((b) => b.id === badgeId)) return;

    const badge = this.availableBadges().find((b) => b.id === badgeId);
    if (!badge) return;

    const earnedBadge: PortfolioBadge = {
      ...badge,
      earnedDate: new Date(),
    };

    portfolios[portfolioIndex].badges.push(earnedBadge);
    portfolios[portfolioIndex].stats.badgesCount++;

    this.portfolios.set([...portfolios]);
  }

  getAvailableBadges(): PortfolioBadge[] {
    return this.availableBadges();
  }

  isLoadingData() {
    return this.isLoading();
  }

  // ============================================
  // MAPPERS
  // ============================================

  private mapSubjectPortfolioDto(dto: SubjectPortfolioDto): SubjectPortfolio {
    return {
      subjectId: dto.SubjectId,
      subjectName: dto.SubjectName,
      subjectIcon: this.getSubjectIcon(dto.SubjectName), // Map to FA icon
      files: dto.Files.map((f) => this.mapPortfolioFileDto(f)),
      feedback: dto.Feedback.map((f) => this.mapTeacherFeedbackDto(f)),
      reflections: dto.Reflections.map((r) => this.mapReflectionDto(r)),
      badges: dto.Badges.map((b) => this.mapPortfolioBadgeDto(b)),
      stats: {
        filesCount: dto.Stats.FilesCount,
        latestUploadDate: dto.Stats.LatestUploadDate ? new Date(dto.Stats.LatestUploadDate) : null,
        feedbackCount: dto.Stats.FeedbackCount,
        badgesCount: dto.Stats.BadgesCount,
      },
    };
  }

  private getSubjectIcon(subjectName: string): string {
    const name = subjectName.toLowerCase();
    if (name.includes('math')) return 'fas fa-calculator';
    if (name.includes('science')) return 'fas fa-flask';
    if (name.includes('english') || name.includes('ela')) return 'fas fa-book';
    if (name.includes('arabic')) return 'fas fa-language';
    if (name.includes('islamic')) return 'fas fa-mosque';
    if (name.includes('social')) return 'fas fa-globe';
    if (name.includes('pe') || name.includes('phys')) return 'fas fa-running';
    if (name.includes('art')) return 'fas fa-palette';
    if (name.includes('ict') || name.includes('computer')) return 'fas fa-laptop';
    return 'fas fa-folder'; // Default
  }

  private mapPortfolioFileDto(dto: PortfolioFileDto): PortfolioFile {
    return {
      id: dto.Id,
      fileName: dto.FileName,
      fileType: dto.FileType as PortfolioFile['fileType'],
      fileSize: dto.FileSize,
      uploadDate: new Date(dto.UploadDate),
      subjectId: dto.SubjectId,
      thumbnailUrl: dto.ThumbnailUrl,
      previewUrl: dto.PreviewUrl,
      downloadUrl: dto.DownloadUrl,
    };
  }

  private mapTeacherFeedbackDto(dto: TeacherFeedbackDto): TeacherFeedback {
    return {
      id: dto.Id,
      teacherName: dto.TeacherName,
      date: new Date(dto.Date),
      comment: dto.Comment,
      relatedFileId: dto.RelatedFileId,
    };
  }

  private mapReflectionDto(dto: ReflectionDto): Reflection {
    return {
      id: dto.Id,
      content: dto.Content,
      date: new Date(dto.Date),
      prompt: dto.Prompt,
      subjectId: dto.SubjectId,
      autoSaved: dto.AutoSaved,
    };
  }

  private mapPortfolioBadgeDto(dto: PortfolioBadgeDto): PortfolioBadge {
    return {
      id: dto.Id,
      name: dto.Name,
      description: dto.Description,
      icon: dto.Icon,
      color: dto.Color,
      earnedDate: dto.EarnedDate ? new Date(dto.EarnedDate) : new Date(),
      relatedWorkId: dto.RelatedWorkId,
      category: dto.Category as 'portfolio' | 'subject',
    };
  }

  private getFileType(fileName: string): PortfolioFile['fileType'] {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const typeMap: { [key: string]: PortfolioFile['fileType'] } = {
      pdf: 'pdf',
      docx: 'docx',
      doc: 'docx',
      pptx: 'pptx',
      ppt: 'pptx',
      jpg: 'jpg',
      jpeg: 'jpg',
      png: 'png',
      mp4: 'mp4',
    };
    return typeMap[ext || ''] || 'pdf';
  }

  private generateThumbnail(fileName: string): string {
    const fileType = this.getFileType(fileName);
    // Return placeholder thumbnails based on file type
    const thumbnails: { [key: string]: string } = {
      pdf: 'assets/thumbnails/pdf-icon.png',
      docx: 'assets/thumbnails/doc-icon.png',
      pptx: 'assets/thumbnails/ppt-icon.png',
      jpg: 'assets/thumbnails/image-placeholder.png',
      png: 'assets/thumbnails/image-placeholder.png',
      mp4: 'assets/thumbnails/video-placeholder.png',
    };
    return thumbnails[fileType] || thumbnails['pdf'];
  }

  private initializePortfolios(): SubjectPortfolio[] {
    return this.subjects.map((subject) => ({
      subjectId: subject.id,
      subjectName: subject.name,
      subjectIcon: subject.icon,
      files: this.getMockFiles(subject.id),
      feedback: this.getMockFeedback(subject.id),
      reflections: [],
      badges: [],
      stats: {
        filesCount: 0,
        latestUploadDate: null,
        feedbackCount: 0,
        badgesCount: 0,
      },
    }));
  }

  private getMockFiles(subjectId: string): PortfolioFile[] {
    if (subjectId === 'math') {
      return [
        {
          id: 'file-math-1',
          fileName: 'Algebra Homework Week 5.pdf',
          fileType: 'pdf',
          fileSize: 1024000,
          uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          subjectId,
          thumbnailUrl: 'assets/thumbnails/pdf-icon.png',
          previewUrl: '',
          downloadUrl: '',
        },
      ];
    }
    return [];
  }

  private getMockFeedback(subjectId: string): TeacherFeedback[] {
    if (subjectId === 'math') {
      return [
        {
          id: 'feedback-math-1',
          teacherName: 'Ms. Sarah Johnson',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          comment:
            'Great work on the algebra problems! Your understanding of quadratic equations is improving. Keep practicing!',
          relatedFileId: 'file-math-1',
        },
      ];
    }
    return [];
  }

  private initializeBadges(): PortfolioBadge[] {
    return [
      {
        id: 'first-upload',
        name: 'First Upload',
        description: 'Upload your first portfolio file',
        icon: 'fas fa-upload',
        color: '#22c55e',
        earnedDate: new Date(),
        category: 'portfolio',
      },
      {
        id: 'prolific-creator',
        name: 'Prolific Creator',
        description: 'Upload 10 files to your portfolio',
        icon: 'fas fa-star',
        color: '#f59e0b',
        earnedDate: new Date(),
        category: 'portfolio',
      },
      {
        id: 'reflection-master',
        name: 'Reflection Master',
        description: 'Complete all reflection prompts',
        icon: 'fas fa-pen-fancy',
        color: '#8b5cf6',
        earnedDate: new Date(),
        category: 'portfolio',
      },
    ];
  }
}
