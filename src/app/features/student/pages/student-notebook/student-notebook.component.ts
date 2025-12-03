import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-notebook',
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <header class="page-header">
        <div class="header-icon">📓</div>
        <div class="header-content">
          <h1>My Digital Notebook</h1>
          <p>Your personal space for reflections, notes, and creative work.</p>
        </div>
        <button class="btn-open-external">Open in OneNote ↗</button>
      </header>

      <div class="notebook-frame-container">
        <div class="placeholder-content">
          <div class="placeholder-icon">📝</div>
          <h2>OneNote Integration</h2>
          <p>This area will display your embedded Class Notebook.</p>
          <p class="sub-text">
            In a real deployment, this would be an iframe connecting to Microsoft Graph API.
          </p>
          <button class="btn-simulate">Simulate Loading Notebook</button>
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
        height: calc(100vh - 100px);
        display: flex;
        flex-direction: column;
      }
      .page-header {
        display: flex;
        gap: 1.5rem;
        align-items: center;
        margin-bottom: 1.5rem;
        background: white;
        padding: 1.5rem 2rem;
        border-radius: 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }
      .header-icon {
        font-size: 2.5rem;
        background: #7719aa;
        color: white;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
      }
      .header-content {
        flex: 1;
      }
      h1 {
        margin: 0 0 0.25rem 0;
        color: #333;
        font-size: 1.5rem;
      }
      p {
        margin: 0;
        color: #666;
        font-size: 1rem;
      }

      .btn-open-external {
        background: #7719aa;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
      }
      .btn-open-external:hover {
        background: #60148a;
      }

      .notebook-frame-container {
        flex: 1;
        background: white;
        border-radius: 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #f0f0f0;
      }

      .placeholder-content {
        text-align: center;
        max-width: 400px;
        padding: 2rem;
      }
      .placeholder-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
        opacity: 0.5;
      }
      h2 {
        color: #333;
        margin-bottom: 1rem;
      }
      .sub-text {
        color: #888;
        font-size: 0.9rem;
        margin-top: 0.5rem;
        margin-bottom: 2rem;
      }

      .btn-simulate {
        background: white;
        border: 2px solid #7719aa;
        color: #7719aa;
        padding: 0.75rem 1.5rem;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
      }
      .btn-simulate:hover {
        background: #7719aa;
        color: white;
      }
    `,
  ],
})
export class StudentNotebookComponent {}
