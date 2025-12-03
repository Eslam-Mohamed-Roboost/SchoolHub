import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mission-detail',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="mission-detail">
      <!-- Back Button -->
      <a routerLink="/student/missions" class="back-link">← Back to Missions</a>

      <!-- Hero Section -->
      <header class="mission-hero">
        <div class="hero-icon">🛡️</div>
        <div class="hero-content">
          <div class="badges">
            <span class="status-badge in-progress">In Progress</span>
            <span class="time-badge">⏱️ 20 mins left</span>
          </div>
          <h1>Mission 3: Online Safety & Privacy</h1>
          <p>Learn how to create strong passwords and protect your personal information online.</p>
          <div class="progress-section">
            <div class="progress-text">
              <span>Your Progress: 60%</span>
              <span>3/5 Activities</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" style="width: 60%"></div>
            </div>
          </div>
        </div>
        <div class="hero-reward">
          <div class="reward-label">REWARD</div>
          <div class="reward-icon">🛡️</div>
          <div class="reward-name">Safety Shield</div>
        </div>
      </header>

      <div class="content-grid">
        <!-- Activities List -->
        <div class="activities-list">
          <h2>Mission Activities</h2>

          <div class="activity-item completed">
            <div class="activity-status">✅</div>
            <div class="activity-info">
              <h3>1. Introduction Video</h3>
              <p>Watch the video about online privacy.</p>
            </div>
            <button class="btn-action secondary">Review</button>
          </div>

          <div class="activity-item completed">
            <div class="activity-status">✅</div>
            <div class="activity-info">
              <h3>2. Reading: Password Power</h3>
              <p>Read about what makes a password strong.</p>
            </div>
            <button class="btn-action secondary">Review</button>
          </div>

          <div class="activity-item completed">
            <div class="activity-status">✅</div>
            <div class="activity-info">
              <h3>3. Interactive: Password Checker</h3>
              <p>Test different passwords to see their strength.</p>
            </div>
            <button class="btn-action secondary">Review</button>
          </div>

          <div class="activity-item active">
            <div class="activity-status">4️⃣</div>
            <div class="activity-info">
              <h3>4. Reflection: My Digital Pledge</h3>
              <p>Write your promise to keep your data safe.</p>
            </div>
            <button class="btn-action primary">Start Activity</button>
          </div>

          <div class="activity-item locked">
            <div class="activity-status">🔒</div>
            <div class="activity-info">
              <h3>5. Quiz: Check Your Understanding</h3>
              <p>Pass the quiz to earn your badge!</p>
            </div>
            <button class="btn-action disabled" disabled>Locked</button>
          </div>
        </div>

        <!-- Sidebar Info -->
        <aside class="mission-sidebar">
          <div class="sidebar-card">
            <h3>What You'll Learn</h3>
            <ul class="learning-list">
              <li>Create strong, secure passwords</li>
              <li>Identify personal vs. private info</li>
              <li>Understand privacy settings</li>
              <li>Spot phishing attempts</li>
            </ul>
          </div>

          <div class="sidebar-card teacher-note">
            <h3>Teacher's Note 👨‍🏫</h3>
            <p>"Remember to think about what information you share on gaming profiles!"</p>
          </div>
        </aside>
      </div>
    </div>
  `,
  styles: [
    `
      .mission-detail {
        max-width: 1200px;
        margin: 0 auto;
        padding-bottom: 4rem;
      }
      .back-link {
        display: inline-block;
        margin-bottom: 1.5rem;
        color: #666;
        text-decoration: none;
        font-weight: 600;
      }
      .back-link:hover {
        color: #00bcf2;
      }

      .mission-hero {
        background: linear-gradient(135deg, #00bcf2, #0099c4);
        color: white;
        padding: 3rem;
        border-radius: 24px;
        display: flex;
        gap: 2rem;
        align-items: center;
        margin-bottom: 2rem;
        box-shadow: 0 10px 20px rgba(0, 188, 242, 0.2);
      }
      .hero-icon {
        font-size: 5rem;
        background: rgba(255, 255, 255, 0.2);
        width: 120px;
        height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 24px;
      }
      .hero-content {
        flex: 1;
      }
      .badges {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
      }
      .status-badge {
        background: #fff9e6;
        color: #8a6d00;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-weight: 700;
        font-size: 0.85rem;
      }
      .time-badge {
        background: rgba(255, 255, 255, 0.2);
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.85rem;
      }
      h1 {
        font-size: 2.5rem;
        margin: 0 0 0.5rem 0;
      }
      p {
        font-size: 1.1rem;
        opacity: 0.9;
        margin-bottom: 1.5rem;
      }

      .progress-section {
        background: rgba(0, 0, 0, 0.1);
        padding: 1rem;
        border-radius: 12px;
      }
      .progress-text {
        display: flex;
        justify-content: space-between;
        font-weight: 600;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
      }
      .progress-track {
        height: 10px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 5px;
        overflow: hidden;
      }
      .progress-fill {
        height: 100%;
        background: #ffb900;
        border-radius: 5px;
      }

      .hero-reward {
        background: rgba(255, 255, 255, 0.1);
        padding: 1.5rem;
        border-radius: 16px;
        text-align: center;
        min-width: 140px;
      }
      .reward-label {
        font-size: 0.8rem;
        font-weight: 700;
        letter-spacing: 1px;
        margin-bottom: 0.5rem;
        opacity: 0.8;
      }
      .reward-icon {
        font-size: 3rem;
        margin-bottom: 0.5rem;
      }
      .reward-name {
        font-weight: 700;
      }

      .content-grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 2rem;
      }

      .activities-list {
        background: white;
        padding: 2rem;
        border-radius: 24px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }
      .activities-list h2 {
        margin-top: 0;
        margin-bottom: 1.5rem;
        color: #333;
      }

      .activity-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1.5rem;
        border: 1px solid #eee;
        border-radius: 16px;
        margin-bottom: 1rem;
        transition: all 0.2s;
      }
      .activity-item:hover {
        border-color: #00bcf2;
        transform: translateX(5px);
      }
      .activity-item.completed {
        background: #f9fff9;
        border-color: #c3e6cb;
      }
      .activity-item.active {
        border-color: #00bcf2;
        background: #e6f8fd;
        box-shadow: 0 4px 12px rgba(0, 188, 242, 0.1);
      }
      .activity-item.locked {
        opacity: 0.6;
        background: #f9f9f9;
      }

      .activity-status {
        font-size: 1.5rem;
        width: 40px;
        text-align: center;
      }
      .activity-info {
        flex: 1;
      }
      .activity-info h3 {
        margin: 0 0 0.25rem 0;
        font-size: 1.1rem;
        color: #333;
      }
      .activity-info p {
        margin: 0;
        color: #666;
        font-size: 0.9rem;
      }

      .btn-action {
        padding: 0.5rem 1.25rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: all 0.2s;
      }
      .btn-action.primary {
        background: #00bcf2;
        color: white;
      }
      .btn-action.primary:hover {
        background: #00a0d1;
      }
      .btn-action.secondary {
        background: white;
        border: 1px solid #ddd;
        color: #666;
      }
      .btn-action.secondary:hover {
        background: #f5f5f5;
      }
      .btn-action.disabled {
        background: #eee;
        color: #999;
        cursor: not-allowed;
      }

      .sidebar-card {
        background: white;
        padding: 1.5rem;
        border-radius: 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        margin-bottom: 1.5rem;
      }
      .sidebar-card h3 {
        margin-top: 0;
        color: #333;
        font-size: 1.2rem;
        margin-bottom: 1rem;
        border-bottom: 2px solid #eee;
        padding-bottom: 0.5rem;
      }

      .learning-list {
        padding-left: 1.25rem;
        margin: 0;
        color: #555;
        line-height: 1.6;
      }
      .learning-list li {
        margin-bottom: 0.5rem;
      }

      .teacher-note {
        background: #fff9e6;
        border: 1px solid #ffeba8;
      }
      .teacher-note p {
        margin: 0;
        font-style: italic;
        color: #8a6d00;
      }

      @media (max-width: 900px) {
        .content-grid {
          grid-template-columns: 1fr;
        }
        .mission-hero {
          flex-direction: column;
          text-align: center;
        }
        .hero-reward {
          width: 100%;
        }
      }
    `,
  ],
})
export class MissionDetailComponent {}
