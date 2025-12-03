import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-evidence',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="container mx-auto px-4 py-8">
    <h2 class="text-2xl font-bold mb-6">Evidence Showcase</h2>
    <p class="text-gray-500">Review and approve submissions for ADEK compliance.</p>
  </div>`,
  styleUrls: ['../../admin.css'],
})
export class AdminEvidenceComponent {}
