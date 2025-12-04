import { Injectable, signal } from '@angular/core';
import {
  PortfolioFile,
  TeacherFeedback,
  Reflection,
  SubjectPortfolio,
  PortfolioOverview,
  PortfolioBadge,
} from '../models/student-portfolio.model';

@Injectable({
  providedIn: 'root',
})
export class StudentPortfolioService {
  private portfolios = signal<SubjectPortfolio[]>([]);
  private availableBadges = signal<PortfolioBadge[]>([]);

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
    // Initialize after subjects array is defined
    this.portfolios.set(this.initializePortfolios());
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
    const portfolios = this.portfolios();
    const portfolioIndex = portfolios.findIndex((p) => p.subjectId === subjectId);

    if (portfolioIndex === -1) return;

    const newFile: PortfolioFile = {
      id: `file-${Date.now()}`,
      fileName: file.name,
      fileType: this.getFileType(file.name),
      fileSize: file.size,
      uploadDate: new Date(),
      subjectId,
      thumbnailUrl: this.generateThumbnail(file.name),
      previewUrl: URL.createObjectURL(file),
      downloadUrl: URL.createObjectURL(file),
    };

    portfolios[portfolioIndex].files.unshift(newFile);
    portfolios[portfolioIndex].stats.filesCount++;
    portfolios[portfolioIndex].stats.latestUploadDate = new Date();

    this.portfolios.set([...portfolios]);

    // Check for "First Upload" badge
    if (portfolios[portfolioIndex].files.length === 1) {
      this.awardBadge(subjectId, 'first-upload');
    }

    // Check for "Prolific Creator" badge
    if (portfolios[portfolioIndex].files.length === 10) {
      this.awardBadge(subjectId, 'prolific-creator');
    }
  }

  deleteFile(subjectId: string, fileId: string): void {
    const portfolios = this.portfolios();
    const portfolioIndex = portfolios.findIndex((p) => p.subjectId === subjectId);

    if (portfolioIndex === -1) return;

    portfolios[portfolioIndex].files = portfolios[portfolioIndex].files.filter(
      (f) => f.id !== fileId
    );
    portfolios[portfolioIndex].stats.filesCount = portfolios[portfolioIndex].files.length;

    this.portfolios.set([...portfolios]);
  }

  saveReflection(subjectId: string, content: string, prompt?: string): void {
    const portfolios = this.portfolios();
    const portfolioIndex = portfolios.findIndex((p) => p.subjectId === subjectId);

    if (portfolioIndex === -1) return;

    const existingReflection = portfolios[portfolioIndex].reflections.find(
      (r) => r.prompt === prompt
    );

    if (existingReflection) {
      // Update existing
      existingReflection.content = content;
      existingReflection.date = new Date();
      existingReflection.autoSaved = true;
    } else {
      // Create new
      const newReflection: Reflection = {
        id: `reflection-${Date.now()}`,
        content,
        date: new Date(),
        prompt,
        subjectId,
        autoSaved: true,
      };
      portfolios[portfolioIndex].reflections.push(newReflection);
    }

    this.portfolios.set([...portfolios]);
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
