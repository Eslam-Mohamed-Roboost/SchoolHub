import { Injectable, signal, computed } from '@angular/core';
import { CPDModule, CPDProgress, TeacherStats } from '../models/cpd.model';

@Injectable({
  providedIn: 'root',
})
export class CpdService {
  private modules = signal<CPDModule[]>([
    {
      id: 'eduaide-ai',
      title: 'Eduaide AI',
      duration: 20,
      status: 'completed',
      icon: 'fas fa-robot',
      color: '#6366f1',
      bgColor: '#e0e7ff',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoProvider: 'youtube',
      guideContent: `
        <h3>Introduction to Eduaide AI</h3>
        <p>Eduaide AI is a powerful tool for generating lesson plans, assessments, and educational content.</p>
        <h4>Learning Objectives:</h4>
        <ul>
          <li>Understand how to use Eduaide AI for lesson planning</li>
          <li>Create differentiated content for diverse learners</li>
          <li>Generate assessments aligned with learning standards</li>
        </ul>
        <h4>Key Features:</h4>
        <p>Eduaide AI provides AI-powered assistance for creating engaging educational materials tailored to your students' needs.</p>
      `,
      formUrl:
        'https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAN__k-demo',
      evidenceFiles: [],
      completedAt: new Date('2024-11-15'),
      startedAt: new Date('2024-11-15'),
      lastAccessedAt: new Date('2024-11-15'),
    },
    {
      id: 'curipod',
      title: 'Curipod Interactive Lessons',
      duration: 18,
      status: 'completed',
      icon: 'fas fa-chalkboard-teacher',
      color: '#10b981',
      bgColor: '#d1fae5',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoProvider: 'youtube',
      guideContent: `
        <h3>Curipod Interactive Lessons</h3>
        <p>Learn how to create engaging interactive presentations that boost student participation.</p>
        <h4>What You'll Learn:</h4>
        <ul>
          <li>Create interactive slides with polls and questions</li>
          <li>Use real-time student responses to guide instruction</li>
          <li>Export and analyze student engagement data</li>
        </ul>
      `,
      formUrl:
        'https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAN__k-demo',
      evidenceFiles: [],
      completedAt: new Date('2024-11-20'),
      startedAt: new Date('2024-11-20'),
      lastAccessedAt: new Date('2024-11-20'),
    },
    {
      id: 'diffit',
      title: 'Diffit Differentiation Tool',
      duration: 12,
      status: 'in-progress',
      icon: 'fas fa-layer-group',
      color: '#f59e0b',
      bgColor: '#fef3c7',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoProvider: 'youtube',
      guideContent: `
        <h3>Diffit Differentiation Tool</h3>
        <p>Master the art of differentiation with Diffit's AI-powered content adaptation.</p>
        <h4>Course Content:</h4>
        <ul>
          <li>Adapt reading materials to different grade levels</li>
          <li>Generate vocabulary lists and comprehension questions</li>
          <li>Create scaffolded versions of complex texts</li>
        </ul>
      `,
      formUrl:
        'https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAN__k-demo',
      evidenceFiles: [],
      startedAt: new Date('2024-11-25'),
      lastAccessedAt: new Date('2024-12-01'),
    },
    {
      id: 'magicschool',
      title: 'MagicSchool AI',
      duration: 22,
      status: 'not-started',
      icon: 'fas fa-hat-wizard',
      color: '#8b5cf6',
      bgColor: '#ede9fe',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoProvider: 'youtube',
      guideContent: `
        <h3>MagicSchool AI Platform</h3>
        <p>Explore the comprehensive suite of AI tools designed specifically for educators.</p>
        <h4>Topics Covered:</h4>
        <ul>
          <li>Lesson plan generation</li>
          <li>Student feedback automation</li>
          <li>Email and communication templates</li>
          <li>IEP goal writing assistance</li>
        </ul>
      `,
      formUrl:
        'https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAN__k-demo',
      evidenceFiles: [],
    },
    {
      id: 'prompt-engineering',
      title: 'AI Prompt Engineering',
      duration: 15,
      status: 'not-started',
      icon: 'fas fa-terminal',
      color: '#ec4899',
      bgColor: '#fce7f3',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoProvider: 'youtube',
      guideContent: `
        <h3>AI Prompt Engineering for Educators</h3>
        <p>Learn the essential skills of crafting effective AI prompts to get the best results.</p>
        <h4>Skills You'll Develop:</h4>
        <ul>
          <li>Understanding prompt structure and components</li>
          <li>Writing clear and specific instructions</li>
          <li>Iterating and refining prompts for better outcomes</li>
          <li>Ethical considerations in AI usage</li>
        </ul>
      `,
      formUrl:
        'https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAN__k-demo',
      evidenceFiles: [],
    },
    {
      id: 'digital-citizenship',
      title: 'Digital Citizenship Teaching',
      duration: 25,
      status: 'not-started',
      icon: 'fas fa-shield-alt',
      color: '#059669',
      bgColor: '#d1fae5',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoProvider: 'youtube',
      guideContent: `
        <h3>Teaching Digital Citizenship</h3>
        <p>Equip your students with essential digital citizenship skills for the modern world.</p>
        <h4>Core Modules:</h4>
        <ul>
          <li>Online safety and privacy</li>
          <li>Digital footprint awareness</li>
          <li>Cyberbullying prevention</li>
          <li>Media literacy and misinformation</li>
          <li>Responsible social media use</li>
        </ul>
      `,
      formUrl:
        'https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAN__k-demo',
      evidenceFiles: [],
    },
    {
      id: 'onenote',
      title: 'OneNote Class Notebook',
      duration: 10,
      status: 'not-started',
      icon: 'fas fa-book',
      color: '#7c3aed',
      bgColor: '#ede9fe',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoProvider: 'youtube',
      guideContent: `
        <h3>OneNote Class Notebook Mastery</h3>
        <p>Learn to organize your classroom with Microsoft OneNote Class Notebooks.</p>
        <h4>What You'll Master:</h4>
        <ul>
          <li>Setting up a Class Notebook structure</li>
          <li>Distributing and collecting assignments</li>
          <li>Providing digital feedback and annotations</li>
          <li>Integrating with Microsoft Teams</li>
        </ul>
      `,
      formUrl:
        'https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAN__k-demo',
      evidenceFiles: [],
    },
    {
      id: 'microsoft-forms',
      title: 'Microsoft Forms Advanced',
      duration: 8,
      status: 'not-started',
      icon: 'fas fa-clipboard-list',
      color: '#0ea5e9',
      bgColor: '#e0f2fe',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoProvider: 'youtube',
      guideContent: `
        <h3>Advanced Microsoft Forms</h3>
        <p>Take your assessment creation to the next level with advanced Forms features.</p>
        <h4>Advanced Techniques:</h4>
        <ul>
          <li>Branching logic and conditional questions</li>
          <li>Quiz creation with automatic grading</li>
          <li>Data analysis with Excel integration</li>
          <li>Response validation and file uploads</li>
        </ul>
      `,
      formUrl:
        'https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAN__k-demo',
      evidenceFiles: [],
    },
  ]);

