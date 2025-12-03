import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teacher-hub',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="teacher-hub container mx-auto px-4 py-8">
      <div class="row g-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Department News -->
        <div class="col-md-8 lg:col-span-2">
          <div class="card border-0 shadow-sm rounded-4 h-100 bg-white rounded-2xl shadow-sm">
            <div
              class="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center flex justify-between items-center p-4 border-b border-gray-200"
            >
              <h5 class="fw-bold mb-0 font-bold text-lg text-gray-800">
                <i class="fas fa-bullhorn text-primary text-cyan-500 me-2"></i>
                Department News
              </h5>
              <span
                class="badge bg-light text-dark bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold"
                >Science & Math</span
              >
            </div>
            <div class="list-group list-group-flush divide-y divide-gray-100">
              <div class="list-group-item py-3 p-4">
                <div class="d-flex w-100 justify-content-between mb-1 flex justify-between">
                  <h6 class="mb-1 fw-bold font-bold text-gray-800">
                    Science Fair Registration Open
                  </h6>
                  <small class="text-muted text-gray-500">Today</small>
                </div>
                <p class="mb-1 small text-muted text-gray-600 text-sm">
                  Please remind your students to submit their project proposals by next Thursday.
                </p>
              </div>
              <div class="list-group-item py-3 p-4">
                <div class="d-flex w-100 justify-content-between mb-1">
                  <h6 class="mb-1 fw-bold font-bold text-gray-800">New Grading Policy Update</h6>
                  <small class="text-muted text-gray-500">Yesterday</small>
                </div>
                <p class="mb-1 small text-muted text-gray-600 text-sm">
                  The ministry has updated the rubric for Grade 10 assessments. Click to view the
                  PDF.
                </p>
              </div>
              <div class="list-group-item py-3 p-4">
                <div class="d-flex w-100 justify-content-between mb-1">
                  <h6 class="mb-1 fw-bold font-bold text-gray-800">Staff Meeting Rescheduled</h6>
                  <small class="text-muted text-gray-500">2 days ago</small>
                </div>
                <p class="mb-1 small text-muted text-gray-600 text-sm">
                  The weekly department meeting is moved to Tuesday at 2:00 PM.
                </p>
              </div>
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
export class TeacherHubComponent {}
