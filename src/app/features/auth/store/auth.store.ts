import { Injectable, signal, computed } from '@angular/core';
import { User } from '../services/auth.service';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  // State signals
  private userSignal = signal<User | null>(null);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Computed state
  user = computed(() => this.userSignal());
  loading = computed(() => this.loadingSignal());
  error = computed(() => this.errorSignal());
  isAuthenticated = computed(() => !!this.userSignal());

  // State mutations
  setUser(user: User | null): void {
    this.userSignal.set(user);
  }

  setLoading(loading: boolean): void {
    this.loadingSignal.set(loading);
  }

  setError(error: string | null): void {
    this.errorSignal.set(error);
  }

  clearError(): void {
    this.errorSignal.set(null);
  }

  reset(): void {
    this.userSignal.set(null);
    this.loadingSignal.set(false);
    this.errorSignal.set(null);
  }
}
