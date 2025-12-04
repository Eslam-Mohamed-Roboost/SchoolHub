import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teacher-hub',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="teacher-hub container mx-auto px-4 py-8">
      <div class="row g-4">
        <!-- School News (Main Content) -->
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm rounded-4 mb-4">
            <div class="card-header bg-white border-bottom py-3 px-4">
              <h5 class="fw-bold mb-0">
                <i class="fas fa-newspaper text-primary me-2"></i>
                School News
              </h5>
              <p class="text-muted small mb-0">Latest updates and announcements from the school</p>
            </div>
            <div class="list-group list-group-flush">
              @for (news of schoolNews; track news.id) {
              <div class="list-group-item py-3">
                <div class="d-flex w-100 justify-content-between align-items-start mb-2">
                  <div class="d-flex align-items-center gap-2">
                    <h6 class="mb-0 fw-bold">{{ news.title }}</h6>
                    <span
                      class="badge"
                      [class.bg-primary]="news.priority === 'high'"
                      [class.bg-info]="news.priority === 'medium'"
                      [class.bg-secondary]="news.priority === 'low'"
                    >
                      {{ news.category }}
                    </span>
                  </div>
                  <small class="text-muted">{{ news.date }}</small>
                </div>
                <p class="mb-2 small text-muted">{{ news.description }}</p>
                @if (news.author) {
                <small class="text-muted">
                  <i class="fas fa-user me-1"></i>{{ news.author }}
                </small>
                }
              </div>
              }
            </div>
          </div>

          <!-- Department Announcements -->
          <div class="card border-0 shadow-sm rounded-4">
            <div class="card-header bg-white border-bottom py-3 px-4">
              <h5 class="fw-bold mb-0">
                <i class="fas fa-bullhorn text-warning me-2"></i>
                Department Announcements
              </h5>
              <p class="text-muted small mb-0">Updates from your departments</p>
            </div>
            <div class="list-group list-group-flush">
              @for (announcement of departmentAnnouncements; track announcement.id) {
              <div class="list-group-item py-3">
                <div class="d-flex w-100 justify-content-between align-items-start mb-2">
                  <div>
                    <span class="badge bg-light text-dark me-2">{{ announcement.department }}</span>
                    <h6 class="mb-0 fw-bold d-inline">{{ announcement.title }}</h6>
                  </div>
                  <small class="text-muted">{{ announcement.date }}</small>
                </div>
                <p class="mb-0 small text-muted">{{ announcement.description }}</p>
              </div>
              }
            </div>
          </div>
        </div>

        <!-- Sidebar: Resources & Meetings -->
        <div class="col-md-4 lg:col-span-1 space-y-6">
          <!-- Shared Resources -->
          <div class="card border-0 shadow-sm rounded-4 bg-white rounded-2xl shadow-sm">
            <div class="card-header bg-white border-bottom py-3 p-4 border-b border-gray-200">
              <h6 class="fw-bold mb-0 font-bold text-gray-800">
                <i class="fas fa-share-alt text-success text-green-500 me-2"></i>
                Shared Resources
              </h6>
            </div>
            <div class="list-group list-group-flush divide-y divide-gray-50">
              <a
                href="#"
                class="list-group-item list-group-item-action py-2 d-flex align-items-center gap-2 flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
              >
                <i class="fas fa-file-word text-primary text-blue-500"></i>
                <div class="small">
                  <div class="fw-bold font-bold text-gray-800">G10_Math_Quiz.docx</div>
                  <span class="text-muted text-gray-500" style="font-size: 0.75rem"
                    >Shared by Ahmed K.</span
                  >
                </div>
              </a>
              <a
                href="#"
                class="list-group-item list-group-item-action py-2 d-flex align-items-center gap-2 flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
              >
                <i class="fas fa-file-pdf text-danger text-red-500"></i>
                <div class="small">
                  <div class="fw-bold font-bold text-gray-800">Lab_Safety_Rules.pdf</div>
                  <span class="text-muted text-gray-500" style="font-size: 0.75rem"
                    >Shared by Sarah M.</span
                  >
                </div>
              </a>
            </div>
          </div>

          <!-- Upcoming Meetings -->
          <div class="card border-0 shadow-sm rounded-4 bg-white rounded-2xl shadow-sm">
            <div class="card-header bg-white border-bottom py-3 p-4 border-b border-gray-200">
              <h6 class="fw-bold mb-0 font-bold text-gray-800">
                <i class="fas fa-calendar-alt text-warning text-yellow-500 me-2"></i>
                Upcoming Meetings
              </h6>
            </div>
            <div class="card-body p-0">
              <div
                class="d-flex align-items-center border-bottom p-3 flex items-center gap-3 border-b border-gray-100"
              >
                <div
                  class="bg-light rounded text-center p-2 me-3 bg-gray-50 rounded-lg"
                  style="min-width: 50px"
                >
                  <div class="small fw-bold text-danger text-red-500 text-xs font-bold">NOV</div>
                  <div class="h5 mb-0 fw-bold text-2xl font-bold text-gray-800">28</div>
                </div>
                <div>
                  <h6 class="fw-bold mb-0 small font-bold text-gray-800">Dept. Coordination</h6>
                  <small class="text-muted text-gray-500">2:00 PM - Room 101</small>
                </div>
              </div>
              <div class="d-flex align-items-center p-3 flex items-center gap-3">
                <div
                  class="bg-light rounded text-center p-2 me-3 bg-gray-50 rounded-lg"
                  style="min-width: 50px"
                >
                  <div class="small fw-bold text-danger text-red-500 text-xs font-bold">DEC</div>
                  <div class="h5 mb-0 fw-bold text-2xl font-bold text-gray-800">05</div>
                </div>
                <div>
                  <h6 class="fw-bold mb-0 small font-bold text-gray-800">Term Review</h6>
                  <small class="text-muted text-gray-500">1:30 PM - Main Hall</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../../teacher.css'],
})
export class TeacherHubComponent {
  schoolNews = [
    {
      id: '1',
      title: 'Parent-Teacher Conference Week',
      category: 'Academic',
      priority: 'high',
      description:
        'Parent-teacher conferences are scheduled for December 12-16. Please check your email for your assigned time slots.',
      date: 'Today',
      author: 'Principal Office',
    },
    {
      id: '2',
      title: 'Winter Break Holiday Schedule',
      category: 'General',
      priority: 'medium',
      description:
        'School will be closed from December 20 to January 3. Classes resume on January 4, 2025.',
      date: 'Yesterday',
      author: 'Administration',
    },
    {
      id: '3',
      title: 'New Digital Learning Platform Launch',
      category: 'Technology',
      priority: 'high',
      description:
        'We are launching a new interactive learning platform for all grades. Training sessions will be held next week.',
      date: '2 days ago',
      author: 'IT Department',
    },
    {
      id: '4',
      title: 'Student Achievement Awards Ceremony',
      category: 'Events',
      priority: 'low',
      description:
        'Join us in celebrating our outstanding students this Friday at 2:00 PM in the main auditorium.',
      date: '3 days ago',
      author: 'Student Affairs',
    },
  ];

