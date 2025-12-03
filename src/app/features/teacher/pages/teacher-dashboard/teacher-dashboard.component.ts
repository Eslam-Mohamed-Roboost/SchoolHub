import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
}

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="teacher-dashboard">
      <section class="hero-section text-center">
        <div class="container">
          <span
            class="badge bg-white text-primary mb-3 px-3 py-2 rounded-pill fw-bold animate__animated animate__fadeInDown"
          >
            ✨ Welcome Back, Sarah
          </span>
          <h1 class="hero-title animate__animated animate__fadeInUp">
            Your Teaching Command Center
          </h1>
          <p class="lead opacity-75 mb-4 animate__animated animate__fadeInUp delay-1">
            Access your subject resources, track CPD, and manage student portfolios all in one
            place.
          </p>
        </div>
      </section>

      <div class="container mb-5">
        <div class="d-flex justify-content-between align-items-end mb-4">
          <div>
            <h2 class="fw-bold mb-1">Subject Portals</h2>
            <p class="text-muted mb-0">Select a subject to access specialized resources</p>
          </div>
        </div>

        <div class="row g-4">
          @for (subject of subjects; track subject.id) {
          <div class="col-md-3 col-sm-6">
            <a
              [routerLink]="['/teacher/subjects', subject.id]"
              class="hover-card subject-tile animate__animated animate__fadeInUp"
              style="text-decoration: none; display: block"
            >
              <div
                class="subject-icon"
                [style.color]="subject.color"
                [style.background]="subject.bgColor"
              >
                <i [class]="subject.icon"></i>
              </div>
              <h5 class="fw-bold">{{ subject.name }}</h5>
              <p class="text-muted small mb-0">{{ subject.description }}</p>
            </a>
          </div>
          }
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../../teacher.css'],
})
export class TeacherDashboardComponent {
  subjects: Subject[] = [
    {
      id: 'math',
      name: 'Mathematics',
      icon: 'fas fa-calculator',
      color: '#6366f1',
      bgColor: '#e0e7ff',
      description: 'Click to Enter Portal',
    },
    {
      id: 'science',
      name: 'Science',
      icon: 'fas fa-flask',
      color: '#10b981',
      bgColor: '#d1fae5',
      description: '5 Labs Added',
    },
    {
      id: 'english',
      name: 'English Language Arts',
      icon: 'fas fa-book-open',
      color: '#f59e0b',
      bgColor: '#fef3c7',
      description: 'Reading Lists',
    },
    {
      id: 'arabic',
      name: 'Arabic Language',
      icon: 'fas fa-pen-nib',
      color: '#ec4899',
      bgColor: '#fce7f3',
      description: 'Grammar Tools',
    },
    {
      id: 'islamic',
      name: 'Islamic Studies',
      icon: 'fas fa-mosque',
      color: '#059669',
      bgColor: '#d1fae5',
      description: 'Quran Resources',
    },
    {
      id: 'social',
      name: 'Social Studies',
      icon: 'fas fa-globe-americas',
      color: '#d97706',
      bgColor: '#fef3c7',
      description: 'History Maps',
    },
    {
      id: 'pe',
      name: 'Physical Education',
      icon: 'fas fa-running',
      color: '#ef4444',
      bgColor: '#fee2e2',
      description: 'Activity Logs',
    },
    {
      id: 'arts',
      name: 'Arts',
      icon: 'fas fa-palette',
      color: '#8b5cf6',
      bgColor: '#ede9fe',
      description: 'Gallery',
    },
  ];
}
