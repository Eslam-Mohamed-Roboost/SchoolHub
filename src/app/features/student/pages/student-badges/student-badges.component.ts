import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-badges',
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <header class="page-header">
        <div class="header-icon">🏆</div>
        <div class="header-content">
          <h1>My Badge Collection</h1>
          <p>Show off what you've earned!</p>
        </div>
      </header>

      <!-- Stats Summary -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🎖️</div>
          <div class="stat-info">
            <div class="stat-value">4</div>
            <div class="stat-label">Badges Earned</div>
            <div class="stat-sub">4 more to go!</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <div class="stat-value">Digital Scout</div>
            <div class="stat-label">Current Level</div>
            <div class="stat-sub">1 more to level up!</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🌟</div>
          <div class="stat-info">
            <div class="stat-value">Safety Shield</div>
            <div class="stat-label">Latest Badge</div>
            <div class="stat-sub">Earned 2 days ago</div>
          </div>
        </div>
      </div>

      <!-- Badge Gallery -->
      <div class="gallery-section">
        <div class="filter-tabs">
          <button class="tab active">All Badges (8)</button>
          <button class="tab">Earned (4) ✨</button>
          <button class="tab">Locked (4) 🔒</button>
        </div>

        <div class="badges-grid">
          @for (badge of badges; track badge.id) {
          <div class="badge-card" [class.locked]="!badge.earned">
            <div class="badge-visual">
              <span class="badge-emoji">{{ badge.icon }}</span>
              @if (!badge.earned) {
              <div class="lock-overlay">🔒</div>
              }
            </div>
            <div class="badge-info">
              <h3>{{ badge.name }}</h3>
              <div class="badge-status">
                @if (badge.earned) {
                <span class="earned-tag">✅ EARNED</span>
                <span class="earn-date">{{ badge.date }}</span>
                } @else {
                <span class="locked-tag">NOT EARNED</span>
                <span class="requirement">{{ badge.requirement }}</span>
                }
              </div>
            </div>
          </div>
          }
        </div>
      </div>

      <!-- Level Roadmap -->
      <div class="roadmap-section">
        <h2>Level Roadmap</h2>
        <div class="roadmap-container">
          <div class="level-step active">
            <div class="step-marker">🌱</div>
            <div class="step-info">
              <h4>Digital Scout</h4>
              <p>1-3 Badges</p>
            </div>
          </div>
          <div class="step-connector active"></div>
          <div class="level-step next">
            <div class="step-marker">🔍</div>
            <div class="step-info">
              <h4>Digital Explorer</h4>
              <p>4-6 Badges</p>
            </div>
          </div>
          <div class="step-connector"></div>
          <div class="level-step">
            <div class="step-marker">🏆</div>
            <div class="step-info">
              <h4>Digital Champion</h4>
              <p>7 Badges</p>
            </div>
          </div>
          <div class="step-connector"></div>
          <div class="level-step">
            <div class="step-marker">⭐</div>
            <div class="step-info">
              <h4>Digital Leader</h4>
              <p>8 Badges</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .page-container {
        max-width: 1200px;
        margin: 0 auto;
        padding-bottom: 4rem;
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
        background: #fff9e6;
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

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 3rem;
      }
      .stat-card {
        background: white;
        padding: 1.5rem;
        border-radius: 20px;
        display: flex;
        align-items: center;
        gap: 1.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }
      .stat-icon {
        font-size: 2.5rem;
        background: #e6f8fd;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
      }
      .stat-value {
        font-size: 1.5rem;
        font-weight: 800;
        color: #333;
      }
      .stat-label {
        font-weight: 600;
        color: #666;
        font-size: 0.9rem;
      }
      .stat-sub {
        font-size: 0.85rem;
        color: #00bcf2;
        margin-top: 0.25rem;
      }

      .gallery-section {
        background: white;
        padding: 2rem;
        border-radius: 24px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        margin-bottom: 3rem;
      }
      .filter-tabs {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        border-bottom: 1px solid #eee;
        padding-bottom: 1rem;
      }
      .tab {
        background: none;
        border: none;
        padding: 0.5rem 1.5rem;
        font-weight: 600;
        color: #666;
        cursor: pointer;
        border-radius: 20px;
        transition: all 0.2s;
      }
      .tab.active {
        background: #00bcf2;
        color: white;
      }
      .tab:hover:not(.active) {
        background: #f0f0f0;
      }

      .badges-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 2rem;
      }
      .badge-card {
        text-align: center;
        padding: 1.5rem;
        border-radius: 16px;
        border: 2px solid #eee;
        transition: all 0.2s;
        cursor: pointer;
      }
      .badge-card:hover {
        transform: translateY(-5px);
        border-color: #00bcf2;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
      }
      .badge-card.locked {
        opacity: 0.7;
        background: #f9f9f9;
      }
      .badge-card.locked .badge-emoji {
        filter: grayscale(100%);
        opacity: 0.5;
      }

      .badge-visual {
        position: relative;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1rem;
      }
      .badge-emoji {
        font-size: 5rem;
      }
      .lock-overlay {
        position: absolute;
        font-size: 2rem;
        background: rgba(255, 255, 255, 0.8);
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .badge-info h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.1rem;
        color: #333;
      }
      .badge-status {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        font-size: 0.85rem;
      }
      .earned-tag {
        color: #107c10;
        font-weight: 700;
      }
      .earn-date {
        color: #888;
      }
      .locked-tag {
        color: #666;
        font-weight: 700;
      }
      .requirement {
        color: #888;
        font-style: italic;
      }

      .roadmap-section {
        background: white;
        padding: 2rem;
        border-radius: 24px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }
      .roadmap-section h2 {
        margin-top: 0;
        margin-bottom: 2rem;
        text-align: center;
      }
      .roadmap-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        max-width: 800px;
        margin: 0 auto;
        position: relative;
      }

      .level-step {
        text-align: center;
        position: relative;
        z-index: 2;
      }
      .step-marker {
        width: 60px;
        height: 60px;
        background: white;
        border: 4px solid #eee;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        margin: 0 auto 1rem auto;
        transition: all 0.3s;
      }
      .level-step.active .step-marker {
        border-color: #ffb900;
        background: #fff9e6;
        transform: scale(1.1);
      }
      .level-step.next .step-marker {
        border-color: #00bcf2;
        border-style: dashed;
      }

      .step-info h4 {
        margin: 0;
        font-size: 1rem;
        color: #333;
      }
      .step-info p {
        margin: 0;
        font-size: 0.85rem;
        color: #888;
      }

      .step-connector {
        flex: 1;
        height: 4px;
        background: #eee;
        margin: 0 -10px;
        position: relative;
        top: -35px;
        z-index: 1;
      }
      .step-connector.active {
        background: #ffb900;
      }

      @media (max-width: 768px) {
        .roadmap-container {
          flex-direction: column;
          gap: 2rem;
        }
        .step-connector {
          width: 4px;
          height: 50px;
          margin: -10px 0;
          top: 0;
        }
      }
    `,
  ],
})
export class StudentBadgesComponent {
  badges = [
    {
      id: 1,
      name: 'Digital Citizen',
      icon: '🌍',
      earned: true,
      date: 'Oct 10, 2023',
      requirement: '',
    },
    {
      id: 2,
      name: 'Footprint Tracker',
      icon: '👣',
      earned: true,
      date: 'Oct 15, 2023',
      requirement: '',
    },
    {
      id: 3,
      name: 'Safety Shield',
      icon: '🛡️',
      earned: true,
      date: 'Oct 20, 2023',
      requirement: '',
    },
    {
      id: 4,
      name: 'Kindness Champion',
      icon: '🤝',
      earned: true,
      date: 'Oct 25, 2023',
      requirement: '',
    },
    {
      id: 5,
      name: 'Truth Seeker',
      icon: '🔍',
      earned: false,
      date: '',
      requirement: 'Complete Mission 5',
    },
    {
      id: 6,
      name: 'Communication Pro',
      icon: '💬',
      earned: false,
      date: '',
      requirement: 'Complete Mission 6',
    },
    {
      id: 7,
      name: 'Balance Master',
      icon: '⚖️',
      earned: false,
      date: '',
      requirement: 'Complete Mission 7',
    },
    {
      id: 8,
      name: 'Digital Leader',
      icon: '📜',
      earned: false,
      date: '',
      requirement: 'Complete Mission 8',
    },
  ];
}