  departmentAnnouncements = [
    {
      id: '1',
      department: 'Science',
      title: 'Science Fair Project Submissions Due',
      description:
        'Reminder: All science fair project proposals must be submitted by next Thursday. Please review the guidelines with your students.',
      date: 'Today',
    },
    {
      id: '2',
      department: 'Math',
      title: 'New Grading Rubric for Assessments',
      description:
        'The ministry has updated the grading rubric for Grade 10 mathematics assessments. Updated materials are available in the Learning Vault.',
      date: 'Yesterday',
    },
    {
      id: '3',
      department: 'Science & Math',
      title: 'Department Meeting Rescheduled',
      description:
        'The weekly department meeting has been moved to Tuesday at 2:00 PM in Room 301. Agenda items include curriculum review and lab equipment updates.',
      date: '2 days ago',
    },
    {
      id: '4',
      department: 'English',
      title: 'Shakespeare Week Activities',
      description:
        'English department is organizing Shakespeare Week from December 15-19. Please encourage student participation in the drama performances.',
      date: '3 days ago',
    },
    {
      id: '5',
      department: 'Arabic',
      title: 'Arabic Language Competition',
      description:
        'Registration is now open for the annual Arabic poetry and essay competition. Deadline for submissions is December 20.',
      date: '4 days ago',
    },
  ];
}
