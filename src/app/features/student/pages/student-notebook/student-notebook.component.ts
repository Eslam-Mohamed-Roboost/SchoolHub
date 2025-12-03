import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-notebook',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="student-notebook container mx-auto px-4 py-8">
      <div
        class="row g-0 border rounded-4 overflow-hidden shadow-sm flex flex-col md:flex-row h-[600px] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <!-- Sidebar -->
        <div
          class="col-md-3 border-end bg-light p-3 md:w-1/4 border-r border-gray-200 bg-gray-50 p-4"
        >
          <div
            class="d-flex align-items-center gap-2 mb-4 text-primary flex items-center gap-2 mb-6 text-cyan-600"
          >
            <i class="fas fa-book-open fs-4 text-xl"></i>
            <h5 class="fw-bold mb-0 font-bold text-lg">My Notebook</h5>
          </div>
          <div class="list-group list-group-flush bg-transparent space-y-1">
            <a
              href="#"
              class="list-group-item list-group-item-action active rounded mb-1 border-0 flex items-center px-4 py-2 bg-cyan-100 text-cyan-700 rounded-lg font-medium"
            >
              <i class="fas fa-shield-alt me-2 w-6"></i> Digital Citizenship
            </a>
            <a
              href="#"
              class="list-group-item list-group-item-action bg-transparent border-0 flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <i class="fas fa-pen-fancy me-2 w-6"></i> My Reflections
            </a>
            <a
              href="#"
              class="list-group-item list-group-item-action bg-transparent border-0 flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <i class="fas fa-project-diagram me-2 w-6"></i> Projects
            </a>
          </div>
        </div>
        <!-- Content -->
        <div class="col-md-9 p-0 bg-white md:w-3/4 flex flex-col">
          <!-- Mock OneNote Toolbar -->
          <div
            class="border-bottom p-2 bg-light d-flex gap-3 border-b border-gray-200 p-2 bg-gray-50 flex items-center gap-2"
          >
            <button
              class="btn btn-sm btn-light border p-1.5 rounded hover:bg-gray-200 text-gray-600"
            >
              <i class="fas fa-bold"></i>
            </button>
            <button
              class="btn btn-sm btn-light border p-1.5 rounded hover:bg-gray-200 text-gray-600"
            >
              <i class="fas fa-italic"></i>
            </button>
            <button
              class="btn btn-sm btn-light border p-1.5 rounded hover:bg-gray-200 text-gray-600"
            >
              <i class="fas fa-underline"></i>
            </button>
            <div class="vr h-6 w-px bg-gray-300 mx-2"></div>
            <button
              class="btn btn-sm btn-primary flex items-center gap-1 px-3 py-1.5 bg-cyan-500 text-white rounded hover:bg-cyan-600 text-sm font-medium"
            >
              <i class="fas fa-camera me-1"></i> Add Photo
            </button>
            <button
              class="btn btn-sm btn-success flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 text-sm font-medium"
            >
              <i class="fas fa-microphone me-1"></i> Record Audio
            </button>
          </div>
          <div
            class="p-5 text-center text-muted mt-5 flex-1 flex flex-col items-center justify-center p-8 text-gray-400"
          >
            <i class="fas fa-pencil-alt fs-1 mb-3 opacity-25 text-6xl mb-4 opacity-20"></i>
            <h4 class="text-xl font-bold text-gray-600 mb-2">Module 3 Reflection</h4>
            <p class="mb-6">Type your thoughts here about online privacy...</p>
            <div
              class="border border-dashed p-5 rounded-3 mt-4 mx-auto border-2 border-dashed border-gray-300 p-8 rounded-xl max-w-sm w-full"
            >
              Start typing or click 'Add Photo' to upload your work.
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../../student.css'],
})
export class StudentNotebookComponent {}
