import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-progress',
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <header class="page-header">
        <div class="header-icon">📊</div>
        <div class="header-content">
          <h1>My Progress</h1>
          <p>Track your learning journey and achievements.</p>
        </div>
      </header>

      <!-- Overview Cards -->
      <div class="overview-grid">
        <div class="stat-card">
          <h3>Missions</h3>
          <div class="stat-number">3 / 8</div>
          <div class="progress-bar-sm"><div class="fill" style="width: 37.5%"></div></div>
          <div class="stat-label">37.5% Complete</div>
        </div>
        <div class="stat-card">
          <h3>Badges</h3>
          <div class="stat-number">4</div>
          <div class="progress-bar-sm"><div class="fill" style="width: 50%"></div></div>
          <div class="stat-label">4 Earned</div>
        </div>
        <div class="stat-card">
          <h3>Points</h3>
          <div class="stat-number">450</div>
          <div class="stat-label">Total XP</div>
        </div>
        <div class="stat-card">
          <h3>Streak</h3>
          <div class="stat-number">🔥 3</div>
          <div class="stat-label">Days Active</div>
        </div>
      </div>

      <div class="details-grid">
        <!-- Activity Timeline -->
        <div class="timeline-section">
          <h2>Recent Activity</h2>
          <div class="timeline">
            <div class="timeline-item">
              <div class="time-marker">Today</div>
              <div class="time-content">
                <div class="activity-icon">🛡️</div>
                <div class="activity-details">
                  <h4>Started Mission 3</h4>
                  <p>Online Safety & Privacy</p>
                </div>
                <div class="activity-time">2h ago</div>
              </div>
            </div>
            <div class="timeline-item">
              <div class="time-marker">Yesterday</div>
              <div class="time-content">
                <div class="activity-icon">🏆</div>
                <div class="activity-details">
                  <h4>Earned Badge</h4>
                  <p>Kindness Champion</p>
                </div>
                <div class="activity-time">4:30 PM</div>
              </div>
            </div>
            <div class="timeline-item">
              <div class="time-marker">Oct 24</div>
              <div class="time-content">
                <div class="activity-icon">✅</div>
                <div class="activity-details">
                  <h4>Completed Quiz</h4>
                  <p>Cyberbullying Prevention - Score: 90%</p>
                </div>
                <div class="activity-time">10:15 AM</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Goals Section -->
        <div class="goals-section">
          <h2>My Goals</h2>
          <div class="goal-card">
            <div class="goal-header">
              <h3>Monthly Goal</h3>
              <span class="goal-status">In Progress</span>
            </div>
            <p>Complete 2 Missions this month</p>
            <div class="goal-progress">
              <div class="progress-info">
                <span>1 / 2 Completed</span>
                <span>50%</span>
              </div>
              <div class="progress-bar-lg"><div class="fill" style="width: 50%"></div></div>
            </div>
          </div>

          <button class="btn-new-goal">+ Set New Goal</button>
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

      .overview-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }
      .stat-card {
        background: white;
        padding: 1.5rem;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        text-align: center;
      }
      .stat-card h3 {
        margin: 0 0 1rem 0;
        color: #666;
        font-size: 1rem;
      }
      .stat-number {
        font-size: 2rem;
        font-weight: 800;
        color: #333;
        margin-bottom: 0.5rem;
      }
      .stat-label {
        font-size: 0.9rem;
        color: #888;
      }

      .progress-bar-sm {
        height: 6px;
        background: #eee;
        border-radius: 3px;
        margin: 0.5rem auto;
        width: 80%;
        overflow: hidden;
      }
      .fill {
        height: 100%;
        background: #00bcf2;
        border-radius: 3px;
      }

      .details-grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 2rem;
      }

      .timeline-section,
      .goals-section {
        background: white;
        padding: 2rem;
        border-radius: 24px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }
      h2 {
        margin-top: 0;
        margin-bottom: 1.5rem;
        color: #333;
        font-size: 1.5rem;
      }

      .timeline {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      .timeline-item {
        display: flex;
        gap: 1rem;
      }
      .time-marker {
        width: 80px;
        font-weight: 600;
        color: #888;
        font-size: 0.9rem;
        text-align: right;
        padding-top: 0.5rem;
      }
      .time-content {
        flex: 1;
        background: #f9f9f9;
        padding: 1rem;
        border-radius: 12px;
        display: flex;
        gap: 1rem;
        align-items: center;
      }
      .activity-icon {
        font-size: 1.5rem;
      }
      .activity-details h4 {
        margin: 0 0 0.25rem 0;
        color: #333;
      }
      .activity-details p {
        margin: 0;
        color: #666;
        font-size: 0.9rem;
      }
      .activity-time {
        font-size: 0.8rem;
        color: #999;
        margin-left: auto;
      }

      .goal-card {
        border: 1px solid #eee;
        padding: 1.5rem;
        border-radius: 16px;
        margin-bottom: 1rem;
      }
      .goal-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
      }
      .goal-header h3 {
        margin: 0;
        color: #333;
        font-size: 1.1rem;
      }
      .goal-status {
        font-size: 0.8rem;
        background: #fff9e6;
        color: #8a6d00;
        padding: 0.25rem 0.5rem;
        border-radius: 10px;
        font-weight: 700;
      }
      .goal-card p {
        color: #666;
        margin-bottom: 1rem;
      }

      .progress-info {
        display: flex;
        justify-content: space-between;
        font-size: 0.85rem;
        color: #666;
        margin-bottom: 0.25rem;
      }
      .progress-bar-lg {
        height: 10px;
        background: #eee;
        border-radius: 5px;
        overflow: hidden;
      }

      .btn-new-goal {
        width: 100%;
        padding: 0.75rem;
        border: 2px dashed #ccc;
        background: none;
        border-radius: 12px;
        color: #666;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      .btn-new-goal:hover {
        border-color: #00bcf2;
        color: #00bcf2;
        background: #e6f8fd;
      }

      @media (max-width: 900px) {
        .details-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class StudentProgressComponent {}
