import { Component, input, output, signal, ChangeDetectionStrategy, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MissionActivityDto } from '../../models/student-api.models';

@Component({
  selector: 'app-video-activity',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="video-activity">
      <div class="video-header">
        <h2>{{ activity().Title }}</h2>
        <p class="video-description">{{ activity().Content }}</p>
      </div>

      <div class="video-container">
        @if (isDirectVideoFile()) {
          <!-- HTML5 Video Player for direct video files -->
          <video
            [src]="getDirectVideoUrl()"
            controls
            (loadedmetadata)="onVideoLoad()"
            (play)="onVideoPlay()"
            (ended)="onVideoEnded()"
            title="Activity Video"
            class="video-player"
          >
            Your browser does not support the video tag.
          </video>
        } @else if (videoUrl()) {
          <!-- Embedded iframe for external videos (YouTube, Vimeo, etc.) -->
          <iframe
            [src]="videoUrl()"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            (load)="onVideoLoad()"
            title="Activity Video"
          ></iframe>
        } @else {
          <div class="video-placeholder">
            <i class="fas fa-video fa-3x"></i>
            <p>No video URL provided</p>
          </div>
        }
      </div>

      @if (watched()) {
        <div class="completion-notice" role="status">
          <i class="fas fa-check-circle"></i>
          <span>Video loaded! You can now mark this activity as complete.</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .video-activity {
      width: 100%;
    }

    .video-header {
      margin-bottom: 1.5rem;
    }

    .video-header h2 {
      font-size: 1.75rem;
      color: #333;
      margin: 0 0 0.5rem 0;
    }

    .video-description {
      color: #666;
      font-size: 1rem;
      margin: 0;
    }

    .video-container {
      position: relative;
      width: 100%;
      padding-bottom: 56.25%; /* 16:9 aspect ratio */
      background: #000;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .video-container iframe,
    .video-container video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .video-player {
      object-fit: contain;
      background: #000;
    }

    .video-placeholder {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #999;
      gap: 1rem;
    }

    .completion-notice {
      margin-top: 1.5rem;
      padding: 1rem 1.5rem;
      background: #d4edda;
      border: 1px solid #c3e6cb;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #155724;
    }

    .completion-notice i {
      font-size: 1.25rem;
      color: #28a745;
    }

    @media (max-width: 768px) {
      .video-header h2 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class VideoActivityComponent {
  activity = input.required<MissionActivityDto>();
  completed = output<void>();
  
  private sanitizer = inject(DomSanitizer);
  watched = signal(false);
  videoPlayed = signal(false);

  videoUrl = signal<SafeResourceUrl | null>(null);
  directVideoUrl = signal<string | null>(null);

  // Common video file extensions
  private readonly videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.m4v'];

  constructor() {
    // Watch for activity changes to extract video URL
    effect(() => {
      const act = this.activity();
      if (act?.Content) {
        this.extractVideoUrl(act.Content);
      }
    });
  }

  /**
   * Check if the URL is a direct video file (not external embed)
   */
  isDirectVideoFile(): boolean {
    return this.directVideoUrl() !== null;
  }

  /**
   * Get the direct video URL for HTML5 video player
   */
  getDirectVideoUrl(): string {
    return this.directVideoUrl() || '';
  }

  private extractVideoUrl(content: string): void {
    // Reset signals
    this.videoUrl.set(null);
    this.directVideoUrl.set(null);

    let url = content.trim();
    if (!url) return;

    // Check if it's a direct video file (ends with video extension)
    const lowerUrl = url.toLowerCase();
    const isDirectVideo = this.videoExtensions.some(ext => lowerUrl.endsWith(ext));

    if (isDirectVideo) {
      // It's a direct video file - use HTML5 video player
      this.directVideoUrl.set(url);
      return;
    }

    // Check if it's a YouTube URL
    if (url.includes('youtube.com/watch')) {
      const videoId = new URL(url).searchParams.get('v');
      if (videoId) {
        url = `https://www.youtube.com/embed/${videoId}`;
      }
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) {
        url = `https://www.youtube.com/embed/${videoId}`;
      }
    } else if (url.includes('vimeo.com/')) {
      // Support Vimeo URLs
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      if (videoId) {
        url = `https://player.vimeo.com/video/${videoId}`;
      }
    }

    // For external embeds, sanitize and set the URL
    if (url && !isDirectVideo) {
      this.videoUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url) as SafeResourceUrl);
    }
  }

  onVideoLoad(): void {
    // Mark as watched when video loads (for both iframe and HTML5 video)
    setTimeout(() => {
      this.watched.set(true);
    }, 1000);
  }

  onVideoPlay(): void {
    // Track when video starts playing
    this.videoPlayed.set(true);
    this.watched.set(true);
  }

  onVideoEnded(): void {
    // Video completed - ensure watched is set
    this.watched.set(true);
    this.videoPlayed.set(true);
  }
}

