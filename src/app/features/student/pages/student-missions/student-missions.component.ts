import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-student-missions',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      <header class="page-header">
        <div class="header-icon">🎯</div>
        <div class="header-content">
          <h1>My Missions</h1>
          <p>Complete missions to earn badges and level up!</p>
        </div>
      </header>

      <div class="missions-grid">
        @for (mission of missions; track mission.id) {
        <div class="mission-card" [class.locked]="mission.status === 'locked'">
          <div class="mission-icon">{{ mission.icon }}</div>
          <div class="mission-content">
            <div class="mission-status" [ngClass]="mission.status">
              @if (mission.status === 'completed') { ✅ Completed } @else if (mission.status ===
              'in-progress') { 🔄 In Progress } @else { 🔒 Locked }
            </div>
            <h2>{{ mission.title }}</h2>
            <p>{{ mission.description }}</p>

            <div class="mission-meta">
              <span class="badge-reward">🏆 {{ mission.badge }}</span>
              <span class="time">⏱️ {{ mission.duration }}</span>
            </div>

            @if (mission.status !== 'locked') {
            <div class="progress-bar-container">
              <div class="progress-bar" [style.width.%]="mission.progress"></div>
            </div>
            <button [routerLink]="['/student/missions', mission.id]" class="btn-start">
              {{ mission.status === 'in-progress' ? 'Continue' : 'Start Mission' }}
            </button>
            } @else {
            <div class="locked-message">Complete previous mission to unlock</div>
            }
          </div>
        </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .page-container {
        max-width: 1200px;
        margin: 0 auto;
      }
      .page-header {
        display: flex;
        gap: 1.5rem;
        align-items: center;
        margin-bottom: 2rem;
        background: white;
        padding: 2rem;
        border-radius: 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }
      .header-icon {
        font-size: 3rem;
        background: #e6f8fd;
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
      }
      h1 {
        margin: 0 0 0.5rem 0;
        color: #333;
        font-size: 2rem;
      }
      p {
        margin: 0;
        color: #666;
        font-size: 1.1rem;
      }

      .missions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 1.5rem;
      }
      .mission-card {
        background: white;
        border-radius: 20px;
        padding: 1.5rem;
        display: flex;
        gap: 1.5rem;
        border: 2px solid transparent;
        transition: all 0.2s;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }
      .mission-card:hover:not(.locked) {
        transform: translateY(-5px);
        border-color: #00bcf2;
      }
      .mission-card.locked {
        opacity: 0.7;
        background: #f9f9f9;
      }

      .mission-icon {
        font-size: 3rem;
        min-width: 60px;
      }
      .mission-content {
        flex: 1;
      }

      .mission-status {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }
      .mission-status.completed {
        background: #e6ffec;
        color: #107c10;
      }
      .mission-status.in-progress {
        background: #fff9e6;
        color: #8a6d00;
      }
      .mission-status.locked {
        background: #eee;
        color: #666;
      }

      h2 {
        margin: 0 0 0.5rem 0;
        font-size: 1.25rem;
        color: #333;
      }
      .mission-content p {
        font-size: 0.95rem;
        margin-bottom: 1rem;
        line-height: 1.4;
      }

      .mission-meta {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
        font-size: 0.9rem;
        font-weight: 600;
        color: #555;
      }

      .progress-bar-container {
        height: 8px;
        background: #eee;
        border-radius: 4px;
        margin-bottom: 1rem;
        overflow: hidden;
      }
      .progress-bar {
        height: 100%;
        background: #00bcf2;
        border-radius: 4px;
      }

      .btn-start {
        width: 100%;
        padding: 0.75rem;
        background: #00bcf2;
        color: white;
        border: none;
        border-radius: 10px;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.2s;
      }
      .btn-start:hover {
        background: #00a0d1;
      }

      .locked-message {
        text-align: center;
        color: #888;
        font-style: italic;
        font-size: 0.9rem;
        padding: 0.5rem;
      }
    `,
  ],
})
export class StudentMissionsComponent {
  missions = [
    {
      id: 1,
      title: 'Digital Citizenship Foundations',
      description: 'Learn the basics of being a good digital citizen.',
      icon: '🌍',
      status: 'completed',
      progress: 100,
      badge: 'Digital Citizen',
      duration: '30 mins',
    },
    {
      id: 2,
      title: 'Your Digital Footprint',
      description: 'Understand what you leave behind online.',
      icon: '👣',
      status: 'completed',
      progress: 100,
      badge: 'Footprint Tracker',
      duration: '45 mins',
    },
    {
      id: 3,
      title: 'Online Safety & Privacy',
      description: 'Protect your personal information and passwords.',
      icon: '🛡️',
      status: 'in-progress',
      progress: 60,
      badge: 'Safety Shield',
      duration: '40 mins',
    },
    {
      id: 4,
      title: 'Cyberbullying Prevention',
      description: 'How to be kind and stand up to bullies.',
      icon: '🤝',
      status: 'locked',
      progress: 0,
      badge: 'Kindness Champion',
      duration: '35 mins',
    },
    {
      id: 5,
      title: 'Media Literacy & Fake News',
      description: 'Spotting fake news and reliable sources.',
      icon: '🔍',
      status: 'locked',
      progress: 0,
      badge: 'Truth Seeker',
      duration: '50 mins',
    },
    {
      id: 6,
      title: 'Digital Communication',
      description: 'Email etiquette and respectful chatting.',
      icon: '💬',
      status: 'locked',
      progress: 0,
      badge: 'Communication Pro',
      duration: '30 mins',
    },
    {
      id: 7,
      title: 'Balanced Technology Use',
      description: 'Finding a healthy balance with screens.',
      icon: '⚖️',
      status: 'locked',
      progress: 0,
      badge: 'Balance Master',
      duration: '40 mins',
    },
    {
      id: 8,
      title: 'Digital Rights & Responsibilities',
      description: 'Knowing your rights and duties online.',
      icon: '📜',
      status: 'locked',
      progress: 0,
      badge: 'Digital Leader',
      duration: '45 mins',
    },
  ];
}
