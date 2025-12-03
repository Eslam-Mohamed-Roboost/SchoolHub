import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-view container mx-auto px-4 py-12">
      <div class="max-w-4xl mx-auto">
        <!-- Digital ID Card -->
        <div
          class="card border-0 shadow-lg rounded-4 mb-5 overflow-hidden relative bg-white rounded-2xl shadow-2xl mb-12"
        >
          <div
            class="bg-primary h-100px"
            style="background: linear-gradient(135deg, #00bcd4, #008b9c); height: 150px"
          ></div>
          <div class="card-body text-center mt-n5 -mt-16">
            <img
              [src]="profileAvatar()"
              class="rounded-circle border border-4 border-white shadow-md mb-3 w-32 h-32 rounded-full border-4 border-white shadow-lg"
              width="120"
              height="120"
              alt="Profile"
            />
            <h2 class="fw-bold mb-1 text-3xl font-bold text-gray-800">{{ profileName() }}</h2>
            <p class="text-muted mb-3 text-gray-500">{{ profileRole() }}</p>
            <div class="d-flex justify-content-center gap-2 mb-4 flex justify-center gap-3">
              <span
                class="badge bg-light text-dark border bg-gray-100 text-gray-700 border border-gray-300 px-3 py-1 rounded-full"
              >
                <i class="fas fa-id-card me-1"></i> ID: {{ profileId() }}
              </span>
              <span
                class="badge bg-light text-dark border bg-gray-100 text-gray-700 border border-gray-300 px-3 py-1 rounded-full"
              >
                <i class="fas fa-building me-1"></i> {{ profileDept() }}
              </span>
            </div>
          </div>
        </div>

        <!-- Profile Settings -->
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white rounded-2xl shadow-sm p-6">
          <div
            class="d-flex justify-content-between align-items-center mb-4 flex justify-between items-center mb-6"
          >
            <h4 class="fw-bold mb-0 text-xl font-bold">Profile Settings</h4>
            <button
              class="btn btn-primary rounded-pill px-4 bg-cyan-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-cyan-600 transition-colors"
            >
              Save Changes
            </button>
          </div>

          <form>
            <div class="row g-3 mb-4 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div class="col-md-6">
                <label class="form-label fw-bold small text-muted text-sm font-bold text-gray-600"
                  >Full Name</label
                >
                <input
                  type="text"
                  class="form-control rounded-3 p-3 border border-gray-300 rounded-lg"
                  [value]="profileName()"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold small text-muted text-sm font-bold text-gray-600"
                  >Email Address</label
                >
                <input
                  type="email"
                  class="form-control rounded-3 p-3 border border-gray-300 rounded-lg"
                  value="user@school.ae"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class ProfileViewComponent {
  profileAvatar = signal('https://ui-avatars.com/api/?name=User&background=random');
  profileName = signal('User Name');
  profileRole = signal('Role Description');
  profileId = signal('00000');
  profileDept = signal('Department');
}
