import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-notification-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (notification of notificationService.getNotifications(); track notification.id) {
        <div 
          class="toast"
          [class.toast-badge]="notification.type === 'badge'"
          [class.toast-hours]="notification.type === 'hours'"
          [class.toast-level]="notification.type === 'level'"
          [class.toast-achievement]="notification.type === 'achievement'"
          [class.toast-info]="notification.type === 'info'"
          (click)="dismissNotification(notification.id)">
          
          <div class="toast-icon">
            {{ notification.icon || getDefaultIcon(notification.type) }}
          </div>
          
          <div class="toast-content">
            <div class="toast-title">{{ notification.title }}</div>
            <div class="toast-message">{{ notification.message }}</div>
          </div>
          
          <button 
            class="toast-close"
            (click)="dismissNotification(notification.id); $event.stopPropagation()"
            aria-label="Close notification">
            ×
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 400px;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.25rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      animation: slideIn 0.3s ease-out;
      border-left: 4px solid #3b82f6;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .toast:hover {
      transform: translateX(-5px);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    }

    .toast-badge {
      border-left-color: #FFD700;
      background: linear-gradient(135deg, #fffbeb, #ffffff);
    }

    .toast-hours {
      border-left-color: #8b5cf6;
      background: linear-gradient(135deg, #f3e8ff, #ffffff);
    }

    .toast-level {
      border-left-color: #10b981;
      background: linear-gradient(135deg, #d1fae5, #ffffff);
    }

    .toast-achievement {
      border-left-color: #f59e0b;
      background: linear-gradient(135deg, #fef3c7, #ffffff);
    }

    .toast-info {
      border-left-color: #3b82f6;
      background: linear-gradient(135deg, #dbeafe, #ffffff);
    }

    .toast-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }

    .toast-content {
      flex: 1;
      min-width: 0;
    }

    .toast-title {
      font-weight: 700;
      font-size: 0.95rem;
      color: #1f2937;
      margin-bottom: 0.25rem;
    }

    .toast-message {
      font-size: 0.85rem;
      color: #6b7280;
      line-height: 1.4;
    }

    .toast-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: #9ca3af;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background-color 0.2s, color 0.2s;
      flex-shrink: 0;
    }

    .toast-close:hover {
      background-color: #f3f4f6;
      color: #374151;
    }

    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @media (max-width: 640px) {
      .toast-container {
        left: 20px;
        right: 20px;
        max-width: none;
      }
    }
  `]
})
export class NotificationToastComponent implements OnInit {
  constructor(public notificationService: NotificationService) {}

  ngOnInit(): void {
    // Component initialization
  }

  dismissNotification(id: string): void {
    this.notificationService.removeNotification(id);
  }

  getDefaultIcon(type: string): string {
    const icons: Record<string, string> = {
      badge: '🏆',
      hours: '⏱️',
      level: '🎉',
      achievement: '🌟',
      info: 'ℹ️'
    };
    return icons[type] || 'ℹ️';
  }
}

