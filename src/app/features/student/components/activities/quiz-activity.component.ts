import { Component, input, output, signal, computed, ChangeDetectionStrategy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MissionActivityDto } from '../../models/student-api.models';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizData {
  questions: QuizQuestion[];
  passingScore?: number;
}

@Component({
  selector: 'app-quiz-activity',
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="quiz-activity">
      <div class="quiz-header">
        <h2>{{ activity().Title }}</h2>
        @if (!quizSubmitted()) {
          <p class="quiz-instruction">Answer all questions below and submit your quiz.</p>
        }
      </div>

      @if (!quizSubmitted()) {
        <!-- Quiz Questions -->
        <div class="quiz-questions">
          @for (question of quizData()?.questions || []; track question.id) {
            <div class="question-card">
              <div class="question-header">
                <span class="question-number">Question {{ $index + 1 }}</span>
                <span class="question-required">Required</span>
              </div>
              <h3 class="question-text">{{ question.question }}</h3>
              
              <div class="options-list" role="radiogroup" [attr.aria-labelledby]="'question-' + question.id">
                @for (option of question.options; track $index) {
                  <label class="option-label">
                    <input
                      type="radio"
                      [name]="'question-' + question.id"
                      [value]="$index"
                      [checked]="userAnswers()[$index] === $index"
                      (change)="selectAnswer($index, $index)"
                    />
                    <span class="option-text">{{ option }}</span>
                  </label>
                }
              </div>
            </div>
          }
        </div>

        <div class="quiz-actions">
          <button
            type="button"
            class="btn-submit"
            (click)="submitQuiz()"
            [disabled]="!allQuestionsAnswered()"
          >
            Submit Quiz
          </button>
          @if (!allQuestionsAnswered()) {
            <p class="answer-hint">Please answer all questions before submitting</p>
          }
        </div>
      } @else {
        <!-- Quiz Results -->
        <div class="quiz-results">
          <div class="results-header" [class.passed]="passed()" [class.failed]="!passed()">
            <div class="results-icon">
              {{ passed() ? '🎉' : '📚' }}
            </div>
            <h3>{{ passed() ? 'Congratulations!' : 'Keep Learning!' }}</h3>
            <p class="score-display">
              You scored <strong>{{ score() }}</strong> out of <strong>{{ totalQuestions() }}</strong>
              ({{ scorePercentage() }}%)
            </p>
          </div>

          @if (passed()) {
            <div class="success-message">
              <i class="fas fa-check-circle"></i>
              <span>You passed! You can now mark this activity as complete.</span>
            </div>
          } @else {
            <div class="retry-message">
              <i class="fas fa-info-circle"></i>
              <span>You need {{ passingScore() }}% to pass. Review the material and try again.</span>
            </div>
          }

          <!-- Show correct answers with explanations -->
          <div class="answers-review">
            <h4>Review Your Answers</h4>
            @for (question of quizData()?.questions || []; track question.id) {
              <div class="review-card" [class.correct]="userAnswers()[$index] === question.correctAnswer">
                <div class="review-header">
                  <span class="review-number">Question {{ $index + 1 }}</span>
                  @if (userAnswers()[$index] === question.correctAnswer) {
                    <span class="review-badge correct">✓ Correct</span>
                  } @else {
                    <span class="review-badge incorrect">✗ Incorrect</span>
                  }
                </div>
                <p class="review-question">{{ question.question }}</p>
                <p class="review-answer">
                  <strong>Your answer:</strong> {{ question.options[userAnswers()[$index]] }}
                </p>
                @if (userAnswers()[$index] !== question.correctAnswer) {
                  <p class="review-correct">
                    <strong>Correct answer:</strong> {{ question.options[question.correctAnswer] }}
                  </p>
                }
                @if (question.explanation) {
                  <p class="review-explanation">
                    <i class="fas fa-lightbulb"></i>
                    {{ question.explanation }}
                  </p>
                }
              </div>
            }
          </div>

          <button type="button" class="btn-retry" (click)="retryQuiz()">
            Try Again
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .quiz-activity {
      width: 100%;
    }

    .quiz-header {
      margin-bottom: 2rem;
    }

    .quiz-header h2 {
      font-size: 1.75rem;
      color: #333;
      margin: 0 0 0.5rem 0;
    }

    .quiz-instruction {
      color: #666;
      margin: 0;
    }

    .quiz-questions {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .question-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      border: 2px solid #f0f0f0;
    }

    .question-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .question-number {
      font-weight: 600;
      color: #00bcf2;
      font-size: 0.9rem;
    }

    .question-required {
      font-size: 0.85rem;
      color: #dc3545;
    }

    .question-text {
      font-size: 1.15rem;
      color: #333;
      margin: 0 0 1.25rem 0;
      font-weight: 500;
    }

    .options-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .option-label {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      background: #f8f9fa;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .option-label:hover {
      background: #e9ecef;
      border-color: #00bcf2;
    }

    .option-label input[type="radio"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
      accent-color: #00bcf2;
    }

    .option-text {
      flex: 1;
      color: #333;
      font-size: 1rem;
    }

    .quiz-actions {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      margin-top: 2rem;
    }

    .btn-submit,
    .btn-retry {
      padding: 0.875rem 2.5rem;
      font-size: 1rem;
      font-weight: 600;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-submit {
      background: #00bcf2;
      color: white;
    }

    .btn-submit:hover:not(:disabled) {
      background: #00a0d1;
      transform: translateY(-1px);
    }

    .btn-submit:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .btn-retry {
      background: #6c757d;
      color: white;
    }

    .btn-retry:hover {
      background: #5a6268;
    }

    .answer-hint {
      color: #dc3545;
      font-size: 0.9rem;
      margin: 0;
    }

    .quiz-results {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .results-header {
      text-align: center;
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
    }

    .results-header.passed {
      background: linear-gradient(135deg, #d4edda, #c3e6cb);
    }

    .results-header.failed {
      background: linear-gradient(135deg, #fff3cd, #ffeaa7);
    }

    .results-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .results-header h3 {
      font-size: 2rem;
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .score-display {
      font-size: 1.25rem;
      color: #555;
      margin: 0;
    }

    .score-display strong {
      color: #00bcf2;
    }

    .success-message,
    .retry-message {
      padding: 1rem 1.5rem;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 2rem;
    }

    .success-message {
      background: #d4edda;
      border: 1px solid #c3e6cb;
      color: #155724;
    }

    .retry-message {
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      color: #856404;
    }

    .success-message i {
      color: #28a745;
      font-size: 1.25rem;
    }

    .retry-message i {
      color: #ffc107;
      font-size: 1.25rem;
    }

    .answers-review {
      margin-bottom: 2rem;
    }

    .answers-review h4 {
      font-size: 1.5rem;
      color: #333;
      margin: 0 0 1.5rem 0;
    }

    .review-card {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      border-left: 4px solid #6c757d;
    }

    .review-card.correct {
      border-left-color: #28a745;
      background: #f1f9f4;
    }

    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .review-number {
      font-weight: 600;
      color: #666;
      font-size: 0.9rem;
    }

    .review-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .review-badge.correct {
      background: #d4edda;
      color: #155724;
    }

    .review-badge.incorrect {
      background: #f8d7da;
      color: #721c24;
    }

    .review-question {
      font-weight: 500;
      color: #333;
      margin: 0 0 0.75rem 0;
      font-size: 1.05rem;
    }

    .review-answer,
    .review-correct {
      margin: 0.5rem 0;
      color: #555;
      font-size: 0.95rem;
    }

    .review-explanation {
      margin: 1rem 0 0 0;
      padding: 0.75rem 1rem;
      background: #fff9e6;
      border-left: 3px solid #ffb900;
      border-radius: 4px;
      color: #666;
      font-size: 0.95rem;
      display: flex;
      align-items: start;
      gap: 0.75rem;
    }

    .review-explanation i {
      color: #ffb900;
      margin-top: 0.2rem;
    }

    @media (max-width: 768px) {
      .quiz-header h2 {
        font-size: 1.5rem;
      }

      .results-header h3 {
        font-size: 1.5rem;
      }

      .results-icon {
        font-size: 3rem;
      }
    }
  `]
})
export class QuizActivityComponent {
  activity = input.required<MissionActivityDto>();
  completed = output<void>();
  
  quizData = signal<QuizData | null>(null);
  userAnswers = signal<number[]>([]);
  quizSubmitted = signal(false);
  score = signal(0);
  
  totalQuestions = computed(() => this.quizData()?.questions?.length || 0);
  scorePercentage = computed(() => 
    this.totalQuestions() > 0 
      ? Math.round((this.score() / this.totalQuestions()) * 100)
      : 0
  );
  passingScore = computed(() => this.quizData()?.passingScore || 70);
  passed = computed(() => this.scorePercentage() >= this.passingScore());
  
  allQuestionsAnswered = computed(() => {
    const answers = this.userAnswers();
    return answers.length === this.totalQuestions() && 
           answers.every(a => a !== undefined && a !== null);
  });

  constructor() {
    // Parse quiz data from activity content when it changes
    effect(() => {
      const act = this.activity();
      if (act?.Content) {
        this.parseQuizData(act.Content);
      }
    });
  }

  private parseQuizData(content: string): void {
    try {
      // Try to parse JSON content
      const data = JSON.parse(content);
      this.quizData.set(data);
      // Initialize empty answers array
      this.userAnswers.set(new Array(data.questions.length).fill(-1));
    } catch {
      // If not JSON, create a simple quiz from text
      this.quizData.set({
        questions: [{
          id: 1,
          question: 'Have you read and understood the content?',
          options: ['Yes', 'No'],
          correctAnswer: 0,
          explanation: 'Make sure to review the content thoroughly.'
        }],
        passingScore: 100
      });
      this.userAnswers.set([-1]);
    }
  }

  selectAnswer(questionIndex: number, answerIndex: number): void {
    this.userAnswers.update(answers => {
      const newAnswers = [...answers];
      newAnswers[questionIndex] = answerIndex;
      return newAnswers;
    });
  }

  submitQuiz(): void {
    if (!this.allQuestionsAnswered()) return;

    // Calculate score
    let correctCount = 0;
    const questions = this.quizData()?.questions || [];
    const answers = this.userAnswers();

    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correctCount++;
      }
    });

    this.score.set(correctCount);
    this.quizSubmitted.set(true);
  }

  retryQuiz(): void {
    this.userAnswers.set(new Array(this.totalQuestions()).fill(-1));
    this.quizSubmitted.set(false);
    this.score.set(0);
  }
}

