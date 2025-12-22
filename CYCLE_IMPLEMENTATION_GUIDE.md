# Quick Implementation Guide: Complete the Mission Cycle

This guide provides **step-by-step instructions** to implement the missing pieces and complete the student mission cycle.

---

## 🎯 Goal
Enable students to:
1. Login ✅
2. View missions ✅
3. Click on a mission ✅
4. **Start an activity** ❌ ← We'll build this
5. **Complete the activity** ❌ ← We'll build this
6. **See progress update** ❌ ← We'll build this
7. **Earn badge when done** ❌ ← We'll build this

---

## 📋 Implementation Checklist

### Step 1: Create Mission Activity Component (30 min)

Create the main activity executor component:

```bash
# Create the component file
touch src/app/features/student/pages/mission-activity/mission-activity.component.ts
```

**File content**: See implementation below (Section: Component Code)

### Step 2: Create Activity Type Components (2 hours)

Create specialized components for each activity type:

```bash
mkdir -p src/app/features/student/components/activities
touch src/app/features/student/components/activities/video-activity.component.ts
touch src/app/features/student/components/activities/quiz-activity.component.ts
touch src/app/features/student/components/activities/reading-activity.component.ts
touch src/app/features/student/components/activities/interactive-activity.component.ts
```

### Step 3: Add Route Configuration (5 min)

Edit `src/app/features/student/student.routes.ts`:

```typescript
import { MissionActivityComponent } from './pages/mission-activity/mission-activity.component';

// Add this route to the children array:
{ 
  path: 'missions/:missionId/activity/:activityId', 
  component: MissionActivityComponent 
}
```

### Step 4: Wire Mission Detail Component (10 min)

Edit `src/app/features/student/pages/mission-detail/mission-detail.component.ts`:

Add this method and update the button.

### Step 5: Create Toast Service (30 min)

Create badge notification system:

```bash
touch src/app/shared/services/toast.service.ts
touch src/app/shared/components/badge-earned-modal.component.ts
```

### Step 6: Test Backend Endpoints (30 min)

Before testing frontend, verify backend is ready:

