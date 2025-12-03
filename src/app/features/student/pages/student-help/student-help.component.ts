import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-help',
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <header class="page-header">
        <div class="header-icon">❓</div>
        <div class="header-content">
          <h1>Help Center</h1>
          <p>Find answers to your questions and learn how to use the Hub.</p>
        </div>
      </header>

      <div class="help-grid">
        <div class="help-section">
          <h2>Video Tutorials</h2>
          <div class="video-list">
            <div class="video-card">
              <div class="video-thumbnail">▶️</div>
              <div class="video-info">
                <h3>Welcome to Digital Hub</h3>
                <span class="duration">3 min</span>
              </div>
            </div>
            <div class="video-card">
              <div class="video-thumbnail">▶️</div>
              <div class="video-info">
                <h3>How to Complete a Mission</h3>
                <span class="duration">4 min</span>
              </div>
            </div>
            <div class="video-card">
              <div class="video-thumbnail">▶️</div>
              <div class="video-info">
                <h3>Using Your Digital Notebook</h3>
                <span class="duration">5 min</span>
              </div>
            </div>
          </div>
        </div>

        <div class="help-section">
          <h2>Frequently Asked Questions</h2>
          <div class="faq-list">
            <details class="faq-item">
              <summary>How do I earn badges?</summary>
              <p>
                You earn badges by completing missions and passing the quizzes with a score of 70%
                or higher.
              </p>
            </details>
            <details class="faq-item">
              <summary>Can I retake a quiz?</summary>
              <p>Yes! You can retake quizzes as many times as you need to pass.</p>
            </details>
            <details class="faq-item">
              <summary>Where is my notebook saved?</summary>
              <p>Your notebook is automatically saved to your OneNote account.</p>
            </details>
          </div>
        </div>

        <div class="help-section contact-form">
          <h2>Need More Help?</h2>
          <p>Send a message to your teacher.</p>
          <form>
            <div class="form-group">
              <label>What do you need help with?</label>
              <select>
                <option>I can't log in</option>
                <option>Video won't play</option>
                <option>I lost my progress</option>
                <option>Other</option>
              </select>
            </div>
            <div class="form-group">
              <label>Describe the problem</label>
              <textarea rows="4"></textarea>
            </div>
            <button type="button" class="btn-submit">Send Help Request</button>
          </form>
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

      .help-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
      }
      .help-section {
        background: white;
        padding: 2rem;
        border-radius: 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }
      h2 {
        margin-top: 0;
        margin-bottom: 1.5rem;
        color: #333;
        font-size: 1.25rem;
        border-bottom: 2px solid #eee;
        padding-bottom: 0.5rem;
      }

      .video-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .video-card {
        display: flex;
        gap: 1rem;
        align-items: center;
        padding: 1rem;
        border: 1px solid #eee;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s;
      }
      .video-card:hover {
        background: #f9f9f9;
        border-color: #00bcf2;
      }
      .video-thumbnail {
        font-size: 2rem;
        width: 60px;
        height: 40px;
        background: #eee;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
      }
      .video-info h3 {
        margin: 0 0 0.25rem 0;
        font-size: 1rem;
        color: #333;
      }
      .duration {
        font-size: 0.85rem;
        color: #888;
      }

      .faq-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .faq-item {
        border: 1px solid #eee;
        border-radius: 12px;
        padding: 1rem;
      }
      .faq-item summary {
        font-weight: 600;
        color: #333;
        cursor: pointer;
      }
      .faq-item p {
        margin: 1rem 0 0 0;
        color: #666;
        line-height: 1.5;
      }

      .form-group {
        margin-bottom: 1.5rem;
      }
      .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: #555;
      }
      select,
      textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-family: inherit;
      }
      .btn-submit {
        width: 100%;
        background: #00bcf2;
        color: white;
        border: none;
        padding: 0.75rem;
        border-radius: 8px;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.2s;
      }
      .btn-submit:hover {
        background: #00a0d1;
      }
    `,
  ],
})
export class StudentHelpComponent {}
