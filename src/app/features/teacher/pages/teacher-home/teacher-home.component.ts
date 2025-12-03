import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-teacher-home',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      <!-- Hero Banner -->
      <header class="hero-banner">
        <div class="hero-content">
          <h1>Welcome back, Sarah! 👋</h1>
          <p class="tagline">Keep growing, keep learning!</p>
          <div class="hero-actions">
            <button class="btn-hero primary">Start a Tutorial</button>
            <button class="btn-hero secondary">This Week's Challenge</button>
          </div>
        </div>
        <div class="hero-decoration">🌱</div>
      </header>

      <!-- Progress Dashboard -->
      <section class="dashboard-grid">
        <div class="dashboard-card">
          <div class="card-icon badge-icon">🏅</div>
          <div class="card-info">
            <div class="card-value">5 / 12</div>
            <div class="card-label">Badges Earned</div>
            <div class="progress-bar-container">
              <div class="progress-bar" style="width: 42%"></div>
            </div>
          </div>
          <a routerLink="/teacher/impact" class="card-link">View All Badges →</a>
        </div>

        <div class="dashboard-card">
          <div class="card-icon cpd-icon">⏱️</div>
          <div class="card-info">
            <div class="card-value">8.5 Hours</div>
            <div class="card-label">CPD Logged</div>
            <div class="trend-indicator">↑ 2 hours this month</div>
          </div>
          <button class="card-action">Log Activity</button>
        </div>

        <div class="dashboard-card highlight">
          <div class="card-icon goal-icon">🏆</div>
          <div class="card-info">
            <div class="card-label">Next Goal</div>
            <div class="card-value-sm">AI Innovator</div>
            <div class="card-sub">1 more badge to reach next tier!</div>
          </div>
        </div>
      </section>

      <div class="content-grid">
        <!-- Left Column -->
        <div class="main-column">
          <!-- Featured Resources -->
          <section class="section-block">
            <h2>Featured Resources</h2>
            <div class="resources-grid">
              <div class="resource-card">
                <div class="res-icon">🤖</div>
                <h3>AI Tools</h3>
                <p>Tutorials for Eduaide, Curipod, Diffit</p>
                <button class="btn-explore">Explore</button>
              </div>
              <div class="resource-card">
                <div class="res-icon">📝</div>
                <h3>Lesson Templates</h3>
                <p>Ready-to-use planning templates</p>
                <button class="btn-explore">Explore</button>
              </div>
              <div class="resource-card">
                <div class="res-icon">🎮</div>
                <h3>Tech Playground</h3>
                <p>Interactive tools and challenges</p>
                <button class="btn-explore">Play</button>
              </div>
              <div class="resource-card">
                <div class="res-icon">🌐</div>
                <h3>Digital Citizenship</h3>
                <p>Resources for teaching DC lessons</p>
                <button class="btn-explore">View</button>
              </div>
            </div>
          </section>

          <!-- Weekly Focus -->
          <section class="section-block">
            <h2>This Week's Focus</h2>
            <div class="challenge-card">
              <div class="challenge-image">🎯</div>
              <div class="challenge-content">
                <h3>Week 3: Master Differentiation with Curipod</h3>
                <p>
                  Learn how to use Curipod's AI features to create differentiated lessons for your
                  students in minutes.
                </p>
                <div class="challenge-meta">
                  <span>⏱️ 30-45 minutes</span>
                  <div class="links">
                    <a href="#">Tutorial Video</a>
                    <a href="#">Quick Guide</a>
                  </div>
                </div>
                <button class="btn-challenge">View Requirements</button>
              </div>
            </div>
          </section>

          <!-- Recent Shares -->
          <section class="section-block">
            <div class="section-header">
              <h2>Teachers' Lounge - Recent Shares</h2>
              <a routerLink="/teacher/lounge" class="link-view-all">View All</a>
            </div>
            <div class="shares-list">
              <div class="share-item">
                <div class="file-icon">📄</div>
                <div class="share-info">
                  <h4>Grade 6 Math Review.docx</h4>
                  <span class="author">by Ahmed Ali • 2 hours ago</span>
                </div>
                <div class="share-stats">
                  <span>⬇️ 12</span>
                  <span>❤️ 5</span>
                </div>
              </div>
              <div class="share-item">
                <div class="file-icon">📊</div>
                <div class="share-info">
                  <h4>Science Project Rubric.xlsx</h4>
                  <span class="author">by Sarah Smith • Yesterday</span>
                </div>
                <div class="share-stats">
                  <span>⬇️ 8</span>
                  <span>❤️ 3</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Right Column -->
        <aside class="side-column">
          <!-- Announcements -->
          <div class="side-card">
            <h3>📢 Announcements</h3>
            <div class="announcement-list">
              <div class="announcement-item">
                <h4>New AI Policy Update</h4>
                <span class="date">Oct 24, 2023</span>
              </div>
              <div class="announcement-item">
                <h4>PD Workshop Registration</h4>
                <span class="date">Oct 22, 2023</span>
              </div>
              <div class="announcement-item">
                <h4>System Maintenance</h4>
                <span class="date">Oct 20, 2023</span>
              </div>
            </div>
            <a href="#" class="link-view-all">See All Announcements</a>
          </div>

          <!-- Help Resources -->
          <div class="side-card">
            <h3>❓ Help Resources</h3>
            <ul class="help-list">
              <li><a href="#">🚀 Getting Started Guide</a></li>
              <li><a href="#">🎥 Video Tutorials</a></li>
              <li><a href="#">🤔 FAQ</a></li>
              <li><a href="#">📧 Contact Support</a></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  `,
  styles: [
    `
      .page-container {
        max-width: 1200px;
        margin: 0 auto;
      }

      /* Hero Banner */
      .hero-banner {
        background: linear-gradient(135deg, #0078d4, #00bcf2);
        color: white;
        padding: 3rem;
        border-radius: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        box-shadow: 0 4px 12px rgba(0, 120, 212, 0.2);
      }
      .hero-content h1 {
        margin: 0 0 0.5rem 0;
        font-size: 2rem;
      }
      .tagline {
        font-size: 1.1rem;
        opacity: 0.9;
        margin-bottom: 1.5rem;
      }
      .hero-actions {
        display: flex;
        gap: 1rem;
      }
      .btn-hero {
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: all 0.2s;
      }
      .btn-hero.primary {
        background: white;
        color: #0078d4;
      }
      .btn-hero.secondary {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.4);
      }
      .btn-hero:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      .hero-decoration {
        font-size: 5rem;
        opacity: 0.2;
      }

      /* Dashboard Grid */
      .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2.5rem;
      }
      .dashboard-card {
        background: white;
        padding: 1.5rem;
        border-radius: 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        display: flex;
        flex-direction: column;
        position: relative;
      }
      .dashboard-card.highlight {
        background: #fff9e6;
        border: 1px solid #ffeba8;
      }

      .card-icon {
        font-size: 2rem;
        margin-bottom: 1rem;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        background: #f5f5f5;
      }
      .badge-icon {
        background: #e6f8fd;
        color: #00bcf2;
      }
      .cpd-icon {
        background: #f9fff9;
        color: #107c10;
      }
      .goal-icon {
        background: #fff4ce;
        color: #8a6d00;
      }

      .card-info {
        flex: 1;
      }
      .card-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: #333;
        margin-bottom: 0.25rem;
      }
      .card-value-sm {
        font-size: 1.25rem;
        font-weight: 700;
        color: #333;
        margin-bottom: 0.25rem;
      }
      .card-label {
        font-size: 0.9rem;
        color: #666;
        margin-bottom: 0.5rem;
      }
      .card-sub {
        font-size: 0.85rem;
        color: #8a6d00;
      }

      .progress-bar-container {
        height: 6px;
        background: #eee;
        border-radius: 3px;
        margin-top: 0.5rem;
        overflow: hidden;
      }
      .progress-bar {
        height: 100%;
        background: #00bcf2;
        border-radius: 3px;
      }

      .trend-indicator {
        font-size: 0.85rem;
        color: #107c10;
        font-weight: 600;
        margin-top: 0.5rem;
      }

      .card-link {
        font-size: 0.9rem;
        color: #0078d4;
        text-decoration: none;
        font-weight: 600;
        margin-top: 1rem;
        display: inline-block;
      }
      .card-action {
        margin-top: 1rem;
        padding: 0.5rem;
        border: 1px solid #0078d4;
        color: #0078d4;
        background: white;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        width: 100%;
      }

      /* Content Grid */
      .content-grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 2rem;
      }

      .section-block {
        margin-bottom: 2.5rem;
      }
      h2 {
        font-size: 1.25rem;
        color: #333;
        margin-bottom: 1rem;
      }

      /* Resources Grid */
      .resources-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
      }
      .resource-card {
        background: white;
        padding: 1.25rem;
        border-radius: 12px;
        border: 1px solid #eee;
        transition: all 0.2s;
        text-align: center;
      }
      .resource-card:hover {
        border-color: #0078d4;
        transform: translateY(-3px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }
      .res-icon {
        font-size: 2rem;
        margin-bottom: 0.5rem;
      }
      .resource-card h3 {
        font-size: 1rem;
        margin: 0 0 0.5rem 0;
        color: #333;
      }
      .resource-card p {
        font-size: 0.85rem;
        color: #666;
        margin-bottom: 1rem;
        min-height: 2.5em;
      }
      .btn-explore {
        padding: 0.4rem 1rem;
        background: #f5f5f5;
        border: none;
        border-radius: 20px;
        color: #555;
        font-weight: 600;
        cursor: pointer;
        font-size: 0.85rem;
        transition: background 0.2s;
      }
      .btn-explore:hover {
        background: #0078d4;
        color: white;
      }

      /* Challenge Card */
      .challenge-card {
        background: white;
        border-radius: 16px;
        overflow: hidden;
        display: flex;
        border: 1px solid #eee;
      }
      .challenge-image {
        width: 120px;
        background: #fff4ce;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
      }
      .challenge-content {
        padding: 1.5rem;
        flex: 1;
      }
      .challenge-content h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.1rem;
      }
      .challenge-content p {
        font-size: 0.95rem;
        color: #666;
        margin-bottom: 1rem;
      }
      .challenge-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        font-size: 0.9rem;
      }
      .links a {
        margin-left: 1rem;
        color: #0078d4;
        text-decoration: none;
      }
      .btn-challenge {
        padding: 0.5rem 1rem;
        background: #0078d4;
        color: white;
        border: none;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
      }

      /* Recent Shares */
      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }
      .shares-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .share-item {
        background: white;
        padding: 1rem;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 1rem;
        border: 1px solid #eee;
      }
      .file-icon {
        font-size: 1.5rem;
        width: 40px;
        height: 40px;
        background: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
      }
      .share-info {
        flex: 1;
      }
      .share-info h4 {
        margin: 0 0 0.25rem 0;
        font-size: 0.95rem;
        color: #333;
      }
      .author {
        font-size: 0.8rem;
        color: #888;
      }
      .share-stats {
        display: flex;
        gap: 1rem;
        font-size: 0.85rem;
        color: #666;
      }

      /* Side Column */
      .side-card {
        background: white;
        padding: 1.5rem;
        border-radius: 16px;
        margin-bottom: 1.5rem;
        border: 1px solid #eee;
      }
      .side-card h3 {
        font-size: 1.1rem;
        margin: 0 0 1rem 0;
      }

      .announcement-item {
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #f5f5f5;
      }
      .announcement-item:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
      }
      .announcement-item h4 {
        margin: 0 0 0.25rem 0;
        font-size: 0.95rem;
        color: #333;
      }
      .date {
        font-size: 0.8rem;
        color: #888;
      }

      .help-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .help-list li {
        margin-bottom: 0.75rem;
      }
      .help-list a {
        text-decoration: none;
        color: #555;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: color 0.2s;
      }
      .help-list a:hover {
        color: #0078d4;
      }

      @media (max-width: 900px) {
        .content-grid {
          grid-template-columns: 1fr;
        }
        .hero-banner {
          flex-direction: column;
          text-align: center;
        }
        .hero-actions {
          justify-content: center;
        }
      }
    `,
  ],
})
export class TeacherHomeComponent {}
