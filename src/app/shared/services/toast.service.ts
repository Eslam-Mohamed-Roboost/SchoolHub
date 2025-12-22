import { Injectable, signal } from '@angular/core';
import { PortfolioBadgeDto } from '../../features/student/models/student-api.models';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning' | 'badge';
  title: string;
  message: string;
  badge?: PortfolioBadgeDto;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts = signal<ToastMessage[]>([]);
  
  readonly currentToasts = this.toasts.asReadonly();

  showSuccess(title: string, message: string, duration = 5000): void {
    this.show({
      id: this.generateId(),
      type: 'success',
      title,
      message,
      duration
    });
  }

  showError(title: string, message: string, duration = 5000): void {
    this.show({
      id: this.generateId(),
      type: 'error',
      title,
      message,
      duration
    });
  }

  showInfo(title: string, message: string, duration = 5000): void {
    this.show({
      id: this.generateId(),
      type: 'info',
      title,
      message,
      duration
    });
  }

  showWarning(title: string, message: string, duration = 5000): void {
    this.show({
      id: this.generateId(),
      type: 'warning',
      title,
      message,
      duration
    });
  }

  showBadgeEarned(badge: PortfolioBadgeDto, duration = 8000): void {
    this.show({
      id: this.generateId(),
      type: 'badge',
      title: 'Badge Earned!',
      message: `You've earned the ${badge.Name} badge!`,
      badge,
      duration
    });
  }

  // Convenience methods for simple messages
  showMessage(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration = 5000): void {
    this.show({
      id: this.generateId(),
      type,
      title: type === 'success' ? 'Success' : type === 'error' ? 'Error' : type === 'warning' ? 'Warning' : 'Info',
      message,
      duration
    });
  }

  showSuccessMessage(message: string, duration = 5000): void {
    this.showMessage(message, 'success', duration);
  }

  showErrorMessage(message: string, duration = 5000): void {
    this.showMessage(message, 'error', duration);
  }

  showInfoMessage(message: string, duration = 5000): void {
    this.showMessage(message, 'info', duration);
  }

  showWarningMessage(message: string, duration = 5000): void {
    this.showMessage(message, 'warning', duration);
  }

  private show(toast: ToastMessage): void {
    this.toasts.update(toasts => [...toasts, toast]);

    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        this.remove(toast.id);
      }, toast.duration);
    }
  }

  remove(id: string): void {
    this.toasts.update(toasts => toasts.filter(t => t.id !== id));
  }

  clear(): void {
    this.toasts.set([]);
  }

  private generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}