```bash
# Test missions endpoint
curl http://localhost:5245/Student/Missions \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test mission detail
curl http://localhost:5245/Student/Missions/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Step 7: End-to-End Testing (30 min)

1. Login as student
2. Navigate to missions
3. Click on a mission
4. Click "Start Activity"
5. Complete the activity
6. Verify progress updates
7. Complete all activities
8. Verify badge is earned

---

## 💻 Complete Component Code

### 1. MissionActivityComponent

```typescript
// src/app/features/student/pages/mission-activity/mission-activity.component.ts
import { Component, OnInit, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { StudentMissionsService } from '../../services/student-missions.service';
import { MissionActivityDto } from '../../models/student-api.models';
import { VideoActivityComponent } from '../../components/activities/video-activity.component';
import { QuizActivityComponent } from '../../components/activities/quiz-activity.component';
import { ReadingActivityComponent } from '../../components/activities/reading-activity.component';
import { InteractiveActivityComponent } from '../../components/activities/interactive-activity.component';

@Component({
  selector: 'app-mission-activity',
  imports: [
    CommonModule, 
    RouterLink, 
    VideoActivityComponent, 
    QuizActivityComponent, 
    ReadingActivityComponent, 
    InteractiveActivityComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="activity-container">
      <!-- Back Navigation -->
      <div class="activity-header">
        <button 
          [routerLink]="['/student/missions', missionId()]" 
          class="back-btn"
        >
          ← Back to Mission
        </button>
        <div class="activity-progress">
          Activity {{ activityOrder() }} of {{ totalActivities() }}
        </div>
      </div>

      @if (isLoading()) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading activity...</span>
          </div>
        </div>
      } @else if (!activity()) {
        <div class="text-center py-5">
          <h2>Activity not found</h2>
          <p class="text-muted">This activity could not be loaded.</p>
        </div>
      } @else {
        <!-- Activity Title -->
        <div class="activity-title-section">
          <h1>{{ activity()?.Title }}</h1>
          @if (activity()?.Completed) {
            <span class="completed-badge">✅ Completed</span>
          }
        </div>

        <!-- Activity Content Based on Type -->
        <div class="activity-content">
          @switch (activity()?.Type) {
            @case ('video') {
              <app-video-activity 
                [activity]="activity()!" 
                (completed)="onActivityCompleted($event)"
              />
            }
            @case ('quiz') {
              <app-quiz-activity 
                [activity]="activity()!" 
                (completed)="onActivityCompleted($event)"
              />
            }
            @case ('reading') {
              <app-reading-activity 
                [activity]="activity()!" 
                (completed)="onActivityCompleted($event)"
              />
            }
            @case ('interactive') {
              <app-interactive-activity 
                [activity]="activity()!" 
                (completed)="onActivityCompleted($event)"
              />
            }
            @default {
              <p>Unsupported activity type: {{ activity()?.Type }}</p>
            }
          }
        </div>

        <!-- Action Buttons -->
        <div class="activity-actions">
          @if (!activity()?.Completed) {
            <button 
              class="btn btn-primary btn-lg"
              (click)="markComplete()"
              [disabled]="isSubmitting()"
            >
              {{ isSubmitting() ? 'Saving...' : 'Mark as Complete' }}
            </button>
          } @else {
            <button 
              class="btn btn-success btn-lg"
              [routerLink]="['/student/missions', missionId()]"
            >
              Back to Mission
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .activity-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
    }
    .activity-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .back-btn {
      background: white;
      border: 1px solid #ddd;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }
    .back-btn:hover {
      background: #f5f5f5;
      border-color: #00bcf2;
    }
    .activity-progress {
      font-size: 0.9rem;
      color: #666;
      font-weight: 600;
    }
    .activity-title-section {
      background: white;
      padding: 2rem;
      border-radius: 16px;
      margin-bottom: 2rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    h1 {
      margin: 0;
      color: #333;
      font-size: 1.75rem;
    }
    .completed-badge {
      background: #e6ffec;
      color: #107c10;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 700;
      font-size: 0.9rem;
    }
    .activity-content {
      background: white;
      padding: 2rem;
      border-radius: 16px;
      margin-bottom: 2rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      min-height: 400px;
    }
    .activity-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }
    .btn {
      padding: 1rem 2rem;
      border-radius: 10px;
      font-weight: 700;
      font-size: 1rem;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-primary {
      background: #00bcf2;
      color: white;
    }
    .btn-primary:hover:not(:disabled) {
      background: #00a0d1;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 188, 242, 0.3);
    }
    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .btn-success {
      background: #107c10;
      color: white;
    }
    .btn-success:hover {
      background: #0d6b0d;
    }
  `]
})
export class MissionActivityComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private missionsService = inject(StudentMissionsService);

  // Signals
  missionId = signal<string>('');
  activityId = signal<string>('');
  activity = signal<MissionActivityDto | null>(null);
  isLoading = signal(false);
  isSubmitting = signal(false);
  activityOrder = signal(0);
  totalActivities = signal(0);

  ngOnInit(): void {
    // Get route params
    this.missionId.set(this.route.snapshot.params['missionId']);
    this.activityId.set(this.route.snapshot.params['activityId']);

    // Load mission details to get activity info
    this.loadActivity();
  }

  private loadActivity(): void {
    this.isLoading.set(true);
    const missionId = this.missionId();
    const activityId = this.activityId();

    // First ensure mission is loaded
    this.missionsService.loadMissionDetails(missionId);

    // Subscribe to mission changes to extract activity
    // In a production app, you might have a separate endpoint for single activity
    setTimeout(() => {
      const mission = this.missionsService.getCurrentMission();
      if (mission && mission.Activities) {
        const foundActivity = mission.Activities.find(
          a => a.Id.toString() === activityId
        );
        
        if (foundActivity) {
          this.activity.set(foundActivity);
          this.activityOrder.set(foundActivity.Order);
          this.totalActivities.set(mission.Activities.length);
        }
      }
      this.isLoading.set(false);
    }, 500); // Small delay to let service load
  }

  onActivityCompleted(data: any): void {
    console.log('Activity completed with data:', data);
    // Could auto-save here if desired
  }

  markComplete(): void {
    const activity = this.activity();
    const missionId = this.missionId();
    
    if (!activity || !missionId) return;

    this.isSubmitting.set(true);

    this.missionsService.updateMissionProgress({
      MissionId: parseInt(missionId),
      ActivityId: activity.Id,
      Completed: true,
      ActivityData: {} // Could include quiz answers, etc.
    });

    // Wait for service to complete, then navigate back
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.router.navigate(['/student/missions', missionId]);
    }, 1000);
  }
}
```

---

### 2. Reading Activity Component (Simplest)

```typescript
// src/app/features/student/components/activities/reading-activity.component.ts
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MissionActivityDto } from '../../models/student-api.models';

@Component({
  selector: 'app-reading-activity',
  imports: [CommonModule],
  template: `
    <div class="reading-activity">
      <div class="content" [innerHTML]="activity().Content"></div>
      
      @if (!activity().Completed) {
        <div class="reading-confirmation">
          <label>
            <input 
              type="checkbox" 
              [(ngModel)]="hasRead"
              (change)="onReadChange()"
            />
            I have read and understood this content
          </label>
        </div>
      }
    </div>
  `,
  styles: [`
    .reading-activity {
      line-height: 1.8;
      color: #333;
    }
    .content {
      margin-bottom: 2rem;
    }
    .reading-confirmation {
      background: #f5f5f5;
      padding: 1rem;
      border-radius: 8px;
      margin-top: 2rem;
    }
    .reading-confirmation label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-weight: 600;
    }
  `]
})
export class ReadingActivityComponent {
  activity = input.required<MissionActivityDto>();
  completed = output<{ hasRead: boolean }>();

  hasRead = false;

  onReadChange(): void {
    if (this.hasRead) {
      this.completed.emit({ hasRead: true });
    }
  }
}
```

---

### 3. Video Activity Component

```typescript
// src/app/features/student/components/activities/video-activity.component.ts
import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MissionActivityDto } from '../../models/student-api.models';

@Component({
  selector: 'app-video-activity',
  imports: [CommonModule],
  template: `
    <div class="video-activity">
      @if (videoUrl()) {
        <div class="video-container">
          <iframe 
            [src]="videoUrl()"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            (load)="onVideoLoad()"
          ></iframe>
        </div>
      } @else {
        <div class="video-placeholder">
          <p>📹 Video content will appear here</p>
          <small>URL: {{ activity().Content }}</small>
        </div>
      }

      <div class="video-description">
        <h3>About this video</h3>
        <p [innerHTML]="activity().Content"></p>
      </div>

      @if (hasWatched()) {
        <div class="watched-indicator">
          ✅ Video watched
        </div>
      }
    </div>
  `,
  styles: [`
    .video-activity {
      max-width: 800px;
      margin: 0 auto;
    }
    .video-container {
      position: relative;
      padding-bottom: 56.25%; /* 16:9 aspect ratio */
      height: 0;
      overflow: hidden;
      border-radius: 12px;
      background: #000;
    }
    .video-container iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .video-placeholder {
      padding: 4rem;
      text-align: center;
      background: #f5f5f5;
      border-radius: 12px;
      color: #666;
    }
    .video-description {
      margin-top: 1.5rem;
      padding: 1rem;
      background: #f9f9f9;
      border-radius: 8px;
    }
    .video-description h3 {
      margin-top: 0;
      color: #333;
    }
    .watched-indicator {
      margin-top: 1rem;
      padding: 0.75rem;
      background: #e6ffec;
      color: #107c10;
      border-radius: 8px;
      text-align: center;
      font-weight: 600;
    }
  `]
})
export class VideoActivityComponent {
  activity = input.required<MissionActivityDto>();
  completed = output<{ watched: boolean }>();

  videoUrl = signal<string>('');
  hasWatched = signal(false);

  ngOnInit(): void {
    // Extract video URL from content
    // Could be direct URL or embedded HTML
    const content = this.activity().Content;
    if (content.includes('youtube.com') || content.includes('youtu.be')) {
      this.videoUrl.set(this.extractYouTubeUrl(content));
    }
  }

  private extractYouTubeUrl(content: string): string {
    // Simple extraction - enhance as needed
    const match = content.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return '';
  }

  onVideoLoad(): void {
    // Mark as watched after video loads
    setTimeout(() => {
      this.hasWatched.set(true);
      this.completed.emit({ watched: true });
    }, 3000); // Simulate minimum watch time
  }
}
```

---

### 4. Quiz Activity Component

```typescript
// src/app/features/student/components/activities/quiz-activity.component.ts
import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MissionActivityDto } from '../../models/student-api.models';

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

@Component({
  selector: 'app-quiz-activity',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="quiz-activity">
      @if (!quizCompleted()) {
        <div class="quiz-intro">
          <h3>{{ quizData().title || 'Quiz Time!' }}</h3>
          <p>Answer all questions to complete this activity.</p>
        </div>

        @for (question of quizData().questions; track $index) {
          <div class="quiz-question">
            <h4>{{ $index + 1 }}. {{ question.question }}</h4>
            
            @for (option of question.options; track optIdx; let optIdx = $index) {
              <label class="quiz-option">
                <input 
                  type="radio" 
                  [name]="'question-' + $index"
                  [value]="optIdx"
                  [(ngModel)]="answers[$index]"
                />
                {{ option }}
              </label>
            }
          </div>
        }

        <button 
          class="btn btn-primary"
          (click)="submitQuiz()"
          [disabled]="!allQuestionsAnswered()"
        >
          Submit Quiz
        </button>
      } @else {
        <div class="quiz-results">
          <div class="results-header" [class.pass]="hasPassed()" [class.fail]="!hasPassed()">
            <div class="score-circle">
              {{ score() }}%
            </div>
            <h3>{{ hasPassed() ? '🎉 Great job!' : '📚 Keep trying!' }}</h3>
            <p>
              You got {{ correctAnswers() }} out of {{ totalQuestions() }} questions correct.
            </p>
          </div>

          @if (!hasPassed()) {
            <button class="btn btn-secondary" (click)="retakeQuiz()">
              Try Again
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .quiz-activity {
      max-width: 700px;
      margin: 0 auto;
    }
    .quiz-intro {
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: linear-gradient(135deg, #00bcf2, #0099c4);
      color: white;
      border-radius: 12px;
    }
    .quiz-intro h3 {
      margin: 0 0 0.5rem 0;
    }
    .quiz-question {
      background: #f9f9f9;
      padding: 1.5rem;
      border-radius: 12px;
      margin-bottom: 1.5rem;
    }
    .quiz-question h4 {
      margin-top: 0;
      color: #333;
    }
    .quiz-option {
      display: block;
      padding: 0.75rem;
      margin: 0.5rem 0;
      background: white;
      border: 2px solid #ddd;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .quiz-option:hover {
      border-color: #00bcf2;
      background: #f0fbff;
    }
    .quiz-option input {
      margin-right: 0.75rem;
    }
    .btn {
      width: 100%;
      padding: 1rem;
      font-size: 1rem;
      font-weight: 700;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      margin-top: 1rem;
    }
    .btn-primary {
      background: #00bcf2;
      color: white;
    }
    .btn-primary:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    .quiz-results {
      text-align: center;
    }
    .results-header {
      padding: 3rem;
      border-radius: 16px;
      margin-bottom: 2rem;
    }
    .results-header.pass {
      background: linear-gradient(135deg, #107c10, #0d6b0d);
      color: white;
    }
    .results-header.fail {
      background: linear-gradient(135deg, #d13438, #a52a2e);
      color: white;
    }
    .score-circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 auto 1rem;
    }
  `]
})
export class QuizActivityComponent {
  activity = input.required<MissionActivityDto>();
  completed = output<{ score: number; passed: boolean }>();

  quizData = signal<any>({ questions: [] });
  answers = signal<number[]>([]);
  quizCompleted = signal(false);
  score = signal(0);
  correctAnswers = signal(0);
  totalQuestions = signal(0);

  ngOnInit(): void {
    // Parse quiz data from activity content
    try {
      const content = this.activity().Content;
      const data = typeof content === 'string' ? JSON.parse(content) : content;
      this.quizData.set(data);
      this.totalQuestions.set(data.questions?.length || 0);
      this.answers.set(new Array(data.questions?.length).fill(null));
    } catch (e) {
      console.error('Failed to parse quiz data:', e);
      // Fallback to mock quiz
      this.quizData.set({
        title: 'Sample Quiz',
        questions: [
          {
            question: 'What is a strong password?',
            options: ['123456', 'password', 'A mix of letters, numbers, and symbols', 'Your name'],
            correct: 2
          },
          {
            question: 'Should you share personal information online?',
            options: ['Yes, always', 'No, never', 'Only with people you trust', 'Only on social media'],
            correct: 1
          }
        ]
      });
      this.totalQuestions.set(2);
      this.answers.set([null, null]);
    }
  }

  allQuestionsAnswered(): boolean {
    return this.answers().every(a => a !== null);
  }

  submitQuiz(): void {
    let correct = 0;
    const questions = this.quizData().questions;
    
    this.answers().forEach((answer, index) => {
      if (answer === questions[index].correct) {
        correct++;
      }
    });

    this.correctAnswers.set(correct);
    const scorePercent = Math.round((correct / questions.length) * 100);
    this.score.set(scorePercent);
    this.quizCompleted.set(true);

    const passed = scorePercent >= 70;
    this.completed.emit({ score: scorePercent, passed });
  }

  hasPassed(): boolean {
    return this.score() >= 70;
  }

  retakeQuiz(): void {
    this.answers.set(new Array(this.totalQuestions()).fill(null));
    this.quizCompleted.set(false);
    this.score.set(0);
    this.correctAnswers.set(0);
  }
}
```

---

### 5. Interactive Activity Component (Placeholder)

```typescript
// src/app/features/student/components/activities/interactive-activity.component.ts
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MissionActivityDto } from '../../models/student-api.models';

@Component({
  selector: 'app-interactive-activity',
  imports: [CommonModule],
  template: `
    <div class="interactive-activity">
      <div class="placeholder">
        <h3>🎮 Interactive Activity</h3>
        <p>{{ activity().Title }}</p>
        <div class="content" [innerHTML]="activity().Content"></div>
        
        <button class="btn btn-primary" (click)="markComplete()">
          Complete Activity
        </button>
      </div>
    </div>
  `,
  styles: [`
    .interactive-activity {
      text-align: center;
      padding: 2rem;
    }
    .placeholder {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 3rem;
      border-radius: 16px;
    }
    .placeholder h3 {
      margin-top: 0;
    }
    .content {
      margin: 2rem 0;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
    }
    .btn {
      padding: 1rem 2rem;
      font-size: 1rem;
      font-weight: 700;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      background: white;
      color: #667eea;
    }
  `]
})
export class InteractiveActivityComponent {
  activity = input.required<MissionActivityDto>();
  completed = output<{ completed: boolean }>();

  markComplete(): void {
    this.completed.emit({ completed: true });
  }
}
```

---

### 6. Update Mission Detail Component

Add this method to `mission-detail.component.ts`:

```typescript
// Add to MissionDetailComponent class
getActivityRoute(activity: MissionActivityDto): string[] {
  const missionId = this.mission()?.Id;
  if (!missionId) return [];
  return ['/student/missions', missionId, 'activity', activity.Id.toString()];
}
```

Update the button in the template:

```typescript
// Replace lines 73-80 in mission-detail.component.ts template
<button
  class="btn-action"
  [class.secondary]="activity.Completed"
  [class.primary]="!activity.Completed"
  [routerLink]="getActivityRoute(activity)"
  type="button"
>
  {{ activity.Completed ? 'Review' : 'Start Activity' }}
</button>
```

---

## 🧪 Testing Instructions

### Test 1: Navigation
1. Start app: `npm start`
2. Login as student
3. Go to Missions
4. Click on mission #3 (in-progress)
5. Click "Start Activity" on first activity
6. **Expected**: Navigate to `/student/missions/3/activity/1`
7. **Expected**: See activity component load

### Test 2: Reading Activity
1. Complete Test 1
2. If activity type is "reading", read content
3. Check "I have read..." checkbox
4. Click "Mark as Complete"
5. **Expected**: Navigate back to mission detail
6. **Expected**: Activity shows ✅ Completed

### Test 3: Quiz Activity
1. Navigate to quiz activity
2. Answer all questions
3. Click "Submit Quiz"
4. **Expected**: See score
5. If passed, click "Mark as Complete"
6. **Expected**: Return to mission with progress updated

### Test 4: Mission Completion
1. Complete all activities in a mission
2. **Expected**: Mission progress reaches 100%
3. **Expected**: Badge notification appears
4. Go to Badges page
5. **Expected**: See newly earned badge

---

## 🐛 Common Issues & Solutions

### Issue 1: "Activity not found"
**Cause**: Mission data not loaded before accessing activity
**Solution**: Add delay or better observable handling in `loadActivity()`

### Issue 2: Progress not updating
**Cause**: Backend endpoint not implemented
**Solution**: 
1. Check backend logs
2. Verify endpoint exists: `/Student/Missions/{id}/Progress`
3. Check request/response in Network tab

### Issue 3: Button does nothing
**Cause**: Route not registered
**Solution**: Verify route is added to `student.routes.ts`

### Issue 4: FormsModule error in quiz
**Solution**: Import FormsModule in quiz component:
```typescript
imports: [CommonModule, FormsModule]
```

---

## 📊 Success Metrics

After implementation, you should be able to:

✅ Navigate from mission list → mission detail → activity page
✅ See different UI for video, quiz, reading, interactive activities
✅ Complete an activity and see confirmation
✅ Return to mission detail with updated progress
✅ Complete all activities and see 100% progress
✅ Earn badge when mission completed (if backend ready)

---

## 🚀 Next Steps After Basic Implementation

1. **Add activity navigation** (Previous/Next buttons)
2. **Add timer** for timed activities
3. **Save progress** automatically (draft answers)
4. **Add hints** for quiz questions
5. **Add feedback** for wrong quiz answers
6. **Improve video tracking** (actual watch time)
7. **Add interactive drag-drop** activities
8. **Add certificate generation** when mission complete

---

## 📞 Need Help?

If stuck:
1. Check browser console for errors
2. Check Network tab for failed API calls
3. Verify backend is running on `http://localhost:5245`
4. Check that you're logged in (token in localStorage)
5. Review `COMPLETE_CYCLE_ANALYSIS.md` for architecture details

---

**Estimated Implementation Time**: 3-4 hours for basic version
**Difficulty**: Intermediate (Angular experience required)

Good luck! 🎉

