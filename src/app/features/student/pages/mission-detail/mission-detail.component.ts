import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StudentMissionsService } from '../../services/student-missions.service';
import { LearningResourceDto } from '../../models/student-api.models';
import { environment } from '../../../../config/environment';

@Component({
  selector: 'app-mission-detail',
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mission-detail" aria-live="polite">
      <!-- Back Button -->
      <a routerLink="/student/missions" class="back-link">← Back to Missions</a>

      @if (missionsService.isLoadingData()) {
      <div class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading mission...</span>
        </div>
      </div>
      } @else if (!mission()) {
      <div class="text-center py-5">
        <h2>Mission not found</h2>
        <p class="text-muted">We couldn't find this mission. Please go back and try another one.</p>
      </div>
      } @else {
      <!-- Hero Section -->
      <header class="mission-hero">
        <div class="hero-icon">{{ mission()?.Icon || '🛡️' }}</div>
        <div class="hero-content">
          <div class="badges">
            <span
              class="status-badge"
              [class.in-progress]="mission()?.Status === 'in-progress'"
              [class.completed]="mission()?.Status === 'completed'"
            >
              {{
                mission()?.Status === 'completed'
                  ? 'Completed'
                  : mission()?.Status === 'in-progress'
                  ? 'In Progress'
                  : 'Locked'
              }}
            </span>
            <span class="time-badge"> ⏱️ {{ mission()?.Progress || 0 }}% complete </span>
          </div>
          <h1>{{ mission()?.Title }}</h1>
          <p>{{ mission()?.Description }}</p>
          <div class="progress-section">
            <div class="progress-text">
              <span>Task Completion: {{ completedTasks() }} / {{ totalTasks() }}</span>
              <span>{{ mission()?.Progress || 0 }}%</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" [style.width.%]="mission()?.Progress || 0"></div>
            </div>
          </div>
        </div>
        <div class="hero-reward">
          <div class="reward-label">REWARD</div>
          <div class="reward-icon">🏆</div>
          <div class="reward-name">{{ mission()?.Badge }}</div>
        </div>
      </header>

      <div class="content-grid">
        <div class="main-content">
          <!-- Mission Checklist Card (The "Simple way to track" request) -->
          <div class="checklist-card">
            <div class="card-header">
              <h2>📋 Mission Checklist</h2>
              <span class="tasks-remaining"
                >{{ totalTasks() - completedTasks() }} tasks remaining</span
              >
            </div>
            <div class="checklist-items">
              @for (activity of mission()!.Activities; track activity.Id) {
              <div class="checklist-item" [class.done]="activity.Completed">
                <span class="check-icon">{{ activity.Completed ? '✅' : '⭕' }}</span>
                <span class="item-text">Activity: {{ activity.Title }}</span>
                @if (!activity.Completed) {
                <span class="item-tag required">Required</span>
                } @else {
                <span class="item-tag done">Completed</span>
                }
              </div>
              } @for (resource of mission()!.Resources; track resource.Id) { @if
              (resource.IsRequired) {
              <div class="checklist-item resource-check">
                <span class="check-icon">📚</span>
                <span class="item-text">Resource: {{ resource.Title }}</span>
                <span class="item-tag required">Review Required</span>
              </div>
              } }
            </div>
          </div>

          <!-- Activities List -->
          <div class="activities-list">
            <div class="header-with-action">
              <h2>Mission Activities</h2>
            </div>

            @if (mission()?.Activities && mission()!.Activities.length > 0) { @for (activity of
            mission()!.Activities; track activity.Id) { @let isNextTask = !activity.Completed &&
            (mission()!.Activities[$index - 1]?.Completed ?? true);
            <div
              class="activity-item"
              [class.completed]="activity.Completed"
              [class.active]="isNextTask"
            >
              <div class="activity-status">
                {{ activity.Completed ? '✅' : isNextTask ? '🎯' : activity.Order }}
              </div>
              <div class="activity-info">
                <h3>{{ activity.Order }}. {{ activity.Title }}</h3>
                <p>{{ activity.Content }}</p>
                @if (isNextTask) {
                <span class="next-label">Next Task</span>
                }
              </div>
              <button
                class="btn-action"
                [class.secondary]="activity.Completed"
                [class.primary]="!activity.Completed"
                type="button"
                [routerLink]="['/student/missions', mission()?.Id, 'activity', activity.Id]"
              >
                {{ activity.Completed ? 'Review' : isNextTask ? 'Continue' : 'Start Activity' }}
              </button>
            </div>
            } } @else {
            <p class="text-muted">No activities defined for this mission yet.</p>
            }
          </div>
        </div>

        <!-- Sidebar Info -->
        <aside class="mission-sidebar">
          <div class="sidebar-card">
            <h3>What You'll Learn</h3>
            <ul class="learning-list">
              <li>{{ mission()?.Description }}</li>
            </ul>
          </div>

          <div class="sidebar-card teacher-note">
            <h3>Teacher's Note 👨‍🏫</h3>
            <p>
              Complete all activities to earn the <strong>{{ mission()?.Badge }}</strong> badge.
            </p>
          </div>

          @if (mission()?.Resources && mission()!.Resources.length > 0) {
          <div class="sidebar-card resources-card">
            <h3>📚 Learning Resources</h3>
            <ul class="resources-list">
              @for (resource of mission()!.Resources; track resource.Id) { @if (resource.Type ===
              'video' && isDirectVideoFile(resource.Url)) {
              <li class="resource-item video-resource">
                <div class="resource-video-header">
                  <span class="resource-icon">{{ getResourceIcon(resource.Type) }}</span>
                  <div class="resource-content">
                    <div class="resource-title">
                      {{ resource.Title }}
                      @if (resource.IsRequired) {
                      <span class="required-dot" title="Required"></span> }
                    </div>
                  </div>
                </div>
                <div class="resource-video-container">
                  <video
                    [src]="resolveUrl(resource.Url)"
                    controls
                    class="resource-video-player"
                    [title]="resource.Title"
                  ></video>
                </div>
              </li>
              } @else if (resource.Type === 'pdf' && isDirectPdfFile(resource.Url)) {
              <li class="resource-item pdf-resource">
                <div class="resource-pdf-header">
                  <span class="resource-icon">{{ getResourceIcon(resource.Type) }}</span>
                  <div class="resource-content">
                    <div class="resource-title">
                      {{ resource.Title }}
                      @if (resource.IsRequired) {
                      <span class="required-dot" title="Required"></span> }
                    </div>
                  </div>
                </div>
                <div class="resource-pdf-container">
                  <iframe
                    [src]="getSafeUrl(resource.Url)"
                    class="resource-pdf-viewer"
                    type="application/pdf"
                  ></iframe>
                </div>
                <button (click)="previewResource(resource)" class="btn-fullscreen-res">
                  Expand to Full Screen ⤢
                </button>
              </li>
              } @else {
              <li class="resource-item">
                <button
                  type="button"
                  (click)="previewResource(resource)"
                  class="resource-link"
                  [class.required-border]="resource.IsRequired"
                >
                  <span class="resource-icon">{{ getResourceIcon(resource.Type) }}</span>
                  <div class="resource-content">
                    <div class="resource-title">
                      {{ resource.Title }}
                      @if (resource.IsRequired) { <span class="badge-required">REQUIRED</span> }
                    </div>
                  </div>
                  <span class="resource-external-icon">👁️</span>
                </button>
              </li>
              } }
            </ul>
          </div>
          }
        </aside>
      </div>
      }

      <!-- Resource Preview Modal -->
      @if (selectedResource()) {
      <div class="resource-modal-overlay" (click)="closePreview()">
        <div class="resource-modal-container" (click)="$event.stopPropagation()">
          <header class="modal-header">
            <div class="modal-title-group">
              <span class="modal-type-icon">{{ getResourceIcon(selectedResource()!.Type) }}</span>
              <div class="modal-text">
                <h2>{{ selectedResource()!.Title }}</h2>
                <span class="modal-subtitle">Resource Preview</span>
              </div>
            </div>
            <button class="modal-close-btn" (click)="closePreview()">×</button>
          </header>

          <div class="modal-view-body">
            @if (selectedResource()!.Type === 'video') { @if
            (isDirectVideoFile(selectedResource()!.Url)) {
            <video
              [src]="resolveUrl(selectedResource()!.Url)"
              controls
              autoplay
              class="premium-player"
            ></video>
            } @else {
            <iframe
              [src]="getSafeUrl(selectedResource()!.Url)"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
            } } @else {
            <iframe [src]="getSafeUrl(selectedResource()!.Url)" frameborder="0"></iframe>
            }
          </div>

          <footer class="modal-footer">
            <a
              [href]="resolveUrl(selectedResource()!.Url)"
              target="_blank"
              rel="noopener noreferrer"
              class="modal-external-btn"
            >
              Open in New Window ↗
            </a>
          </footer>
        </div>
      </div>
      }
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
      .status-badge.completed {
        background: #dcfce7;
        color: #15803d;
      }
      .status-badge.in-progress {
        background: #e0f2fe;
        color: #0369a1;
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
        transition: width 0.5s ease-out;
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
        grid-template-columns: 2.5fr 1fr;
        gap: 2rem;
      }

      /* Checklist Card */
      .checklist-card {
        background: #ffffff;
        border-radius: 24px;
        padding: 2rem;
        margin-bottom: 2rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        border: 1px solid #eef2f6;
      }
      .checklist-card .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
      }
      .checklist-card h2 {
        margin: 0;
        font-size: 1.5rem;
        color: #1e293b;
      }
      .tasks-remaining {
        background: #f1f5f9;
        color: #475569;
        padding: 0.4rem 0.8rem;
        border-radius: 12px;
        font-size: 0.85rem;
        font-weight: 600;
      }
      .checklist-items {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1rem;
      }
      .checklist-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 16px;
        border: 1px solid #e2e8f0;
        transition: all 0.2s;
      }
      .checklist-item.done {
        background: #f0fdf4;
        border-color: #dcfce7;
      }
      .item-text {
        flex: 1;
        font-size: 0.95rem;
        color: #334155;
        font-weight: 500;
      }
      .checklist-item.done .item-text {
        color: #15803d;
        text-decoration: line-through;
        opacity: 0.7;
      }
      .item-tag {
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        padding: 0.2rem 0.5rem;
        border-radius: 6px;
      }
      .item-tag.required {
        background: #fee2e2;
        color: #b91c1c;
      }
      .item-tag.done {
        background: #dcfce7;
        color: #15803d;
      }

      .activities-list {
        background: white;
        padding: 2rem;
        border-radius: 24px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }
      .header-with-action {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
      }
      .activities-list h2 {
        margin: 0;
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
      .next-label {
        display: inline-block;
        background: #00bcf2;
        color: white;
        font-size: 0.7rem;
        font-weight: 700;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        text-transform: uppercase;
        margin-top: 0.25rem;
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

      /* Sidebar & Resources */
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
      .resources-card {
        background: #f0f7ff;
        border: 1px solid #b3d9ff;
      }
      .resources-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .resource-item {
        margin-bottom: 1rem;
      }
      .resource-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem;
        background: white;
        border-radius: 8px;
        text-decoration: none;
        color: #333;
        transition: all 0.2s;
        border: 1px solid #e9ecef;
        width: 100%;
        text-align: left;
        cursor: pointer;
        font-family: inherit;
      }
      .resource-link.required-border {
        border-left: 4px solid #ef4444;
      }
      .badge-required {
        background: #fee2e2;
        color: #dc2626;
        font-size: 0.65rem;
        font-weight: 800;
        padding: 0.1rem 0.4rem;
        border-radius: 4px;
        margin-left: 0.5rem;
      }
      .required-dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        background: #ef4444;
        border-radius: 50%;
        margin-left: 6px;
      }
      .resource-link:hover {
        background: #e6f8fd;
        border-color: #00bcf2;
        transform: translateX(3px);
      }
      .resource-video-header,
      .resource-pdf-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.75rem;
      }
      .resource-video-container {
        position: relative;
        width: 100%;
        padding-bottom: 56.25%; /* 16:9 aspect ratio */
        background: #000;
        border-radius: 8px;
        overflow: hidden;
      }
      .resource-video-player {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      .resource-pdf-container {
        position: relative;
        width: 100%;
        height: 400px;
        background: #f8f9fa;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid #e9ecef;
      }
      .resource-pdf-viewer {
        width: 100%;
        height: 100%;
        border: none;
        background: white;
      }
      .btn-fullscreen-res {
        width: 100%;
        margin-top: 0.5rem;
        padding: 0.5rem;
        background: #e0f2fe;
        color: #0369a1;
        border: none;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
      }

      /* Premium Modal Styles */
      .resource-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(15, 23, 42, 0.8);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 2rem;
      }
      .resource-modal-container {
        background: #ffffff;
        width: 100%;
        max-width: 1100px;
        height: 90vh;
        border-radius: 24px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      }
      .modal-header {
        padding: 1.25rem 2rem;
        background: #f8fafc;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .modal-title-group {
        display: flex;
        align-items: center;
        gap: 1.25rem;
      }
      .modal-type-icon {
        font-size: 2rem;
        background: #e0f2fe;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
      }
      .modal-text h2 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 700;
        color: #0f172a;
      }
      .modal-subtitle {
        font-size: 0.85rem;
        color: #64748b;
      }
      .modal-close-btn {
        background: transparent;
        border: none;
        font-size: 2.5rem;
        color: #94a3b8;
        cursor: pointer;
        line-height: 1;
      }
      .modal-view-body {
        flex: 1;
        background: #0f172a;
        position: relative;
        overflow: hidden;
      }
      .modal-view-body iframe,
      .modal-view-body video {
        width: 100%;
        height: 100%;
        border: none;
      }
      .premium-player {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      .modal-footer {
        padding: 1rem 2rem;
        background: white;
        border-top: 1px solid #e2e8f0;
        display: flex;
        justify-content: flex-end;
      }
      .modal-external-btn {
        background: #00bcf2;
        color: white;
        text-decoration: none;
        padding: 0.6rem 1.25rem;
        border-radius: 10px;
        font-weight: 600;
        font-size: 0.9rem;
      }

      @media (max-width: 900px) {
        .content-grid {
          grid-template-columns: 1fr;
        }
        .checklist-items {
          grid-template-columns: 1fr;
        }
        .mission-hero {
          flex-direction: column;
          text-align: center;
          padding: 2rem;
        }
        .hero-reward {
          width: 100%;
        }
      }
    `,
  ],
})
export class MissionDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);
  missionsService = inject(StudentMissionsService);

  mission = computed(() => this.missionsService.getCurrentMission());
  selectedResource = signal<LearningResourceDto | null>(null);

  // Computed task statistics
  totalTasks = computed(() => {
    const m = this.mission();
    if (!m) return 0;
    const activityCount = m.Activities?.length || 0;
    const requiredResourcesCount = m.Resources?.filter((r) => r.IsRequired).length || 0;
    return activityCount + requiredResourcesCount;
  });

  completedTasks = computed(() => {
    const m = this.mission();
    if (!m) return 0;
    const completedActivities = m.Activities?.filter((a) => a.Completed).length || 0;
    // Note: Since we don't track resources yet, they aren't "completed" in the data sense
    // but they are shown in the total count to represent the required workload.
    return completedActivities;
  });

  ngOnInit(): void {
    const missionId = this.route.snapshot.params['id'] as string;
    if (missionId) {
      this.missionsService.loadMissionDetails(missionId);
    } else {
      console.error('Missing mission id in route');
    }
  }

  previewResource(resource: LearningResourceDto): void {
    this.selectedResource.set(resource);
    document.body.style.overflow = 'hidden';
  }

  closePreview(): void {
    this.selectedResource.set(null);
    document.body.style.overflow = '';
  }

  getSafeUrl(url: string | undefined): SafeResourceUrl {
    if (!url) return this.sanitizer.bypassSecurityTrustResourceUrl('');

    // Resolve relative paths first
    const fullUrl = this.resolveUrl(url);

    let finalUrl = fullUrl;
    if (fullUrl.includes('youtube.com/watch?v=')) {
      finalUrl = fullUrl.replace('watch?v=', 'embed/');
    } else if (fullUrl.includes('youtu.be/')) {
      finalUrl = fullUrl.replace('youtu.be/', 'youtube.com/embed/');
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(finalUrl);
  }

  /**
   * Resolve URL to absolute path if it starts with /
   */
  resolveUrl(url: string | undefined): string {
    if (!url) return '';
    if (url.startsWith('/')) {
      return `${environment.apiUrl}${url}`;
    }
    return url;
  }

  getResourceIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'video':
        return '📹';
      case 'article':
        return '📄';
      case 'interactive':
        return '🎮';
      case 'pdf':
        return '📕';
      default:
        return '🔗';
    }
  }

  isDirectVideoFile(url: string | undefined): boolean {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.m4v'];
    const lowerUrl = url.toLowerCase();
    return videoExtensions.some((ext) => lowerUrl.endsWith(ext));
  }

  isDirectPdfFile(url: string | undefined): boolean {
    if (!url) return false;
    const lowerUrl = url.toLowerCase();
    return lowerUrl.endsWith('.pdf');
  }
}