  // Computed progress
  progress = computed<CPDProgress>(() => {
    const completedModules = this.modules().filter((m) => m.status === 'completed');
    const hoursCompleted = completedModules.reduce((sum, m) => sum + m.duration, 0) / 60;

    return {
      hoursCompleted: Math.round(hoursCompleted * 10) / 10,
      targetHours: 10,
      completedModules: completedModules.length,
      totalModules: this.modules().length,
      lastActivityDate: new Date('2024-12-01'),
      streak: 5,
    };
  });

  // Teacher stats
  stats = computed<TeacherStats>(() => ({
    cpdHours: this.progress().hoursCompleted,
    badgesEarned: 4,
    activeStudents: 28,
    currentStreak: this.progress().streak,
  }));

  getModules() {
    return this.modules();
  }

  getModule(id: string) {
    return this.modules().find((m) => m.id === id);
  }

  getProgress() {
    return this.progress();
  }

  getStats() {
    return this.stats();
  }

  markModuleComplete(id: string): void {
    this.modules.update((modules) =>
      modules.map((m) =>
        m.id === id
          ? {
              ...m,
              status: 'completed' as const,
              completedAt: new Date(),
            }
          : m
      )
    );
  }

  markModuleInProgress(id: string): void {
    this.modules.update((modules) =>
      modules.map((m) =>
        m.id === id && m.status === 'not-started'
          ? {
              ...m,
              status: 'in-progress' as const,
              startedAt: new Date(),
              lastAccessedAt: new Date(),
            }
          : m
      )
    );
  }

  uploadEvidence(moduleId: string, files: FileList): void {
    // Mock implementation - in production, upload to blob storage
    const fileNames = Array.from(files).map((f) => f.name);
    this.modules.update((modules) =>
      modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              evidenceFiles: [...m.evidenceFiles, ...fileNames],
            }
          : m
      )
    );
  }
}
