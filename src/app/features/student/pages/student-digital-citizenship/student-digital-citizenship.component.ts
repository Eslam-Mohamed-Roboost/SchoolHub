import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-digital-citizenship',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="student-digital-citizenship container mx-auto px-4 py-8">
      <div class="card border-0 shadow-lg rounded-4 p-4 mb-5 bg-white rounded-2xl shadow-xl p-6">
        <h4 class="fw-bold mb-4 text-xl font-bold mb-6 text-slate-800">
          <i class="fas fa-map-signs text-primary me-2 text-cyan-500"></i>Digital Citizenship
          Curriculum
        </h4>
        <div class="list-group list-group-flush space-y-2">
          <a
            href="#"
            class="list-group-item list-group-item-action d-flex align-items-center justify-content-between py-3 bg-light flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div class="d-flex align-items-center gap-3 flex items-center gap-4">
              <i class="fas fa-check-circle text-success fs-4 text-green-500 text-xl"></i>
              <div>
                <h6
                  class="fw-bold mb-0 text-decoration-line-through text-muted font-bold text-gray-400 line-through"
                >
                  Lesson 1: Digital Footprints
                </h6>
                <small class="text-muted text-gray-500 text-sm">Completed on Nov 20</small>
              </div>
            </div>
            <span
              class="badge bg-success bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold"
              >Done</span
            >
          </a>
          <a
            href="#"
            class="list-group-item list-group-item-action d-flex align-items-center justify-content-between py-3 bg-light flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div class="d-flex align-items-center gap-3 flex items-center gap-4">
              <i class="fas fa-check-circle text-success fs-4 text-green-500 text-xl"></i>
              <div>
                <h6
                  class="fw-bold mb-0 text-decoration-line-through text-muted font-bold text-gray-400 line-through"
                >
                  Lesson 2: Online Safety
                </h6>
                <small class="text-muted text-gray-500 text-sm">Completed on Nov 25</small>
              </div>
            </div>
            <span
              class="badge bg-success bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold"
              >Done</span
            >
          </a>
          <a
            href="#"
            class="list-group-item list-group-item-action d-flex align-items-center justify-content-between py-3 border-start border-4 border-primary flex items-center justify-between p-4 bg-white border-l-4 border-cyan-500 shadow-sm rounded-r-lg"
          >
            <div class="d-flex align-items-center gap-3 flex items-center gap-4">
              <div
                class="spinner-border spinner-border-sm text-primary animate-spin h-5 w-5 border-2 border-cyan-500 border-t-transparent rounded-full"
                role="status"
              ></div>
              <div>
                <h6 class="fw-bold mb-0 text-primary font-bold text-cyan-600">
                  Lesson 3: Cyberbullying
                </h6>
                <small class="text-primary text-cyan-500 text-sm">In Progress - Due Tomorrow</small>
              </div>
            </div>
            <button
              class="btn btn-sm btn-primary rounded-pill px-3 bg-cyan-500 text-white px-4 py-1.5 rounded-full text-sm font-bold hover:bg-cyan-600 transition-colors"
            >
              Continue
            </button>
          </a>
          <a
            href="#"
            class="list-group-item list-group-item-action d-flex align-items-center justify-content-between py-3 opacity-75 flex items-center justify-between p-4 opacity-75 cursor-not-allowed"
          >
            <div class="d-flex align-items-center gap-3 flex items-center gap-4">
              <i class="fas fa-lock text-muted fs-4 text-gray-400 text-xl"></i>
              <div>
                <h6 class="fw-bold mb-0 text-muted font-bold text-gray-400">
                  Lesson 4: Media Literacy
                </h6>
                <small class="text-muted text-gray-400 text-sm">Locked</small>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../../student.css'],
})
export class StudentDigitalCitizenshipComponent {}
