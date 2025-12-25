import { Injectable, signal } from '@angular/core';
import { BadgeAwardNotification } from '../../features/student/models/learning-hours.model';

export interface Notification {
  id: string;
  type: 'badge' | 'hours' | 'level' | 'achievement' | 'info';
  title: string;
  message: string;
  icon?: string;
  timestamp: Date;
  read: boolean;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = signal<Notification[]>([]);
  private badgeAwardData = signal<BadgeAwardNotification | null>(null);
  private showBadgeModal = signal(false);

  constructor() {}

  // ============================================
  // NOTIFICATION MANAGEMENT
  // ============================================

  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date(),
      read: false
    };

    this.notifications.update(current => [newNotification, ...current]);

    // Auto-remove after 5 seconds for non-badge notifications
    if (notification.type !== 'badge') {
      setTimeout(() => {
        this.removeNotification(newNotification.id);
      }, 5000);
    }
  }

  removeNotification(id: string): void {
    this.notifications.update(current => current.filter(n => n.id !== id));
  }

  markAsRead(id: string): void {
    this.notifications.update(current =>
      current.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }

  clearAll(): void {
    this.notifications.set([]);
  }

  // ============================================
  // BADGE AWARD NOTIFICATIONS
  // ============================================

  showBadgeAward(badgeData: BadgeAwardNotification): void {
    this.badgeAwardData.set(badgeData);
    this.showBadgeModal.set(true);

    // Also add to notification list
    this.addNotification({
      type: 'badge',
      title: 'Badge Earned!',
      message: `You earned the ${badgeData.badgeName} badge!`,
      icon: badgeData.badgeIcon,
      data: badgeData
    });
  }

  closeBadgeModal(): void {
    this.showBadgeModal.set(false);
    setTimeout(() => {
      this.badgeAwardData.set(null);
    }, 300);
  }

  // ============================================
  // HOURS NOTIFICATIONS
  // ============================================

  notifyHoursEarned(hours: number, activityName: string): void {
    this.addNotification({
      type: 'hours',
      title: 'Learning Hours Added!',
      message: `You earned ${hours} hours from ${activityName}`,
      icon: '⏱️'
    });
  }

  // ============================================
  // LEVEL UP NOTIFICATIONS
  // ============================================

  notifyLevelUp(newLevel: number, levelName: string): void {
    this.addNotification({
      type: 'level',
      title: 'Level Up!',
      message: `Congratulations! You reached Level ${newLevel}: ${levelName}`,
      icon: '🎉'
    });
  }

  // ============================================
  // ACHIEVEMENT NOTIFICATIONS
  // ============================================

  notifyAchievement(title: string, message: string): void {
    this.addNotification({
      type: 'achievement',
      title,
      message,
      icon: '🏆'
    });
  }

  // ============================================
  // GETTERS
  // ============================================

  getNotifications() {
    return this.notifications();
  }

  getUnreadCount() {
    return this.notifications().filter(n => !n.read).length;
  }

  getBadgeAwardData() {
    return this.badgeAwardData();
  }

  isBadgeModalOpen() {
    return this.showBadgeModal();
  }

  // ============================================
  // HELPERS
  // ============================================

  private generateId(): string {
    return `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

