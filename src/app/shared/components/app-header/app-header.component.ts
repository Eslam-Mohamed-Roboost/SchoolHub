import { Component, Input, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';

export interface NavLink {
  path: string;
  label: string;
  exact?: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css'],
})
export class AppHeaderComponent {
  @Input() navLinks: NavLink[] = [];

  private authService = inject(AuthService);

  userAvatar = computed(() => {
    const user = this.authService.currentUser();
    if (user?.Name) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.Name)}&background=random`;
    }
    return 'https://ui-avatars.com/api/?name=User&background=random';
  });

  userName = computed(() => {
    const user = this.authService.currentUser();
    return user?.Name || 'User';
  });

  isAvatarHovered = signal(false);

  logout() {
    this.authService.logout();
  }
}
