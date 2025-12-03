import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-challenge-zone',
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <header class="page-header">
        <div class="header-icon">🎮</div>
        <div class="header-content">
          <h1>Challenge Zone</h1>
          <p>Test your skills, play games, and have fun!</p>
        </div>
      </header>

      <div class="challenge-tabs">
        <button class="tab active">All Challenges</button>
        <button class="tab">New 🆕</button>
        <button class="tab">Completed ✅</button>
      </div>

      <div class="challenges-grid">
        <div class="challenge-card">
          <div class="card-image quiz-bg">
            <span class="type-icon">🧠</span>
            <span class="difficulty easy">Easy</span>
          </div>
          <div class="card-content">
            <h3>Weekly Knowledge Check</h3>
            <p>Quick 5-question quiz about this week's topic.</p>
            <div class="card-meta">
              <span>⏱️ 5 mins</span>
              <span>⭐ 25 pts</span>
            </div>
            <button class="btn-start">Start Quiz</button>
          </div>
        </div>

        <div class="challenge-card">
          <div class="card-image create-bg">
            <span class="type-icon">🎨</span>
            <span class="difficulty medium">Medium</span>
          </div>
          <div class="card-content">
            <h3>Create a Digital Poster</h3>
            <p>Design a poster about password safety using Canva.</p>
            <div class="card-meta">
              <span>⏱️ 20 mins</span>
              <span>⭐ 50 pts</span>
            </div>
            <button class="btn-start">Start Creating</button>
          </div>
        </div>

        <div class="challenge-card">
          <div class="card-image game-bg">
            <span class="type-icon">🕹️</span>
            <span class="difficulty hard">Hard</span>
          </div>
          <div class="card-content">
            <h3>Phishing Spotter Game</h3>
            <p>Can you identify all the fake emails in 2 minutes?</p>
            <div class="card-meta">
              <span>⏱️ 10 mins</span>
              <span>⭐ 100 pts</span>
            </div>
            <button class="btn-start">Play Game</button>
          </div>
        </div>

        <div class="challenge-card">
          <div class="card-image investigate-bg">
            <span class="type-icon">🕵️</span>
            <span class="difficulty medium">Medium</span>
          </div>
          <div class="card-content">
            <h3>Fact Checker</h3>
            <p>Investigate 3 news headlines and find the truth.</p>
            <div class="card-meta">
              <span>⏱️ 15 mins</span>
              <span>⭐ 50 pts</span>
            </div>
            <button class="btn-start">Start Investigation</button>
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
        background: #e6e6fa;
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

      .challenge-tabs {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
      }
      .tab {
        background: white;
        border: 1px solid #eee;
        padding: 0.75rem 1.5rem;
        border-radius: 20px;
        font-weight: 600;
        color: #666;
        cursor: pointer;
        transition: all 0.2s;
      }
      .tab.active {
        background: #7719aa;
        color: white;
        border-color: #7719aa;
      }
      .tab:hover:not(.active) {
        background: #f5f5f5;
      }

      .challenges-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 2rem;
      }
      .challenge-card {
        background: white;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        transition: transform 0.2s;
        border: 2px solid transparent;
      }
      .challenge-card:hover {
        transform: translateY(-5px);
        border-color: #7719aa;
      }

      .card-image {
        height: 160px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .quiz-bg {
        background: linear-gradient(135deg, #ffb900, #ffd700);
      }
      .create-bg {
        background: linear-gradient(135deg, #00bcf2, #00e5ff);
      }
      .game-bg {
        background: linear-gradient(135deg, #ff5252, #ff8a80);
      }
      .investigate-bg {
        background: linear-gradient(135deg, #7719aa, #9c27b0);
      }

      .type-icon {
        font-size: 4rem;
        filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.1));
      }

      .difficulty {
        position: absolute;
        top: 1rem;
        right: 1rem;
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 700;
        background: rgba(255, 255, 255, 0.9);
        color: #333;
      }
      .difficulty.easy {
        color: #107c10;
      }
      .difficulty.medium {
        color: #8a6d00;
      }
      .difficulty.hard {
        color: #d13438;
      }

      .card-content {
        padding: 1.5rem;
      }
      h3 {
        margin: 0 0 0.5rem 0;
        color: #333;
        font-size: 1.25rem;
      }
      p {
        color: #666;
        font-size: 0.95rem;
        margin-bottom: 1.5rem;
        line-height: 1.4;
        min-height: 2.8em;
      }

      .card-meta {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1.5rem;
        font-size: 0.9rem;
        font-weight: 600;
        color: #555;
      }

      .btn-start {
        width: 100%;
        padding: 0.75rem;
        background: white;
        border: 2px solid #7719aa;
        color: #7719aa;
        border-radius: 10px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
      }
      .btn-start:hover {
        background: #7719aa;
        color: white;
      }
    `,
  ],
})
export class ChallengeZoneComponent {}
