import { Component, Input, signal, inject, computed, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';

export interface NavLink {
  path: string;
  label: string;
  exact?: boolean;
  icon?: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css'],
})
export class AppHeaderComponent implements OnInit, OnDestroy {
  @Input() navLinks: NavLink[] = [];

  private authService = inject(AuthService);

  // Navigation states
  isMobileMenuOpen = signal(false);
  isUserMenuOpen = signal(false);
  isScrolled = signal(false);

  userAvatar = computed(() => {
    const user = this.authService.currentUser();
    if (user?.Name) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.Name)}&background=4f46e5&color=fff&bold=true`;
    }
    return 'https://ui-avatars.com/api/?name=User&background=4f46e5&color=fff&bold=true';
  });

  userName = computed(() => {
    const user = this.authService.currentUser();
    return user?.Name || 'User';
  });

  userRole = computed(() => {
    const user = this.authService.currentUser();
    return user?.Role || 'User';
  });

  @HostListener('window:scroll')
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled.set(scrollPosition > 10);
  }

  ngOnInit(): void {
    // Check initial scroll position
    this.onWindowScroll();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(open => !open);
    if (this.isMobileMenuOpen()) {
      this.isUserMenuOpen.set(false);
    }
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen.update(open => !open);
    if (this.isUserMenuOpen()) {
      this.isMobileMenuOpen.set(false);
    }
  }

  closeUserMenu(): void {
    this.isUserMenuOpen.set(false);
  }

  closeAllMenus(): void {
    this.isMobileMenuOpen.set(false);
    this.isUserMenuOpen.set(false);
  }

  logout(): void {
    this.closeAllMenus();
    this.authService.logout();
  }
}
