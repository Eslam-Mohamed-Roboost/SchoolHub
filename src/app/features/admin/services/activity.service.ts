import { Injectable, signal } from '@angular/core';
import { ActivityLog, ActivityType } from '../models/admin.models';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private activities = signal<ActivityLog[]>(this.generateMockActivities());

  getActivities() {
    return this.activities.asReadonly();
  }

  getRecentActivities(limit: number = 10): ActivityLog[] {
    return this.activities().slice(0, limit);
  }

  filterActivities(type?: ActivityType): ActivityLog[] {
    if (!type) return this.activities();
    return this.activities().filter((a) => a.type === type);
  }

  addActivity(activity: Omit<ActivityLog, 'id' | 'timestamp'>): ActivityLog {
    const newActivity: ActivityLog = {
      ...activity,
      id: `activity-${Date.now()}`,
      timestamp: new Date(),
    };
    this.activities.update((activities) => [newActivity, ...activities]);
    return newActivity;
  }

  getTodayActivityCount(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.activities().filter((a) => a.timestamp >= today).length;
  }

  getWeekActivityCount(): number {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return this.activities().filter((a) => a.timestamp >= weekAgo).length;
  }

  private generateMockActivities(): ActivityLog[] {
    const activities: ActivityLog[] = [];
    const actions = {
      Login: ['logged in', 'signed in', 'accessed the system'],
      Badge: ['submitted badge', 'earned badge', 'completed challenge'],
      Upload: ['uploaded resource', 'added document', 'shared file'],
      Completion: ['completed mission', 'finished lesson', 'submitted assignment'],
      Update: ['updated profile', 'changed settings', 'modified content'],
    };

    // Generate 500 mock activities
    for (let i = 1; i <= 500; i++) {
      const types: ActivityType[] = ['Login', 'Badge', 'Upload', 'Completion', 'Update'];
      const type = types[Math.floor(Math.random() * types.length)];
      const actionList = actions[type];
      const action = actionList[Math.floor(Math.random() * actionList.length)];

      const isTeacher = Math.random() > 0.5;
      const userId = isTeacher
        ? `teacher-${Math.floor(Math.random() * 40) + 1}`
        : `student-${Math.floor(Math.random() * 800) + 1}`;

      activities.push({
        id: `activity-${i}`,
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        userId,
        userName: isTeacher ? `Teacher ${userId.split('-')[1]}` : `Student ${userId.split('-')[1]}`,
        userAvatar: `https://ui-avatars.com/api/?name=${isTeacher ? 'Teacher' : 'Student'}+${
          userId.split('-')[1]
        }&background=random`,
        action,
        type,
        details: `Action performed at ${new Date().toLocaleTimeString()}`,
      });
    }

    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
}
