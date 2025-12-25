import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeAwardNotification } from '../../../features/student/models/learning-hours.model';

@Component({
  selector: 'app-badge-award-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge-award-modal.component.html',
  styleUrls: ['./badge-award-modal.component.css']
})
export class BadgeAwardModalComponent implements OnInit {
  @Input() badgeData: BadgeAwardNotification | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  showConfetti = signal(false);
  animateIn = signal(false);

  ngOnInit(): void {
    if (this.isOpen) {
      this.triggerAnimation();
    }
  }

  ngOnChanges(): void {
    if (this.isOpen) {
      this.triggerAnimation();
    }
  }

  triggerAnimation(): void {
    setTimeout(() => {
      this.animateIn.set(true);
      this.showConfetti.set(true);
    }, 100);

    // Hide confetti after animation
    setTimeout(() => {
      this.showConfetti.set(false);
    }, 3000);
  }

  closeModal(): void {
    this.animateIn.set(false);
    setTimeout(() => {
      this.close.emit();
    }, 300);
  }

  shareBadge(): void {
    // TODO: Implement share functionality
    console.log('Sharing badge:', this.badgeData);
  }
}

