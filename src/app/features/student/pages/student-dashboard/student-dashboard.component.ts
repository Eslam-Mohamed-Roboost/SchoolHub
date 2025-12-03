import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="student-dashboard">
      <section class="hero-section text-center pb-5">
        <div class="container mx-auto">
          <div
            class="d-inline-block p-2 bg-white rounded-pill mb-3 animate__animated animate__bounceIn inline-block rounded-full bg-white px-4 py-2 mb-4"
          >
            <span class="px-3 fw-bold text-warning font-bold text-yellow-500"
              ><i class="fas fa-fire me-1"></i> 7 Day Streak!</span
            >
          </div>
          <h1 class="hero-title animate__animated animate__tada text-5xl font-extrabold mb-4">
            Ready for Adventure, Ahmad? 🚀
          </h1>
          <div class="hero-subtitle text-white opacity-75 text-lg">
            Continue your Digital Citizenship journey.
          </div>

          <!-- Gamified Stats -->
          <div
            class="row justify-content-center g-4 mb-5 mt-3 grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-4xl mx-auto"
          >
            <div class="col-md-3">
              <div class="student-stat-card animate__animated animate__fadeInUp">
                <h2 class="fw-bold text-primary mb-0 text-3xl font-bold text-cyan-500">3/8</h2>
                <small class="text-muted fw-bold text-gray-500 font-bold uppercase"
                  >LESSONS COMPLETED</small
                >
              </div>
            </div>
            <div class="col-md-3">
              <div class="student-stat-card animate__animated animate__fadeInUp delay-1">
                <h2 class="fw-bold text-warning mb-0 text-3xl font-bold text-yellow-500">1,250</h2>
                <small class="text-muted fw-bold text-gray-500 font-bold uppercase"
                  >XP POINTS</small
                >
              </div>
            </div>
            <div class="col-md-3">
              <div class="student-stat-card animate__animated animate__fadeInUp delay-2">
                <h2 class="fw-bold text-success mb-0 text-3xl font-bold text-green-500">2</h2>
                <small class="text-muted fw-bold text-gray-500 font-bold uppercase"
                  >BADGES EARNED</small
                >
              </div>
            </div>
          </div>
        </div>
      </section>

      <div
        class="container mx-auto px-4"
        style="margin-top: -80px; position: relative; z-index: 10;"
      >
        <!-- Hexagon Navigation Grid -->
        <h4 class="fw-bold mb-3 text-navy text-xl font-bold text-slate-800 mb-4">
          Your Mission Control
        </h4>
        <div class="row g-4 mb-5 grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          <div class="col-md-4 col-6">
            <a routerLink="/student/notebook" class="hexagon-tile nav-tile-anim">
              <i class="fas fa-book text-4xl mb-4"></i>
              <span>My Notebook</span>
            </a>
          </div>
          <div class="col-md-4 col-6">
            <a
              routerLink="/student/badges"
              class="hexagon-tile nav-tile-anim"
              style="animation-delay: 0.1s"
            >
              <i class="fas fa-trophy text-4xl mb-4"></i>
              <span>Badges</span>
            </a>
          </div>
          <div class="col-md-4 col-6">
            <a
              routerLink="/student/digital-citizenship"
              class="hexagon-tile nav-tile-anim"
              style="animation-delay: 0.2s"
            >
              <i class="fas fa-shield-alt text-4xl mb-4"></i>
              <span>Digital Cit.</span>
            </a>
          </div>
        </div>

        <!-- Digital Citizenship Curriculum List -->
        <div class="card border-0 shadow-lg rounded-4 p-4 mb-5 bg-white rounded-2xl shadow-xl p-6">
          <h4 class="fw-bold mb-4 text-xl font-bold mb-6">
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
                  <small class="text-primary text-cyan-500 text-sm"
                    >In Progress - Due Tomorrow</small
                  >
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
    </div>
  `,
  styleUrls: ['../../student.css'],
})
export class StudentDashboardComponent {}
