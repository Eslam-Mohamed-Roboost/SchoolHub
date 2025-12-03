import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-home',
  imports: [CommonModule],
  templateUrl: './student-home.component.html',
  styleUrl: './student-home.component.css',
})
export class StudentHomeComponent {
  studentName = 'Ahmed'; // Mock data

  missions = {
    completed: 3,
    total: 8,
    percentage: 37.5,
  };

  badges = {
    earned: 4,
    recent: ['Safety Shield', 'Digital Scout', 'Kindness Champion', 'Footprint Tracker'],
  };

  currentMission = {
    id: 3,
    title: 'Online Safety & Privacy',
    progress: 60,
    activitiesCompleted: 3,
    totalActivities: 5,
    timeLeft: '20 mins',
    status: 'In Progress',
  };
}
