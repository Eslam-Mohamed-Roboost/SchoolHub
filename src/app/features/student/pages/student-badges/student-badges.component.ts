import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-badges',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="student-badges container mx-auto px-4 py-8">
      <h2 class="fw-bold mb-4 text-center text-3xl font-extrabold text-slate-800 mb-8">
        🏆 Hall of Fame
      </h2>

      <div class="row g-4 mb-5 grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <!-- Earned Badge -->
        <div class="col-md-3">
          <div
            class="text-center p-4 bg-white rounded-4 shadow-sm border border-warning bg-white rounded-2xl shadow-sm border border-yellow-400 p-6 flex flex-col items-center"
          >
            <i
              class="fas fa-shield-alt text-warning text-yellow-500 mb-4"
              style="font-size: 4rem;"
            ></i>
            <h5 class="fw-bold mt-3 text-lg font-bold text-slate-800">Digital Defender</h5>
            <span
              class="badge bg-success mt-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold"
              >EARNED</span
            >
          </div>
        </div>
        <!-- Locked Badge -->
        <div class="col-md-3">
          <div
            class="text-center p-4 bg-light rounded-4 border opacity-75 bg-gray-50 rounded-2xl border border-gray-200 p-6 flex flex-col items-center opacity-75"
          >
            <i class="fas fa-lock text-secondary text-gray-400 mb-4" style="font-size: 4rem;"></i>
            <h5 class="fw-bold mt-3 text-muted text-lg font-bold text-gray-500">Cyber Scout</h5>
            <span
              class="badge bg-secondary mt-2 bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-bold"
              >LOCKED</span
            >
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm rounded-4 p-4 bg-white rounded-2xl shadow-sm p-6">
        <h4 class="fw-bold mb-4 text-xl font-bold text-slate-800 mb-6">📊 Class Leaderboard</h4>
        <div class="table-responsive overflow-x-auto">
          <table class="table table-hover align-middle w-full text-left border-collapse">
            <thead class="table-light bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th class="p-4 rounded-tl-lg">Rank</th>
                <th class="p-4">Student</th>
                <th class="p-4">Badges</th>
                <th class="p-4 rounded-tr-lg">XP</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr class="table-warning bg-yellow-50 hover:bg-yellow-100 transition-colors">
                <td class="fw-bold p-4 font-bold text-yellow-700">#1 🥇</td>
                <td class="p-4 flex items-center gap-3">
                  <img
                    src="https://ui-avatars.com/api/?name=Ali&background=random"
                    class="rounded-circle me-2 w-8 h-8 rounded-full"
                    width="30"
                  />
                  <span class="font-medium text-slate-800">Ali Ahmed</span>
                </td>
                <td class="p-4 text-slate-600">15</td>
                <td class="fw-bold p-4 font-bold text-slate-800">2,400</td>
              </tr>
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="fw-bold p-4 font-bold text-gray-500">#2 🥈</td>
                <td class="p-4 flex items-center gap-3">
                  <img
                    src="https://ui-avatars.com/api/?name=Omar&background=random"
                    class="rounded-circle me-2 w-8 h-8 rounded-full"
                    width="30"
                  />
                  <span class="font-medium text-slate-800">Omar K.</span>
                </td>
                <td class="p-4 text-slate-600">14</td>
                <td class="fw-bold p-4 font-bold text-slate-800">2,150</td>
              </tr>
              <tr
                class="table-light border-start border-4 border-primary bg-cyan-50 border-l-4 border-cyan-500 hover:bg-cyan-100 transition-colors"
              >
                <td class="fw-bold p-4 font-bold text-cyan-700">#5</td>
                <td class="p-4 flex items-center gap-3">
                  <img
                    src="https://ui-avatars.com/api/?name=You&background=random"
                    class="rounded-circle me-2 w-8 h-8 rounded-full"
                    width="30"
                  />
                  <span class="font-bold text-slate-900">You</span>
                </td>
                <td class="p-4 text-slate-600">12</td>
                <td class="fw-bold p-4 font-bold text-slate-800">1,250</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../../student.css'],
})
export class StudentBadgesComponent {}
