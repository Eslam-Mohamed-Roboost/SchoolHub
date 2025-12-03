import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="container mx-auto px-4 py-8 text-center">
    <i class="fas fa-chart-pie text-6xl text-cyan-500 mb-4"></i>
    <h2 class="text-2xl font-bold">Advanced Analytics</h2>
    <p class="text-gray-500">Detailed engagement reports coming soon.</p>
  </div>`,
  styleUrls: ['../../admin.css'],
})
export class AdminAnalyticsComponent {}
