import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="container mx-auto px-4 py-8 text-center">
    <i class="fas fa-file-alt text-6xl text-cyan-500 mb-4"></i>
    <h2 class="text-2xl font-bold">Reports</h2>
    <p class="text-gray-500">Generate and export comprehensive reports.</p>
  </div>`,
  styleUrls: ['../../admin.css'],
})
export class AdminReportsComponent {}
